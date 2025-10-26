const { db, now } = require('../db/sqlite');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    phone: row.phone || null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

module.exports = {
  async create({ name, email, password, role = 'client', phone = null }) {
    const id = uuidv4();
    const ts = now();
    const hashed = await bcrypt.hash(password, 10);
    const stmt = db.prepare(`INSERT INTO users (id, name, email, password, role, phone, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(id, name, email, hashed, role, phone, ts, ts);
    return this.findById(id);
  },

  findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return rowToUser(stmt.get(id));
  },

  findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return rowToUser(stmt.get(email));
  },

  async comparePassword(user, candidate) {
    return bcrypt.compare(candidate, user.password);
  }
};
