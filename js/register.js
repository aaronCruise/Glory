const express = require('express');
const router = express.Router();
const db = require('../db');

async function testDbConnection() {
  try {
    const conn = await db.pool.getConnection();
    console.log('Database connection successful!');
    conn.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

// Call the async function correctly
testDbConnection().then(() => {
  console.log('Database check complete.');
});

router.post('/', async  (req, res) => {
    const {firstName, lastName, email, password, dob, phone } = req.body;

    if (!firstName || !lastName || !email || !password || !dob || !phone) {
        return res.status(400).send('please fill in all fields');
    }

    try {
	console.log('Inside try block...');
        const [user] = await db.pool.query(
          'SELECT Count(*) as count FROM user WHERE email = ?',[email]);

	console.log('DB result:', user);

        if (user.count > 0) {
	  console.error('Email already exists:', email);
          return res.status(400).json({ message: 'This email has already been registered' });
        }

        const fullName = `${firstName} ${lastName}`;

        const result = await db.pool.query(
            'INSERT INTO user (full_name, DOB, email, phone, password) VALUES (?,?,?,?,?)', [fullName, dob, email, phone, password]
        );

	console.log('Insert result:', result);

        res.status(201).json({message: 'Registration successful!'});
    } catch(err){
        console.error('Database error:', err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;
