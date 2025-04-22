// Test case T06 - Shopping Cart Management
const request = require('supertest');
const express = require('express');
const session = require('express-session');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const cartRouter = require('../backend/controllers/cartController');

describe('Cart Functionality (T06)', () => {
  let app, agent, products;

  before(() => {
    app = express();

    // Set up express‑session
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: true
    }));

    // Helper route to seed session.cart
    app.get('/set-session', (req, res) => {
      req.session.cart = [1, 2];
      res.sendStatus(200);
    });

    app.use('/cart', cartRouter);

    // Load the products file
    products = require(path.join(__dirname, '../backend/', 'products.json'));

    // Use a persistent agent so cookies (session) are kept across requests
    agent = request.agent(app);
  });

  it('returns an empty array when session.cart is not set', async () => {
    const res = await request(app)
      .get('/cart')
      .expect(200);

    expect(res.body).to.have.property('items')
      .that.is.an('array')
      .that.is.empty;
  });

  it('returns full product objects for IDs in session.cart', async () => {
    // First set req.session.cart = [1,2]
    await agent
      .get('/set-session')
      .expect(200);

    // Then call GET /cart
    const res = await agent
      .get('/cart')
      .expect(200);

    // Build expected result from products.json
    const expected = products.filter(p => [1, 2].includes(p.id));

    expect(res.body).to.have.property('items')
      .that.deep.equals(expected);
  });
});
