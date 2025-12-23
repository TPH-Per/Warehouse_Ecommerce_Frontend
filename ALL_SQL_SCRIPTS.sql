-- ================================================================
-- 🎌 PERW SHOP - TỔNG HỢP TẤT CẢ SQL SCRIPTS
-- Chạy file này để setup đầy đủ dữ liệu mẫu
-- Ngày tạo: 2025-12-23
-- ================================================================

USE [perw]
GO

PRINT '=========================================='
PRINT '🚀 BẮT ĐẦU SETUP DỮ LIỆU PERW SHOP'
PRINT '=========================================='
PRINT ''

-- ================================================================
-- PHẦN 1: SUPPLIERS (NHÀ CUNG CẤP)
-- ================================================================
PRINT '📦 PHẦN 1: Tạo nhà cung cấp...'

SET IDENTITY_INSERT [dbo].[suppliers] ON
GO

-- Xóa và tạo lại suppliers
DELETE FROM suppliers WHERE id IN (1, 2, 3, 4, 5, 6);

INSERT INTO [dbo].[suppliers] ([id], [name], [contact_info], [created_at], [updated_at])
VALUES 
(1, N'Good Smile Company', N'Email: info@goodsmile.info | Web: goodsmile.info', GETDATE(), GETDATE()),
(2, N'Bandai Spirits', N'Email: support@bandai.co.jp | Web: bandai-spirits.co.jp', GETDATE(), GETDATE()),
(3, N'Kotobukiya', N'Email: webmaster@kotobukiya.co.jp | Web: kotobukiya.co.jp', GETDATE(), GETDATE()),
(4, N'MegaHouse', N'Email: info@megahouse.co.jp | Web: megahobby.jp', GETDATE(), GETDATE()),
(5, N'Alter', N'Email: info@alter-web.jp | Web: alter-web.jp', GETDATE(), GETDATE()),
(6, N'Max Factory', N'Email: info@maxfactory.jp | Web: maxfactory.jp', GETDATE(), GETDATE());

SET IDENTITY_INSERT [dbo].[suppliers] OFF
GO

PRINT '✅ Đã tạo 6 nhà cung cấp'
PRINT ''

-- ================================================================
-- PHẦN 2: CATEGORIES (DANH MỤC)
-- ================================================================
PRINT '📦 PHẦN 2: Tạo danh mục...'

SET IDENTITY_INSERT [dbo].[categories] ON
GO

-- Xóa categories test cũ nếu có
DELETE FROM categories WHERE id IN (101, 102, 103, 104) OR name LIKE '%Cat_Test%';

INSERT INTO [dbo].[categories] ([id], [name], [slug], [created_at], [updated_at])
VALUES 
    (101, N'Scale Figure', 'scale-figure', GETDATE(), GETDATE()),
    (102, N'Nendoroid', 'nendoroid', GETDATE(), GETDATE()),
    (103, N'Figma', 'figma', GETDATE(), GETDATE()),
    (104, N'Pop Up Parade', 'pop-up-parade', GETDATE(), GETDATE());

SET IDENTITY_INSERT [dbo].[categories] OFF
GO

PRINT '✅ Đã tạo 4 danh mục'
PRINT ''

-- ================================================================
-- PHẦN 3: PRODUCTS (SẢN PHẨM)
-- ================================================================
PRINT '📦 PHẦN 3: Tạo sản phẩm...'

SET IDENTITY_INSERT [dbo].[products] ON
GO

-- Xóa products cũ nếu có
DELETE FROM product_variants WHERE product_id >= 1001;
DELETE FROM products WHERE id >= 1001;

