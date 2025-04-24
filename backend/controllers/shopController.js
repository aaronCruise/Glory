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

//Add product to cart
const addToCart = (req, res) => {
  try {
    const { productId } = req.body;
    const products = loadProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    req.session.cart.push(product);
    res.status(200).json({ message: "Product added to cart", cart: req.session.cart });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /cart - view current user's cart
const getCart = (req, res) => {
  const cart = req.session.cart || [];
  res.status(200).json({ cart });
};


// Define routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Don't allow customers to PUT (update) the product list
router.put('/:id', (req,res,next) => {
  if (!req.session.userId || !req.session.isAdmin) 
    return res.status(403).json({ error:'Forbidden' });
});

module.exports = router;
