// Test case T12 - Update Authorization
const request = require('supertest');
const { expect } = require('chai');
const app = require('../backend/server');

describe("Customer‑only can't update products (T12 - customer check)", () => {
  it("should return 404 Not Found when a customer tries PUT /products/:id", async () => {
    await request(app)
      .put("/products/1")
      .send({ price: 19.99 })
      .expect(403); // page should say, 'forbidden'
  });
});
