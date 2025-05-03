const express = require('express');
const router = express.Router(); 
const db = require('../db'); 

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    console.log('🔹 Received login request');

    try {
        const connection = await db.pool.getConnection();
        console.log('✅ Database connection successful');

        const query = 'SELECT role FROM user WHERE email = ? AND password = ?';
        const results = await connection.query(query, [email, password]);

        connection.release(); 
        console.log('🔹 Connection released back to pool');

        if (results.length > 0) {
            const role = results[0].role;
            console.log('User role:', role);


            if (role === 'admin') {
                return res.redirect('/frontend/admin/index.html');
            } else {
                return res.redirect('/home_user_logged_in/index.html');
            }
        } else {
            res.status(401).send({ message: 'Invalid email or password.' });
        }
    } catch (err) {
        console.error('❌ Error executing query:', err);
        res.status(500).send({ message: 'Internal server error' });
    }
});




module.exports = router;

