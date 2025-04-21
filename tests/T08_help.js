// Test case T08 - Help Menu Display
const request = require('supertest');
const app = require('../backend/server');
const fs   = require('fs');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;

describe('Help Menu Display (T08)', () => {
  it('should include a helpmenu file that should be accessible to public', () => {
    const filePath = path.join(__dirname, '..', 'frontend', 'help_page', 'index.html');
    const exists = fs.existsSync(filePath);
    expect(exists).to.be.true;
  });
})
