// Test case T08 - Help Menu Display
const request = require('supertest');
const app     = require('../backend/server');
const chai    = require('chai');
const expect  = chai.expect;

describe('Help Menu Display (T08)', function() {
    // Verify that the home footer has a help link
    it('serves footer_logged_out.html with the help page', async function() {
        const res = await request(app)
            .get('/shared_elements/footer_logged_out.html')
            .expect(200);
        expect(res.text).to.include('<a href="../help_page_out/index.html" class="navbar-link">Help');
    });
    // Verify the help page has a specific string
    it('GET /help_page_out/index.html returns the help content', async function() {
        const res = await request(app)
            .get('/help_page_out/index.html')
            .expect(200);
        expect(res.text).to.include('How Can We Help You?');
    });
});
