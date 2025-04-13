const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');

function verifyDate(dateInput) {
    //console.log('Date input received in verifyDate:', dateInput);
    if (typeof dateInput !== 'string') {
        //console.error('DOB is not a string:', dateInput);
        return false;
    }

    const parseDate = dateInput.split("-");
    const year = parseInt(parseDate[0]);
    const month = parseInt(parseDate[1]);
    const day = parseInt(parseDate[2]);

    if(year < 1910 || year > 2024){
        //console.log("Invalid year input");
        return false;
    }
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function verifyInput(FName, Phone) {
    const fullNameRegex = /^[A-Za-z]+ [A-Za-z]+$/;
    //const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;

    if (!FName || !Phone) {
        throw new Error('please fill in all fields');
    }

    if(!fullNameRegex.test(FName)){
        throw new Error('please input a valid First Name');
    }

    if(!phoneRegex.test(Phone)){
        throw new Error('please input a valid phone number');
    }

}

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/profile_user_logged_in/index.html'));
});

router.get('/UserInfo', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    try {
        const [userResult] = await db.pool.query('SELECT * FROM user WHERE id = ?', [userId]);
	const [userResult2] = await db.pool.query('SELECT * FROM shipping_info WHERE user_id = ?', [userId]);
        const user = userResult[0];
	const user2 = userResult2[0];
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
	    shipping_address: user2.address
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', async  (req, res) => {
    const {fullname, email, phone, shippingAddress } = req.body;

    try{
	verifyInput(fullname, email, phone);
    } catch (e) {
	return res.status(400).json({ message: e.message });
    }
    try {

        const result = await db.pool.query(
            'UPDATE user SET full_name = ?, phone = ? WHERE email = ?', [fullName, phone, email]
        );

	const [userResult] = await db.pool.query('SELECT id FROM user WHERE email = ?', [email]);
	const userId = userResult[0]?.id;

	if (!userId) return res.status(404).json({ message: 'User not found' });


	const [shippingCheck] = await db.pool.query(
    	    'SELECT * FROM shipping_info WHERE user_id = ?',
    	    [userId]
	);


	if (shippingCheck.length > 0) {
	    await db.pool.query(
                'UPDATE shipping_info SET address = ? WHERE user_id = ?',
                 [address, userId]
    	    );
	} else {
    	    await db.pool.query(
                `INSERT INTO shipping_info (user_id, address) VALUES (?, ?)`,
                 [userId, address]
    	    );
	}

        res.status(201).json({message: 'Profile updated successfully!'});
    } catch(e){
        //console.error('Database error:', e);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;
