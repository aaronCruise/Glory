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

function verifyInput(FName, Phone, Email) {
    const fullNameRegex = /^[A-Za-z]+ [A-Za-z]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;

    if (!FName || !Phone || !Email) {
        throw new Error('please fill in all fields');
    }

    if(!fullNameRegex.test(FName)){
        throw new Error('please input a valid First Name');
    }

    if(!phoneRegex.test(Phone)){
        throw new Error('please input a valid phone number');
    }

    if(!emailRegex.test(Email)){
        throw new Error('please input a valid phone number');
    }

}

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/profile_user_logged_in/index.html'));
});

router.get('/UserInfo', async (req, res) => {
    console.log('Session when accessing profile:', req.session);
    const userId = req.session.userId;
    console.log('User ID is: ', userId);
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    try {
        const [userResult] = await db.pool.query('SELECT * FROM user WHERE id = ?', [userId]);
	if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

	const user = userResult;


	const [userResult2] = await db.pool.query('SELECT * FROM shipping_info WHERE user_id = ?', [userId]);

	console.log("First database entry result:", userResult[0]);
	console.log("Shipping result:", userResult2);

	let shippingAddress = "";

        if (userResult2 !== undefined && userResult2 !== null) {
            shippingAddress = userResult2.address;
        } else {
            console.log("Shipping result is undefined or null.");
	}

	console.log("User full name:", user.full_name);
	console.log("User email:", user.email);
	console.log("User phone:", user.phone);
	console.log("Shipping address:", shippingAddress);

        return res.status(200).json({
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            shipping_address: shippingAddress
        });
    } catch (e) {
	console.error("Caught error in /UserInfo route:", e);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', async  (req, res) => {
    const {fullname, email, phone, shippingAddress } = req.body;
    console.log('Received POST:', req.body);
    console.log('fullname:', fullname);
    console.log('shippingAddress:', shippingAddress);

    try{
	console.log('Entered first try block');
	verifyInput(fullname, phone, email);
	console.log('Successfully verified input');
    } catch (e) {
	return res.status(400).json({ message: e.message });
    }
    try {
	console.log('Entered second try block');
        const result = await db.pool.query(
            'UPDATE user SET full_name = ?, phone = ? WHERE email = ?', [fullname, phone, email]
        );

	console.log('User table update result:', result);
	console.log('User update result:', result[0]);
	const [userResult] = await db.pool.query('SELECT id FROM user WHERE email = ?', [email]);
	const userId = userResult.id;

	console.log('Users ID Value:', userId);

	if (!userId) return res.status(404).json({ message: 'User not found' });

	console.log('About to run SELECT for shipping info');
	const [shippingCheck] = await db.pool.query(
    	    'SELECT * FROM shipping_info WHERE user_id = ?',
    	    [userId]
	);

	console.log('Shipping Check trying to update info:', shippingCheck);

	if (shippingCheck !== undefined && shippingCheck !== null) {
	    await db.pool.query(
                'UPDATE shipping_info SET address = ? WHERE user_id = ?',
                 [shippingAddress, userId]
    	    );
	} else {
    	    const insertResult = await db.pool.query(
                `INSERT INTO shipping_info (user_id, address) VALUES (?, ?)`,
                 [userId, shippingAddress]
    	    );
	    console.log('Shipping address insert result:', insertResult);
	}

        res.status(201).json({message: 'Profile updated successfully!'});
    } catch(e){
        //console.error('Database error:', e);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;
