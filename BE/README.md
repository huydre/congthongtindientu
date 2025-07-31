# Backend API - Hệ thống Tin tức và Quản lý

API Backend cho hệ thống tin tức và quản lý được xây dựng với Node.js, Express.js và MongoDB.

## 🚀 Tính năng chính

- **Quản lý tin tức**: CRUD tin tức với upload hình ảnh
- **Xác thực người dùng**: Đăng ký, đăng nhập với JWT
- **Phân quyền**: Admin và Client roles
- **Upload file**: Quản lý hình ảnh thumbnail
- **Real-time**: Socket.IO support
- **RESTful API**: Cấu trúc API chuẩn REST

## 📁 Cấu trúc thư mục

```
BE/
├── controllers/           # Logic xử lý business
│   ├── admin/            # Controllers cho admin
│   │   └── auth.controller.js
│   └── client/           # Controllers cho client
│       ├── Contact.controller.js
│       ├── home.controller.js
│       └── News.controller.js
├── database/             # Kết nối database
│   └── db.js
├── middleware/           # Middleware functions
│   └── auth.middleware.js
├── model/               # MongoDB models
│   ├── account.model.js
│   ├── Chat.model.js
│   ├── News.model.js
│   └── role.route.js
├── routes/              # API routes
│   ├── admin/           # Admin routes
│   │   ├── auth.route.js
│   │   └── index.route.js
│   └── client/          # Client routes
│       ├── Contact.route.js
│       ├── Home.route.js
│       ├── index.js
│       └── News.route.js
├── scripts/             # Utility scripts
│   └── seedNews.js      # Seed data cho news
├── uploads/             # Thư mục chứa file upload
├── index.js             # Entry point
└── package.json         # Dependencies
```

## 🛠️ Công nghệ sử dụng

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB với Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **Real-time**: Socket.IO
- **CORS**: cors middleware
- **Environment**: dotenv

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 16.x
- MongoDB >= 4.x
- npm hoặc yarn

### Bước 1: Clone và cài đặt dependencies
```bash
cd BE
npm install
```

### Bước 2: Cấu hình môi trường
Tạo file `.env` trong thư mục BE:
```env
# Database
MONGO_URI=mongodb://localhost:27017/ltw

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
```

### Bước 3: Seed dữ liệu (tùy chọn)
```bash
node scripts/seedNews.js
```

### Bước 4: Chạy server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 🔌 API Endpoints

### Authentication (Admin)
```
POST /auth/register    # Đăng ký tài khoản
POST /auth/login       # Đăng nhập
```

### News (Client)
```
GET    /news           # Lấy danh sách tin tức (có phân trang)
GET    /news/:id       # Lấy chi tiết tin tức
POST   /news           # Tạo tin tức mới (có upload ảnh)
PUT    /news/:id       # Cập nhật tin tức
DELETE /news/:id       # Xóa tin tức
```

### Contact
```
POST   /contacts       # Gửi liên hệ
GET    /contacts       # Lấy danh sách liên hệ
```

### Home
```
GET    /               # API trang chủ
```

## 📊 Models

### Account Model
```javascript
{
  fullName: String,
  email: String,
  password: String,     // Mã hóa bằng bcrypt
  phone: String,
  role_id: String,
  status: String,
  deleted: Boolean,
  deletedAt: Date,
  timestamps: true
}
```

### News Model
```javascript
{
  title: String,
  contentHtml: String,
  author: String,
  thumbnail: String,
  status: ["draft", "published"],
  category: ["all", "announcement", "policy", "service", "event"],
  excerpt: String,
  featured: Boolean,
  deleted: Boolean,
  deletedAt: Date,
  timestamps: true
}
```

## 🔒 Authentication & Authorization

API sử dụng JWT tokens cho authentication:

1. **Đăng ký/Đăng nhập**: Nhận JWT token
2. **Protected routes**: Gửi token trong header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. **Middleware**: `auth.middleware.js` xác thực token

## 📁 Upload Files

- **Thư mục**: `/uploads`
- **Định dạng**: Chỉ hình ảnh (jpg, png, gif, webp)
- **Kích thước**: Tối đa 5MB
- **URL access**: `http://localhost:3000/uploads/filename`

## 🔧 Scripts có sẵn

```bash
npm start        # Chạy production server
npm run dev      # Chạy development với nodemon
npm test         # Chạy tests (chưa có)
```

## 🌐 CORS Configuration

API được cấu hình cho phép:
- Origin: `http://localhost:5173` (Vite dev server)
- Credentials: true

## 🚨 Lưu ý bảo mật

1. **Environment Variables**: Không commit file `.env`
2. **JWT Secret**: Sử dụng secret key mạnh
3. **Password**: Được hash bằng bcrypt
4. **File Upload**: Kiểm tra loại file và kích thước
5. **CORS**: Chỉ cho phép origin được tin tưởng

## 🐛 Debug và Logs

- Server logs được hiển thị trong console
- MongoDB connection status
- Error handling cho các route chính

## 📝 Development

### Thêm API endpoint mới:
1. Tạo controller trong `/controllers`
2. Tạo route trong `/routes`
3. Cập nhật index route file
4. Test API với Postman/Thunder Client

### Thêm model mới:
1. Tạo schema trong `/model`
2. Import vào controller cần sử dụng

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Liên hệ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trong repository.
