// Test case T10 - Admin Product Listing Operations
const fs       = require('fs');
const path     = require('path');
const { JSDOM } = require('jsdom');
const { expect } = require('chai');

// Verify that admin has ability to update product listings
describe('Admin Product Listing UI (T10)', () => {
    let dom, window, document;

    // Get paths to front end files
    const adminHtmlPath = path.resolve(__dirname, '../frontend/admin/index.html');
    const adminScriptPath = path.resolve(__dirname, '../frontend/admin/script.js');

    before(() => {
        // Load HTML
        let html = fs.readFileSync(adminHtmlPath, 'utf8');
    
        // Remove all <scripts>
        html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

        // Create JSDOM enviornment
        dom = new JSDOM(html, {
            runScripts: 'dangerously',
            resources: 'usable',
            url: 'http://localhost/admin.html'
        });
        window   = dom.window;
        document = window.document;

        // Inject admin script
        const js = fs.readFileSync(adminScriptPath, 'utf8');
        const scriptEl = document.createElement('script');
        scriptEl.textContent = js;
        document.body.appendChild(scriptEl);

        // Luanch the DOM
        document.dispatchEvent(new window.Event('DOMContentLoaded'));
    });

    // Cleanup
    after(() => window.close && window.close());

    // Verify rendering of UI components
    it('renders all Add-Product form fields', () => {
        [ 'product-name', 'image', 'category', 'description', 'submit-btn' ]
        .forEach(id => {
            const el = document.getElementById(id);
            expect(el, `#${id} should exist`).to.exist;
        });
    });

    // Verify actual product updates
    it ('should actually update the product listing', () => {
        throw new Error('This feature has not been implemented.');
    });
});
