const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 3300;
const host = process.env.HOST || '0.0.0.0';

// Database connection
const dbPath = process.env.DB_PATH || './db.sqlite';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
  console.log(`Connected to the SQLite database at: ${dbPath}`);
});

// Middleware
// Set default charset for all responses
app.use((req, res, next) => {
  res.charset = 'utf-8';
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  name: 'command-builder-session',
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// --- ASYNC DB HELPERS ---
function dbGet(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function dbAll(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function dbRun(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
}

// --- AUTH MIDDLEWARE ---

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.redirect('/login');
  }
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
}

// --- API ROUTES ---

// Middleware to disable caching for all API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// --- Session and Auth ---
app.get('/api/session', (req, res) => {
  if (req.session.user) {
    const { id, username, role } = req.session.user;
    res.json({ loggedIn: true, user: { id, username, role } });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) return res.status(500).send('Internal server error');
    if (row) {
      req.session.user = row;
      res.redirect('/');
    } else {
      res.redirect('/login?error=1');
    }
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Could not log out.');
    res.redirect('/login');
  });
});


// --- Command Documentation API (English only) ---

app.get('/api/commands', isAuthenticated, (req, res) => {
  const lang = req.query.lang || 'en'; // Default to English
  const isZh = lang === 'zh';

  const query = `
    SELECT
      ${isZh ? 'COALESCE(category_zh, category_en)' : 'category_en'} as category,
      id,
      ${isZh ? 'COALESCE(name_zh, name_en)' : 'name_en'} as name,
      hex_id
    FROM commands
    ORDER BY
      ${isZh ? 'COALESCE(category_zh, category_en)' : 'category_en'},
      ${isZh ? 'COALESCE(name_zh, name_en)' : 'name_en'}`;

  console.log(`DEBUG: Commands API called with lang=${lang}`);

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const groupedCommands = rows.reduce((acc, row) => {
      const category = row.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push({ id: row.id, name: row.name, hex_id: row.hex_id });
      return acc;
    }, {});

    console.log(`DEBUG: Returning ${Object.keys(groupedCommands).length} categories for lang=${lang}`);
    res.json(groupedCommands);
  });
});

app.get('/api/search', isAuthenticated, (req, res) => {
  const searchTerm = req.query.q || '';
  const lang = req.query.lang || 'en';
  const isZh = lang === 'zh';

  if (!searchTerm) return res.json({});

  const query = `
    SELECT
      ${isZh ? 'COALESCE(category_zh, category_en)' : 'category_en'} as category,
      id,
      ${isZh ? 'COALESCE(name_zh, name_en)' : 'name_en'} as name
    FROM commands
    WHERE
      ${isZh ? '(COALESCE(name_zh, name_en) LIKE ? OR COALESCE(description_zh, description_en) LIKE ?)' : '(name_en LIKE ? OR description_en LIKE ?)'}
    ORDER BY
      ${isZh ? 'COALESCE(category_zh, category_en)' : 'category_en'},
      ${isZh ? 'COALESCE(name_zh, name_en)' : 'name_en'}`;

  console.log(`DEBUG: Search API called with term="${searchTerm}", lang=${lang}`);

  db.all(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const groupedCommands = rows.reduce((acc, row) => {
      const category = row.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push({ id: row.id, name: row.name });
      return acc;
    }, {});
    res.json(groupedCommands);
  });
});

