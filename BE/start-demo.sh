#!/bin/bash

echo "=== KHỞI ĐỘNG DEMO BACKEND ==="
echo ""

# Kiểm tra Node.js
echo "1. Kiểm tra Node.js..."
node --version
if [ $? -ne 0 ]; then
    echo "❌ Node.js chưa được cài đặt!"
    exit 1
fi

# Kiểm tra MongoDB
echo "2. Kiểm tra MongoDB..."
mongod --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  MongoDB không được tìm thấy. Đảm bảo MongoDB đang chạy!"
fi

# Cài đặt dependencies
echo "3. Cài đặt dependencies..."
npm install

# Tạo dữ liệu demo
echo "4. Tạo dữ liệu demo..."
node seedDemo.js

# Khởi động server
echo "5. Khởi động server..."
echo "✅ Server sẽ chạy tại http://localhost:3000"
echo "✅ Sử dụng file demo-api.http để test các API"
echo ""
echo "=== TẢI KHOẢN DEMO ==="
echo "Admin: admin@example.com / admin123"
echo "User: user1@example.com / 123456"
echo "Editor: editor@example.com / editor123"
echo ""

npm start
