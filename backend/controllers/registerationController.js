const express = require('express');
const router = express.Router();
const db = require('../db');


function verifyDate(dateInput) {
    const date = new Date(dateInput);
    return !isNaN(date.getTime()); // Validate if the date is real
}

function verifyInput(FName, LName, Email, Password, confirmPassword, DOB, Phone) {
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;

    if (!FName || !LName || !Email || !Password || !confirmPassword || !DOB || !Phone) {
        throw new Error('please fill in all fields');
    }

    if(!nameRegex.test(FName)){
        throw new Error('please input a valid First Name');
    }

    if(!nameRegex.test(LName)){
        throw new Error('please input a valid Last Name');
    }

    if(!emailRegex.test(Email)){
        throw new Error('please input a valid email address');
    }

    if(!phoneRegex.test(Phone)){
        throw new Error('please input a valid phone number');
    }

    if(!dobRegex.test(DOB)){
        throw new Error('please format the date of birth properly');
    }

    //console.log('Before calling verifyDate with DOB:', DOB);
    if (!verifyDate(DOB)){
        throw new Error('please input a valid date');
    }

    if(!passwordRegex.test(Password)){
        throw new Error('please input a valid password that fulfills all requirments');
    }

    if(!passwordRegex.test(confirmPassword)){
        throw new Error('please input a valid confirm password that fulfills all requirments');
    }

}

router.post('/', async  (req, res) => {
    const {firstName, lastName, email, password, confirmPassword, dob, phone } = req.body;

     console.log(req.body);

    try{
        verifyInput(firstName, lastName, email, password, confirmPassword, dob, phone);
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
    try {
        //console.log('Inside try block...');
        const [user] = await db.pool.query(
          'SELECT Count(*) as count FROM user WHERE email = ?',[email]);

        //console.log('DB result:', user);

        if (user.count > 0) {
          //console.error('Email already exists:', email);
          return res.status(400).json({ message: 'This email has already been registered' });
        }


	if (password !== confirmPassword) {
	  return res.status(400).json({ message: 'Passwords do not match.' });
	}

        const fullName = `${firstName} ${lastName}`;

        const result = await db.pool.query(
            'INSERT INTO user (full_name, DOB, email, phone, password) VALUES (?,?,?,?,?)', [fullName, dob, email, phone, password]
        );

	 const userId = result.insertId;

        // Step 4: Insert the address into the shipping_info table with the userId
        const result2 = await db.pool.query('INSERT INTO shipping_info (user_id) VALUES (?)',
            [userId]
        );

        //console.log('Insert result:', result);

    	 res.status(201).json({
   	    message: 'Registration successful!',
            user: {
                fullName: fullName,
        	email: email,
		phone: phone,
        	shippingInfo: ''
    	    }
	});
    } catch(e){
        console.error('Registration failed:', e);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;
