// Test Case T03 - Password Management
const request = require('supertest');
const app     = require('../backend/server');
const db      = require('../backend/db');
const chai    = require('chai');
chai.should();

// Verify the stub for the forgot password API
describe('T03 – Forgot Password API', function() {
    const email = 't03user@gmail.com';

    // Insert a test user
    before(async function() {
        const sql = `
            INSERT INTO user (email, password, full_name, dob, phone) VALUES (?, ?, ?, ?, ?)`;
        await db.pool
               .execute(sql, [
                    email,
                    'OrigPass!1',
                    'Test User',
                    '1990-01-01',
                    '123-456-7890'
               ]);
    });

    // Expecting 404-not founds, since API is not setup
    it('should send if email format invalid', async function() {
        const res = await request(app)
            .post('/api/forgot-password')
            .send({ email: 'not-an-email' })
            .expect(404);
    });

    it('should send if email is valid', async function() {
        const res = await request(app)
            .post('/api/forgot-password')
            .send({ email })
            .expect(404);
    });

    // Clean up the test user
    after(async function() {
        await db.pool
               .execute('DELETE FROM user WHERE email = ?', [ email ]);
    });
});
