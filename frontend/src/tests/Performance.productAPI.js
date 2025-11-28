import http from 'k6/http';
import { check, sleep } from 'k6';

// --- 1. CẤU HÌNH LOAD TEST ---
export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Tăng dần lên 10 user
    { duration: '30s', target: 10 }, // Giữ ổn định 10 user để test sức chịu đựng
    { duration: '5s', target: 0 },   // Kết thúc
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% request phải xong dưới 2 giây
    http_req_failed: ['rate<0.01'],    // Tỉ lệ lỗi phải dưới 1%
  },
};

// --- 2. SETUP: ĐĂNG NHẬP LẤY TOKEN (Chạy 1 lần duy nhất) ---
export function setup() {
  // LƯU Ý: Kiểm tra kỹ lại đường dẫn Login của bạn
  // Nếu AuthController có @RequestMapping("/api/auth") và post login -> "/api/auth/login"
  // Nếu code của bạn khác, hãy sửa dòng này
  const loginUrl = 'http://localhost:8080/api/auth/login'; 
  
  const payload = JSON.stringify({
    username: 'admin',       // User này phải có trong DB
    password: 'password123'  // Pass đúng
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(loginUrl, payload, params);

  // Debug: Nếu login lỗi, in ra để biết đường sửa
  if (res.status !== 200) {
    console.error(`Login Failed! Status: ${res.status}. Body: ${res.body}`);
    return null; 
  }

  // Trích xuất Token.
  // Thử các trường hợp phổ biến: res.json('token') hoặc res.json('accessToken')
  // Dựa vào code ProductController trả về ApiResponse, khả năng cao Login cũng trả về dạng ApiResponse
  // Ví dụ: { "success": true, "data": { "token": "..." } } hoặc { "token": "..." }
  const authToken = res.json('token') || res.json('accessToken') || res.json('data.token');
  
  return authToken;
}

// --- 3. KỊCH BẢN TEST CHÍNH ---
export default function (authToken) {
  // Nếu setup() login thất bại (không có token), dừng luôn user này
  if (!authToken) {
    console.log("Không có Token, bỏ qua request.");
    sleep(1);
    return;
  }

  const BASE_URL = 'http://localhost:8080/api/products';
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`, // Đính kèm Token
    },
  };

  // --- A. GET ALL PRODUCTS ---
  const resGet = http.get(BASE_URL, params);
  check(resGet, {
    'GET All - Status 200': (r) => r.status === 200,
    'GET All - Nhanh < 1s': (r) => r.timings.duration < 1000,
  });

  // --- B. CREATE PRODUCT (POST) ---
  // Tạo data ngẫu nhiên để không bị trùng tên
  const randomId = Math.floor(Math.random() * 100000);
  
  // Payload khớp 100% với ProductRequest.java của bạn
  const productPayload = JSON.stringify({
    name: `K6 Test Product ${randomId}`,
    description: `Mô tả test hiệu năng cho sản phẩm ${randomId}`,
    price: 150000.50,       // BigDecimal: Số thực ok
    quantity: 50,           // Integer: Số nguyên ok
    category: "Software",   // String
    imageUrl: "https://example.com/image.jpg", // String
    isAvailable: true       // Boolean
  });

  const resPost = http.post(BASE_URL, productPayload, params);
  check(resPost, {
    'Create - Status 200': (r) => r.status === 200,
    // Kiểm tra xem server có trả về đúng thông báo thành công không
    'Create - Success msg': (r) => r.body.includes("thành công"), 
  });

  sleep(1); // Nghỉ 1 giây
}