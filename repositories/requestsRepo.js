const { db, now } = require('../db/sqlite');
const { v4: uuidv4 } = require('uuid');

function rowToRequest(row) {
  if (!row) return null;
  return {
    id: row.id,
    category: row.category,
    description: row.description,
    location: row.location,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    quotesCount: row.quotesCount,
    userId: row.userId || null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

module.exports = {
  findAll() {
    const stmt = db.prepare('SELECT * FROM requests ORDER BY datetime(createdAt) DESC');
    return stmt.all().map(rowToRequest);
  },

  findById(id) {
    const stmt = db.prepare('SELECT * FROM requests WHERE id = ?');
    return rowToRequest(stmt.get(id));
  },

  create(data) {
    const id = uuidv4();
    const ts = now();
    const req = {
      id,
      category: data.category,
      description: data.description,
      location: data.location,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status || 'new',
      quotesCount: 0,
      userId: data.userId || null,
      createdAt: ts,
      updatedAt: ts,
    };
    const stmt = db.prepare(`INSERT INTO requests (
      id, category, description, location, name, email, phone, status, quotesCount, userId, createdAt, updatedAt
    ) VALUES (@id, @category, @description, @location, @name, @email, @phone, @status, @quotesCount, @userId, @createdAt, @updatedAt)`);
    stmt.run(req);
    return req;
  },

  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: now() };
    const stmt = db.prepare(`UPDATE requests SET
      category=@category,
      description=@description,
      location=@location,
      name=@name,
      email=@email,
      phone=@phone,
      status=@status,
      quotesCount=@quotesCount,
      userId=@userId,
      updatedAt=@updatedAt
      WHERE id=@id`);
    stmt.run(updated);
    return updated;
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM requests WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  },

  incrementQuotesCount(id, by = 1) {
    const stmt = db.prepare('UPDATE requests SET quotesCount = quotesCount + ? , updatedAt = ? WHERE id = ?');
    stmt.run(by, now(), id);
  }
};
