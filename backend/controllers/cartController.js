const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Load all products
const loadProducts = () => {
  const filePath = path.join(__dirname, '..', 'products.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// GET /cart
router.get('/', (req, res) => {
  try {
    const cart = req.session.cart || []; // This is an array of product IDs
    const allProducts = loadProducts();

    // Match cart product IDs to full product objects
    const cartItems = allProducts.filter(product => cart.includes(product.id));

    res.status(200).json({ items: cartItems });
  } catch (err) {
    console.error("Error loading cart:", err);
    res.status(500).json({ error: "Failed to load cart items" });
  }
});

module.exports = router;
