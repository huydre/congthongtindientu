const express = require('express');
const router = express.Router();
const News = require('../../model/News.model');

// GET /admin/news - Lấy danh sách tin tức (admin)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filters
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [news, totalNews] = await Promise.all([
      News.find(filter)
        .populate('author', 'fullName username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      News.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalNews / limit);

    res.json({
      success: true,
      data: {
        news,
        pagination: {
          currentPage: page,
          totalPages,
          totalNews,
          limit
        }
      },
      message: 'Lấy danh sách tin tức thành công'
    });
  } catch (error) {
    console.error('Error getting news:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách tin tức',
      error: error.message
    });
  }
});

// GET /admin/news/:id - Lấy chi tiết tin tức
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'fullName username');
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin tức'
      });
    }

    res.json({
      success: true,
      data: news,
      message: 'Lấy tin tức thành công'
    });
  } catch (error) {
    console.error('Error getting news by id:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy tin tức',
      error: error.message
    });
  }
});

// POST /admin/news - Tạo tin tức mới
router.post('/', async (req, res) => {
  try {
    const { title, content, contentHtml, author, status, category, featured, tags, excerpt } = req.body;

    const newNews = new News({
      title,
      content,
      contentHtml,
      author,
      status: status || 'draft',
      category: category || 'all',
      featured: featured || false,
      tags: tags || [],
      excerpt
    });

    await newNews.save();

    // Populate author info
    await newNews.populate('author', 'fullName username');

    res.status(201).json({
      success: true,
      data: newNews,
      message: 'Tạo tin tức thành công'
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi tạo tin tức',
      error: error.message
    });
  }
});

// PUT /admin/news/:id - Cập nhật tin tức
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, contentHtml, status, category, featured, tags, excerpt } = req.body;

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
      content: content || news.content,
      contentHtml: contentHtml || news.contentHtml,
      status: status || news.status,
      category: category || news.category,
      featured: featured !== undefined ? featured : news.featured,
      tags: tags || news.tags,
      excerpt: excerpt || news.excerpt,
      updatedAt: new Date()
    };

    const updatedNews = await News.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'fullName username');

    res.json({
      success: true,
      data: updatedNews,
      message: 'Cập nhật tin tức thành công'
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật tin tức',
      error: error.message
    });
  }
});

// DELETE /admin/news/:id - Xóa tin tức
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin tức'
      });
    }

    // Soft delete
    await News.findByIdAndUpdate(id, { 
      deleted: true,
      deletedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Xóa tin tức thành công'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi xóa tin tức',
      error: error.message
    });
  }
});

// GET /admin/news/stats - Thống kê tin tức
router.get('/stats', async (req, res) => {
  try {
    const [totalNews, publishedNews, draftNews, featuredNews] = await Promise.all([
      News.countDocuments({ deleted: { $ne: true } }),
      News.countDocuments({ status: 'published', deleted: { $ne: true } }),
      News.countDocuments({ status: 'draft', deleted: { $ne: true } }),
      News.countDocuments({ featured: true, deleted: { $ne: true } })
    ]);

    const stats = {
      totalNews,
      publishedNews,
      draftNews,
      featuredNews
    };

    res.json({
      success: true,
      data: stats,
      message: 'Lấy thống kê tin tức thành công'
    });
  } catch (error) {
    console.error('Error getting news stats:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy thống kê',
      error: error.message
    });
  }
});

module.exports = router;
