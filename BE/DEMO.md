# Demo Backend API

## 🚀 Hướng dẫn khởi động nhanh

### Cách 1: Sử dụng script tự động
```bash
# Trên Windows
start-demo.bat

# Trên Linux/Mac
chmod +x start-demo.sh
./start-demo.sh
```

### Cách 2: Khởi động thủ công
```bash
# 1. Cài đặt dependencies
npm install

# 2. Tạo dữ liệu demo
node seedDemo.js

# 3. Khởi động server
npm start
```

## 📋 Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | admin@example.com | admin123 |
| User | user1@example.com | 123456 |
| Editor | editor@example.com | editor123 |

## 🔧 Test API

### Sử dụng REST Client (VS Code)
1. Cài đặt extension "REST Client" trong VS Code
2. Mở file `demo-api.http`
3. Click vào "Send Request" để test từng API

### Sử dụng Postman/Insomnia
1. Import các request từ file `demo-api.http`
2. Thay thế token và ID trong các request
3. Test các endpoint

## 📚 Các API có sẵn

### Authentication
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `GET /auth/logout` - Đăng xuất

### Admin - News Management
- `GET /admin/news` - Lấy danh sách tin tức
- `POST /admin/news` - Tạo tin tức mới
- `PUT /admin/news/:id` - Cập nhật tin tức
- `DELETE /admin/news/:id` - Xóa tin tức

### Admin - User Management
- `GET /admin/users` - Lấy danh sách người dùng
- `PUT /admin/users/:id` - Cập nhật người dùng
- `DELETE /admin/users/:id` - Xóa người dùng

### Client
- `GET /` - Lấy tin tức trang chủ
- `GET /news/:id` - Lấy chi tiết tin tức
- `POST /contact` - Gửi liên hệ

## 🗄️ Database

Backend sử dụng MongoDB với các collection:
- `accounts` - Thông tin tài khoản người dùng
- `news` - Tin tức và bài viết
- `contacts` - Thông tin liên hệ

## 🛡️ Authorization

Hầu hết API admin yêu cầu JWT token trong header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Token được trả về khi đăng nhập thành công.

## 📝 Lưu ý

1. Đảm bảo MongoDB đang chạy trước khi khởi động
2. Server mặc định chạy tại port 3000
3. CORS đã được cấu hình cho frontend tại localhost:5173
4. Upload files được lưu trong thư mục `/uploads`

## 🔍 Troubleshooting

### Lỗi kết nối MongoDB
```bash
# Khởi động MongoDB service
# Windows:
net start MongoDB

# Mac với Homebrew:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Port 3000 đã được sử dụng
Thay đổi PORT trong file `index.js` hoặc dừng process đang sử dụng port 3000.

### Lỗi JWT token
Đảm bảo đã đăng nhập và sử dụng token đúng trong header Authorization.
