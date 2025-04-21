// Test case T07 - Order Checkout
const express   = require('express');
const request   = require('supertest');
const session   = require('express-session');
const chai      = require('chai');
const expect    = chai.expect;

describe('T07: Order Confirmation Flow', () => {
  let app, agent, orders;

  before(() => {
    orders = [];
    app = express();
    app.use(express.json());
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: true
    }));

    // Helper route to seed req.session.cart with two items
    app.get('/set-cart', (req, res) => {
      req.session.cart = [1, 2];
      res.sendStatus(200);
    });

    // Stub GET /cart to return whatever is in session.cart
    app.get('/cart', (req, res) => {
      const cart = req.session.cart || [];
      res.status(200).json({ items: cart });
    });

    // Stub POST /checkout to "process" the order and clear the cart
    app.post('/checkout', (req, res) => {
      const cart = req.session.cart || [];
      if (cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }
      const orderId = orders.length + 1;
      const newOrder = { id: orderId, items: [...cart] };
      orders.push(newOrder);
      // clear the cart
      req.session.cart = [];
      res.status(200).json({
        success: true,
        message: 'Order confirmed',
        orderId,
        items: newOrder.items
      });
    });

    agent = request.agent(app);
  });
});
;
