const express = require('express');
const crypto = require('crypto');
const router = express.Router();
 // No db imports for reviews anymore

// Stateless token derived from environment variables to survive Vercel cold starts
const STATELESS_TOKEN = crypto.createHash('sha256').update((process.env.ADMIN_USERNAME || 'admin') + (process.env.ADMIN_PASSWORD || 'secret')).digest('hex');

// Token-based auth middleware (no WWW-Authenticate header — no browser popup)
function tokenAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    if (token === STATELESS_TOKEN) {
        next();
    } else {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
}

// POST login — validate credentials, return token
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        return res.json({ success: true, token: STATELESS_TOKEN });
    } else {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

// POST logout — client drops token
router.post('/logout', tokenAuth, (req, res) => {
    res.json({ success: true, message: 'Logged out' });
});

// Protect all routes below with token auth
router.use(tokenAuth);


function isValidToken(token) {
    return token === STATELESS_TOKEN;
}

module.exports = router;
module.exports.isValidToken = isValidToken;
