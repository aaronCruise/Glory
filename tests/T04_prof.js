// Test case T04 – Verify Profile Page
const request = require('supertest');
const { expect } = require('chai');
const app = require('../backend/server');
const db = require('../backend/db');

describe('T04: Profile Flow', function() {
  const user = {
    firstName: 'Test',
    lastName: 'Profile',
    email: `test.profile+${Date.now()}@example.com`,
    password: 'TestPass!1',
    confirmPassword: 'TestPass!1',
    dob: '1990-01-01',
    phone: '123-456-7890'
  };
  let agent = request.agent(app);

  it('should register, login, retrieve profile info, then delete the account', async function() {
    const resReg = await agent
      .post('/register')
      .send(user)
      .expect(201);
    expect(resReg.body).to.have.property('message', 'Registration successful!');
    expect(resReg.body.user).to.include({
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone
    });

    await agent
      .post('/login')
      .send({ email: user.email, password: user.password })
      .expect(302);

    const resProfile = await agent
      .get('/profile/UserInfo')
      .expect(200);

    expect(resProfile.body).to.include({
      full_name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone
    });
    expect(resProfile.body).to.have.property('shipping_address').that.is.a('string');

    await db.pool.query('DELETE FROM shipping_info WHERE user_id = (SELECT id FROM user WHERE email = ?)', [user.email]);
    await db.pool.query('DELETE FROM user WHERE email = ?', [user.email]);
  });
});

