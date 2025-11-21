# FloginFE_BE - Dự án Kiểm Thử Phần Mềm 2024-2025

## 📋 Giới thiệu

Dự án **FloginFE_BE** là một ứng dụng web full-stack bao gồm:
- ✅ **Chức năng Login**: Hệ thống đăng nhập/đăng ký với validation đầy đủ
- ✅ **Chức năng Product**: Quản lý sản phẩm với CRUD operations
- ✅ **Frontend**: React 18+ với React Testing Library
- ✅ **Backend**: Spring Boot 3.2+ với JUnit 5 & Mockito
- ✅ **Database**: MySQL với schema đầy đủ
- ✅ **Testing**: Phát triển theo phương pháp TDD

## 🚀 Công nghệ sử dụng

### Frontend
- React 18+
- React Router DOM 6
- Axios
- React Testing Library
- Jest
- CSS3 với animations

### Backend
- Spring Boot 3.2+
- Java 17+
- Spring Security + JWT
- Spring Data JPA
- MySQL
- JUnit 5 + Mockito
- Maven

## 📁 Cấu trúc dự án

```
FloginFE_BE/
├── data.sql                    # Database schema & sample data
├── frontend/                   # React Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # React Components
│   │   │   ├── Login.js
│   │   │   ├── Login.css
│   │   │   ├── Register.js
│   │   │   ├── Register.css
│   │   │   ├── ProductList.js
│   │   │   ├── ProductList.css
│   │   │   ├── ProductForm.js
│   │   │   └── ProductForm.css
│   │   ├── services/          # API Services
│   │   │   ├── authService.js
│   │   │   └── productService.js
│   │   ├── utils/             # Utilities
│   │   │   └── validation.js
│   │   ├── tests/             # Test files
│   │   │   ├── Login.test.js
│   │   │   └── validation.test.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── backend/                    # Spring Boot API
    ├── src/
    │   ├── main/
    │   │   ├── java/com/flogin/
    │   │   │   ├── FloginApplication.java
    │   │   │   ├── config/
    │   │   │   │   └── SecurityConfig.java
    │   │   │   ├── controller/
    │   │   │   │   ├── AuthController.java
    │   │   │   │   └── ProductController.java
    │   │   │   ├── service/
    │   │   │   │   ├── AuthService.java
    │   │   │   │   └── ProductService.java
    │   │   │   ├── dto/
    │   │   │   │   ├── LoginRequest.java
    │   │   │   │   ├── RegisterRequest.java
    │   │   │   │   ├── AuthResponse.java
    │   │   │   │   ├── ProductRequest.java
    │   │   │   │   ├── ProductResponse.java
    │   │   │   │   └── ApiResponse.java
    │   │   │   ├── entity/
    │   │   │   │   ├── User.java
    │   │   │   │   └── Product.java
    │   │   │   ├── repository/
    │   │   │   │   ├── UserRepository.java
    │   │   │   │   └── ProductRepository.java
    │   │   │   └── security/
    │   │   │       ├── JwtUtils.java
    │   │   │       ├── CustomUserDetailsService.java
    │   │   │       └── JwtAuthenticationFilter.java
    │   │   └── resources/
    │   │       ├── application.properties
    │   │       └── application-test.properties
    │   └── test/
    │       └── java/com/flogin/
    │           └── service/
    │               ├── AuthServiceTest.java
    │               └── ProductServiceTest.java
    └── pom.xml
```

## 🛠️ Cài đặt & Chạy dự án

### 1. Chuẩn bị Database

```sql
-- Tạo database
CREATE DATABASE flogin_db;

-- Import data từ file data.sql
mysql -u root -p flogin_db < data.sql
```

**Hoặc** chạy trực tiếp file `data.sql` trong MySQL Workbench/phpMyAdmin.

### 2. Backend (Spring Boot)

```bash
cd backend

# Cấu hình database trong application.properties
# spring.datasource.username=root
# spring.datasource.password=your_password

# Chạy ứng dụng
mvn spring-boot:run

# Hoặc với Maven Wrapper
./mvnw spring-boot:run

# Chạy tests
mvn test
```

Backend sẽ chạy tại: `http://localhost:8080`

### 3. Frontend (React)

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start

# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🔐 Tài khoản mẫu

Sau khi import `data.sql`, bạn có thể đăng nhập với:

| Username | Password | Role |
|----------|----------|------|
| admin | password123 | ADMIN |
| user1 | password123 | USER |
| user2 | password123 | USER |

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/test` - Test endpoint

### Products (Cần JWT token)
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/{id}` - Lấy sản phẩm theo ID
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/{id}` - Cập nhật sản phẩm
- `DELETE /api/products/{id}` - Xóa sản phẩm
- `GET /api/products/search?name=xxx` - Tìm kiếm sản phẩm
- `GET /api/products/category/{category}` - Lấy sản phẩm theo danh mục

## ✅ Testing

### Frontend Tests

```bash
cd frontend
npm test
```

**Test Coverage:**
- Login Component validation tests
- Validation utilities tests
- Successful/failed login scenarios

### Backend Tests

```bash
cd backend
mvn test
```

**Test Coverage:**
- AuthService tests (register, login)
- ProductService tests (CRUD operations)
- Repository tests
- Controller integration tests

## 🎨 Features

### Login & Register
- ✅ Form validation (username, password, email)
- ✅ Error handling với thông báo rõ ràng
- ✅ JWT authentication
- ✅ Password encryption (BCrypt)
- ✅ Responsive design

### Product Management
- ✅ CRUD operations đầy đủ
- ✅ Search & filter theo tên, danh mục
- ✅ Form validation cho sản phẩm
- ✅ Image preview
- ✅ Real-time updates
- ✅ Responsive product grid

## 🔧 Configuration

### Backend (application.properties)

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/flogin_db
spring.datasource.username=root
spring.datasource.password=

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000
```

### Frontend (API URL)

Trong `src/services/authService.js` và `productService.js`:

```javascript
const API_URL = 'http://localhost:8080/api';
```

## 📚 Kiến thức áp dụng

- ✅ TDD (Test-Driven Development)
- ✅ RESTful API Design
- ✅ JWT Authentication
- ✅ React Hooks (useState, useEffect)
- ✅ React Router
- ✅ Form Validation
- ✅ CRUD Operations
- ✅ Spring Security
- ✅ JPA/Hibernate
- ✅ Unit Testing (JUnit 5, Mockito)
- ✅ Integration Testing
- ✅ CSS Animations

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p

# Tạo lại database
DROP DATABASE IF EXISTS flogin_db;
CREATE DATABASE flogin_db;
```

### CORS Error
- Đảm bảo backend đang chạy tại port 8080
- Kiểm tra CORS configuration trong SecurityConfig

### JWT Token Error
- Clear localStorage trong browser
- Đăng nhập lại để lấy token mới

## 👥 Nhóm phát triển

Dự án môn **Kiểm Thử Phần Mềm**  
Trường Đại học Sài Gòn  
Niên khóa 2024-2025

## 📄 License

Dự án được phát triển cho mục đích học tập.

---

**Happy Coding! 🚀**
#   S o f l w a r e _ T e s t i n g  
 