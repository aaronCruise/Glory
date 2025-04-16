// Test Case T03 - Password change
// TODO fix. this fails
const request = require('supertest');
const { expect } = require('chai');
const app = require('../backend/server');

describe('Profile Update / Change Password (T03)', () => {
    it('should update the user profile with the new password and details', async () => {
        // Prepare new profile information.
        const updateData = {
            fullname: 'Test User', 
            email: 'testuser@gmail.com',
            phone: '123-456-7890',
            password: 'NewPassword!@',
            dob: '1990-01-01',
            shippingAddress: '123 Main St'
        };

        const res = await request(app)
            .post('/profile')
            .send(updateData)
            .expect(201);

        expect(res.body).to.have.property('message', 'Profile updated successfully!');
    });
});