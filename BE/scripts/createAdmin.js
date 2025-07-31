const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Account = require('../model/account.model');
require('dotenv').config();

// Kết nối database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ltw');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Tạo tài khoản admin
const createAdminAccount = async () => {
  try {
    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await Account.findOne({ email: 'admin@ltw.com' });
    
    if (existingAdmin) {
      console.log('❌ Admin account already exists!');
      console.log('📧 Email: admin@ltw.com');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Tạo admin account
    const adminAccount = new Account({
      fullName: 'Administrator',
      email: 'admin@ltw.com',
      password: hashedPassword,
      phone: '0123456789',
      role_id: 'admin',
      status: 'active',
      deleted: false
    });

    await adminAccount.save();

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email: admin@ltw.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('📱 Phone: 0123456789');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
};

// Chạy script
const runScript = async () => {
  console.log('🚀 Starting admin account creation...');
  await connectDB();
  await createAdminAccount();
};

runScript();
