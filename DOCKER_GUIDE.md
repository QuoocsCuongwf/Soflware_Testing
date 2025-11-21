# Docker Quick Start Guide - FloginFE_BE

## 🐳 Cách chạy project với Docker

### 1. Yêu cầu
- Docker Desktop đã cài đặt
- Docker Compose đã cài đặt (thường đi kèm Docker Desktop)

### 2. Chạy toàn bộ ứng dụng (1 lệnh)

```bash
# Build và chạy tất cả services (MySQL, Backend, Frontend)
docker-compose up --build

# Hoặc chạy ở chế độ background
docker-compose up -d --build
```

**Ứng dụng sẽ chạy tại:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- MySQL: localhost:3307

### 3. Dừng ứng dụng

```bash
# Dừng containers
docker-compose down

# Dừng và xóa volumes (xóa data database)
docker-compose down -v
```

### 4. Xem logs

```bash
# Xem tất cả logs
docker-compose logs -f

# Xem log của service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### 5. Rebuild lại sau khi sửa code

```bash
# Rebuild service cụ thể
docker-compose up -d --build backend
docker-compose up -d --build frontend

# Rebuild tất cả
docker-compose up -d --build
```

### 6. Truy cập container

```bash
# Truy cập backend container
docker exec -it flogin-backend sh

# Truy cập MySQL container
docker exec -it flogin-mysql mysql -u flogin -pflogin123 flogin_db

# Truy cập frontend container
docker exec -it flogin-frontend sh
```

### 7. Kiểm tra trạng thái

```bash
# Xem containers đang chạy
docker-compose ps

# Xem resource usage
docker stats
```

## 🔧 Build riêng từng service

### Backend only
```bash
cd backend
docker build -t flogin-backend .
docker run -p 8080:8080 flogin-backend
```

### Frontend only
```bash
cd frontend
docker build -t flogin-frontend .
docker run -p 3000:80 flogin-frontend
```

## 📋 Thông tin đăng nhập

Sau khi containers chạy, database sẽ tự động import data từ `data.sql`.

**Tài khoản mẫu:**
- Username: `admin` | Password: `password123`
- Username: `user1` | Password: `password123`
- Username: `user2` | Password: `password123`

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Thay đổi port trong docker-compose.yml
# Frontend: "3001:80" thay vì "3000:80"
# Backend: "8081:8080" thay vì "8080:8080"
```

### Backend không connect được MySQL
```bash
# Chờ MySQL khởi động hoàn toàn (30-60 giây)
# Hoặc restart backend container
docker-compose restart backend
```

### Xóa tất cả và start lại từ đầu
```bash
docker-compose down -v
docker-compose up --build
```

### Xem chi tiết lỗi
```bash
docker-compose logs backend
docker-compose logs mysql
```

## 🚀 Production Deployment

Để deploy lên server:

```bash
# Copy toàn bộ project lên server
# SSH vào server
ssh user@your-server

# Chạy docker-compose
cd /path/to/project
docker-compose up -d --build

# Setup nginx reverse proxy (optional)
# Setup SSL với Let's Encrypt (optional)
```

## 📦 Docker Images Size

- Backend: ~200MB
- Frontend: ~50MB (với nginx alpine)
- MySQL: ~500MB
- **Total**: ~750MB

## ⚡ Tips

1. **Tăng tốc build**: Docker sẽ cache các layer, chỉ rebuild khi code thay đổi
2. **Development mode**: Sử dụng volumes để mount code vào container
3. **Production mode**: Sử dụng build như hiện tại
4. **Health checks**: Docker sẽ tự động restart nếu service bị lỗi

---

**Chúc bạn chạy thành công! 🎉**
