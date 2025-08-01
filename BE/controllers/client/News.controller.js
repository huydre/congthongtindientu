const News = require("../../model/News.model")
const multer = require('multer')
const path = require('path')

// Cấu hình multer để lưu ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Thư mục lưu ảnh
    },
    filename: function (req, file, cb) {
        // Tạo tên file unique với timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// Filter để chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Chỉ cho phép upload file ảnh!'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    }
})

module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [news, totalItems] = await Promise.all([
      News.find({
        status: 'published',
        deleted: { $ne: true }
      }).sort({ createdAt: -1 }).limit(limit).skip(skip),
      
      News.countDocuments({
        status: 'published',
        deleted: { $ne: true }
      })
    ]); 

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      massage: "Lấy tin tức thành công",
      News: news,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    res.status(500).json({ massage: "Lỗi server" });
  }
};

// Middleware upload cho postNews
module.exports.uploadImage = upload.single('thumbnail')

// [post] tao news
module.exports.postNews = async (req, res) => {
    try {
        const { title, contentHtml, author, status } = req.body;

        // Xử lý URL ảnh
        let thumbnailUrl = null;
        if (req.file) {
            // Tạo URL cho ảnh đã upload
            thumbnailUrl = `/uploads/${req.file.filename}`;
        }

        const newNews = new News({
            title,
            contentHtml,
            author,
            thumbnail: thumbnailUrl, // Lưu URL ảnh vào database
            status
        });

        await newNews.save();
        res.json({
            success: true,
            data: newNews,
            message: 'Tạo tin tức thành công!'
        })
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi tạo tin tức',
            error: error.message
        })
    }
}

// [Get] detail new
module.exports.detailNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin tức'
            })
        }
        res.json({
            success: true,
            data: news
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy tin tức',
            error: error.message
        })
    }
}

// [PUT] update news
module.exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, contentHtml, author, status } = req.body;

        // Tìm tin tức cần cập nhật
        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin tức'
            });
        }

        // Cập nhật thông tin
        const updateData = {
            title: title || news.title,
            contentHtml: contentHtml || news.contentHtml,
            author: author || news.author,
            status: status || news.status,
            updatedAt: new Date()
        };

        // Xử lý ảnh mới nếu có
        if (req.file) {
            updateData.thumbnail = `/uploads/${req.file.filename}`;
        }

        const updatedNews = await News.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedNews,
            message: 'Cập nhật tin tức thành công!'
        });
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi cập nhật tin tức',
            error: error.message
        });
    }
}

// [DELETE] delete news
module.exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm tin tức cần xóa
        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin tức'
            });
        }

        // Xóa tin tức (soft delete hoặc hard delete)
        // Soft delete - đánh dấu là đã xóa
        await News.findByIdAndUpdate(id, { 
            deleted: true,
            deletedAt: new Date()
        });

        // Hoặc hard delete - xóa hoàn toàn
        // await News.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Xóa tin tức thành công!'
        });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xóa tin tức',
            error: error.message
        });
    }
}