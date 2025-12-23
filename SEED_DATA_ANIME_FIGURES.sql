-- ================================================================
-- 🎌 WIBU SHOP - SCRIPT INSERT DỮ LIỆU SẢN PHẨM ANIME FIGURE
-- Chạy script này để thêm categories, products và variants
-- ================================================================

USE [perw]
GO

-- ================================================================
-- 1. XÓA DỮ LIỆU CŨ (TÙY CHỌN - CẢNH BÁO: XÓA TOÀN BỘ!)
-- ================================================================
-- Bỏ comment nếu muốn xóa dữ liệu cũ trước khi insert
/*
DELETE FROM purchase_order_details;
DELETE FROM purchase_orders;
DELETE FROM carts;
DELETE FROM branch_inventories;
DELETE FROM inventories;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM categories WHERE name LIKE '%Test%' OR name LIKE '%Cat_%';
*/

-- ================================================================
-- 2. INSERT SUPPLIERS (nếu chưa có)
-- ================================================================
SET IDENTITY_INSERT [dbo].[suppliers] ON
GO

-- Thêm supplier nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM suppliers WHERE id = 1)
BEGIN
    INSERT INTO [dbo].[suppliers] ([id], [name], [contact_info], [created_at])
    VALUES (1, N'Good Smile Company', N'contact@goodsmile.info', GETDATE())
END

IF NOT EXISTS (SELECT 1 FROM suppliers WHERE id = 2)
BEGIN
    INSERT INTO [dbo].[suppliers] ([id], [name], [contact_info], [created_at])
    VALUES (2, N'Bandai Namco', N'support@bandai.co.jp', GETDATE())
END

IF NOT EXISTS (SELECT 1 FROM suppliers WHERE id = 3)
BEGIN
    INSERT INTO [dbo].[suppliers] ([id], [name], [contact_info], [created_at])
    VALUES (3, N'Kotobukiya', N'info@kotobukiya.co.jp', GETDATE())
END

IF NOT EXISTS (SELECT 1 FROM suppliers WHERE id = 4)
BEGIN
    INSERT INTO [dbo].[suppliers] ([id], [name], [contact_info], [created_at])
    VALUES (4, N'MegaHouse', N'contact@megahouse.co.jp', GETDATE())
END

SET IDENTITY_INSERT [dbo].[suppliers] OFF
GO

-- ================================================================
-- 3. INSERT CATEGORIES (4 danh mục chính)
-- ================================================================
-- Xóa categories test cũ
DELETE FROM categories WHERE name LIKE '%Cat_Test%' OR slug LIKE '%test%';
GO

SET IDENTITY_INSERT [dbo].[categories] ON
GO

-- Reset và insert categories mới
DELETE FROM categories WHERE id IN (101, 102, 103, 104);

INSERT INTO [dbo].[categories] ([id], [name], [slug], [created_at], [updated_at])
VALUES 
    (101, N'Scale Figure', 'scale-figure', GETDATE(), GETDATE()),
    (102, N'Nendoroid', 'nendoroid', GETDATE(), GETDATE()),
    (103, N'Figma', 'figma', GETDATE(), GETDATE()),
    (104, N'Pop Up Parade', 'pop-up-parade', GETDATE(), GETDATE());
GO

SET IDENTITY_INSERT [dbo].[categories] OFF
GO

-- ================================================================
-- 4. INSERT PRODUCTS
-- ================================================================
SET IDENTITY_INSERT [dbo].[products] ON
GO

-- Xóa products cũ (test)
DELETE FROM products WHERE id >= 1001;

-- ==================== CATEGORY: SCALE FIGURE (101) ====================

INSERT INTO [dbo].[products] ([id], [category_id], [supplier_id], [name], [description], [slug], [status], [created_at])
VALUES 
(1001, 101, 1, N'Gojo Satoru - Jujutsu Kaisen 1/7 Scale', 
 N'Mô hình Gojo Satoru từ anime Jujutsu Kaisen, tỷ lệ 1/7, cao 25cm. Thiết kế chi tiết, trang phục đen đặc trưng với khăn bịt mắt.', 
 'gojo-satoru-jjk-1-7', 'active', GETDATE()),

(1002, 101, 1, N'Marin Kitagawa - My Dress-Up Darling 1/7 Scale',
 N'Mô hình Marin Kitagawa trong bộ đồng phục học sinh, tỷ lệ 1/7, cao 24cm. Cosplay lover với nụ cười rạng rỡ.',
 'marin-kitagawa-1-7', 'active', GETDATE()),

(1003, 101, 2, N'Zero Two - Darling in the FranXX 1/7 Scale',
 N'Mô hình Zero Two với bộ pilot suit đỏ đặc trưng, tỷ lệ 1/7, cao 26cm. Phiên bản giới hạn.',
 'zero-two-1-7', 'active', GETDATE()),

