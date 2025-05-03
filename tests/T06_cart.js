// Test case T06 - Cart Management
const path   = require('path');
const fs     = require('fs');
const chai   = require('chai');
const expect = chai.expect;

// Load the products JSON
const products = require('../backend/products.json');

// Grab the cart operation functions
const { addToCart, getCart } = (() => {
    const code = fs.readFileSync(
        path.resolve(__dirname, '../backend/controllers/shopController.js'), 'utf8'
    );
    const controllersDir = JSON.stringify(
        path.resolve(__dirname, '../backend/controllers')
    );
    // Wrap into a function for convenience
    const wrapper = `
        (function() { const __dirname = ${controllersDir}; ${code}
            return { addToCart, getCart }; })()`;
    return eval(wrapper);
})();


// Unit test the cart functions
describe('Unit Test Cart Functions (T06)', function() {
    let req, res;

    // Reset req/res before each test
    beforeEach(function() {
        req = { session: {}, body: {} };
        res = {
            statusCode: null,
            jsonData:   null,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(obj) {
                this.jsonData = obj;
                return this;
            }
        };
    });

    // No additions = cart empty
    it('getCart() returns empty array when no cart in session', function() {
        getCart(req, res);
        expect(res.statusCode).to.equal(200);
        expect(res.jsonData).to.deep.equal({ cart: [] });
    });

    // Simulate adding a product
    it('addToCart() adds a real product to an empty cart', function() {
        const sample = products[0];
        req.body.productId = sample.id;
        addToCart(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.jsonData).to.have.property('message', 'Product added to cart');
        expect(res.jsonData)
            .to.have.property('cart')
            .that.is.an('array')
            .with.lengthOf(1);
        expect(res.jsonData.cart[0].id).to.equal(sample.id);
    });

    // Simulate persistent session = same cart
    it('getCart() returns items previously added', function() {
        req.session.cart = [ products[0] ];
        getCart(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.jsonData).to.deep.equal({ cart: [ products[0] ] });
    });
});
