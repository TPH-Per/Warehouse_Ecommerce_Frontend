-- ================================================================
-- 🏭 SCRIPT INSERT NHÀ CUNG CẤP (SUPPLIERS) VÀ CẬP NHẬT PRODUCTS
-- Các nhà cung cấp figure anime nổi tiếng
-- ================================================================

USE [perw]
GO

-- ================================================================
-- 1. XÓA SUPPLIERS CŨ (TÙY CHỌN)
-- ================================================================
-- DELETE FROM suppliers WHERE id >= 1;
-- GO

-- ================================================================
-- 2. INSERT SUPPLIERS MỚI
-- ================================================================
PRINT '🏭 Đang tạo nhà cung cấp...'

SET IDENTITY_INSERT [dbo].[suppliers] ON
GO

-- Xóa và insert lại suppliers
DELETE FROM suppliers WHERE id IN (1, 2, 3, 4, 5, 6);

INSERT INTO [dbo].[suppliers] ([id], [name], [contact_info], [created_at], [updated_at])
VALUES 
(1, N'Good Smile Company', 
   N'Email: info@goodsmile.info | Tel: +81-3-5765-7788 | Web: goodsmile.info | Address: Tokyo, Japan', 
   GETDATE(), GETDATE()),

(2, N'Bandai Spirits', 
   N'Email: support@bandai.co.jp | Tel: +81-3-3847-5050 | Web: bandai-spirits.co.jp | Address: Tokyo, Japan', 
   GETDATE(), GETDATE()),

(3, N'Kotobukiya', 
   N'Email: webmaster@kotobukiya.co.jp | Tel: +81-3-5296-0210 | Web: kotobukiya.co.jp | Address: Tokyo, Japan', 
   GETDATE(), GETDATE()),

(4, N'MegaHouse', 
   N'Email: info@megahouse.co.jp | Tel: +81-3-3847-1113 | Web: megahobby.jp | Address: Tokyo, Japan', 
   GETDATE(), GETDATE()),

(5, N'Alter', 
   N'Email: info@alter-web.jp | Tel: +81-3-5827-4088 | Web: alter-web.jp | Address: Saitama, Japan', 
   GETDATE(), GETDATE()),

(6, N'Max Factory', 
   N'Email: info@maxfactory.jp | Tel: +81-3-5765-7789 | Web: maxfactory.jp | Address: Tokyo, Japan', 
   GETDATE(), GETDATE());

SET IDENTITY_INSERT [dbo].[suppliers] OFF
GO

PRINT '✅ Đã tạo 6 nhà cung cấp'

-- ================================================================
-- 3. CẬP NHẬT PRODUCTS THEO NHÀ CUNG CẤP
-- ================================================================
PRINT ''
PRINT '📦 Đang cập nhật sản phẩm theo nhà cung cấp...'

-- ==================== GOOD SMILE COMPANY (1) ====================
-- Nendoroid, Figma, Pop Up Parade
UPDATE products SET supplier_id = 1 WHERE id IN (
    1006, 1007, 1008, 1009, 1010,  -- Nendoroid: Denji, Frieren, Anya, Makima, Power
    1011, 1012, 1013, 1015,        -- Figma: Shinobu, Levi, Tanjiro, Mikasa
    1016, 1017, 1018, 1019, 1020   -- Pop Up Parade: Fern, Himmel, Bocchi, Chisato, Takina
);
PRINT '✅ Good Smile Company: 14 sản phẩm';

-- ==================== BANDAI SPIRITS (2) ====================
-- Figma Nezuko, Zero Two
UPDATE products SET supplier_id = 2 WHERE id IN (
    1003,  -- Zero Two Scale Figure
    1014   -- Figma Nezuko
);
PRINT '✅ Bandai Spirits: 2 sản phẩm';

-- ==================== KOTOBUKIYA (3) ====================
-- Rem Wedding
UPDATE products SET supplier_id = 3 WHERE id IN (
    1004   -- Rem Wedding
);
PRINT '✅ Kotobukiya: 1 sản phẩm';

-- ==================== MEGAHOUSE (4) ====================
-- Yor Forger
UPDATE products SET supplier_id = 4 WHERE id IN (
    1005   -- Yor Forger Thorn Princess
);
PRINT '✅ MegaHouse: 1 sản phẩm';

-- ==================== ALTER (5) ====================
-- Gojo Satoru
UPDATE products SET supplier_id = 5 WHERE id IN (
    1001   -- Gojo Satoru
);
PRINT '✅ Alter: 1 sản phẩm';

-- ==================== MAX FACTORY (6) ====================
-- Marin Kitagawa
UPDATE products SET supplier_id = 6 WHERE id IN (
    1002   -- Marin Kitagawa
);
PRINT '✅ Max Factory: 1 sản phẩm';

GO

-- ================================================================
-- 4. KIỂM TRA KẾT QUẢ
-- ================================================================
PRINT ''
PRINT '📊 DANH SÁCH NHÀ CUNG CẤP:'
SELECT id, name, contact_info FROM suppliers ORDER BY id;

PRINT ''
PRINT '📦 SẢN PHẨM THEO NHÀ CUNG CẤP:'
SELECT 
    s.name AS [Nhà cung cấp],
    COUNT(p.id) AS [Số sản phẩm],
    STRING_AGG(p.name, ', ') WITHIN GROUP (ORDER BY p.id) AS [Danh sách SP]
FROM suppliers s
LEFT JOIN products p ON s.id = p.supplier_id
WHERE s.id <= 6
GROUP BY s.id, s.name
ORDER BY s.id;

PRINT ''
PRINT '📋 CHI TIẾT SẢN PHẨM:'
SELECT 
    p.id,
    p.name AS [Sản phẩm],
    c.name AS [Danh mục],
    s.name AS [Nhà cung cấp]
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN suppliers s ON p.supplier_id = s.id
WHERE p.id >= 1001
ORDER BY s.id, p.id;

GO

PRINT ''
PRINT '✅ Script hoàn thành! Đã tạo 6 nhà cung cấp và cập nhật 20 sản phẩm.'
GO