-- SCALE FIGURE (Category 101)
INSERT INTO [dbo].[products] ([id], [category_id], [supplier_id], [name], [description], [slug], [status], [created_at])
VALUES 
(1001, 101, 5, N'Gojo Satoru - Jujutsu Kaisen 1/7 Scale', N'Mô hình Gojo Satoru từ anime Jujutsu Kaisen, tỷ lệ 1/7, cao 25cm.', 'gojo-satoru-jjk-1-7', 'active', GETDATE()),
(1002, 101, 6, N'Marin Kitagawa - My Dress-Up Darling 1/7 Scale', N'Mô hình Marin Kitagawa trong bộ đồng phục học sinh, tỷ lệ 1/7, cao 24cm.', 'marin-kitagawa-1-7', 'active', GETDATE()),
(1003, 101, 2, N'Zero Two - Darling in the FranXX 1/7 Scale', N'Mô hình Zero Two với bộ pilot suit đỏ đặc trưng, tỷ lệ 1/7, cao 26cm.', 'zero-two-1-7', 'active', GETDATE()),
(1004, 101, 3, N'Rem - Re:Zero 1/7 Scale Wedding Ver.', N'Mô hình Rem trong váy cưới trắng tinh khôi, tỷ lệ 1/7, cao 23cm.', 'rem-wedding-1-7', 'active', GETDATE()),
(1005, 101, 4, N'Yor Forger - Spy x Family 1/7 Scale Thorn Princess', N'Mô hình Yor Forger trong trang phục Thorn Princess, tỷ lệ 1/7, cao 27cm.', 'yor-forger-thorn-1-7', 'active', GETDATE()),

-- NENDOROID (Category 102)
(1006, 102, 1, N'Nendoroid Chainsaw Man - Denji', N'Nendoroid Denji từ Chainsaw Man, chibi style, cao 10cm.', 'nendoroid-denji', 'active', GETDATE()),
(1007, 102, 1, N'Nendoroid Frieren - Sousou no Frieren', N'Nendoroid Frieren phù thủy tiên, cao 10cm.', 'nendoroid-frieren', 'active', GETDATE()),
(1008, 102, 1, N'Nendoroid Anya Forger - Spy x Family', N'Nendoroid Anya với biểu cảm hài hước, cao 10cm.', 'nendoroid-anya', 'active', GETDATE()),
(1009, 102, 1, N'Nendoroid Makima - Chainsaw Man', N'Nendoroid Makima với cái nhìn lạnh lùng, cao 10cm.', 'nendoroid-makima', 'active', GETDATE()),
(1010, 102, 1, N'Nendoroid Power - Chainsaw Man', N'Nendoroid Power với sừng quỷ, cao 10cm.', 'nendoroid-power', 'active', GETDATE()),

-- FIGMA (Category 103)
(1011, 103, 1, N'Figma Shinobu Kocho - Demon Slayer', N'Figma Shinobu Kocho với katana côn trùng, cao 14cm.', 'figma-shinobu', 'active', GETDATE()),
(1012, 103, 1, N'Figma Levi Ackerman - Attack on Titan', N'Figma Levi với ODM Gear, cao 13cm.', 'figma-levi', 'active', GETDATE()),
(1013, 103, 1, N'Figma Tanjiro Kamado - Demon Slayer', N'Figma Tanjiro với Nichirin Blade, cao 15cm.', 'figma-tanjiro', 'active', GETDATE()),
(1014, 103, 2, N'Figma Nezuko Kamado - Demon Slayer', N'Figma Nezuko dạng chiến đấu & dạng mini, cao 14cm.', 'figma-nezuko', 'active', GETDATE()),
(1015, 103, 1, N'Figma Mikasa Ackerman - Attack on Titan', N'Figma Mikasa với scarf đỏ, cao 14cm.', 'figma-mikasa', 'active', GETDATE()),

