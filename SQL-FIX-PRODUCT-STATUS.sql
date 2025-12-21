-- =====================================================
-- SCRIPT: Sửa trạng thái sản phẩm dựa trên tồn kho
-- Mục tiêu: Chỉ sản phẩm có hàng trong kho mới được active
-- Database: perw
-- Created: 2024-12-21
-- =====================================================

USE [perw]
GO

-- =====================================================
-- BƯỚC 1: XEM TÌNH TRẠNG HIỆN TẠI
-- =====================================================

-- Xem tất cả sản phẩm và trạng thái
PRINT '=== TÌNH TRẠNG HIỆN TẠI ==='
SELECT 
    p.id AS ProductId,
    p.name AS ProductName,
    p.status AS CurrentStatus,
    COUNT(DISTINCT pv.id) AS VariantCount,
    COUNT(DISTINCT bi.id) AS InventoryRecords,
    COALESCE(SUM(bi.quantity_on_hand), 0) AS TotalStock
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.deleted_at IS NULL
LEFT JOIN branch_inventories bi ON bi.product_variant_id = pv.id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.name, p.status
ORDER BY p.id;

-- =====================================================
-- BƯỚC 2: TÌM SẢN PHẨM CÓ TỒN KHO NHƯNG KHÔNG ACTIVE
-- =====================================================

PRINT ''
PRINT '=== SẢN PHẨM CÓ TỒN KHO NHƯNG CHƯA ACTIVE ==='
SELECT 
    p.id AS ProductId,
    p.name AS ProductName,
    p.status AS CurrentStatus,
    SUM(bi.quantity_on_hand) AS TotalStock,
    'Cần chuyển thành ACTIVE' AS Action
FROM products p
INNER JOIN product_variants pv ON pv.product_id = p.id AND pv.deleted_at IS NULL
INNER JOIN branch_inventories bi ON bi.product_variant_id = pv.id
WHERE p.deleted_at IS NULL
  AND p.status != 'active'
  AND bi.quantity_on_hand > 0
GROUP BY p.id, p.name, p.status
HAVING SUM(bi.quantity_on_hand) > 0;

-- =====================================================
-- BƯỚC 3: TÌM SẢN PHẨM ACTIVE NHƯNG KHÔNG CÓ TỒN KHO
-- =====================================================

PRINT ''
PRINT '=== SẢN PHẨM ACTIVE NHƯNG KHÔNG CÓ TỒN KHO ==='
SELECT 
    p.id AS ProductId,
    p.name AS ProductName,
    p.status AS CurrentStatus,
    COALESCE(SUM(bi.quantity_on_hand), 0) AS TotalStock,
    'Xem xét chuyển thành DRAFT hoặc thêm inventory' AS Action
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.deleted_at IS NULL
LEFT JOIN branch_inventories bi ON bi.product_variant_id = pv.id
WHERE p.deleted_at IS NULL
  AND p.status = 'active'
GROUP BY p.id, p.name, p.status
HAVING COALESCE(SUM(bi.quantity_on_hand), 0) = 0;

-- =====================================================
-- BƯỚC 4: CẬP NHẬT - ACTIVE CHO SẢN PHẨM CÓ TỒN KHO
-- =====================================================

PRINT ''
PRINT '=== CẬP NHẬT: ACTIVE CHO SẢN PHẨM CÓ TỒN KHO ==='

-- Cập nhật sản phẩm có variant trong kho thành ACTIVE
UPDATE products 
SET 
    status = 'active',
    updated_at = GETDATE()
WHERE id IN (
    SELECT DISTINCT p.id
    FROM products p
    INNER JOIN product_variants pv ON pv.product_id = p.id AND pv.deleted_at IS NULL
    INNER JOIN branch_inventories bi ON bi.product_variant_id = pv.id
    WHERE p.deleted_at IS NULL
      AND bi.quantity_on_hand > 0
)
AND status != 'active';

PRINT CONCAT('Đã cập nhật ', @@ROWCOUNT, ' sản phẩm thành ACTIVE');

-- =====================================================
-- BƯỚC 5 (TÙY CHỌN): DRAFT CHO SẢN PHẨM KHÔNG CÓ TỒN KHO
-- =====================================================

-- ⚠️ CẢNH BÁO: Uncomment dòng dưới nếu muốn chuyển sản phẩm không có hàng thành DRAFT
-- Điều này sẽ ẩn sản phẩm khỏi trang hiển thị

/*
PRINT ''
PRINT '=== CẬP NHẬT: DRAFT CHO SẢN PHẨM ACTIVE NHƯNG KHÔNG CÓ TỒN KHO ==='

UPDATE products 
SET 
    status = 'draft',
    updated_at = GETDATE()
WHERE id NOT IN (
    SELECT DISTINCT p.id
    FROM products p
    INNER JOIN product_variants pv ON pv.product_id = p.id AND pv.deleted_at IS NULL
    INNER JOIN branch_inventories bi ON bi.product_variant_id = pv.id
    WHERE p.deleted_at IS NULL
      AND bi.quantity_on_hand > 0
)
AND status = 'active'
AND deleted_at IS NULL;

PRINT CONCAT('Đã cập nhật ', @@ROWCOUNT, ' sản phẩm thành DRAFT');
*/

-- =====================================================
-- BƯỚC 6: KIỂM TRA KẾT QUẢ
-- =====================================================

PRINT ''
PRINT '=== KẾT QUẢ SAU KHI CẬP NHẬT ==='
SELECT 
    p.id AS ProductId,
    p.name AS ProductName,
    p.status AS Status,
    COUNT(DISTINCT pv.id) AS VariantCount,
    COUNT(DISTINCT bi.id) AS InventoryRecords,
    COALESCE(SUM(bi.quantity_on_hand), 0) AS TotalStock
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.deleted_at IS NULL
LEFT JOIN branch_inventories bi ON bi.product_variant_id = pv.id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.name, p.status
ORDER BY 
    CASE WHEN p.status = 'active' THEN 1 ELSE 2 END,
    TotalStock DESC;

-- =====================================================
-- BƯỚC 7: SẢN PHẨM SẼ HIỂN THỊ TRÊN FRONTEND
-- =====================================================

PRINT ''
PRINT '=== SẢN PHẨM SẼ HIỂN THỊ TRÊN FRONTEND (API /products/in-stock) ==='
SELECT DISTINCT
    p.id AS ProductId,
    p.name AS ProductName,
    p.status AS Status,
    c.name AS CategoryName,
    MIN(pv.price) AS Price,
    SUM(bi.quantity_on_hand) AS TotalStock,
    COUNT(DISTINCT bi.branch_id) AS BranchesWithStock
FROM products p
INNER JOIN categories c ON c.id = p.category_id
INNER JOIN product_variants pv ON pv.product_id = p.id AND pv.deleted_at IS NULL
INNER JOIN branch_inventories bi ON bi.product_variant_id = pv.id
WHERE p.deleted_at IS NULL
  AND p.status = 'active'
  AND bi.quantity_on_hand > 0
GROUP BY p.id, p.name, p.status, c.name
ORDER BY TotalStock DESC;

GO
