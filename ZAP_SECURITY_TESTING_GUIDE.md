# Hướng Dẫn Security Testing với OWASP ZAP

## 📋 Yêu Cầu

### 7.2 Security Testing (10 điểm)

#### a) Test common vulnerabilities (5 điểm):
- ✅ SQL Injection
- ✅ XSS (Cross-Site Scripting)
- ✅ CSRF (Cross-Site Request Forgery)
- ✅ Authentication bypass attempts

#### b) Test input validation và sanitization (3 điểm)

#### c) Security best practices implementation (2 điểm):
- ✅ Password hashing
- ✅ HTTPS enforcement
- ✅ CORS configuration
- ✅ Security headers

---

## 🚀 Bước 1: Cài đặt OWASP ZAP

### Download ZAP:
```
https://www.zaproxy.org/download/
```

**Chọn phiên bản:**
- Windows: `ZAP_2.14.0_windows.exe`
- Installer sẽ cài đặt JRE tự động

### Khởi động ZAP:
```bash
# Sau khi cài đặt, mở OWASP ZAP
# Chọn: "No, I do not want to persist this session"
```

---

## 🔧 Bước 2: Khởi động Application

### Terminal 1 - Backend:
```powershell
cd "F:\softwave testing\project Ass2\backend"
mvn spring-boot:run
```
**Verify:** `http://localhost:8080/actuator/health` → `{"status":"UP"}`

### Terminal 2 - Frontend:
```powershell
cd "F:\softwave testing\project Ass2\frontend"
npm start
```
**Verify:** `http://localhost:3000` → Login page hiển thị

---

## 🎯 Bước 3: Configure OWASP ZAP

### 3.1 Tạo Context mới
1. Click **"File"** → **"New Session"** → Đặt tên: `Flogin_Security_Test`
2. Click **"Include in Context"** icon (biểu tượng target)
3. Nhập URL patterns:
   ```
   http://localhost:3000.*
   http://localhost:8080/api.*
   ```
4. Đặt tên Context: `Flogin Application`

### 3.2 Configure Authentication (Optional - nâng cao)
1. Right-click Context → **"Authentication"**
2. Method: **"JSON-based Authentication"**
3. Login URL: `http://localhost:8080/api/auth/login`
4. Request Body:
   ```json
   {"username":"testuser","password":"Test123"}
   ```
5. Username/Password parameters: `username`, `password`
6. Logged-in indicator: `token` (trong response)

---

## 🕷️ Bước 4: Spider Scan (Khám phá URLs)

### Automated Spider:
1. Click tab **"Quick Start"**
2. Nhập URL: `http://localhost:3000`
3. Click **"Automated Scan"**
4. Đợi Spider hoàn thành (~2-5 phút)

**Kết quả:** ZAP sẽ list tất cả URLs tìm được trong tab **"Sites"**

### AJAX Spider (cho React app):
1. Right-click `http://localhost:3000` trong Sites tree
2. Chọn **"Attack"** → **"AJAX Spider"**
3. Browser: Firefox/Chrome Headless
4. Click **"Start Scan"**
5. Đợi ~5-10 phút

**Screenshot cần chụp:**
- ✅ `zap-spider-results.png` - Sites tree với tất cả URLs

---

## 🔍 Bước 5: Passive Scan (Tự động)

Passive scan chạy tự động trong quá trình Spider.

**Xem kết quả:**
1. Click tab **"Alerts"** ở bottom panel
2. Filter theo mức độ: High, Medium, Low, Info

**Screenshot cần chụp:**
- ✅ `zap-passive-scan-alerts.png` - Danh sách alerts

---

## ⚡ Bước 6: Active Scan (Tấn công mô phỏng)

### 6.1 Configure Scan Policy
1. Click **"Tools"** → **"Options"** → **"Active Scan"**
2. Threads: `5` (đừng set quá cao)
3. Max scan duration: `60` minutes

### 6.2 Start Active Scan
1. Right-click `http://localhost:3000` trong Sites
2. Chọn **"Attack"** → **"Active Scan"**
3. Chọn Policy: **"Default Policy"**
4. Technology: Chọn: `Java`, `JavaScript`, `MySQL`
5. Click **"Start Scan"**

