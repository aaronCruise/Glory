// Test case T04 – Verify Profile Page
const request = require('supertest');
const { expect } = require('chai');
const app = require('../backend/server');
const db = require('../backend/db');

describe('User Profile Info (T04)', () => {
    let agent;
    let userId;

    // Insert a test user
    before(async () => {
    await db.pool.query(
        'INSERT INTO user (full_name, DOB, email, phone, password) VALUES (?, ?, ?, ?, ?)',
        ['Info User', '1990-01-01', 'infouser@example.com', '111-222-3333', 'InfoPassword!@']
    );

    // Grab their ID
    const [row] = await db.pool.query(
        'SELECT id FROM user WHERE email = ?',
        ['infouser@example.com']
    );
    userId = row.id;

    // Insert Shipping info
    await db.pool.query(
        'INSERT INTO shipping_info (user_id, address) VALUES (?, ?)',
        [userId, '456 Test Ave']
    );

    // Login to get session token
    agent = request.agent(app);
    const loginRes = await agent
        .post('/login')
        .send({ email: 'infouser@example.com', password: 'InfoPassword!@' })
        .expect(200);
        expect(loginRes.body).to.have.property('token');
    });

    // Cleanup database after test
    after(async () => {
        await db.pool.query('DELETE FROM shipping_info WHERE user_id = ?', [userId]);
        await db.pool.query('DELETE FROM user WHERE id = ?', [userId]);
    });

    // Execute test
    it('should return full_name, email, phone, and shipping_address', async () => {
        const res = await agent
            .get('/profile/UserInfo')
            .expect(200);

        // Verify that profile page displays correct credentials
        expect(res.body).to.deep.equal({
            full_name: 'Info User',
            email: 'infouser@example.com',
            phone: '111-222-3333',
            shipping_address: '456 Test Ave'
        });
    });
});
