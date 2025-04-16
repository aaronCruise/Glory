// Test Case T02 - User Authentication
const request = require('supertest');
const { expect } = require('chai');
const app = require('../backend/server');
const db = require('../backend/db');

describe('User Login (T02)', () => {
    before(async () => {
        // Insert a test user into the database
        // Needed even though registration test is before, since
        // the test user is deleted after registration is ran
        await db.pool.query(
            'INSERT INTO user (full_name, DOB, email, phone, password) VALUES (?, ?, ?, ?, ?)',
            ['Test User', '1990-01-01', 'testuser@gmail.com', '123-456-7890', 'TestPassword!@']
        );
    });

    after(async () => {
        // Clean up: delete the test user
        await db.pool.query("DELETE FROM user WHERE email = 'testuser@gmail.com'");
    });

    it('should authenticate the registered user and redirect to the Users Home page', async () => {
        const credentials = {
            email: 'testuser@gmail.com',
            password: 'TestPassword!@'
        };

        const res = await request(app)
            .post('/login') // Uses the loginController attached in server.js as app.use('/login', loginController)
            .send(credentials)
            .expect(302);

        // Since loginController redirects to '/UsersHome' upon successful login:
        expect(res.headers.location).to.equal('/UsersHome');
    });
});