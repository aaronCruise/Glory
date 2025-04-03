// loginController.js
const express = require('express');
const router = express.Router(); // Creates an Express router
const db = require('../db'); // Import the database connection

// Handle login request
router.post('/', (req, res) => {
    const { email, password } = req.body;

    console.log('email:', email);
    console.log('password:', password);

    const query = 'SELECT * FROM user WHERE email = ? AND password = ?';

    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal server error' });
        }

        console.log('Query Results:', results);

        if (results.length > 0) {
            // User found
            res.send({ message: 'Login successful!' });
        } else {
            // No match found
            res.status(401).send({ message: 'Invalid email or password.' });
        }
    });
});

// Export the router to use in the main app (server.js)
module.exports = router;
