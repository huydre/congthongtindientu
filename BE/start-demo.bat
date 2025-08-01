@echo off
echo === KHOI DONG DEMO BACKEND ===
echo.

REM Kiem tra Node.js
echo 1. Kiem tra Node.js...
node --version
if errorlevel 1 (
    echo ❌ Node.js chua duoc cai dat!
    pause
    exit /b 1
)

REM Kiem tra MongoDB (optional)
echo 2. Luu y: Dam bao MongoDB dang chay!

REM Cai dat dependencies
echo 3. Cai dat dependencies...
npm install

REM Tao du lieu demo
echo 4. Tao du lieu demo...
node seedDemo.js

REM Khoi dong server
echo 5. Khoi dong server...
echo ✅ Server se chay tai http://localhost:3000
echo ✅ Su dung file demo-api.http de test cac API
echo.
echo === TAI KHOAN DEMO ===
echo Admin: admin@example.com / admin123
echo User: user1@example.com / 123456
echo Editor: editor@example.com / editor123
echo.

npm start
