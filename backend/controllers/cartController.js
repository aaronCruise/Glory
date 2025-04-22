const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Load all products
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "products.json"), "utf8")
);

// GET /cart
router.get("/", (req, res) => {
  try {
    const cart = req.session.cart || [];                // This is an array of product IDs

    const cartItems = cart.map(item => {
      const prod = products.find(p => p.id === item.id);
      return prod ? { ...prod, qty: item.qty } : null;
    }).filter(Boolean);                                

    res.status(200).json({ items: cartItems });
  } catch (err) {
    console.error("Error loading cart:", err);
    res.status(500).json({ error: "Failed to load cart items" });
  }
});

router.post("/", (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: "productId required" });

    if (!req.session.cart) req.session.cart = [];

    const cart = req.session.cart;
    const found = cart.find(i => i.id === productId);

    if (found) {
      found.qty += qty;               
    } else {
      cart.push({ id: productId, qty });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

module.exports = router;
