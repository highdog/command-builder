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
  const query = `SELECT category_en as category, id, name_en as name FROM commands ORDER BY category_en, name_en`;
  db.all(query, [], (err, rows) => {
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

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
