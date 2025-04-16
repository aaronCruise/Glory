// Test Case T04 - Customer Profile Page
const request = require('supertest');
const { expect } = require('chai');
const app = require('../backend/server');

describe('Profile Display (T04)', () => {
    it('should serve the profile page HTML when accessed with a GET request', async () => {
        const res = await request(app)
            .get('/profile')
            .expect(200);

        // Check for HTML content
        expect(res.type).to.match(/html/);
    });
});
