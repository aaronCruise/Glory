// Test Case T02 - User Authentication
const request = require('supertest');
const { expect } = require('chai');
const app = require('../backend/server');
const db = require('../backend/db');

// Verify that a user can log into an existing account
describe('User Login (T02)', () => {

    // Insert an account
    before(async () => {
        await db.pool.query('INSERT INTO user (full_name, DOB, email, phone, password) VALUES (?, ?, ?, ?, ?)',
            ['Test User', '1990-01-01', 'testuser@gmail.com', '123-456-7890', 'TestPassword!@']
        );
    });

    after(async () => {
        // Clean up: delete the test user
        await db.pool.query("DELETE FROM user WHERE email = 'testuser@gmail.com'");
    });

    it('should authenticate the registered user', async () => {
        // Use the existing credentials
        const credentials = {
            email: 'testuser@gmail.com',
            password: 'TestPassword!@'
        };

        // Do request
        const res = await request(app)
            .post('/login')
            .send(credentials)
            .expect(200);

        // Test session token was created after login
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.a('string');
    });
});