**⏰ Đợi:** Active scan mất 10-30 phút

**Screenshot cần chụp:**
- ✅ `zap-active-scan-progress.png` - Scan đang chạy
- ✅ `zap-active-scan-results.png` - Kết quả scan

---

## 🎯 Bước 7: Test Specific Vulnerabilities

### 7.1 SQL Injection Test

**Manual Test:**
1. Trong ZAP, click tab **"Request"** (bottom)
2. Find POST request: `http://localhost:8080/api/auth/login`
3. Right-click → **"Open/Resend with Request Editor"**
4. Change body:
   ```json
   {"username":"' OR '1'='1","password":"anything"}
   ```
5. Click **"Send"**
6. Check response: Should be **400 Bad Request** hoặc validation error

**Automated Test:**
1. Right-click login endpoint
2. **"Attack"** → **"SQL Injection"**
3. Xem kết quả trong Alerts tab

**Screenshot:**
- ✅ `zap-sql-injection-test.png` - Request/Response với SQL payload

### 7.2 XSS Test

**Manual Test:**
1. Login vào application: `http://localhost:3000`
2. Go to **"Add Product"** page
3. Trong ZAP, find POST `/api/products` request
4. Modify `name` field:
   ```json
   {"name":"<script>alert('XSS')</script>","price":100000,"quantity":10}
   ```
5. Check response: Should be sanitized/escaped

**Automated Test:**
- ZAP tự động test XSS trong Active Scan

**Screenshot:**
- ✅ `zap-xss-test.png` - XSS payload test

### 7.3 CSRF Test

**Check:**
1. Xem các POST/PUT/DELETE requests
2. Verify có `Authorization: Bearer <token>` header
3. Try request **without** Authorization header → Should get 401

**Screenshot:**
- ✅ `zap-csrf-protection.png` - Request với/không có JWT token

### 7.4 Authentication Bypass Test

**Test cases:**
1. **Access protected endpoint without token:**
   ```
   GET http://localhost:8080/api/products
   (No Authorization header)
   Expected: 401 Unauthorized
   ```

2. **Use expired token:**
   - Copy old token
   - Try request after 24h
   - Expected: 401

3. **Tampered JWT:**
   - Change token payload
   - Expected: 401 Invalid signature

**Screenshot:**
- ✅ `zap-auth-bypass-test.png` - Failed authentication attempts

---

## 📊 Bước 8: Export Reports

### 8.1 HTML Report
1. Click **"Report"** → **"Generate HTML Report"**
2. Chọn context: `Flogin Application`
3. Save as: `ZAP-Security-Report.html`
4. Open trong browser → Screenshot summary

### 8.2 PDF Report (nếu có)
1. **"Report"** → **"Generate PDF Report"**
2. Save as: `ZAP-Security-Report.pdf`

**Screenshot:**
- ✅ `zap-report-summary.png` - Report overview

---

## 📸 Checklist Screenshots Cần Chụp

Lưu tất cả screenshots vào: `F:\softwave testing\project Ass2\report\images\zap\`

### Required Screenshots (10-15 ảnh):

#### General:
- [ ] `zap-dashboard.png` - ZAP interface tổng quan
- [ ] `zap-sites-tree.png` - Sites tree với URLs đã discover

#### Spider & Scan:
- [ ] `zap-spider-results.png` - Spider scan hoàn thành
- [ ] `zap-passive-scan-alerts.png` - Passive alerts
- [ ] `zap-active-scan-progress.png` - Active scan đang chạy
- [ ] `zap-active-scan-results.png` - Active scan kết quả

#### Vulnerability Tests:
- [ ] `zap-sql-injection-test.png` - SQL Injection test với payload
- [ ] `zap-sql-injection-protected.png` - Response cho thấy protected
- [ ] `zap-xss-test.png` - XSS test
- [ ] `zap-xss-protected.png` - XSS protection
- [ ] `zap-csrf-protection.png` - CSRF token check
- [ ] `zap-auth-bypass-test.png` - Auth bypass attempts

#### Alerts & Reports:
- [ ] `zap-alerts-by-risk.png` - Alerts filtered by risk level
- [ ] `zap-alerts-details.png` - Chi tiết một alert
- [ ] `zap-report-summary.png` - Report summary page

---

## 📝 Bước 9: Thêm Screenshots vào Báo Cáo

### Uncomment các dòng trong `bonus.tex`:

```latex
% Tìm dòng có comment: % PLACEHOLDER: Them screenshots ZAP
% Bỏ comment và thêm đúng tên file

