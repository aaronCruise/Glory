// Test case T07 - Order Checkout
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { expect } = require('chai');
const sinon = require('sinon');

// Simulate a browser window checkout flow
describe('Checkout workflow (T07)', () => {
    let dom, window, document;

    // Get paths to frontend cart files
    const cartHtmlPath = path.resolve(__dirname, '../frontend/cart_user_logged_in/index.html');
    const cartScriptPath = path.resolve(__dirname, '../frontend/cart_user_logged_in/script.js');

    beforeEach(() => {
        // Load HTML
        let html = fs.readFileSync(cartHtmlPath, 'utf8');

        // Remove all <scripts>
        html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

        // Create JSDOM enviornment
        dom = new JSDOM(html, {
          runScripts: 'dangerously',
          resources: 'usable',
          url: 'http://localhost/cart.html'
        });
        window  = dom.window;
        document = window.document;
        
        // Stub a confirm and open window
        sinon.stub(window, 'confirm');
        sinon.stub(window, 'open');

        // Add test cart data 
        window.localStorage.setItem('cart', JSON.stringify([
          { id: 1, name: 'Widget A', price: '10.00', qty: 2 },
          { id: 2, name: 'Gadget B', price: '5.50', qty: 1 }
        ]));

        // Inject cart script
        const scriptContent = fs.readFileSync(cartScriptPath, 'utf8');
        const scriptEl = document.createElement('script');
        scriptEl.textContent = scriptContent;
        document.body.appendChild(scriptEl);

        // Launch the DOM
        document.dispatchEvent(new window.Event('DOMContentLoaded'));
    });

    // Cleanup after test
    afterEach(() => {
        sinon.restore();
        dom.window.close();
    });

    // Verify correct subtotal & total
    it('shows the correct subtotal & total and displays the Checkout button', () => {
        const rows = document.querySelectorAll('.summary-row');
        expect(rows[0].textContent).to.contain('Subtotal').and.to.contain('$25.50');
        expect(rows[2].textContent).to.contain('Total').and.to.contain('$25.50');
        expect(document.querySelector('.checkout-btn').style.display).to.equal('block');
    });

    // Verify redirection to payment portal
    it('opens payment portal when user confirms', () => {
        window.confirm.returns(true);
        document.querySelector('.checkout-btn').click();
        expect(window.open.calledOnceWithExactly(
          'https://example.com/payment', '_blank'
        )).to.be.true;
    });
});
