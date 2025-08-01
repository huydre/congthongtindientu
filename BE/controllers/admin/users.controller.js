const Account = require('../../model/account.model');
const bcrypt = require('bcrypt');

// [GET] /admin/users - Lấy danh sách người dùng
module.exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filters
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    if (req.query.search) {
      filter.$or = [
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { fullName: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const [users, totalUsers] = await Promise.all([
      Account.find(filter)
        .select('-password') // Không trả về password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Account.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          limit
        }
      },
      message: 'Lấy danh sách người dùng thành công'
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách người dùng',
      error: error.message
    });
  }
};

// [GET] /admin/users/:id - Lấy thông tin chi tiết người dùng
module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await Account.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'Lấy thông tin người dùng thành công'
    });
  } catch (error) {
    console.error('Error getting user by id:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy thông tin người dùng',
      error: error.message
    });
  }
};

// [POST] /admin/users - Tạo người dùng mới
module.exports.createUser = async (req, res) => {
  try {
    const { username, email, password, fullName, role = 'user' } = req.body;

    // Kiểm tra email và username đã tồn tại
    const existingUser = await Account.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc username đã tồn tại'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new Account({
      username,
      email,
      password: hashedPassword,
      fullName,
      role
    });

    await newUser.save();

    // Trả về user không có password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'Tạo người dùng thành công'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi tạo người dùng',
      error: error.message
    });
  }
};

// [PUT] /admin/users/:id - Cập nhật thông tin người dùng
module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, role, status } = req.body;

    // Tìm user cần cập nhật
    const user = await Account.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra email và username trùng lặp (nếu thay đổi)
    if (email && email !== user.email) {
      const existingEmail = await Account.findOne({ email, _id: { $ne: id } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email đã tồn tại'
        });
      }
    }

    if (username && username !== user.username) {
      const existingUsername = await Account.findOne({ username, _id: { $ne: id } });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username đã tồn tại'
        });
      }
    }

    // Cập nhật thông tin
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (fullName) updateData.fullName = fullName;
    if (role) updateData.role = role;
    if (status !== undefined) updateData.status = status;

    const updatedUser = await Account.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: updatedUser,
      message: 'Cập nhật người dùng thành công'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật người dùng',
      error: error.message
    });
  }
};

// [PUT] /admin/users/:id/password - Đổi mật khẩu người dùng
module.exports.changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Tìm user
    const user = await Account.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await Account.findByIdAndUpdate(id, { password: hashedPassword });

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Error changing user password:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi đổi mật khẩu',
      error: error.message
    });
  }
};

// [DELETE] /admin/users/:id - Xóa người dùng
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm user cần xóa
    const user = await Account.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Không cho phép xóa chính mình
    if (req.user && req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa chính mình'
      });
    }

    // Xóa user
    await Account.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Xóa người dùng thành công'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi xóa người dùng',
      error: error.message
    });
  }
};

// [GET] /admin/users/stats - Thống kê người dùng
module.exports.getUserStats = async (req, res) => {
  try {
    const [totalUsers, adminCount, userCount, recentUsers] = await Promise.all([
      Account.countDocuments(),
      Account.countDocuments({ role: 'admin' }),
      Account.countDocuments({ role: 'user' }),
      Account.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const stats = {
      totalUsers,
      adminCount,
      userCount,
      recentUsers
    };

    res.json({
      success: true,
      data: stats,
      message: 'Lấy thống kê người dùng thành công'
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy thống kê',
      error: error.message
    });
  }
};
