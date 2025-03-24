const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/register', async  (req, res) => {
    const {firstName, lastName, email, password, dob, phone } = req.body;

    if (!firstName || !lastName || !email || !password || !dob || !phone) {
        return res.status(400).send('please fill in all fields');
    }

    try {
        const [user] = await db.pool.query(
          'SELECT Count(*) as count FROM users WHERE email = ?',[email]);
    
        if (user.count > 0) {
          return res.status(400).json({ message: 'This email has already been registered' });
        }

        const fullName = '${firstName} ${lastName}';

        const result = await db.pool.query(
            'INSERT INTO users (full_name, DOB, email, phone, password) VALUES (?,?,?,?,?)', [fullName, dob, email, phone, password]
        );

        res.status(201).json({message: 'Registration successful!'});
    } catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;