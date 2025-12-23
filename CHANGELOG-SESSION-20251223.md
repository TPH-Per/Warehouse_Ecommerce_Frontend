# 📋 CHANGELOG - SESSION 23/12/2025

## 🎯 Mục tiêu chính
Nâng cấp hệ thống e-commerce WibuShop với các tính năng:
- Phân trang và lọc sản phẩm nâng cao
- Checkout flow hoàn chỉnh với API tạo đơn hàng
- In hóa đơn cho khách hàng
- Dữ liệu mẫu cho categories, products, suppliers, branches

---

## 📁 CÁC FILE ĐÃ THAY ĐỔI

### 1. `src/pages/ProductListPage.vue`
**Thay đổi:**
- ✅ Phân trang: 8 sản phẩm/trang (4 cột x 2 hàng)
- ✅ Lọc theo nhà cung cấp (`supplier_id`)
- ✅ Lọc theo khoảng giá (5 mức: Dưới 500K → Trên 5 triệu)
- ✅ Xử lý query `?category=id` từ header navigation
- ✅ Sửa ảnh bị cắt: dùng `aspect-ratio: 1` thay vì fixed height
- ✅ Responsive list view image (160x160 desktop, full width mobile)
- ✅ Hiển thị "X-Y trong tổng số Z sản phẩm"

### 2. `src/pages/CartPage.vue`
**Thay đổi:**
- ✅ Thêm phần chọn **phương thức thanh toán** (COD / Chuyển khoản)
- ✅ Radio buttons với icon và mô tả
- ✅ Truyền `PaymentMethodId` vào API tạo đơn hàng
- ✅ Lưu thông tin payment method, customer vào localStorage
- ✅ Sửa ảnh trong cart: container 70x70px với `aspect-ratio: 1`
- ✅ Thêm loading indicator khi ảnh đang tải
- ✅ CSS styling cho payment options

### 3. `src/pages/CheckoutPage.vue`
**Thay đổi - Tạo lại hoàn toàn:**
- ✅ Thiết kế hóa đơn chuyên nghiệp có thể in
- ✅ Header với logo PerW Shop và mã đơn hàng
- ✅ Thông tin khách hàng (tên, SĐT, địa chỉ)
- ✅ Phương thức thanh toán với trạng thái
- ✅ Bảng chi tiết sản phẩm (tên, SL, đơn giá, thành tiền)
- ✅ Tổng kết: Tạm tính, Phí ship, Giảm giá, Tổng cộng
- ✅ Footer với thông tin liên hệ
- ✅ Nút "In hóa đơn" gọi `window.print()`
- ✅ Print CSS: ẩn header web, chỉ in hóa đơn, format A4

### 4. `src/pages/OrderPage.vue`
**Thay đổi:**
- ✅ Sửa ảnh chi tiết đơn hàng: container 56x56px
- ✅ Dùng `aspect-ratio: 1` để ảnh không bị cắt
- ✅ Thêm loading indicator và error placeholder

### 5. `src/styles/global.scss`
**Thay đổi:**
- ✅ Thêm Global Print Styles
- ✅ Ẩn header, navigation, footer khi in
- ✅ Reset neon effects về màu đen cho in
- ✅ White background cho in

### 6. `src/components/AppHeader.vue`
**Thay đổi (bởi user):**
- ✅ Đổi tên "Wibu" → "PerW" trong logo

### 7. `src/stores/orders.store.ts`
**Thay đổi:**
- ✅ Thêm debug console.log để trace API response

---

## 📄 CÁC FILE MỚI TẠO

### SQL Scripts
| File | Mô tả |
|------|-------|
| `SEED_DATA_ANIME_FIGURES.sql` | Tạo 4 categories, 20 products, 32 variants |
| `SEED_SUPPLIERS.sql` | Tạo 6 nhà cung cấp và link với products |
| `SEED_BRANCH_INVENTORIES.sql` | Tạo 3 branches và inventory cho mỗi chi nhánh |
| `SEED_PAYMENT_METHODS.sql` | Tạo 2 phương thức thanh toán (COD, Bank Transfer) |
| `FIX_IMAGE_PATHS.sql` | Sửa đường dẫn ảnh thêm `/wwwroot/` |