(1004, 101, 3, N'Rem - Re:Zero 1/7 Scale Wedding Ver.',
 N'Mô hình Rem trong váy cưới trắng tinh khôi, tỷ lệ 1/7, cao 23cm. Limited edition.',
 'rem-wedding-1-7', 'active', GETDATE()),

(1005, 101, 4, N'Yor Forger - Spy x Family 1/7 Scale Thorn Princess',
 N'Mô hình Yor Forger trong trang phục Thorn Princess, tỷ lệ 1/7, cao 27cm. Action pose ấn tượng.',
 'yor-forger-thorn-1-7', 'active', GETDATE()),

-- ==================== CATEGORY: NENDOROID (102) ====================

(1006, 102, 1, N'Nendoroid Chainsaw Man - Denji',
 N'Nendoroid Denji từ Chainsaw Man, chibi style, cao 10cm. Đi kèm nhiều phụ kiện thay thế.',
 'nendoroid-denji', 'active', GETDATE()),

(1007, 102, 1, N'Nendoroid Frieren - Sousou no Frieren',
 N'Nendoroid Frieren phù thủy tiên, cao 10cm. Bao gồm phép thuật effect và sách cổ.',
 'nendoroid-frieren', 'active', GETDATE()),

(1008, 102, 1, N'Nendoroid Anya Forger - Spy x Family',
 N'Nendoroid Anya với biểu cảm hài hước, cao 10cm. Phiên bản smug face đặc biệt.',
 'nendoroid-anya', 'active', GETDATE()),

(1009, 102, 1, N'Nendoroid Makima - Chainsaw Man',
 N'Nendoroid Makima với cái nhìn lạnh lùng, cao 10cm. Control Devil form.',
 'nendoroid-makima', 'active', GETDATE()),

(1010, 102, 1, N'Nendoroid Power - Chainsaw Man',
 N'Nendoroid Power với sừng quỷ, cao 10cm. Blood Fiend version.',
 'nendoroid-power', 'active', GETDATE()),

-- ==================== CATEGORY: FIGMA (103) ====================

(1011, 103, 1, N'Figma Shinobu Kocho - Demon Slayer',
 N'Figma Shinobu Kocho với katana côn trùng, cao 14cm. Hơn 30 điểm khớp linh hoạt.',
 'figma-shinobu', 'active', GETDATE()),

(1012, 103, 1, N'Figma Levi Ackerman - Attack on Titan',
 N'Figma Levi với ODM Gear, cao 13cm. Humanity strongest soldier.',
 'figma-levi', 'active', GETDATE()),

(1013, 103, 1, N'Figma Tanjiro Kamado - Demon Slayer',
 N'Figma Tanjiro với Nichirin Blade, cao 15cm. Water Breathing effect parts.',
 'figma-tanjiro', 'active', GETDATE()),

(1014, 103, 2, N'Figma Nezuko Kamado - Demon Slayer',
 N'Figma Nezuko dạng chiến đấu & dạng mini, cao 14cm. Bamboo muzzle included.',
 'figma-nezuko', 'active', GETDATE()),

(1015, 103, 1, N'Figma Mikasa Ackerman - Attack on Titan',
 N'Figma Mikasa với scarf đỏ, cao 14cm. Full ODM Gear set.',
 'figma-mikasa', 'active', GETDATE()),

-- ==================== CATEGORY: POP UP PARADE (104) ====================

(1016, 104, 1, N'Pop Up Parade Fern - Sousou no Frieren',
 N'Pop Up Parade Fern học trò của Frieren, cao 17cm. Trang phục mage tím.',
 'popup-fern', 'active', GETDATE()),

(1017, 104, 1, N'Pop Up Parade Himmel - Sousou no Frieren',
 N'Pop Up Parade Himmel anh hùng, cao 18cm. Trang phục hiệp sĩ.',
 'popup-himmel', 'active', GETDATE()),

(1018, 104, 1, N'Pop Up Parade Bocchi - Bocchi the Rock',
 N'Pop Up Parade Hitori Gotoh với guitar, cao 17cm. Anxious expression.',
 'popup-bocchi', 'active', GETDATE()),

(1019, 104, 1, N'Pop Up Parade Chisato Nishikigi - Lycoris Recoil',
 N'Pop Up Parade Chisato với DA uniform, cao 17cm. Smile ver.',
 'popup-chisato', 'active', GETDATE()),

(1020, 104, 1, N'Pop Up Parade Takina Inoue - Lycoris Recoil',
 N'Pop Up Parade Takina với DA uniform, cao 17cm. Combat pose.',
 'popup-takina', 'active', GETDATE());

SET IDENTITY_INSERT [dbo].[products] OFF
GO

