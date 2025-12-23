-- ================================================================
-- 🏪 WIBU SHOP - SCRIPT NHẬP KHO CHI NHÁNH (BRANCH INVENTORIES)
-- Chạy sau khi đã chạy SEED_DATA_ANIME_FIGURES.sql
-- ================================================================

USE [perw]
GO

-- ================================================================
-- 1. KIỂM TRA VÀ TẠO BRANCHES (NẾU CHƯA CÓ)
-- ================================================================
PRINT '📍 Kiểm tra và tạo branches...'

-- Tạo branches mẫu nếu chưa có
IF NOT EXISTS (SELECT 1 FROM branches WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT [dbo].[branches] ON
    INSERT INTO [dbo].[branches] ([id], [name], [warehouse_id], [location], [created_at])
    VALUES (1, N'WibuShop - Quận 1', 1, N'123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', GETDATE())
    SET IDENTITY_INSERT [dbo].[branches] OFF
    PRINT '✅ Đã tạo Branch 1: Quận 1'
END

IF NOT EXISTS (SELECT 1 FROM branches WHERE id = 2)
BEGIN
    SET IDENTITY_INSERT [dbo].[branches] ON
    INSERT INTO [dbo].[branches] ([id], [name], [warehouse_id], [location], [created_at])
    VALUES (2, N'WibuShop - Quận 3', 1, N'456 Võ Văn Tần, Phường 5, Quận 3, TP.HCM', GETDATE())
    SET IDENTITY_INSERT [dbo].[branches] OFF
    PRINT '✅ Đã tạo Branch 2: Quận 3'
END

IF NOT EXISTS (SELECT 1 FROM branches WHERE id = 3)
BEGIN
    SET IDENTITY_INSERT [dbo].[branches] ON
    INSERT INTO [dbo].[branches] ([id], [name], [warehouse_id], [location], [created_at])
    VALUES (3, N'WibuShop - Thủ Đức', 1, N'789 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức', GETDATE())
    SET IDENTITY_INSERT [dbo].[branches] OFF
    PRINT '✅ Đã tạo Branch 3: Thủ Đức'
END

GO

-- ================================================================
-- 2. XÓA BRANCH_INVENTORIES CŨ (TÙY CHỌN)
-- ================================================================
-- Bỏ comment nếu muốn xóa dữ liệu cũ
/*
DELETE FROM branch_inventories WHERE product_variant_id >= 2001;
PRINT '🗑️ Đã xóa branch_inventories cũ'
*/
GO

-- ================================================================
-- 3. INSERT BRANCH INVENTORIES
-- Thêm tồn kho cho mỗi chi nhánh
-- ================================================================
PRINT '📦 Đang nhập kho chi nhánh...'

-- Biến để lưu số lượng đã insert
DECLARE @inserted INT = 0;

-- Chi nhánh 1: Quận 1 (Có tất cả sản phẩm, số lượng cao)
INSERT INTO [dbo].[branch_inventories] 
    ([branch_id], [product_variant_id], [quantity_on_hand], [quantity_reserved], [reorder_level], [created_at], [updated_at])
SELECT 
    1 AS branch_id,
    pv.id AS product_variant_id,
    ABS(CHECKSUM(NEWID())) % 21 + 10 AS quantity_on_hand,  -- Random 10-30
    0 AS quantity_reserved,
    5 AS reorder_level,
    GETDATE() AS created_at,
    GETDATE() AS updated_at
FROM product_variants pv
WHERE pv.id >= 2001 AND pv.id <= 2032
AND NOT EXISTS (
    SELECT 1 FROM branch_inventories bi 
    WHERE bi.branch_id = 1 AND bi.product_variant_id = pv.id
);

SET @inserted = @@ROWCOUNT;
PRINT CONCAT('✅ Branch 1 (Quận 1): ', @inserted, ' variants đã nhập kho');

-- Chi nhánh 2: Quận 3 (Có 70% sản phẩm, số lượng trung bình)
INSERT INTO [dbo].[branch_inventories] 
    ([branch_id], [product_variant_id], [quantity_on_hand], [quantity_reserved], [reorder_level], [created_at], [updated_at])
SELECT 
    2 AS branch_id,
    pv.id AS product_variant_id,
    ABS(CHECKSUM(NEWID())) % 16 + 5 AS quantity_on_hand,  -- Random 5-20
    0 AS quantity_reserved,
    3 AS reorder_level,
    GETDATE() AS created_at,
    GETDATE() AS updated_at
FROM product_variants pv
WHERE pv.id >= 2001 AND pv.id <= 2032
AND pv.id % 10 != 3  -- Bỏ qua một số variant (70%)
AND NOT EXISTS (
    SELECT 1 FROM branch_inventories bi 
    WHERE bi.branch_id = 2 AND bi.product_variant_id = pv.id
);

SET @inserted = @@ROWCOUNT;
PRINT CONCAT('✅ Branch 2 (Quận 3): ', @inserted, ' variants đã nhập kho');

-- Chi nhánh 3: Thủ Đức (Có 50% sản phẩm, số lượng thấp hơn)
INSERT INTO [dbo].[branch_inventories] 
    ([branch_id], [product_variant_id], [quantity_on_hand], [quantity_reserved], [reorder_level], [created_at], [updated_at])
SELECT 
    3 AS branch_id,
    pv.id AS product_variant_id,
    ABS(CHECKSUM(NEWID())) % 11 + 3 AS quantity_on_hand,  -- Random 3-13
    0 AS quantity_reserved,
    2 AS reorder_level,
    GETDATE() AS created_at,
    GETDATE() AS updated_at
FROM product_variants pv
WHERE pv.id >= 2001 AND pv.id <= 2032
AND pv.id % 2 = 0  -- Chỉ lấy số chẵn (50%)
AND NOT EXISTS (
    SELECT 1 FROM branch_inventories bi 
    WHERE bi.branch_id = 3 AND bi.product_variant_id = pv.id
);

SET @inserted = @@ROWCOUNT;
PRINT CONCAT('✅ Branch 3 (Thủ Đức): ', @inserted, ' variants đã nhập kho');

GO

-- ================================================================
-- 4. KIỂM TRA KẾT QUẢ
-- ================================================================
PRINT ''
PRINT '📊 KẾT QUẢ NHẬP KHO:'
PRINT '========================'

-- Thống kê theo chi nhánh
SELECT 
    b.name AS [Chi nhánh],
    b.location AS [Địa chỉ],
    COUNT(bi.id) AS [Số loại SP],
    SUM(bi.quantity_on_hand) AS [Tổng tồn kho]
FROM branches b
LEFT JOIN branch_inventories bi ON b.id = bi.branch_id
WHERE b.id IN (1, 2, 3)
GROUP BY b.id, b.name, b.location
ORDER BY b.id;

-- Chi tiết tồn kho theo sản phẩm
PRINT ''
PRINT '📋 CHI TIẾT TỒN KHO:'

SELECT 
    b.name AS [Chi nhánh],
    p.name AS [Sản phẩm],
    pv.name AS [Variant],
    bi.quantity_on_hand AS [Tồn kho],
    bi.quantity_reserved AS [Đã đặt],
    (bi.quantity_on_hand - bi.quantity_reserved) AS [Có sẵn]
FROM branch_inventories bi
JOIN branches b ON bi.branch_id = b.id
JOIN product_variants pv ON bi.product_variant_id = pv.id
JOIN products p ON pv.product_id = p.id
WHERE bi.product_variant_id >= 2001
ORDER BY b.id, p.id, pv.id;

GO

PRINT ''
PRINT '✅ Script hoàn thành! Đã nhập kho cho các chi nhánh.'
GO
