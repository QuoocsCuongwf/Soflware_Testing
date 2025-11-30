# 🛡️ FloginFE_BE - Hệ Thống Quản Lý Sản Phẩm & Kiểm Thử Phần Mềm

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)

> **Dự án môn học Kiểm Thử Phần Mềm (2024-2025)**
>
> Ứng dụng Full-stack minh họa quy trình phát triển hướng kiểm thử (TDD), tích hợp CI/CD cơ bản và đóng gói bằng Docker.

---

## 📖 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
    - [Cách 1: Docker (Khuyên dùng)](#cách-1-chạy-bằng-docker-khuyên-dùng)
    - [Cách 2: Thủ công (Development)](#cách-2-chạy-thủ-công-development)
- [Hướng dẫn kiểm thử (Testing)](#-hướng-dẫn-kiểm-thử-testing)
- [API Documentation](#-api-documentation)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)

---

## 📋 Giới thiệu

**FloginFE_BE** là ứng dụng web quản lý sản phẩm hoàn chỉnh, được xây dựng để thực hành các kỹ thuật kiểm thử phần mềm nâng cao:
* **Unit Testing**: Kiểm thử từng đơn vị code nhỏ nhất (Service, Component).
* **Integration Testing**: Kiểm thử tích hợp giữa các tầng (Controller <-> Service <-> DB).
* **Automation Testing**: Tự động hóa quy trình kiểm thử End-to-End.

---

## ✨ Tính năng chính

| Module | Chức năng | Mô tả |
| :--- | :--- | :--- |
| **🔐 Auth** | Đăng nhập / Đăng ký | Xác thực JWT, Mã hóa mật khẩu BCrypt, Validation dữ liệu chặt chẽ. |
| **📦 Product** | CRUD Sản phẩm | Thêm, Xóa, Sửa, Xem danh sách, Tìm kiếm sản phẩm. |
| **🛡️ Security** | Phân quyền | Role-based Authorization (ADMIN/USER). |
| **🐳 DevOps** | Dockerization | Đóng gói toàn bộ ứng dụng (DB, Backend, Frontend) vào Container. |

---

## 🛠 Công nghệ sử dụng

### Backend (Server)
* **Core**: Spring Boot 3.2.5, Java 17
* **Database**: MySQL 8.0, Spring Data JPA
* **Security**: Spring Security, JWT (JSON Web Token)
* **Testing**: JUnit 5, Mockito, H2 Database (Test env)
* **Build Tool**: Maven

### Frontend (Client)
* **Framework**: React 18, React Router DOM 6
* **HTTP Client**: Axios
* **Testing**: React Testing Library, Jest, Cypress
* **Styling**: CSS3, Responsive Design

---

## 🚀 Cài đặt & Chạy dự án

Bạn có thể chọn 1 trong 2 cách để chạy dự án:

### Cách 1: Chạy bằng Docker (Khuyên dùng)
*Yêu cầu: Đã cài đặt Docker và Docker Compose.*

Cách này nhanh nhất, không cần cài đặt Java/NodeJS/MySQL cục bộ. Chỉ cần chạy lệnh sau tại thư mục gốc của dự án:

docker-compose up -d --build
---
### Cách 2: Chạy thủ công
* **B1 Cài đặt database**
mysql -u root -p flogin_db < data.sql
* **B2 Khởi động backend (Spring Boot)**
cd backend
mvn spring-boot:run
* **B3 Khởi chạy Fontend** 
cd frontend
npm install
npm start