app.get('/api/commands/:id', isAuthenticated, (req, res) => {
  console.log(`DEBUG: API request for command ID ${req.params.id}`);
  db.get('SELECT * FROM commands WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.log(`DEBUG: Database error:`, err.message);
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      console.log(`DEBUG: Command ${req.params.id} raw data:`, {
        id: row.id,
        hex_id: row.hex_id,
        name_en: row.name_en,
        name_zh: row.name_zh,
        names_equal: row.name_en === row.name_zh,
        desc_en_length: row.description_en ? row.description_en.length : 0,
        desc_zh_length: row.description_zh ? row.description_zh.length : 0,
        descs_equal: row.description_en === row.description_zh,
        desc_zh_preview: row.description_zh ? row.description_zh.substring(0, 50) : 'N/A'
      });

      // Log if hex_id is missing but don't block the response
      if (!row.hex_id) {
        console.log(`INFO: Command ${req.params.id} has null/undefined hex_id - will show documentation only`);
      }

      // Test JSON serialization
      const jsonString = JSON.stringify(row);
      const parsed = JSON.parse(jsonString);
      console.log(`DEBUG: After JSON serialization:`, {
        name_zh: parsed.name_zh,
        desc_zh_length: parsed.description_zh ? parsed.description_zh.length : 0
      });

      res.json(row);
    } else {
      console.log(`DEBUG: No command found with ID ${req.params.id}`);
      res.status(404).json({ message: 'Command not found' });
    }
  });
});

