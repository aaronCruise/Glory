// Test case T05 - Product Browsing
const request = require('supertest');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const app = require('../backend/server');

// Verify that a user can browse products
describe('Shop Page Endpoints (T05)', () => {
    let products;

    // Load the products JSON file
    before(() => {
    const filePath = path.join(__dirname, '..', 'backend', 'products.json');
    products = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    });

    // Check that products are loaded succesfully
    describe('GET /products', () => {
        it('should return all products', async () => {
            const res = await request(app)
                .get('/products')
                .expect(200);
            expect(res.body).to.have.property('items').that.is.an('array');
            expect(res.body.items).to.deep.equal(products);
        });
    });

    // Check that a specific product exists
    describe('GET /products/:id', () => {
        it('should return a single product when id exists', async () => {
            const testId = products[0].id;
            const res = await request(app)
                .get(`/products/${testId}`)
                .expect(200);

        // Verify that products display as expected
        expect(res.body).to.deep.equal(products.find(p => p.id === testId));
        });
    });
});