-- ================================================================
-- 5. INSERT PRODUCT VARIANTS (Mỗi sản phẩm có 2-3 variants)
-- ================================================================
SET IDENTITY_INSERT [dbo].[product_variants] ON
GO

-- Xóa variants cũ
DELETE FROM product_variants WHERE id >= 2001;

-- =============== GOJO SATORU (Product 1001) ===============
INSERT INTO [dbo].[product_variants] ([id], [product_id], [name], [sku], [price], [original_price], [image_url], [created_at])
VALUES 
(2001, 1001, N'Standard Edition', 'GOJO-STD-001', 2450000, 2800000, '/uploads/products/gojo-satoru-standard.jpg', GETDATE()),
(2002, 1001, N'Deluxe Edition (LED Base)', 'GOJO-DLX-001', 3200000, 3500000, '/uploads/products/gojo-satoru-deluxe.jpg', GETDATE()),
(2003, 1001, N'Limited Edition (Hollow Purple)', 'GOJO-LTD-001', 4500000, NULL, '/uploads/products/gojo-satoru-limited.jpg', GETDATE()),

-- =============== MARIN KITAGAWA (Product 1002) ===============
(2004, 1002, N'School Uniform Ver.', 'MARIN-SCH-001', 1980000, 2200000, '/uploads/products/marin-school.jpg', GETDATE()),
(2005, 1002, N'Cosplay Ver. (Shizuku-tan)', 'MARIN-COS-001', 2350000, NULL, '/uploads/products/marin-cosplay.jpg', GETDATE()),

-- =============== ZERO TWO (Product 1003) ===============
(2006, 1003, N'Pilot Suit Ver.', 'ZERO2-PIL-001', 2680000, 3000000, '/uploads/products/zerotwo-pilot.jpg', GETDATE()),
(2007, 1003, N'White Dress Ver.', 'ZERO2-DRS-001', 2850000, NULL, '/uploads/products/zerotwo-dress.jpg', GETDATE()),

-- =============== REM WEDDING (Product 1004) ===============
(2008, 1004, N'Crystal Dress Ver.', 'REM-WED-001', 3150000, 3500000, '/uploads/products/rem-wedding-crystal.jpg', GETDATE()),
(2009, 1004, N'Premium Box Set', 'REM-WED-002', 4200000, NULL, '/uploads/products/rem-wedding-premium.jpg', GETDATE()),

-- =============== YOR FORGER (Product 1005) ===============
(2010, 1005, N'Thorn Princess Ver.', 'YOR-THN-001', 2750000, 3100000, '/uploads/products/yor-thorn.jpg', GETDATE()),
(2011, 1005, N'Elegant Dress Ver.', 'YOR-DRS-001', 2450000, NULL, '/uploads/products/yor-dress.jpg', GETDATE()),

-- =============== NENDOROID DENJI (Product 1006) ===============
(2012, 1006, N'Standard Ver.', 'NENDO-DENJI-001', 890000, 1050000, '/uploads/products/nendo-denji.jpg', GETDATE()),
(2013, 1006, N'Chainsaw Head Ver.', 'NENDO-DENJI-002', 980000, NULL, '/uploads/products/nendo-denji-csm.jpg', GETDATE()),

-- =============== NENDOROID FRIEREN (Product 1007) ===============
(2014, 1007, N'Standard Ver.', 'NENDO-FRIE-001', 920000, 1100000, '/uploads/products/nendo-frieren.jpg', GETDATE()),
(2015, 1007, N'Magic Casting Ver.', 'NENDO-FRIE-002', 1050000, NULL, '/uploads/products/nendo-frieren-magic.jpg', GETDATE()),

-- =============== NENDOROID ANYA (Product 1008) ===============
(2016, 1008, N'Smug Face Ver.', 'NENDO-ANYA-001', 850000, 950000, '/uploads/products/nendo-anya-smug.jpg', GETDATE()),
(2017, 1008, N'School Uniform Ver.', 'NENDO-ANYA-002', 890000, NULL, '/uploads/products/nendo-anya-school.jpg', GETDATE()),

-- =============== NENDOROID MAKIMA (Product 1009) ===============
(2018, 1009, N'Control Devil Ver.', 'NENDO-MAKI-001', 920000, 1050000, '/uploads/products/nendo-makima.jpg', GETDATE()),

-- =============== NENDOROID POWER (Product 1010) ===============
(2019, 1010, N'Blood Fiend Ver.', 'NENDO-POWE-001', 890000, 1000000, '/uploads/products/nendo-power.jpg', GETDATE()),

-- =============== FIGMA SHINOBU (Product 1011) ===============
(2020, 1011, N'Standard Ver.', 'FIG-SHIN-001', 1450000, 1650000, '/uploads/products/figma-shinobu.jpg', GETDATE()),