### Documentation
| File | Mô tả |
|------|-------|
| `FIX_API_ORDERS_DETAILS.md` | Hướng dẫn sửa backend API trả về Items và Payment |
| `IMAGE_LIST_PRODUCTS.txt` | Danh sách 32 ảnh cần đổi tên |
| `CHANGELOG-SESSION-20251223.md` | File này - ghi lại tất cả thay đổi |
| `ALL_SQL_SCRIPTS.sql` | Tổng hợp tất cả SQL scripts |

---

## 🗃️ DATABASE CHANGES

### Categories (4 danh mục mới)
| ID | Tên | Slug |
|----|-----|------|
| 101 | Scale Figure | scale-figure |
| 102 | Nendoroid | nendoroid |
| 103 | Figma | figma |
| 104 | Pop Up Parade | pop-up-parade |

### Suppliers (6 nhà cung cấp mới)
| ID | Tên |
|----|-----|
| 1 | Good Smile Company |
| 2 | Bandai Spirits |
| 3 | Kotobukiya |
| 4 | MegaHouse |
| 5 | Alter |
| 6 | Max Factory |

### Products (20 sản phẩm mới)
- IDs: 1001 - 1020
- Scale Figure: Gojo, Marin, Zero Two, Rem, Yor (5)
- Nendoroid: Denji, Frieren, Anya, Makima, Power (5)
- Figma: Shinobu, Levi, Tanjiro, Nezuko, Mikasa (5)
- Pop Up Parade: Fern, Himmel, Bocchi, Chisato, Takina (5)

### Product Variants (32 biến thể mới)
- IDs: 2001 - 2032
- Mỗi sản phẩm có 1-3 biến thể với giá khác nhau

### Branches (3 chi nhánh)
| ID | Tên | Địa chỉ |
|----|-----|---------|
| 1 | WibuShop - Quận 1 | 123 Nguyễn Huệ, Q1, TP.HCM |
| 2 | WibuShop - Quận 3 | 456 Võ Văn Tần, Q3, TP.HCM |
| 3 | WibuShop - Thủ Đức | 789 Võ Văn Ngân, Thủ Đức |

### Payment Methods (2 phương thức)
| ID | Tên | Code |
|----|-----|------|
| 1 | Thanh toán khi nhận hàng (COD) | COD |
| 2 | Chuyển khoản ngân hàng | BANK_TRANSFER |

---

## 🔧 BACKEND CẦN SỬA

### `ApiOrdersController.cs`
Cần sửa để trả về `Items` và `Payment` đầy đủ khi gọi `GET /api/orders`.
Xem chi tiết trong file `FIX_API_ORDERS_DETAILS.md`.

---

## ⚠️ ISSUES CÒN TỒN TẠI

1. **Order Page chi tiết trống**: Backend không trả về Items và Payment
2. **Ảnh sản phẩm**: Cần copy 32 ảnh vào `wwwroot/uploads/products/`
3. **Chuyển khoản ngân hàng**: Chưa có logic QR Code

---

## 📝 THỨ TỰ CHẠY SQL SCRIPTS

```
1. SEED_DATA_ANIME_FIGURES.sql     (Categories, Products, Variants)
2. SEED_SUPPLIERS.sql              (Suppliers, update Products)
3. SEED_BRANCH_INVENTORIES.sql     (Branches, Branch Inventories)
4. SEED_PAYMENT_METHODS.sql        (Payment Methods)
5. FIX_IMAGE_PATHS.sql             (Fix image URLs)
```

Hoặc chạy file tổng hợp: `ALL_SQL_SCRIPTS.sql`

---

**Ngày cập nhật:** 2025-12-23 17:46
**Phiên bản:** 1.0.0
