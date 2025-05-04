const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    console.log('🔹 Received login request');
    console.log('Email:', email);

    try {
        console.log('🔹 Trying to get a database connection...');
        const connection = await db.pool.getConnection();
        console.log(' Database connection successful');

        const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
        const results = await connection.query(query, [email, password]);

        console.log(' Query executed. Results:', results);

        if (results.length > 0) {
	    const user = results[0];

            req.session.userId = user.id;
	    res.cookie('connect.sid', req.sessionID, { httpOnly: true, secure: false }); // For session cookie
	    console.log('Session after login:', req.session);
	    res.status(200).json({ token: req.sessionID });
        } else {
            res.status(401).send({ message: 'Invalid email or password.' });
        }

        connection.release();
        console.log('🔹 Connection released back to pool');

    } catch (err) {
        console.error(' Error executing query:', err);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;




module.exports = router;