\begin{figure}[H]
\centering
\includegraphics[width=0.9\textwidth]{images/zap/zap-dashboard.png}
\caption{OWASP ZAP Dashboard - Tổng quan interface}
\end{figure}

\begin{figure}[H]
\centering
\includegraphics[width=0.85\textwidth]{images/zap/zap-sql-injection-test.png}
\caption{SQL Injection Test với ZAP - Protected}
\end{figure}

\begin{figure}[H]
\centering
\includegraphics[width=0.85\textwidth]{images/zap/zap-xss-test.png}
\caption{XSS Test Results - Input Sanitized}
\end{figure}

\begin{figure}[H]
\centering
\includegraphics[width=0.85\textwidth]{images/zap/zap-auth-bypass-test.png}
\caption{Authentication Bypass Test - Secure}
\end{figure}

\begin{figure}[H]
\centering
\includegraphics[width=0.9\textwidth]{images/zap/zap-report-summary.png}
\caption{ZAP Security Report Summary}
\end{figure}
```

---

## 🎓 Tips & Best Practices

### Performance:
- **Giảm threads** trong Active Scan (5-10) để tránh overload
- **Spider depth:** Max 5 levels
- **Timeout:** Set reasonable timeout (30-60s)

### Security:
- Test trên **localhost** hoặc **staging environment**, KHÔNG test production
- Thông báo team trước khi chạy Active Scan
- Monitor server resources khi scan

### Screenshots:
- Chụp **full window** để thấy rõ context
- Highlight các **alerts quan trọng** (HIGH/MEDIUM)
- Chụp cả **request và response** để thấy protection mechanism

---

## ✅ Verification Checklist

Sau khi hoàn thành, verify:

- [ ] Application chạy bình thường trên localhost
- [ ] ZAP đã discover ít nhất 10+ URLs
- [ ] Passive scan hoàn thành (check Alerts tab)
- [ ] Active scan hoàn thành 100%
- [ ] Có ít nhất 10-15 screenshots trong `images/zap/`
- [ ] Report HTML đã được export
- [ ] Screenshots đã được thêm vào `bonus.tex`
- [ ] PDF compile thành công

---

## 🔧 Troubleshooting

### Issue: ZAP không thấy URLs từ React app
**Solution:** Sử dụng **AJAX Spider** thay vì Spider thông thường

### Issue: Active Scan quá lâu
**Solution:** 
- Giảm số threads (5 thay vì 10)
- Chọn specific URLs thay vì scan toàn bộ site
- Disable một số scan rules không cần thiết

### Issue: Too many False Positives
**Solution:**
- Review từng alert kỹ
- Mark false positives và exclude
- Focus vào HIGH và MEDIUM alerts

---

## 📚 Tài Liệu Tham Khảo

- OWASP ZAP User Guide: https://www.zaproxy.org/docs/
- OWASP Top 10: https://owasp.org/Top10/
- ZAP API Documentation: https://www.zaproxy.org/docs/api/

---

## 🎯 Kết Quả Mong Đợi

Sau khi hoàn thành, báo cáo sẽ có:

✅ **Section 7.2 Security Testing** với:
- Methodology (OWASP ZAP)
- Test results cho 4 vulnerabilities (SQL, XSS, CSRF, Auth)
- Input validation coverage
- Security best practices implementation
- 10-15 screenshots minh họa
- Summary table với findings
- Recommendations

✅ **Điểm số:** 10/10 nếu:
- All vulnerabilities tested thoroughly
- Screenshots clear và informative
- Proper documentation
- Security practices implemented

---

**Good luck! 🚀**
