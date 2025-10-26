const { db, now } = require('../db/sqlite');
const { v4: uuidv4 } = require('uuid');

function rowToProvider(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    description: row.description || '',
    categories: row.categories ? row.categories.split(',').filter(Boolean) : [],
    rating: row.rating,
    reviews: row.reviews,
    basePrice: row.basePrice,
    responseTime: row.responseTime,
    completedJobs: row.completedJobs,
    verified: !!row.verified,
    userId: row.userId || null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

module.exports = {
  find(query = {}) {
    const conditions = [];
    const params = [];
    if (query.category) {
      conditions.push("(',' || categories || ',') LIKE ?");
      params.push(`%,${query.category},%`);
    }
    if (query.minRating) {
      conditions.push('rating >= ?');
      params.push(query.minRating);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const stmt = db.prepare(`SELECT * FROM providers ${where} ORDER BY rating DESC`);
    return stmt.all(...params).map(rowToProvider);
  },

  findById(id) {
    const stmt = db.prepare('SELECT * FROM providers WHERE id = ?');
    return rowToProvider(stmt.get(id));
  },

  create(data) {
    const id = uuidv4();
    const ts = now();
    const rec = {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      description: data.description || '',
      categories: Array.isArray(data.categories) ? data.categories.join(',') : (data.categories || ''),
      rating: typeof data.rating === 'number' ? data.rating : 0,
      reviews: typeof data.reviews === 'number' ? data.reviews : 0,
      basePrice: data.basePrice,
      responseTime: data.responseTime || '24 часа',
      completedJobs: typeof data.completedJobs === 'number' ? data.completedJobs : 0,
      verified: data.verified ? 1 : 0,
      userId: data.userId || null,
      createdAt: ts,
      updatedAt: ts,
    };
    const stmt = db.prepare(`INSERT INTO providers (
      id, name, email, phone, description, categories, rating, reviews, basePrice, responseTime, completedJobs, verified, userId, createdAt, updatedAt
    ) VALUES (@id, @name, @email, @phone, @description, @categories, @rating, @reviews, @basePrice, @responseTime, @completedJobs, @verified, @userId, @createdAt, @updatedAt)`);
    stmt.run(rec);
    return rowToProvider(rec);
  },

  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;
    const merged = {
      ...existing,
      ...data,
      categories: Array.isArray(data.categories) ? data.categories.join(',') : (data.categories ?? existing.categories.join(',')),
      verified: data.verified != null ? (data.verified ? 1 : 0) : (existing.verified ? 1 : 0),
      updatedAt: now(),
    };
    const stmt = db.prepare(`UPDATE providers SET
      name=@name,
      email=@email,
      phone=@phone,
      description=@description,
      categories=@categories,
      rating=@rating,
      reviews=@reviews,
      basePrice=@basePrice,
      responseTime=@responseTime,
      completedJobs=@completedJobs,
      verified=@verified,
      userId=@userId,
      updatedAt=@updatedAt
      WHERE id=@id`);
    stmt.run({
      ...merged,
      categories: typeof merged.categories === 'string' ? merged.categories : merged.categories.join(','),
    });
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM providers WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};
