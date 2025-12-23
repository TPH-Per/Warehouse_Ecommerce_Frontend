-- ================================================================
-- 🖼️ SCRIPT SỬA ĐƯỜNG DẪN ẢNH - THÊM wwwroot/
-- Chạy script này để update image_url trong product_variants
-- ================================================================

USE [perw]
GO

-- Update tất cả đường dẫn ảnh từ /uploads/... thành /wwwroot/uploads/...
UPDATE [dbo].[product_variants]
SET image_url = REPLACE(image_url, '/uploads/products/', '/wwwroot/uploads/products/')
WHERE image_url LIKE '/uploads/products/%'
AND image_url NOT LIKE '/wwwroot/%';

PRINT CONCAT('✅ Đã update ', @@ROWCOUNT, ' đường dẫn ảnh');

-- Kiểm tra kết quả
SELECT 
    id,
    name,
    sku,
    image_url
FROM product_variants
WHERE id >= 2001
ORDER BY id;

GO
