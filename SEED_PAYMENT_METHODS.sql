-- ================================================================
-- 💳 SCRIPT THÊM PHƯƠNG THỨC THANH TOÁN
-- ================================================================

USE [perw]
GO

-- Xóa nếu đã có
DELETE FROM payment_methods WHERE code IN ('COD', 'BANK_TRANSFER');
GO

SET IDENTITY_INSERT [dbo].[payment_methods] ON
GO

INSERT INTO [dbo].[payment_methods] ([id], [name], [code], [is_active], [created_at])
VALUES 
(1, N'Thanh toán khi nhận hàng (COD)', 'COD', 1, GETDATE()),
(2, N'Chuyển khoản ngân hàng', 'BANK_TRANSFER', 1, GETDATE());

SET IDENTITY_INSERT [dbo].[payment_methods] OFF
GO

-- Kiểm tra
SELECT * FROM payment_methods;
GO

PRINT '✅ Đã thêm 2 phương thức thanh toán: COD và Chuyển khoản'
GO
