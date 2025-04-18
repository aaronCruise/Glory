const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Helper: Load JSON product data
const loadProducts = () => {
  const filePath = path.join(__dirname, '..', 'products.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// GET /products
const getAllProducts = (req, res) => {
  try {
    const products = loadProducts();
    res.status(200).json({items: products});
  } catch (err) {
    console.error("Error loading products:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
};

// GET /products/:id
const getProductById = (req, res) => {
  try {
    const products = loadProducts();
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Define routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;