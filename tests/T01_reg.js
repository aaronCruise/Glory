// Test case T01 - Account Registration
const request = require('supertest');
const { expect } = require('chai');
const app = require('../backend/server');
const db = require('../backend/db');

describe('User Registration (T01)', () => {
  // Delete account from the previous test and after to keep DB clean
  afterEach(async () => {
    await db.pool.query("DELETE FROM user WHERE email = 'testuser@gmail.com' AND password = 'TestPassword!@'");
  });

  it('should create a new user account and return a success message', async () => {
    const newUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@gmail.com',
      password: 'TestPassword!@',
      confirmPassword: 'TestPassword!@',
      dob: '1990-01-01',
      phone: '123-456-7890'
    };

    const res = await request(app)
      .post('/register')
      .send(newUser)
      .expect(201);

    expect(res.body).to.have.property('message', 'Registration successful!');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.include({
      fullName: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      phone: newUser.phone
    });
  });
});
