import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '30s', target: 50 }, 
    { duration: '30s', target: 100 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],  
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const url = 'http://localhost:8080/api/auth/login'; 
  const payload = JSON.stringify({
    username: 'testuer',
    password: 'admin123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Gửi request POST
  const res = http.post(url, payload, params);

  // Kiểm tra kết quả (Validation)
  check(res, {
    'status is 200': (r) => r.status === 200,
    'login successful': (r) => r.body.includes('token') || r.json('token') !== undefined,
  });

  sleep(1); // Mỗi user nghỉ 1s trước khi request tiếp
}