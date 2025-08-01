# API Test với Upload File
# Sử dụng curl hoặc Postman để test upload

## 1. Tạo tin tức với ảnh (multipart/form-data)

### Sử dụng curl:
```bash
curl -X POST http://localhost:3000/news/postnews \
  -F "title=Tin tức có ảnh" \
  -F "contentHtml=<h2>Tin tức với ảnh</h2><p>Nội dung có kèm ảnh thumbnail</p>" \
  -F "author=Test User" \
  -F "status=published" \
  -F "thumbnail=@path/to/your/image.jpg"
```

### Sử dụng Postman:
1. Chọn POST method
2. URL: http://localhost:3000/news/postnews
3. Body -> form-data:
   - title: "Tin tức có ảnh"
   - contentHtml: "<h2>Tin tức với ảnh</h2><p>Nội dung có kèm ảnh thumbnail</p>"
   - author: "Test User"
   - status: "published"
   - thumbnail: [Select File] -> chọn file ảnh

## 2. Cập nhật tin tức với ảnh mới

### Sử dụng curl:
```bash
curl -X PUT http://localhost:3000/news/NEWS_ID_HERE \
  -F "title=Tin tức đã cập nhật" \
  -F "contentHtml=<h2>Nội dung cập nhật</h2><p>Tin tức đã được cập nhật với ảnh mới</p>" \
  -F "status=published" \
  -F "thumbnail=@path/to/new/image.jpg"
```

### Sử dụng Postman:
1. Chọn PUT method
2. URL: http://localhost:3000/news/{id}
3. Body -> form-data:
   - title: "Tin tức đã cập nhật"
   - contentHtml: "<h2>Nội dung cập nhật</h2>"
   - status: "published"
   - thumbnail: [Select File] -> chọn file ảnh mới

## 3. Test các endpoint khác

### Lấy danh sách tin tức (với phân trang):
```bash
curl http://localhost:3000/news
curl http://localhost:3000/news?page=2
```

### Lấy chi tiết tin tức:
```bash
curl http://localhost:3000/news/{news_id}
```

### Xóa tin tức:
```bash
curl -X DELETE http://localhost:3000/news/{news_id}
```

## 4. Response Examples

### Tạo tin tức thành công:
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "title": "Tin tức có ảnh",
    "contentHtml": "<h2>Tin tức với ảnh</h2>",
    "author": "Test User",
    "thumbnail": "/uploads/thumbnail-1640995200000-123456789.jpg",
    "status": "published",
    "deleted": false,
    "category": "all",
    "featured": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Tạo tin tức thành công!"
}
```

### Lấy danh sách tin tức:
```json
{
  "massage": "Lấy tin tức thành công",
  "News": [
    {
      "_id": "65a1b2c3d4e5f6789012345",
      "title": "Tin tức 1",
      "contentHtml": "<p>Nội dung tin tức 1</p>",
      "author": "Admin",
      "thumbnail": "/uploads/thumbnail-1.jpg",
      "status": "published",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5
}
```

### Xóa tin tức thành công:
```json
{
  "success": true,
  "message": "Xóa tin tức thành công!"
}
```

## 5. Error Responses

### Tin tức không tồn tại:
```json
{
  "success": false,
  "message": "Không tìm thấy tin tức"
}
```

### Lỗi validation:
```json
{
  "success": false,
  "message": "Có lỗi xảy ra khi tạo tin tức",
  "error": "Validation error details"
}
```

### File upload không hợp lệ:
```json
{
  "success": false,
  "message": "Chỉ cho phép upload file ảnh!"
}
```

## 6. Notes
- Các file upload được lưu trong thư mục `/uploads`
- Kích thước file tối đa: 5MB
- Chỉ chấp nhận file ảnh (image/*)
- Soft delete: tin tức bị xóa vẫn tồn tại trong DB nhưng được đánh dấu `deleted: true`
