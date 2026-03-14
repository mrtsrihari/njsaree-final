const path = require('path');
const Database = require('better-sqlite3');
const os = require('os');

// In Vercel, the only writable path is /tmp
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true' || process.env.VERCEL;
const dbDir = isVercel ? os.tmpdir() : path.join(__dirname, '..');
const dbPath = path.join(dbDir, 'reviews.db');

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create reviews table
db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function insertReview(name, rating, message) {
    const stmt = db.prepare('INSERT INTO reviews (name, rating, message) VALUES (?, ?, ?)');
    return stmt.run(name, rating, message);
}

function getApprovedReviews() {
    return db.prepare('SELECT id, name, rating, message, created_at FROM reviews WHERE approved = 1 ORDER BY created_at DESC').all();
}

function getPendingReviews() {
    return db.prepare('SELECT * FROM reviews WHERE approved = 0 ORDER BY created_at DESC').all();
}

function getAllReviews() {
    return db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
}

function approveReview(id) {
    return db.prepare('UPDATE reviews SET approved = 1 WHERE id = ?').run(id);
}

function deleteReview(id) {
    return db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
}

module.exports = {
    db,
    insertReview,
    getApprovedReviews,
    getPendingReviews,
    getAllReviews,
    approveReview,
    deleteReview
};
