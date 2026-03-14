require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

// Serve admin panel (protected by basic auth in the route)
app.get('/admin', (req, res) => {
    // Auth is handled by the admin.html page making API calls with credentials
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Fallback to index (Express 5 catch-all syntax)
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conditionally listen if not on Vercel
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`✨ NJ Saree Drapist server running at http://localhost:${PORT}`);
        console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
    });
}

// Export the Express API
module.exports = app;