-- POP UP PARADE (Category 104)
(1016, 104, 1, N'Pop Up Parade Fern - Sousou no Frieren', N'Pop Up Parade Fern học trò của Frieren, cao 17cm.', 'popup-fern', 'active', GETDATE()),
(1017, 104, 1, N'Pop Up Parade Himmel - Sousou no Frieren', N'Pop Up Parade Himmel anh hùng, cao 18cm.', 'popup-himmel', 'active', GETDATE()),
(1018, 104, 1, N'Pop Up Parade Bocchi - Bocchi the Rock', N'Pop Up Parade Hitori Gotoh với guitar, cao 17cm.', 'popup-bocchi', 'active', GETDATE()),
(1019, 104, 1, N'Pop Up Parade Chisato Nishikigi - Lycoris Recoil', N'Pop Up Parade Chisato với DA uniform, cao 17cm.', 'popup-chisato', 'active', GETDATE()),
(1020, 104, 1, N'Pop Up Parade Takina Inoue - Lycoris Recoil', N'Pop Up Parade Takina với DA uniform, cao 17cm.', 'popup-takina', 'active', GETDATE());

SET IDENTITY_INSERT [dbo].[products] OFF
GO

PRINT '✅ Đã tạo 20 sản phẩm'
PRINT ''

-- ================================================================
-- PHẦN 4: PRODUCT VARIANTS (BIẾN THỂ SẢN PHẨM)
-- ================================================================
PRINT '📦 PHẦN 4: Tạo biến thể sản phẩm...'

SET IDENTITY_INSERT [dbo].[product_variants] ON
GO

INSERT INTO [dbo].[product_variants] ([id], [product_id], [name], [sku], [price], [original_price], [image_url], [created_at])
VALUES 
-- GOJO SATORU (1001)
(2001, 1001, N'Standard Edition', 'GOJO-STD-001', 2450000, 2800000, '/wwwroot/uploads/products/gojo-satoru-standard.jpg', GETDATE()),
(2002, 1001, N'Deluxe Edition (LED Base)', 'GOJO-DLX-001', 3200000, 3500000, '/wwwroot/uploads/products/gojo-satoru-deluxe.jpg', GETDATE()),
(2003, 1001, N'Limited Edition (Hollow Purple)', 'GOJO-LTD-001', 4500000, NULL, '/wwwroot/uploads/products/gojo-satoru-limited.jpg', GETDATE()),

-- MARIN KITAGAWA (1002)
(2004, 1002, N'School Uniform Ver.', 'MARIN-SCH-001', 1980000, 2200000, '/wwwroot/uploads/products/marin-school.jpg', GETDATE()),
(2005, 1002, N'Cosplay Ver. (Shizuku-tan)', 'MARIN-COS-001', 2350000, NULL, '/wwwroot/uploads/products/marin-cosplay.jpg', GETDATE()),

-- ZERO TWO (1003)
(2006, 1003, N'Pilot Suit Ver.', 'ZERO2-PIL-001', 2680000, 3000000, '/wwwroot/uploads/products/zerotwo-pilot.jpg', GETDATE()),
(2007, 1003, N'White Dress Ver.', 'ZERO2-DRS-001', 2850000, NULL, '/wwwroot/uploads/products/zerotwo-dress.jpg', GETDATE()),

-- REM WEDDING (1004)
(2008, 1004, N'Crystal Dress Ver.', 'REM-WED-001', 3150000, 3500000, '/wwwroot/uploads/products/rem-wedding-crystal.jpg', GETDATE()),
(2009, 1004, N'Premium Box Set', 'REM-WED-002', 4200000, NULL, '/wwwroot/uploads/products/rem-wedding-premium.jpg', GETDATE()),

-- YOR FORGER (1005)
(2010, 1005, N'Thorn Princess Ver.', 'YOR-THN-001', 2750000, 3100000, '/wwwroot/uploads/products/yor-thorn.jpg', GETDATE()),
(2011, 1005, N'Elegant Dress Ver.', 'YOR-DRS-001', 2450000, NULL, '/wwwroot/uploads/products/yor-dress.jpg', GETDATE()),

-- NENDOROID DENJI (1006)
(2012, 1006, N'Standard Ver.', 'NENDO-DENJI-001', 890000, 1050000, '/wwwroot/uploads/products/nendo-denji.jpg', GETDATE()),
(2013, 1006, N'Chainsaw Head Ver.', 'NENDO-DENJI-002', 980000, NULL, '/wwwroot/uploads/products/nendo-denji-csm.jpg', GETDATE()),

