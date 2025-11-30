import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Cấu hình Load Test & Stress Test
export const options = {
    stages: [
        // --- LOAD TEST ---
        { duration: '30s', target: 100 },  // Tăng lên 100 user trong 30s
        { duration: '1m', target: 100 },   // Giữ 100 user trong 1 phút
        { duration: '30s', target: 500 },  // Tăng lên 500 user
        { duration: '1m', target: 500 },   // Giữ 500 user
        { duration: '30s', target: 1000 }, // Tăng lên 1000 user
        { duration: '1m', target: 1000 },  // Giữ 1000 user

        // --- STRESS TEST (Tìm điểm gãy) ---
        { duration: '1m', target: 2000 },  // Ép lên 2000 user xem có sập không
        { duration: '30s', target: 0 },    // Giảm dần về 0 để kết thúc
    ],
    // Thiết lập ngưỡng (Thresholds) để đánh giá Pass/Fail tự động
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% request phải nhanh hơn 2s
        http_req_failed: ['rate<0.01'],    // Tỉ lệ lỗi phải dưới 1%
    },
};

export default function () {
    const url = 'http://localhost:8080/auth/login'; // Thay link của bạn
    const payload = JSON.stringify({
        username: 'KieuNam',
        password: '123456',
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