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

function verifyInput(FName, LName, Password, DOB, Phone) {
    const nameRegex = /^[A-Za-z]+$/;
    //const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;

    if (!FName || !LName || !Password || !DOB || !Phone) {
        throw new Error('please fill in all fields');
    }

    if(!nameRegex.test(FName)){
        throw new Error('please input a valid First Name');
    }

    if(!nameRegex.test(LName)){
        throw new Error('please input a valid Last Name');
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

}

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/profile_user_logged_in/index.html'));
});

router.put('/', async  (req, res) => {
    const {firstName, lastName, email, password, dob, phone } = req.body;

    try{
	verifyInput(firstName, lastName, password, dob, phone);
    } catch (e) {
	return res.status(400).json({ message: e.message });
    }
    try {
        const fullName = `${firstName} ${lastName}`;

        const result = await db.pool.query(
            'UPDATE user SET full_name = ?, dob = ?, phone = ?, password = ? WHERE email = ?', [fullName, dob, phone, password, email]
        );

        res.status(201).json({message: 'Profile updated successfully!'});
    } catch(e){
        //console.error('Database error:', e);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;