-- NENDOROID FRIEREN (1007)
(2014, 1007, N'Standard Ver.', 'NENDO-FRIE-001', 920000, 1100000, '/wwwroot/uploads/products/nendo-frieren.jpg', GETDATE()),
(2015, 1007, N'Magic Casting Ver.', 'NENDO-FRIE-002', 1050000, NULL, '/wwwroot/uploads/products/nendo-frieren-magic.jpg', GETDATE()),

-- NENDOROID ANYA (1008)
(2016, 1008, N'Smug Face Ver.', 'NENDO-ANYA-001', 850000, 950000, '/wwwroot/uploads/products/nendo-anya-smug.jpg', GETDATE()),
(2017, 1008, N'School Uniform Ver.', 'NENDO-ANYA-002', 890000, NULL, '/wwwroot/uploads/products/nendo-anya-school.jpg', GETDATE()),

-- NENDOROID MAKIMA (1009)
(2018, 1009, N'Control Devil Ver.', 'NENDO-MAKI-001', 920000, 1050000, '/wwwroot/uploads/products/nendo-makima.jpg', GETDATE()),

-- NENDOROID POWER (1010)
(2019, 1010, N'Blood Fiend Ver.', 'NENDO-POWE-001', 890000, 1000000, '/wwwroot/uploads/products/nendo-power.jpg', GETDATE()),

-- FIGMA SHINOBU (1011)
(2020, 1011, N'Standard Ver.', 'FIG-SHIN-001', 1450000, 1650000, '/wwwroot/uploads/products/figma-shinobu.jpg', GETDATE()),

-- FIGMA LEVI (1012)
(2021, 1012, N'Final Season Ver.', 'FIG-LEVI-001', 1580000, 1800000, '/wwwroot/uploads/products/figma-levi.jpg', GETDATE()),
(2022, 1012, N'Cleaning Ver.', 'FIG-LEVI-002', 1350000, NULL, '/wwwroot/uploads/products/figma-levi-clean.jpg', GETDATE()),

-- FIGMA TANJIRO (1013)
(2023, 1013, N'Water Breathing Ver.', 'FIG-TANJ-001', 1480000, 1700000, '/wwwroot/uploads/products/figma-tanjiro.jpg', GETDATE()),

-- FIGMA NEZUKO (1014)
(2024, 1014, N'Demon Form Ver.', 'FIG-NEZU-001', 1520000, 1750000, '/wwwroot/uploads/products/figma-nezuko.jpg', GETDATE()),
(2025, 1014, N'Sleeping Box Ver.', 'FIG-NEZU-002', 1280000, NULL, '/wwwroot/uploads/products/figma-nezuko-box.jpg', GETDATE()),

-- FIGMA MIKASA (1015)
(2026, 1015, N'ODM Gear Ver.', 'FIG-MIKA-001', 1550000, 1800000, '/wwwroot/uploads/products/figma-mikasa.jpg', GETDATE()),

-- POP UP PARADE FERN (1016)
(2027, 1016, N'Mage Ver.', 'POP-FERN-001', 680000, 780000, '/wwwroot/uploads/products/popup-fern.jpg', GETDATE()),

-- POP UP PARADE HIMMEL (1017)
(2028, 1017, N'Hero Ver.', 'POP-HIMM-001', 720000, 850000, '/wwwroot/uploads/products/popup-himmel.jpg', GETDATE()),

-- POP UP PARADE BOCCHI (1018)
(2029, 1018, N'Guitar Ver.', 'POP-BOCC-001', 650000, 750000, '/wwwroot/uploads/products/popup-bocchi.jpg', GETDATE()),
(2030, 1018, N'Cardboard Box Ver.', 'POP-BOCC-002', 720000, NULL, '/wwwroot/uploads/products/popup-bocchi-box.jpg', GETDATE()),