-- =============== FIGMA LEVI (Product 1012) ===============
(2021, 1012, N'Final Season Ver.', 'FIG-LEVI-001', 1580000, 1800000, '/uploads/products/figma-levi.jpg', GETDATE()),
(2022, 1012, N'Cleaning Ver.', 'FIG-LEVI-002', 1350000, NULL, '/uploads/products/figma-levi-clean.jpg', GETDATE()),

-- =============== FIGMA TANJIRO (Product 1013) ===============
(2023, 1013, N'Water Breathing Ver.', 'FIG-TANJ-001', 1480000, 1700000, '/uploads/products/figma-tanjiro.jpg', GETDATE()),

-- =============== FIGMA NEZUKO (Product 1014) ===============
(2024, 1014, N'Demon Form Ver.', 'FIG-NEZU-001', 1520000, 1750000, '/uploads/products/figma-nezuko.jpg', GETDATE()),
(2025, 1014, N'Sleeping Box Ver.', 'FIG-NEZU-002', 1280000, NULL, '/uploads/products/figma-nezuko-box.jpg', GETDATE()),

-- =============== FIGMA MIKASA (Product 1015) ===============
(2026, 1015, N'ODM Gear Ver.', 'FIG-MIKA-001', 1550000, 1800000, '/uploads/products/figma-mikasa.jpg', GETDATE()),

-- =============== POP UP PARADE FERN (Product 1016) ===============
(2027, 1016, N'Mage Ver.', 'POP-FERN-001', 680000, 780000, '/uploads/products/popup-fern.jpg', GETDATE()),

-- =============== POP UP PARADE HIMMEL (Product 1017) ===============
(2028, 1017, N'Hero Ver.', 'POP-HIMM-001', 720000, 850000, '/uploads/products/popup-himmel.jpg', GETDATE()),

-- =============== POP UP PARADE BOCCHI (Product 1018) ===============
(2029, 1018, N'Guitar Ver.', 'POP-BOCC-001', 650000, 750000, '/uploads/products/popup-bocchi.jpg', GETDATE()),
(2030, 1018, N'Cardboard Box Ver.', 'POP-BOCC-002', 720000, NULL, '/uploads/products/popup-bocchi-box.jpg', GETDATE()),

-- =============== POP UP PARADE CHISATO (Product 1019) ===============
(2031, 1019, N'DA Uniform Ver.', 'POP-CHIS-001', 680000, 780000, '/uploads/products/popup-chisato.jpg', GETDATE()),

-- =============== POP UP PARADE TAKINA (Product 1020) ===============
(2032, 1020, N'DA Uniform Ver.', 'POP-TAKI-001', 680000, 780000, '/uploads/products/popup-takina.jpg', GETDATE());

SET IDENTITY_INSERT [dbo].[product_variants] OFF
GO

-- ================================================================
-- 6. INSERT INVENTORIES (Kho hàng cho mỗi variant)
-- ================================================================
-- Giả sử warehouse_id = 1 là kho chính
DECLARE @warehouse_id BIGINT = 1;

-- Chèn inventory cho tất cả variants (số lượng ngẫu nhiên 10-50)
INSERT INTO [dbo].[inventories] ([warehouse_id], [product_variant_id], [quantity_on_hand], [quantity_reserved], [reorder_level], [created_at])
SELECT 
    @warehouse_id,
    pv.id,
    ABS(CHECKSUM(NEWID())) % 41 + 10, -- Random 10-50
    0,
    5,
    GETDATE()
FROM product_variants pv
WHERE pv.id >= 2001 AND pv.id <= 2032
AND NOT EXISTS (SELECT 1 FROM inventories i WHERE i.product_variant_id = pv.id AND i.warehouse_id = @warehouse_id);
GO

-- ================================================================
-- 7. KIỂM TRA KẾT QUẢ
-- ================================================================
SELECT 'Categories' as [Table], COUNT(*) as [Count] FROM categories WHERE id IN (101,102,103,104)
UNION ALL
SELECT 'Products', COUNT(*) FROM products WHERE id >= 1001
UNION ALL
SELECT 'Variants', COUNT(*) FROM product_variants WHERE id >= 2001
UNION ALL
SELECT 'Inventories', COUNT(*) FROM inventories WHERE product_variant_id >= 2001;
GO

-- Hiển thị sản phẩm đã tạo
SELECT 
    c.name as Category,
    p.name as Product,
    pv.name as Variant,
    pv.sku,
    pv.price,
    pv.original_price,
    pv.image_url
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN product_variants pv ON pv.product_id = p.id
WHERE p.id >= 1001
ORDER BY c.id, p.id, pv.id;
GO

PRINT '✅ Script hoàn thành! Đã tạo 4 categories, 20 products và 32 variants.'
GO
