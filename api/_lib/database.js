import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'bek.db');
const SEED_PATH = path.join(__dirname, '..', '..', 'data', 'seed.json');

let db = null;
let SQL = null;

function loadSeed() {
  if (!fs.existsSync(SEED_PATH)) return null;
  return JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));
}

function schema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS signalements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      categorie TEXT NOT NULL,
      description TEXT NOT NULL,
      quartier TEXT NOT NULL,
      votes INTEGER DEFAULT 0,
      statut TEXT DEFAULT 'Nouveau',
      date TEXT DEFAULT (date('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS propositions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      categorie TEXT NOT NULL,
      description TEXT NOT NULL,
      auteur TEXT NOT NULL,
      votes INTEGER DEFAULT 0,
      commentaires INTEGER DEFAULT 0,
      date TEXT DEFAULT (date('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS entraide (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      titre TEXT NOT NULL,
      auteur TEXT NOT NULL,
      contact TEXT,
      description TEXT NOT NULL,
      date TEXT DEFAULT (date('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS membres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      email TEXT,
      statut TEXT DEFAULT 'en_attente',
      date_inscription TEXT DEFAULT (date('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS projets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      objectif TEXT,
      description TEXT NOT NULL,
      avancement INTEGER DEFAULT 0,
      benevoles INTEGER DEFAULT 0,
      statut TEXT DEFAULT 'Actif',
      date TEXT DEFAULT (date('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS actualites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      categorie TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      date TEXT DEFAULT (date('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount_dzd NUMERIC NOT NULL,
      amount_eur NUMERIC DEFAULT 0,
      currency TEXT DEFAULT 'dzd',
      status TEXT DEFAULT 'pending',
      chargily_checkout_id TEXT UNIQUE,
      supporter_name TEXT,
      message TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      plan_type TEXT,
      status TEXT DEFAULT 'active',
      chargily_checkout_id TEXT UNIQUE,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      description TEXT,
      hours TEXT,
      website TEXT,
      is_premium INTEGER DEFAULT 0,
      chargily_checkout_id TEXT UNIQUE,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ad_campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL,
      link_url TEXT,
      placement TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      chargily_checkout_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function seed() {
  const s = loadSeed();
  if (s) {
    for (const [table, rows] of Object.entries(s)) {
      if (rows && rows.length > 0) {
        const count = db.exec(`SELECT COUNT(*) as c FROM ${table}`);
        if (count.length === 0 || count[0].values[0][0] === 0) {
          for (const row of rows) {
            const keys = Object.keys(row);
            const vals = Object.values(row);
            const placeholders = keys.map(() => '?').join(',');
            db.run(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`, vals);
          }
        }
      }
    }
  }
}

function toObject(columns, values) {
  const obj = {};
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = values[i];
  }
  return obj;
}

export async function initDb() {
  if (db) return db;
  SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }

  db.run('PRAGMA journal_mode=WAL');
  schema();
  seed();
  persist();

  console.log(`[DB] Initialized at ${DB_PATH}`);
  return db;
}

let persistTimer = null;

export function persist() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
    persistTimer = null;
  }, 300);
}

export function persistNow() {
  if (persistTimer) clearTimeout(persistTimer);
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
  persistTimer = null;
}

export function closeDb() {
  if (db) { persistNow(); db.close(); db = null; }
}

export function queryAll(table, order = null) {
  let sql = `SELECT * FROM ${table}`;
  if (order) sql += ` ORDER BY ${order}`;
  const result = db.exec(sql);
  if (result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map(row => toObject(columns, row));
}

export function queryById(table, id) {
  const result = db.exec(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  if (result.length === 0 || result[0].values.length === 0) return null;
  const { columns, values } = result[0];
  return toObject(columns, values[0]);
}

export function queryWhere(table, conditions, order = null) {
  const whereClauses = [];
  const params = [];
  for (const [key, value] of Object.entries(conditions)) {
    whereClauses.push(`${key} = ?`);
    params.push(value);
  }
  const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  let sql = `SELECT * FROM ${table} ${where}`;
  if (order) sql += ` ORDER BY ${order}`;
  const result = db.exec(sql, params);
  if (result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map(row => toObject(columns, row));
}

export function insertRow(table, data) {
  const filtered = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) filtered[k] = v;
  }
  const keys = Object.keys(filtered);
  const vals = Object.values(filtered);
  const placeholders = keys.map(() => '?').join(',');
  db.run(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`, vals);
  const id = db.exec('SELECT last_insert_rowid() as id');
  persist();
  const newId = id[0].values[0][0];
  return queryById(table, newId);
}

export function updateRow(table, id, data) {
  const setClauses = [];
  const params = [];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    setClauses.push(`${key} = ?`);
    params.push(value);
  }
  params.push(id);
  db.run(`UPDATE ${table} SET ${setClauses.join(',')} WHERE id = ?`, params);
  persist();
  return queryById(table, id);
}

export function deleteRow(table, id) {
  db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
  persist();
}

export function updateRowByCheckout(table, checkoutId, data) {
  const setClauses = [];
  const params = [];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    setClauses.push(`${key} = ?`);
    params.push(value);
  }
  params.push(checkoutId);
  db.run(`UPDATE ${table} SET ${setClauses.join(',')} WHERE chargily_checkout_id = ?`, params);
  persist();
}

export function countWhere(table, conditions) {
  const whereClauses = [];
  const params = [];
  for (const [key, value] of Object.entries(conditions)) {
    whereClauses.push(`${key} = ?`);
    params.push(value);
  }
  const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const result = db.exec(`SELECT COUNT(*) as c FROM ${table} ${where}`, params);
  return result[0].values[0][0];
}

export function queryRaw(sql, params = []) {
  const result = db.exec(sql, params);
  if (result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map(row => toObject(columns, row));
}
