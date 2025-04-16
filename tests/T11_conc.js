// Test Case T11 - Concurrency
const request = require('supertest');
const app = require('../backend/server');

describe('Concurrent Access to Home Page (T11)', function () {
    it('should handle 50 concurrent GET requests to the home page', async function () {
        this.timeout(10000);

        const requests = [];
        for (let i = 0; i < 50; i++) {
            requests.push(request(app).get('/').expect(200));
        }
        await Promise.all(requests);
    });
});