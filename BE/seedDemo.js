const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Account = require('./model/account.model');
const News = require('./model/News.model');
const connectDB = require('./database/db');

const seedData = async () => {
  try {
    // Kết nối database
    await connectDB();
    console.log('Đã kết nối database');

    // Xóa dữ liệu cũ
    await Account.deleteMany({});
    await News.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    // Tạo tài khoản admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new Account({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      fullName: 'Administrator',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=ffffff'
    });
    await admin.save();
    console.log('Đã tạo tài khoản admin');

    // Tạo một số tài khoản user
    const users = [
      {
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('123456', 10),
        fullName: 'Nguyễn Văn A',
        role: 'user'
      },
      {
        username: 'user2', 
        email: 'user2@example.com',
        password: await bcrypt.hash('123456', 10),
        fullName: 'Trần Thị B',
        role: 'user'
      },
      {
        username: 'editor',
        email: 'editor@example.com', 
        password: await bcrypt.hash('editor123', 10),
        fullName: 'Editor User',
        role: 'admin'
      }
    ];

    for (let userData of users) {
      const user = new Account(userData);
      await user.save();
    }
    console.log('Đã tạo tài khoản người dùng');

    // Tạo tin tức demo
    const newsData = [
      {
        title: 'Thông báo về dịch vụ công trực tuyến mới',
        content: `
          <h2>Dịch vụ công trực tuyến mới</h2>
          <p>Chúng tôi vui mừng thông báo về việc ra mắt dịch vụ công trực tuyến mới nhằm phục vụ tốt hơn nhu cầu của người dân.</p>
          
          <h3>Các tính năng chính:</h3>
          <ul>
            <li>Nộp hồ sơ trực tuyến</li>
            <li>Tra cứu tiến độ xử lý</li>
            <li>Nhận thông báo qua email/SMS</li>
            <li>Thanh toán phí dịch vụ online</li>
          </ul>
          
          <p>Dịch vụ sẽ chính thức hoạt động từ ngày 01/02/2024.</p>
        `,
        author: admin._id,
        status: 'published',
        featured: true,
        tags: ['dịch vụ công', 'trực tuyến', 'thông báo'],
        thumbnail: '/uploads/sample-thumbnail-1.jpg',
        views: 1250
      },
      {
        title: 'Hướng dẫn sử dụng hệ thống mới',
        content: `
          <h2>Hướng dẫn chi tiết</h2>
          <p>Để sử dụng hệ thống mới một cách hiệu quả, vui lòng làm theo các bước sau:</p>
          
          <h3>Bước 1: Đăng ký tài khoản</h3>
          <p>Truy cập trang đăng ký và điền đầy đủ thông tin cá nhân.</p>
          
          <h3>Bước 2: Xác thực email</h3>
          <p>Kiểm tra email và click vào link xác thực.</p>
          
          <h3>Bước 3: Hoàn thiện hồ sơ</h3>
          <p>Cập nhật đầy đủ thông tin cá nhân để sử dụng dịch vụ.</p>
        `,
        author: admin._id,
        status: 'published',
        featured: false,
        tags: ['hướng dẫn', 'sử dụng', 'hệ thống'],
        thumbnail: '/uploads/sample-thumbnail-2.jpg',
        views: 890
      },
      {
        title: 'Cập nhật chính sách bảo mật thông tin',
        content: `
          <h2>Chính sách bảo mật mới</h2>
          <p>Nhằm đảm bảo an toàn thông tin cá nhân của người dùng, chúng tôi đã cập nhật chính sách bảo mật.</p>
          
          <h3>Các điểm chính:</h3>
          <ul>
            <li>Mã hóa toàn bộ dữ liệu cá nhân</li>
            <li>Xác thực hai yếu tố (2FA)</li>
            <li>Kiểm tra bảo mật định kỳ</li>
            <li>Thông báo ngay khi có bất thường</li>
          </ul>
          
          <p>Chính sách có hiệu lực từ ngày 15/01/2024.</p>
        `,
        author: admin._id,
        status: 'published',
        featured: true,
        tags: ['bảo mật', 'chính sách', 'thông tin'],
        thumbnail: '/uploads/sample-thumbnail-3.jpg',
        views: 2100
      },
      {
        title: 'Thông báo bảo trì hệ thống',
        content: `
          <h2>Lịch bảo trì hệ thống</h2>
          <p>Hệ thống sẽ được bảo trì để nâng cấp hiệu năng và bảo mật.</p>
          
          <h3>Thời gian bảo trì:</h3>
          <p><strong>Từ 02:00 đến 06:00 ngày 20/01/2024</strong></p>
          
          <h3>Ảnh hưởng:</h3>
          <ul>
            <li>Tạm thời không thể truy cập hệ thống</li>
            <li>Các giao dịch đang xử lý sẽ được hoàn thành sau bảo trì</li>
          </ul>
          
          <p>Chúng tôi xin lỗi vì sự bất tiện này.</p>
        `,
        author: admin._id,
        status: 'draft',
        featured: false,
        tags: ['bảo trì', 'hệ thống', 'thông báo'],
        thumbnail: '/uploads/sample-thumbnail-4.jpg',
        views: 0
      },
      {
        title: 'Kết quả khảo sát ý kiến người dân',
        content: `
          <h2>Kết quả khảo sát</h2>
          <p>Chúng tôi đã tiến hành khảo sát ý kiến người dân về chất lượng dịch vụ.</p>
          
          <h3>Kết quả tổng quan:</h3>
          <ul>
            <li>95% hài lòng với dịch vụ</li>
            <li>90% cho rằng thủ tục đã được đơn giản hóa</li>
            <li>85% đánh giá thời gian xử lý nhanh chóng</li>
          </ul>
          
          <p>Cảm ơn sự đóng góp ý kiến của người dân.</p>
        `,
        author: admin._id,
        status: 'published',
        featured: false,
        tags: ['khảo sát', 'ý kiến', 'kết quả'],
        thumbnail: '/uploads/sample-thumbnail-5.jpg',
        views: 567
      }
    ];

    for (let data of newsData) {
      const news = new News(data);
      await news.save();
    }
    console.log('Đã tạo tin tức demo');

    console.log('\n=== THÔNG TIN TẢI KHOẢN DEMO ===');
    console.log('Admin:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
    console.log('\nUser thường:');
    console.log('  Email: user1@example.com');
    console.log('  Password: 123456');
    console.log('\nEditor:');
    console.log('  Email: editor@example.com');
    console.log('  Password: editor123');
    console.log('\n=== HOÀN THÀNH SEED DATA ===');

    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed data:', error);
    process.exit(1);
  }
};

// Chạy script
seedData();
