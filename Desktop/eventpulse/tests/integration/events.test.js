const request = require('supertest');
const app = require('../../app');

describe('Health Check & Events API Integration Tests', () => {
  test('GET /health - should return server health state', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('server', 'Running');
  });

  test('GET /api/events - should return events response structure', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
