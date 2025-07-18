const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
  // Create users table with a role column
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'user'
  )`, (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
      return;
    }
    
    // Add role column if it doesn't exist (for migrations)
    db.run("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'", (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error("Error adding role column:", err.message);
      }
    });

    // Insert a default admin user if not exists, and ensure they are an admin
    const adminPassword = 'admin';
    db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
      if (err) {
        console.error(err.message);
      } else if (!row) {
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', adminPassword, 'admin']);
      } else {
        // If admin user exists, ensure their role is 'admin'
        db.run("UPDATE users SET role = 'admin' WHERE username = ?", ['admin']);
      }
    });
  });

  // Create the commands table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hex_id TEXT,
    type TEXT,
    category_en TEXT,
    name_en TEXT,
    description_en TEXT,
    category_zh TEXT,
    name_zh TEXT,
    description_zh TEXT
  )`, (err) => {
    if (err) {
      console.error("Error creating commands table:", err.message);
    }
    db.close((err) => {
      if (err) console.error(err.message);
    });
  });
});