-- POP UP PARADE CHISATO (1019)
(2031, 1019, N'DA Uniform Ver.', 'POP-CHIS-001', 680000, 780000, '/wwwroot/uploads/products/popup-chisato.jpg', GETDATE()),

-- POP UP PARADE TAKINA (1020)
(2032, 1020, N'DA Uniform Ver.', 'POP-TAKI-001', 680000, 780000, '/wwwroot/uploads/products/popup-takina.jpg', GETDATE());

SET IDENTITY_INSERT [dbo].[product_variants] OFF
GO

PRINT '✅ Đã tạo 32 biến thể sản phẩm'
PRINT ''

-- ================================================================
-- PHẦN 5: BRANCHES (CHI NHÁNH)
-- ================================================================
PRINT '📦 PHẦN 5: Tạo chi nhánh...'

IF NOT EXISTS (SELECT 1 FROM branches WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT [dbo].[branches] ON
    INSERT INTO [dbo].[branches] ([id], [name], [warehouse_id], [location], [created_at])
    VALUES (1, N'PerW Shop - Quận 1', 1, N'123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', GETDATE())
    SET IDENTITY_INSERT [dbo].[branches] OFF
END

IF NOT EXISTS (SELECT 1 FROM branches WHERE id = 2)
BEGIN
    SET IDENTITY_INSERT [dbo].[branches] ON
    INSERT INTO [dbo].[branches] ([id], [name], [warehouse_id], [location], [created_at])
    VALUES (2, N'PerW Shop - Quận 3', 1, N'456 Võ Văn Tần, Phường 5, Quận 3, TP.HCM', GETDATE())
    SET IDENTITY_INSERT [dbo].[branches] OFF
END

IF NOT EXISTS (SELECT 1 FROM branches WHERE id = 3)
BEGIN
    SET IDENTITY_INSERT [dbo].[branches] ON
    INSERT INTO [dbo].[branches] ([id], [name], [warehouse_id], [location], [created_at])
    VALUES (3, N'PerW Shop - Thủ Đức', 1, N'789 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức', GETDATE())
    SET IDENTITY_INSERT [dbo].[branches] OFF
END
GO

PRINT '✅ Đã tạo 3 chi nhánh'
PRINT ''

-- ================================================================
-- PHẦN 6: BRANCH INVENTORIES (KHO CHI NHÁNH)
-- ================================================================
PRINT '📦 PHẦN 6: Nhập kho chi nhánh...'

-- Chi nhánh 1: Quận 1 (100% sản phẩm)
INSERT INTO [dbo].[branch_inventories] 
    ([branch_id], [product_variant_id], [quantity_on_hand], [quantity_reserved], [reorder_level], [created_at])
SELECT 1, pv.id, ABS(CHECKSUM(NEWID())) % 21 + 10, 0, 5, GETDATE()
FROM product_variants pv
WHERE pv.id >= 2001 AND pv.id <= 2032
AND NOT EXISTS (SELECT 1 FROM branch_inventories bi WHERE bi.branch_id = 1 AND bi.product_variant_id = pv.id);

-- Chi nhánh 2: Quận 3 (70% sản phẩm)
INSERT INTO [dbo].[branch_inventories] 
    ([branch_id], [product_variant_id], [quantity_on_hand], [quantity_reserved], [reorder_level], [created_at])
SELECT 2, pv.id, ABS(CHECKSUM(NEWID())) % 16 + 5, 0, 3, GETDATE()
FROM product_variants pv
WHERE pv.id >= 2001 AND pv.id <= 2032 AND pv.id % 10 != 3
AND NOT EXISTS (SELECT 1 FROM branch_inventories bi WHERE bi.branch_id = 2 AND bi.product_variant_id = pv.id);

-- Chi nhánh 3: Thủ Đức (50% sản phẩm)
INSERT INTO [dbo].[branch_inventories] 
    ([branch_id], [product_variant_id], [quantity_on_hand], [quantity_reserved], [reorder_level], [created_at])
SELECT 3, pv.id, ABS(CHECKSUM(NEWID())) % 11 + 3, 0, 2, GETDATE()
FROM product_variants pv
WHERE pv.id >= 2001 AND pv.id <= 2032 AND pv.id % 2 = 0
AND NOT EXISTS (SELECT 1 FROM branch_inventories bi WHERE bi.branch_id = 3 AND bi.product_variant_id = pv.id);

PRINT '✅ Đã nhập kho cho 3 chi nhánh'
PRINT ''

-- ================================================================
-- PHẦN 7: INVENTORIES (KHO CHÍNH)
-- ================================================================
PRINT '📦 PHẦN 7: Nhập kho chính...'

DECLARE @warehouse_id BIGINT = 1;

INSERT INTO [dbo].[inventories] ([warehouse_id], [product_variant_id], [quantity_on_hand], [quantity_reserved], [reorder_level], [created_at])
SELECT @warehouse_id, pv.id, ABS(CHECKSUM(NEWID())) % 41 + 10, 0, 5, GETDATE()
FROM product_variants pv
WHERE pv.id >= 2001 AND pv.id <= 2032
AND NOT EXISTS (SELECT 1 FROM inventories i WHERE i.product_variant_id = pv.id AND i.warehouse_id = @warehouse_id);

PRINT '✅ Đã nhập kho chính'
PRINT ''

-- ================================================================
-- PHẦN 8: PAYMENT METHODS (PHƯƠNG THỨC THANH TOÁN)
-- ================================================================
PRINT '📦 PHẦN 8: Tạo phương thức thanh toán...'

DELETE FROM payment_methods WHERE code IN ('COD', 'BANK_TRANSFER');

SET IDENTITY_INSERT [dbo].[payment_methods] ON

INSERT INTO [dbo].[payment_methods] ([id], [name], [code], [is_active], [created_at])
VALUES 
(1, N'Thanh toán khi nhận hàng (COD)', 'COD', 1, GETDATE()),
(2, N'Chuyển khoản ngân hàng', 'BANK_TRANSFER', 1, GETDATE());

SET IDENTITY_INSERT [dbo].[payment_methods] OFF
GO

PRINT '✅ Đã tạo 2 phương thức thanh toán'
PRINT ''

-- ================================================================
-- PHẦN 9: KIỂM TRA KẾT QUẢ
-- ================================================================
PRINT '=========================================='
PRINT '📊 KẾT QUẢ SETUP:'
PRINT '=========================================='

SELECT 'Suppliers' as [Table], COUNT(*) as [Count] FROM suppliers WHERE id <= 6
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories WHERE id IN (101,102,103,104)
UNION ALL
SELECT 'Products', COUNT(*) FROM products WHERE id >= 1001
UNION ALL
SELECT 'Variants', COUNT(*) FROM product_variants WHERE id >= 2001
UNION ALL
SELECT 'Branches', COUNT(*) FROM branches WHERE id IN (1,2,3)
UNION ALL
SELECT 'Branch_Inventories', COUNT(*) FROM branch_inventories WHERE product_variant_id >= 2001
UNION ALL
SELECT 'Inventories', COUNT(*) FROM inventories WHERE product_variant_id >= 2001
UNION ALL
SELECT 'Payment_Methods', COUNT(*) FROM payment_methods WHERE code IN ('COD', 'BANK_TRANSFER');

PRINT ''
PRINT '=========================================='
PRINT '✅ SETUP HOÀN TẤT!'
PRINT '=========================================='
PRINT ''
PRINT 'Tiếp theo:'
PRINT '1. Copy 32 ảnh vào wwwroot/uploads/products/'
PRINT '2. Xem IMAGE_LIST_PRODUCTS.txt để biết tên file cần copy'
PRINT '3. Rebuild và test frontend'
GO
