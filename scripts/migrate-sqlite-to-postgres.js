const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

const projectRoot = path.resolve(__dirname, '..');
const sqlitePath = process.env.SQLITE_PATH || path.join(projectRoot, 'db.sqlite');
const builderConfigPath = process.env.BUILDER_CONFIG_PATH || path.join(projectRoot, 'builder-configs.json');
const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!postgresUrl) {
  console.error('Missing POSTGRES_URL or DATABASE_URL.');
  process.exit(1);
}

if (!fs.existsSync(sqlitePath)) {
  console.error(`SQLite file not found: ${sqlitePath}`);
  process.exit(1);
}

function sqliteAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function sqlValuesPlaceholders(rowCount, columnCount) {
  const values = [];
  for (let i = 0; i < rowCount; i += 1) {
    const group = [];
    for (let j = 0; j < columnCount; j += 1) {
      group.push(`$${i * columnCount + j + 1}`);
    }
    values.push(`(${group.join(', ')})`);
  }
  return values.join(', ');
}

async function bulkInsert(client, tableName, rows) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const placeholders = sqlValuesPlaceholders(rows.length, columns.length);
  const params = rows.flatMap((row) => columns.map((column) => row[column]));
  const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${placeholders}`;
  await client.query(sql, params);
}

async function main() {
  const sqliteDb = new sqlite3.Database(sqlitePath);
  const pool = new Pool({ connectionString: postgresUrl });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS commands (
        id SERIAL PRIMARY KEY,
        hex_id TEXT,
        type TEXT,
        category_en TEXT,
        name_en TEXT,
        description_en TEXT,
        category_zh TEXT,
        name_zh TEXT,
        description_zh TEXT
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT NOT NULL DEFAULT 'user'
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS packet_types (
        id SERIAL PRIMARY KEY,
        command_id INTEGER NOT NULL REFERENCES commands(id) ON DELETE CASCADE,
        name TEXT NOT NULL
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS payload_fields (
        id SERIAL PRIMARY KEY,
        packet_type_id INTEGER NOT NULL REFERENCES packet_types(id) ON DELETE CASCADE,
        field_name TEXT NOT NULL,
        display_name TEXT NOT NULL,
        type TEXT NOT NULL,
        default_value TEXT,
        is_readonly BOOLEAN DEFAULT FALSE,
        bit_position INTEGER,
        max_length INTEGER,
        display_order INTEGER
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS enum_values (
        id SERIAL PRIMARY KEY,
        field_id INTEGER NOT NULL REFERENCES payload_fields(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        value TEXT NOT NULL,
        display_order INTEGER
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS builder_configs (
        hex_id TEXT PRIMARY KEY,
        config JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query('TRUNCATE TABLE enum_values, payload_fields, packet_types, users, commands RESTART IDENTITY CASCADE');
    await client.query('TRUNCATE TABLE builder_configs');

    const commands = await sqliteAll(sqliteDb, 'SELECT * FROM commands ORDER BY id');
    const users = await sqliteAll(sqliteDb, 'SELECT * FROM users ORDER BY id');
    const packetTypes = await sqliteAll(sqliteDb, 'SELECT * FROM packet_types ORDER BY id');
    const payloadFields = await sqliteAll(sqliteDb, 'SELECT * FROM payload_fields ORDER BY id');
    const enumValues = await sqliteAll(sqliteDb, 'SELECT * FROM enum_values ORDER BY id');

    await bulkInsert(client, 'commands', commands);
    await bulkInsert(client, 'users', users);
    await bulkInsert(client, 'packet_types', packetTypes);
    await bulkInsert(client, 'payload_fields', payloadFields);
    await bulkInsert(client, 'enum_values', enumValues);

    if (fs.existsSync(builderConfigPath)) {
      const builderConfigs = JSON.parse(fs.readFileSync(builderConfigPath, 'utf8'));
      const rows = Object.entries(builderConfigs).map(([hexId, config]) => ({
        hex_id: hexId,
        config: JSON.stringify(config)
      }));
      for (const row of rows) {
        await client.query(
          'INSERT INTO builder_configs (hex_id, config, updated_at) VALUES ($1, $2::jsonb, NOW())',
          [row.hex_id, row.config]
        );
      }
    }

    await client.query(`
      SELECT setval(pg_get_serial_sequence('commands', 'id'), COALESCE((SELECT MAX(id) FROM commands), 1), (SELECT COUNT(*) > 0 FROM commands))
    `);
    await client.query(`
      SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), (SELECT COUNT(*) > 0 FROM users))
    `);
    await client.query(`
      SELECT setval(pg_get_serial_sequence('packet_types', 'id'), COALESCE((SELECT MAX(id) FROM packet_types), 1), (SELECT COUNT(*) > 0 FROM packet_types))
    `);
    await client.query(`
      SELECT setval(pg_get_serial_sequence('payload_fields', 'id'), COALESCE((SELECT MAX(id) FROM payload_fields), 1), (SELECT COUNT(*) > 0 FROM payload_fields))
    `);
    await client.query(`
      SELECT setval(pg_get_serial_sequence('enum_values', 'id'), COALESCE((SELECT MAX(id) FROM enum_values), 1), (SELECT COUNT(*) > 0 FROM enum_values))
    `);

    await client.query('COMMIT');
    console.log('Migration finished successfully.');
    console.log(`commands=${commands.length}, users=${users.length}, packet_types=${packetTypes.length}, payload_fields=${payloadFields.length}, enum_values=${enumValues.length}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    sqliteDb.close();
    client.release();
    await pool.end();
  }
}

main();
