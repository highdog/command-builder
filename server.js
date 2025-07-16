const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
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
  const query = `SELECT category_en as category, id, name_en as name, hex_id FROM commands ORDER BY category_en, name_en`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const groupedCommands = rows.reduce((acc, row) => {
      const category = row.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push({ id: row.id, name: row.name, hex_id: row.hex_id });
      return acc;
    }, {});
    res.json(groupedCommands);
  });
});

app.get('/api/search', isAuthenticated, (req, res) => {
  const searchTerm = req.query.q || '';
  if (!searchTerm) return res.json({});
  const query = `
    SELECT category_en as category, id, name_en as name 
    FROM commands 
    WHERE name_en LIKE ? OR description_en LIKE ?
    ORDER BY category_en, name_en`;
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
  db.get('SELECT * FROM commands WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) res.json(row);
    else res.status(404).json({ message: 'Command not found' });
  });
});

app.get('/api/command-definitions/:hex_id', isAuthenticated, async (req, res) => {
    const { hex_id } = req.params;
    try {
        // 1. Get command_id from hex_id
        const command = await dbGet('SELECT id, name_en as name, type FROM commands WHERE hex_id = ?', [hex_id]);
        if (!command) {
            return res.status(404).json({ message: 'Command definition not found.' });
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
        console.error(`Failed to get command definition for ${hex_id}:`, error);
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
    // Disable caching for HTML files to ensure the latest version is always served
    if (path.extname(filePath) === '.html') {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'command_builder.html')));
app.get('/documentation', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', isAuthenticated, isAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/command-editor', isAuthenticated, isAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public', 'command_editor.html')));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
