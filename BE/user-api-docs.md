# User Management API Documentation

## 📋 Endpoints Overview

### Admin User Management
- `GET /admin/users/stats` - Thống kê người dùng
- `GET /admin/users` - Lấy danh sách người dùng
- `GET /admin/users/:id` - Lấy thông tin chi tiết người dùng
- `POST /admin/users` - Tạo người dùng mới
- `PUT /admin/users/:id` - Cập nhật thông tin người dùng
- `PUT /admin/users/:id/password` - Đổi mật khẩu người dùng
- `DELETE /admin/users/:id` - Xóa người dùng

## 🔍 API Details

### 1. Lấy thống kê người dùng
```http
GET /admin/users/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "adminCount": 5,
    "userCount": 145,
    "recentUsers": [
      {
        "_id": "65a1b2c3d4e5f67890123456",
        "username": "newuser",
        "email": "newuser@example.com",
        "fullName": "New User",
        "role": "user",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  },
  "message": "Lấy thống kê người dùng thành công"
}
```

### 2. Lấy danh sách người dùng (với filters)
```http
GET /admin/users?page=1&limit=10&role=user&search=john
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng user mỗi trang (default: 10)
- `role` (optional): Lọc theo vai trò (user/admin)
- `search` (optional): Tìm kiếm theo username, email, fullName

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "65a1b2c3d4e5f67890123456",
        "username": "johndoe",
        "email": "john@example.com",
        "fullName": "John Doe",
        "role": "user",
        "avatar": "https://ui-avatars.com/api/?name=John+Doe",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 15,
      "totalUsers": 150,
      "limit": 10
    }
  },
  "message": "Lấy danh sách người dùng thành công"
}
```

### 3. Lấy thông tin chi tiết người dùng
```http
GET /admin/users/65a1b2c3d4e5f67890123456
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f67890123456",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "user",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Lấy thông tin người dùng thành công"
}
```

### 4. Tạo người dùng mới
```http
POST /admin/users
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securepassword123",
  "fullName": "New User",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f67890123457",
    "username": "newuser",
    "email": "newuser@example.com",
    "fullName": "New User",
    "role": "user",
    "avatar": "https://ui-avatars.com/api/?name=New+User",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  },
  "message": "Tạo người dùng thành công"
}
```

### 5. Cập nhật thông tin người dùng
```http
PUT /admin/users/65a1b2c3d4e5f67890123456
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "fullName": "John Doe Updated",
  "role": "admin",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f67890123456",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe Updated",
    "role": "admin",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  },
  "message": "Cập nhật người dùng thành công"
}
```

### 6. Đổi mật khẩu người dùng
```http
PUT /admin/users/65a1b2c3d4e5f67890123456/password
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "newPassword": "newsecurepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công"
}
```

### 7. Xóa người dùng
```http
DELETE /admin/users/65a1b2c3d4e5f67890123456
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Xóa người dùng thành công"
}
```

## 🚫 Error Responses

### User không tồn tại:
```json
{
  "success": false,
  "message": "Không tìm thấy người dùng"
}
```

### Email/Username đã tồn tại:
```json
{
  "success": false,
  "message": "Email hoặc username đã tồn tại"
}
```

### Không thể xóa chính mình:
```json
{
  "success": false,
  "message": "Không thể xóa chính mình"
}
```

### Mật khẩu không hợp lệ:
```json
{
  "success": false,
  "message": "Mật khẩu phải có ít nhất 6 ký tự"
}
```

### Unauthorized:
```json
{
  "success": false,
  "message": "Không có quyền truy cập"
}
```

## 🔐 Security Notes

1. **Authentication Required**: Tất cả endpoint cần JWT token hợp lệ
2. **Admin Role Required**: Chỉ admin mới có thể truy cập các endpoint này
3. **Password Security**: Mật khẩu được hash bằng bcrypt
4. **Self-Protection**: Không thể xóa chính mình
5. **Validation**: Email và username phải unique

## 📝 Usage Examples

### Tìm kiếm người dùng:
```bash
curl -H "Authorization: Bearer {token}" \
     "http://localhost:3000/admin/users?search=john&role=user&page=1&limit=5"
```

### Tạo admin mới:
```bash
curl -X POST \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"username":"newadmin","email":"admin@test.com","password":"admin123","fullName":"New Admin","role":"admin"}' \
     http://localhost:3000/admin/users
```

### Cập nhật role user thành admin:
```bash
curl -X PUT \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"role":"admin"}' \
     http://localhost:3000/admin/users/{user_id}
```
