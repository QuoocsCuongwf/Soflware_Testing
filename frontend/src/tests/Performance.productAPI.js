import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 5 },
    { duration: '20s', target: 5 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

export function setup() {
  const loginUrl = 'http://localhost:8080/api/auth/login';
  const payload = JSON.stringify({ username: 'testuser', password: 'admin123' });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(loginUrl, payload, params);
  if (res.status !== 200) return null;
  return res.json('token') || res.json('accessToken') || res.json('data.token');
}

export default function (authToken) {
  // Nếu setup() login thất bại (không có token), dừng luôn user này
  if (!authToken) {
    sleep(1);
    return;
  }

  const BASE_URL = 'http://localhost:8080/api/products';
  const params = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` } };

  const randomId = Math.floor(Math.random() * 1000000);
  const createPayload = JSON.stringify({
    name: `K6 Auto Product ${randomId}`,
    description: `Desc ${randomId}`,
    price: 100000,
    quantity: 10,
    category: 'Testing',
    imageUrl: 'http://img.com/1.jpg',
    isAvailable: true,
  });

  const resCreate = http.post(BASE_URL, createPayload, params);
  const checkCreate = check(resCreate, { 'Create - Status 200': (r) => r.status === 200 });
  if (!checkCreate) return;
  const productId = resCreate.json('data.id');

  const resGetId = http.get(`${BASE_URL}/${productId}`, params);
  check(resGetId, {
    'Get By ID - Status 200': (r) => r.status === 200,
    'Get By ID - Đúng tên': (r) => r.json('data.name').includes(randomId.toString()),
  });

  const updatePayload = JSON.stringify({
    name: `K6 Auto Product ${randomId} UPDATED`,
    description: 'Desc Updated',
    price: 200000,
    quantity: 20,
    category: 'Testing',
    imageUrl: 'http://img.com/1.jpg',
    isAvailable: true,
  });

  const resUpdate = http.put(`${BASE_URL}/${productId}`, updatePayload, params);
  check(resUpdate, {
    'Update - Status 200': (r) => r.status === 200,
    'Update - Data thay đổi': (r) => r.json('data.name').includes('UPDATED'),
  });

  const resSearch = http.get(`${BASE_URL}/search?name=${randomId}`, params);
  check(resSearch, { 'Search - Status 200': (r) => r.status === 200, 'Search - Có kết quả': (r) => r.json('data').length > 0 });

  const resCat = http.get(`${BASE_URL}/category/Testing`, params);
  check(resCat, { 'Category - Status 200': (r) => r.status === 200 });

  const resDelete = http.del(`${BASE_URL}/${productId}`, null, params);
  check(resDelete, { 'Delete - Status 200': (r) => r.status === 200 });

  const resCheckDelete = http.get(`${BASE_URL}/${productId}`, params);
  check(resCheckDelete, { 'Verify Delete - Phải lỗi 400/404': (r) => r.status !== 200 });

  sleep(1);
}