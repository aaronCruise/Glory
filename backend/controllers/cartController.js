const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');

router.get('/products', (req, res) => {
    console.log("GET /cart/products hit");
    // Test products – hardcoded
    const testCart = {
        items: [
            {
                id: 101,
                name: "Fitness Tracker",
                price: 49.99,
                image: "/images/Fitness_Tracker.png",
                quantity: 1
            },
            {
                id: 102,
                name: "Yoga Mat",
                price: 24.99,
                image: "/images/Yoga_Mat.png",
                quantity: 1
            }
        ]
    };

    res.json(testCart);
});

module.exports = router;
