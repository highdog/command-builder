require('dotenv').config();

const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// Production environment configuration
const port = process.env.PORT || 3300;
const host = process.env.HOST || '0.0.0.0';
const dbPath = process.env.DB_PATH || './commands.db';
const sessionSecret = process.env.SESSION_SECRET || 'fallback-secret-key-change-this';
const isProduction = process.env.NODE_ENV === 'production';

// Database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
  console.log(`Connected to the SQLite database at: ${dbPath}`);
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

// Middleware
// Set default charset for all responses
app.use((req, res, next) => {
  res.charset = 'utf-8';
  next();
});

// Security headers for production
if (isProduction) {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}

// Request logging for production
if (isProduction) {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.url} - ${req.ip}`);
    next();
  });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
const sessionConfig = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Production session warning suppression (we know about MemoryStore limitations)
if (isProduction) {
  console.log('INFO: Using MemoryStore for sessions. Consider using a persistent store for multi-instance deployments.');
}

app.use(session(sessionConfig));

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
            resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

// --- AUTHENTICATION MIDDLEWARE ---
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// --- STATIC FILES ---
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    port: port,
    host: host,
    environment: process.env.NODE_ENV || 'development'
  });
});

// --- LOGIN SYSTEM ---
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Simple admin check - in production, use proper password hashing
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    
    if (username === adminUsername && password === adminPassword) {
      req.session.user = { id: 1, username: adminUsername, role: 'admin' };
      res.redirect('/');
    } else {
      res.redirect('/login?error=1');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.redirect('/login?error=1');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// --- Command Documentation API ---
app.get('/api/commands', isAuthenticated, (req, res) => {
  const lang = req.query.lang || 'en';
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

  if (isProduction) {
    console.log(`API: Commands requested for lang=${lang}`);
  }

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    const groupedCommands = rows.reduce((acc, row) => {
      const category = row.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push({ id: row.id, name: row.name, hex_id: row.hex_id });
      return acc;
    }, {});

    if (isProduction) {
      console.log(`API: Returning ${Object.keys(groupedCommands).length} categories for lang=${lang}`);
    }

    res.json(groupedCommands);
  });
});

// Get specific command details
app.get('/api/commands/:id', isAuthenticated, async (req, res) => {
  try {
    const commandId = req.params.id;
    const command = await dbGet('SELECT * FROM commands WHERE id = ?', [commandId]);

    if (!command) {
      return res.status(404).json({ error: 'Command not found' });
    }

    res.json(command);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update command (Admin only)
app.put('/api/commands/:commandId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { commandId } = req.params;
    const { data } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (data.name_en) {
      updateFields.push('name_en = ?');
      updateValues.push(data.name_en);
    }
    if (data.name_zh) {
      updateFields.push('name_zh = ?');
      updateValues.push(data.name_zh);
    }
    if (data.description_en) {
      updateFields.push('description_en = ?');
      updateValues.push(data.description_en);
    }
    if (data.description_zh) {
      updateFields.push('description_zh = ?');
      updateValues.push(data.description_zh);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateValues.push(commandId);
    const query = `UPDATE commands SET ${updateFields.join(', ')} WHERE hex_id = ?`;

    const result = await dbRun(query, updateValues);

    if (isProduction) {
      console.log(`API: Command ${commandId} updated by ${req.session.user.username}`);
    }

    res.json({ success: true, changes: result.changes });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search API
app.get('/api/search', isAuthenticated, (req, res) => {
  const searchTerm = req.query.q || '';
  const lang = req.query.lang || 'en';
  const isZh = lang === 'zh';

  if (!searchTerm.trim()) {
    return res.json([]);
  }

  const query = `
    SELECT
      id,
      hex_id,
      ${isZh ? 'COALESCE(name_zh, name_en)' : 'name_en'} as name,
      ${isZh ? 'COALESCE(category_zh, category_en)' : 'category_en'} as category
    FROM commands
    WHERE
      ${isZh ? 'COALESCE(name_zh, name_en)' : 'name_en'} LIKE ? OR
      ${isZh ? 'COALESCE(description_zh, description_en)' : 'description_en'} LIKE ? OR
      hex_id LIKE ?
    ORDER BY
      ${isZh ? 'COALESCE(name_zh, name_en)' : 'name_en'}
    LIMIT 20`;

  const searchPattern = `%${searchTerm}%`;

  db.all(query, [searchPattern, searchPattern, searchPattern], (err, rows) => {
    if (err) {
      console.error('Search error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Document API
app.get('/api/document', isAuthenticated, (req, res) => {
  fs.readFile(path.join(__dirname, 'Mobile.md'), 'utf8', (err, data) => {
    if (err) {
      console.error('Document read error:', err);
      return res.status(500).send('Error reading document');
    }
    res.send(data);
  });
});

// --- ROUTES ---
app.get('/login', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/', isAuthenticated, (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'public', 'command_builder.html'));
});

app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(port, host, () => {
  console.log(`🚀 Server running at http://${host}:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${dbPath}`);
  console.log(`🔐 Session secret: ${sessionSecret.substring(0, 10)}...`);

  if (host === '0.0.0.0') {
    console.log(`🌐 External access: http://159.75.182.217:${port}`);
  }

  console.log('✅ Server started successfully');
});
