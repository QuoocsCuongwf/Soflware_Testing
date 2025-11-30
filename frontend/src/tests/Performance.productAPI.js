import http from 'k6/http';
import { check, sleep } from 'k6';

// --- 1. CẤU HÌNH LOAD TEST ---
export const options = {
  stages: [
    { duration: '5s', target: 5 },   // Tăng nhẹ lên 5 user
    { duration: '20s', target: 5 },  // Chạy ổn định
    { duration: '5s', target: 0 },   // Kết thúc
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% request phải xong dưới 2s
    http_req_failed: ['rate<0.05'],    // Cho phép lỗi tối đa 5%
  },
};

// --- 2. SETUP: ĐĂNG NHẬP LẤY TOKEN (Chạy 1 lần duy nhất) ---
export function setup() {
  const loginUrl = 'http://localhost:8080/api/auth/login'; // <--- SỬA LẠI NẾU CẦN
  
  const payload = JSON.stringify({
    username: 'testuer',     // <--- USER CỦA BẠN
    password: 'admin123'     // <--- PASS CỦA BẠN
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(loginUrl, payload, params);

  if (res.status !== 200) {
    console.error(`Login Failed: ${res.body}`);
    return null;
  }

  // Lấy token (Sửa lại đường dẫn json tùy theo response thực tế của bạn)
  // Ví dụ: res.json('data.token') hoặc res.json('accessToken')
  const authToken = res.json('token') || res.json('accessToken') || res.json('data.token');
  return authToken;
}

// --- 3. KỊCH BẢN CHÍNH (FULL FLOW) ---
export default function (authToken) {
  if (!authToken) {
    console.log("Stop: No Token");
    sleep(1);
    return;
  }

  const BASE_URL = 'http://localhost:8080/api/products';
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  };

  // ======================================================
  // BƯỚC 1: CREATE (Tạo để lấy ID test cho các bước sau)
  // ======================================================
  const randomId = Math.floor(Math.random() * 1000000);
  const createPayload = JSON.stringify({
    name: `K6 Auto Product ${randomId}`,
    description: `Desc ${randomId}`,
    price: 100000,
    quantity: 10,
    category: "Testing",
    imageUrl: "http://img.com/1.jpg",
    isAvailable: true
  });

  const resCreate = http.post(BASE_URL, createPayload, params);
  
  const checkCreate = check(resCreate, {
    'Create - Status 200': (r) => r.status === 200,
  });

  // Nếu tạo thất bại thì dừng luôn vòng lặp này, không test tiếp được
  if (!checkCreate) return;

  // LẤY ID SẢN PHẨM VỪA TẠO
  // Controller trả về: new ApiResponse(true, "...", product)
  // Nên ID sẽ nằm ở: data.id
  const productId = resCreate.json('data.id'); 

  // ======================================================
  // BƯỚC 2: GET BY ID (Lấy chi tiết)
  // ======================================================
  const resGetId = http.get(`${BASE_URL}/${productId}`, params);
  check(resGetId, {
    'Get By ID - Status 200': (r) => r.status === 200,
    'Get By ID - Đúng tên': (r) => r.json('data.name').includes(randomId.toString()),
  });

  // ======================================================
  // BƯỚC 3: UPDATE (Sửa sản phẩm)
  // ======================================================
  const updatePayload = JSON.stringify({
    name: `K6 Auto Product ${randomId} UPDATED`, // Đổi tên
    description: `Desc Updated`,
    price: 200000, // Đổi giá
    quantity: 20,
    category: "Testing",
    imageUrl: "http://img.com/1.jpg",
    isAvailable: true
  });

  const resUpdate = http.put(`${BASE_URL}/${productId}`, updatePayload, params);
  check(resUpdate, {
    'Update - Status 200': (r) => r.status === 200,
    'Update - Data thay đổi': (r) => r.json('data.name').includes("UPDATED"),
  });

  // ======================================================
  // BƯỚC 4: SEARCH & CATEGORY
  // ======================================================
  // 4.1 Search
  const resSearch = http.get(`${BASE_URL}/search?name=${randomId}`, params);
  check(resSearch, {
    'Search - Status 200': (r) => r.status === 200,
    'Search - Có kết quả': (r) => r.json('data').length > 0,
  });

  // 4.2 Get By Category
  const resCat = http.get(`${BASE_URL}/category/Testing`, params);
  check(resCat, {
    'Category - Status 200': (r) => r.status === 200,
  });

  // ======================================================
  // BƯỚC 5: DELETE (Xóa dọn dẹp)
  // ======================================================
  const resDelete = http.del(`${BASE_URL}/${productId}`, null, params);
  check(resDelete, {
    'Delete - Status 200': (r) => r.status === 200,
  });

  // (Optional) Verify đã xóa thật chưa
  const resCheckDelete = http.get(`${BASE_URL}/${productId}`, params);
  check(resCheckDelete, {
    'Verify Delete - Phải lỗi 400/404': (r) => r.status !== 200,
  });

  sleep(1);
}