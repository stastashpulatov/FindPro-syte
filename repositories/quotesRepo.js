const { db, now } = require('../db/sqlite');
const { v4: uuidv4 } = require('uuid');

function rowToQuote(row) {
  if (!row) return null;
  return {
    id: row.id,
    requestId: row.requestId,
    providerId: row.providerId,
    price: row.price,
    description: row.description || '',
    estimatedTime: row.estimatedTime || null,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

module.exports = {
  findByRequestId(requestId) {
    const stmt = db.prepare('SELECT * FROM quotes WHERE requestId = ? ORDER BY datetime(createdAt) DESC');
    return stmt.all(requestId).map(rowToQuote);
  },

  findById(id) {
    const stmt = db.prepare('SELECT * FROM quotes WHERE id = ?');
    return rowToQuote(stmt.get(id));
  },

  create(data) {
    const id = uuidv4();
    const ts = now();
    const rec = {
      id,
      requestId: data.requestId,
      providerId: data.providerId,
      price: data.price,
      description: data.description || '',
      estimatedTime: data.estimatedTime || null,
      status: data.status || 'pending',
      createdAt: ts,
      updatedAt: ts,
    };
    const stmt = db.prepare(`INSERT INTO quotes (
      id, requestId, providerId, price, description, estimatedTime, status, createdAt, updatedAt
    ) VALUES (@id, @requestId, @providerId, @price, @description, @estimatedTime, @status, @createdAt, @updatedAt)`);
    stmt.run(rec);
    return rowToQuote(rec);
  },

  createMany(list) {
    const ts = now();
    const stmt = db.prepare(`INSERT INTO quotes (id, requestId, providerId, price, description, estimatedTime, status, createdAt, updatedAt)
      VALUES (@id, @requestId, @providerId, @price, @description, @estimatedTime, @status, @createdAt, @UpdatedAt)`);
    const insert = db.transaction((rows) => {
      for (const q of rows) {
        const rec = {
          id: uuidv4(),
          requestId: q.requestId,
          providerId: q.providerId,
          price: q.price,
          description: q.description || '',
          estimatedTime: q.estimatedTime || null,
          status: q.status || 'pending',
          createdAt: ts,
          updatedAt: ts,
        };
        db.prepare(`INSERT INTO quotes (id, requestId, providerId, price, description, estimatedTime, status, createdAt, updatedAt)
          VALUES (@id, @requestId, @providerId, @price, @description, @estimatedTime, @status, @createdAt, @updatedAt)`).run(rec);
      }
    });
    insert(list);
  },

  accept(id) {
    const q = this.findById(id);
    if (!q) return null;
    // accept selected
    db.prepare('UPDATE quotes SET status = ?, updatedAt = ? WHERE id = ?').run('accepted', now(), id);
    // reject others for the same request
    db.prepare('UPDATE quotes SET status = ?, updatedAt = ? WHERE requestId = ? AND id <> ?')
      .run('rejected', now(), q.requestId, id);
    return this.findById(id);
  },

  deleteByRequestId(requestId) {
    const stmt = db.prepare('DELETE FROM quotes WHERE requestId = ?');
    stmt.run(requestId);
  }
};