app.get('/api/command-definitions/:hex_id', isAuthenticated, async (req, res) => {
    // Sanitize the hex_id by removing the '0x' prefix if it exists
    const sanitizedHexId = req.params.hex_id.startsWith('0x') 
        ? req.params.hex_id.substring(2) 
        : req.params.hex_id;

    try {
        // 1. Get command_id from the sanitized hex_id
        const command = await dbGet('SELECT id, name_en as name, type FROM commands WHERE hex_id = ?', [sanitizedHexId]);
        if (!command) {
            return res.status(404).json({ message: `Command definition not found for hex_id: ${sanitizedHexId}` });
        }
        const commandId = command.id;

        // 2. Get all packet types for this command
        const packetTypes = await dbAll('SELECT id, name FROM packet_types WHERE command_id = ?', [commandId]);

        const definition = {
            name: command.name,
            type: command.type, // e.g., bitmask, nibble_array
            payloads: {}
        };

        // 3. For each packet type, get its fields
        for (const packetType of packetTypes) {
            const fields = await dbAll('SELECT id, field_name as id, display_name as name, type, default_value, is_readonly, bit_position, max_length FROM payload_fields WHERE packet_type_id = ? ORDER BY display_order', [packetType.id]);

            // 4. For each field, get its enum values if it's an enum
            for (const field of fields) {
                if (field.type === 'enum' || field.type === 'enum_nibble') {
                    const enums = await dbAll('SELECT name, value FROM enum_values WHERE field_id = ? ORDER BY display_order', [field.id]);
                    field.values = enums.reduce((acc, cur) => {
                        // Convert numeric strings back to numbers
                        acc[cur.name] = isNaN(cur.value) ? cur.value : Number(cur.value);
                        return acc;
                    }, {});
                }
                // Clean up unnecessary properties
                delete field.field_id; 
            }
            definition.payloads[packetType.name] = fields;
        }
        
        res.json(definition);

    } catch (error) {
        console.error(`Failed to get command definition for ${req.params.hex_id}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/document', isAuthenticated, (req, res) => {
  fs.readFile(path.join(__dirname, 'Mobile.md'), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading document');
    res.send(data);
  });
});

// --- Command Management API (Admins only) ---

app.post('/api/commands', isAuthenticated, isAdmin, (req, res) => {
  const { name_en, description_en, category_en, name_zh, description_zh, category_zh } = req.body;
  db.run(
    'INSERT INTO commands (name_en, description_en, category_en, name_zh, description_zh, category_zh) VALUES (?, ?, ?, ?, ?, ?)',
    [name_en, description_en, category_en, name_zh, description_zh, category_zh],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put('/api/commands/:id', isAuthenticated, isAdmin, (req, res) => {
  const { name_en, description_en, category_en, name_zh, description_zh, category_zh } = req.body;
  db.run(
    'UPDATE commands SET name_en = ?, description_en = ?, category_en = ?, name_zh = ?, description_zh = ?, category_zh = ? WHERE id = ?',
    [name_en, description_en, category_en, name_zh, description_zh, category_zh, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Success' });
    }
  );
});

app.delete('/api/commands/:id', isAuthenticated, isAdmin, (req, res) => {
  db.run('DELETE FROM commands WHERE id = ?', req.params.id, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Deleted' });
  });
});

// Update command by hex_id (for inline editing)
app.post('/api/admin/update-command', isAuthenticated, isAdmin, (req, res) => {
  console.log('DEBUG: update-command API called');
  console.log('DEBUG: Request body:', req.body);
  console.log('DEBUG: User session:', req.session.user);

  const { commandId, data } = req.body;

  if (!commandId || !data) {
    console.log('DEBUG: Missing commandId or data');
    return res.status(400).json({ success: false, error: 'Missing commandId or data' });
  }

  const { name_zh, name_en, description_zh, description_en } = data;
  console.log('DEBUG: Updating command:', commandId, 'with data:', { name_zh, name_en, description_zh, description_en });

  db.run(
    'UPDATE commands SET name_zh = ?, name_en = ?, description_zh = ?, description_en = ? WHERE hex_id = ?',
    [name_zh, name_en, description_zh, description_en, commandId],
    function(err) {
      if (err) {
        console.error('Error updating command:', err);
        return res.status(500).json({ success: false, error: err.message });
      }

      console.log('DEBUG: Update result - changes:', this.changes);

      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Command not found' });
      }

      res.json({ success: true, message: 'Command updated successfully' });
    }
  );
});

// --- User Management API (Admins only) ---

app.get('/api/users', isAuthenticated, isAdmin, (req, res) => {
  db.all('SELECT id, username, role FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/users', isAuthenticated, isAdmin, (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required' });
  }
  db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID, username, role });
  });
});

app.put('/api/users/:id', isAuthenticated, isAdmin, (req, res) => {
  const { username, password, role } = req.body;
  let query = 'UPDATE users SET username = ?, role = ?';
  const params = [username, role];
  if (password) {
    query += ', password = ?';
    params.push(password);
  }
  query += ' WHERE id = ?';
  params.push(req.params.id);

  db.run(query, params, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'User updated' });
  });
});

app.delete('/api/users/:id', isAuthenticated, isAdmin, (req, res) => {
  if (req.session.user.id == req.params.id) {
    return res.status(400).json({ message: "Cannot delete yourself." });
  }
  db.run('DELETE FROM users WHERE id = ?', req.params.id, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'User deleted' });
  });
});

app.patch('/api/commands/:id/description', isAuthenticated, isAdmin, (req, res) => {
    const { lang, description } = req.body;
    const { id } = req.params;

    if (!['en', 'zh'].includes(lang)) {
        return res.status(400).json({ message: 'Invalid language specified.' });
    }

    const column = lang === 'en' ? 'description_en' : 'description_zh';

    db.run(`UPDATE commands SET ${column} = ? WHERE id = ?`, [description, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Command not found.' });
        }
        res.json({ message: 'Description updated successfully.' });
    });
});

// --- Command Payload Editor APIs (Admins only) ---

// Add a new payload field
app.post('/api/payload-fields', isAuthenticated, isAdmin, async (req, res) => {
    const { packet_type_id, field_name, display_name, type, display_order } = req.body;
    try {
        const result = await dbRun(
            'INSERT INTO payload_fields (packet_type_id, field_name, display_name, type, display_order) VALUES (?, ?, ?, ?, ?)',
            [packet_type_id, field_name, display_name, type, display_order]
        );
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a payload field
app.put('/api/payload-fields/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { field_name, display_name, type, default_value, is_readonly, bit_position, max_length, display_order } = req.body;
    try {
        await dbRun(
            'UPDATE payload_fields SET field_name = ?, display_name = ?, type = ?, default_value = ?, is_readonly = ?, bit_position = ?, max_length = ?, display_order = ? WHERE id = ?',
            [field_name, display_name, type, default_value, is_readonly, bit_position, max_length, display_order, req.params.id]
        );
        res.json({ message: 'Field updated successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a payload field
app.delete('/api/payload-fields/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        // Also need to delete associated enum values
        await dbRun('DELETE FROM enum_values WHERE field_id = ?', [req.params.id]);
        await dbRun('DELETE FROM payload_fields WHERE id = ?', [req.params.id]);
        res.json({ message: 'Field deleted successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add an enum value
app.post('/api/enum-values', isAuthenticated, isAdmin, async (req, res) => {
    const { field_id, name, value, display_order } = req.body;
    try {
        const result = await dbRun(
            'INSERT INTO enum_values (field_id, name, value, display_order) VALUES (?, ?, ?, ?)',
            [field_id, name, value, display_order]
        );
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update an enum value
app.put('/api/enum-values/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { name, value, display_order } = req.body;
    try {
        await dbRun(
            'UPDATE enum_values SET name = ?, value = ?, display_order = ? WHERE id = ?',
            [name, value, display_order, req.params.id]
        );
        res.json({ message: 'Enum value updated successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an enum value
app.delete('/api/enum-values/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await dbRun('DELETE FROM enum_values WHERE id = ?', [req.params.id]);
        res.json({ message: 'Enum value deleted successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// --- Static File Serving and Routes ---
app.use(express.static(path.join(__dirname, 'public'), {
  index: false, // Disable default index.html handling
  setHeaders: (res, filePath) => {
    // Set proper charset for HTML files to fix Chinese character encoding
    if (path.extname(filePath) === '.html') {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    // Set proper charset for JavaScript files
    if (path.extname(filePath) === '.js') {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    // Set proper charset for CSS files
    if (path.extname(filePath) === '.css') {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));
app.get('/login', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/', isAuthenticated, (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'public', 'command_builder.html'));
});
app.get('/documentation', isAuthenticated, (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/command-editor', isAuthenticated, isAdmin, (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'public', 'command_editor.html'));
});

// Builder Configuration API
app.post('/api/commands/:hex_id/builder-config', isAuthenticated, isAdmin, (req, res) => {
  const { hex_id } = req.params;
  const config = req.body;

  console.log(`Saving builder config for ${hex_id}:`, config);

  // For now, we'll store builder configs in a simple JSON file
  // In a real implementation, you might want to use a database table
  const fs = require('fs');
  const configPath = path.join(__dirname, 'builder-configs.json');

  let configs = {};
  try {
    if (fs.existsSync(configPath)) {
      configs = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading builder configs:', error);
  }

  configs[hex_id] = config;

  try {
    fs.writeFileSync(configPath, JSON.stringify(configs, null, 2));
    console.log(`Builder config saved for ${hex_id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving builder config:', error);
    res.status(500).json({ error: 'Failed to save builder configuration' });
  }
});

app.get('/api/commands/:hex_id/builder-config', isAuthenticated, (req, res) => {
  const { hex_id } = req.params;

  const fs = require('fs');
  const configPath = path.join(__dirname, 'builder-configs.json');

  try {
    if (fs.existsSync(configPath)) {
      const configs = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (configs[hex_id]) {
        res.json(configs[hex_id]);
      } else {
        res.status(404).json({ error: 'Builder configuration not found' });
      }
    } else {
      res.status(404).json({ error: 'No builder configurations found' });
    }
  } catch (error) {
    console.error('Error reading builder config:', error);
    res.status(500).json({ error: 'Failed to read builder configuration' });
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Graceful shutdown...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

// Start server
app.listen(port, host, () => {
  console.log(`🚀 Server running at http://${host}:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${dbPath}`);

  if (host === '0.0.0.0') {
    console.log(`🌐 External access: http://159.75.182.217:${port}`);
  }

  console.log('✅ Server started successfully');
});
