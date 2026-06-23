process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '1h';

const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');

let mongod;
let token;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  const res = await request(app).post('/api/auth/register').send({
    name: 'HR Admin',
    email: 'hr@example.com',
    password: 'password123',
  });
  token = res.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('Employee API', () => {
  it('blocks access without a token', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.statusCode).toBe(401);
  });

  it('creates a new employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Rani Yadav',
        email: 'rani@example.com',
        mobileNumber: '9876543210',
        department: 'Engineering',
        designation: 'Software Engineer Intern',
        joiningDate: '2026-01-15',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.fullName).toBe('Rani Yadav');
  });

  it('lists employees and supports name search', async () => {
    const res = await request(app)
      .get('/api/employees?search=Rani')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination.total).toBe(1);
  });

  it('rejects invalid mobile numbers', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Bad Mobile',
        email: 'bad@example.com',
        mobileNumber: '12345',
        department: 'Engineering',
        designation: 'Intern',
        joiningDate: '2026-01-15',
      });
    expect(res.statusCode).toBe(400);
  });
});
