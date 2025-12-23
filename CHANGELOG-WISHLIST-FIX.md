# 📋 CHANGELOG - Cart, Wishlist & Order Features

**Ngày:** 23/12/2024 (Cập nhật lần 2)

---

## 🐛 SỬA LỖI

### 1. CartPage - Không hiển thị ảnh sản phẩm
**File:** `src/pages/CartPage.vue`

**Vấn đề:** 
- Ảnh sản phẩm không hiển thị do đường dẫn `VariantImageUrl` từ backend là đường dẫn tương đối (vd: `/uploads/products/xxx.jpg`)

**Giải pháp:**
- Thêm hàm `getImageUrl()` để xử lý đường dẫn ảnh:
  - Nếu URL đầy đủ (http/https) → giữ nguyên
  - Nếu URL tương đối → thêm `API_BASE_URL` từ environment
  - Nếu không có URL → dùng placeholder
- Thêm error slot cho v-img để xử lý ảnh bị lỗi

---

### 2. CheckoutPage - Dữ liệu fix cứng
**File:** `src/pages/CheckoutPage.vue`

**Vấn đề:**
- `shippingInfo` (tên, số điện thoại, địa chỉ) đang fix cứng
- Không có loading state
- Không xử lý trường hợp không có dữ liệu order

**Giải pháp:**
- Lấy thông tin người dùng từ `authStore.user` cho shipping info
- Thêm loading state khi đang tải order
- Thêm empty state khi không có order data
- Thêm hàm `getImageUrl()` cho xử lý ảnh
- Hiển thị discount code nếu có áp dụng

---

## ✨ TÍNH NĂNG MỚI

### 3. Wishlist Store - Danh sách yêu thích
**File:** `src/stores/wishlist.store.ts` (MỚI)

**Lý do:**
- Database **KHÔNG CÓ** bảng `wishlists` → lưu trong localStorage
- Yêu cầu đăng nhập để thêm/xóa wishlist

**Tính năng:**
- ✅ Lưu wishlist trong localStorage theo user ID
- ✅ Merge guest wishlist khi đăng nhập
- ✅ Toggle add/remove wishlist
- ✅ Kiểm tra sản phẩm có trong wishlist
- ✅ Tính tổng giá trị wishlist
- ✅ Clear toàn bộ wishlist
- ✅ Auto-sync với localStorage

**API:**
```typescript
const wishlistStore = useWishlistStore();

// Khởi tạo
wishlistStore.initialize();

// Thêm vào wishlist
wishlistStore.addToWishlist(product, variant);

// Toggle (thêm/xóa)
wishlistStore.toggleWishlist(product, variant);

// Kiểm tra có trong wishlist
wishlistStore.isInWishlist(variantId);

// Xóa
wishlistStore.removeById(itemId);
wishlistStore.removeFromWishlist(variantId);

// Clear
wishlistStore.clearWishlist();
```

---

### 4. WishListPage - Cập nhật sử dụng Store
**File:** `src/pages/WishListPage.vue`

**Thay đổi:**
- ✅ Thay mock data bằng wishlist store
- ✅ Thêm trạng thái yêu cầu đăng nhập
- ✅ Thêm xử lý image URL với `getImageUrl()`
- ✅ Thêm error handling cho ảnh
- ✅ Cập nhật các action buttons sử dụng store

---

### 5. ProductDetailPage - Tích hợp Wishlist
**File:** `src/pages/ProductDetailPage.vue`

**Thay đổi:**
- ✅ Import và sử dụng `useWishlistStore`
- ✅ `isInWishlist` là computed sync với store
- ✅ `toggleWishlist()` sử dụng store với:
  - Kiểm tra đăng nhập
  - Chuyển hướng login nếu chưa đăng nhập
  - Toast thông báo kết quả

---

## 📁 FILES ĐÃ THAY ĐỔI

| File | Thay đổi |
|------|----------|
| `src/stores/wishlist.store.ts` | **MỚI** - Wishlist store với localStorage |
| `src/stores/orders.store.ts` | **MỚI** - Orders store với API |
| `src/api/orders.api.ts` | **MỚI** - Orders API service |
| `src/pages/WishListPage.vue` | Cập nhật sử dụng store, xử lý ảnh |
| `src/pages/CartPage.vue` | Thêm `getImageUrl()`, error handling ảnh |
| `src/pages/CheckoutPage.vue` | Dynamic shipping info, **clear cart** |
| `src/pages/OrderPage.vue` | Fetch từ API, loading/empty states |
| `src/pages/ProductDetailPage.vue` | Tích hợp wishlist store |
| `src/components/AppHeader.vue` | **Wishlist badge** từ store |

---

## ✨ TÍNH NĂNG BỔ SUNG (CẬP NHẬT LẦN 2)

### 6. Clear Cart sau Checkout
**File:** `src/pages/CheckoutPage.vue`

**Tính năng:**
- ✅ Sau khi thanh toán thành công, giỏ hàng tự động rỗng
- ✅ Gọi `cartStore.clearCart()` khi vào trang Checkout

---

### 7. Wishlist Badge trên Header
**File:** `src/components/AppHeader.vue`

**Tính năng:**
- ✅ Import `useWishlistStore`
- ✅ `wishlistCount` lấy từ `wishlistStore.itemCount`
- ✅ Badge hiển thị số sản phẩm trong wishlist
- ✅ Khởi tạo wishlist store trong `onMounted`

---

### 8. Orders API & Store
**Files:** 
- `src/api/orders.api.ts` (MỚI)
- `src/stores/orders.store.ts` (MỚI)

**Tính năng:**
- ✅ `getMyOrders()` - Lấy danh sách đơn hàng
- ✅ `getOrderById()` - Chi tiết đơn hàng  
- ✅ `createOrder()` - Tạo đơn mới (auto clear cart)
- ✅ `cancelOrder()` - Hủy đơn hàng
- ✅ Normalize data PascalCase/camelCase

---

### 9. OrderPage Dynamic Data
**File:** `src/pages/OrderPage.vue`

**Thay đổi:**
- ✅ Thay mock data bằng orders store
- ✅ Fetch từ API `/api/orders`
- ✅ Loading state khi đang tải
- ✅ Login required state
- ✅ Empty state khi không có đơn hàng
- ✅ Xử lý image URL

---

## 🧪 CÁCH TEST

### Test Wishlist Badge:
1. Đăng nhập vào hệ thống
2. Vào trang chi tiết sản phẩm
3. Click nút ❤️ → Badge trên header tăng lên
4. Vào trang Wishlist → Xóa sản phẩm → Badge giảm

### Test Clear Cart:
1. Đăng nhập và thêm sản phẩm vào giỏ
2. Click "Tiến hành thanh toán"
3. Sau khi vào trang Checkout → Giỏ hàng rỗng (icon badge = 0)

### Test Orders:
1. Đăng nhập vào hệ thống
2. Vào trang "Đơn hàng của tôi" (`/order`)
3. Nếu có đơn hàng → Hiển thị danh sách
4. Nếu chưa có → Hiển thị "Chưa có đơn hàng nào"
5. Click "Xem chi tiết" → Mở rộng thông tin

---

## 🔮 CẦN LÀM THÊM (Optional)

1. **Backend Orders API**: Cần implement API `/api/orders` trong backend
2. **Fetch địa chỉ mặc định**: API `/api/addresses`
3. **Real checkout flow**: Tạo order qua API thay vì localStorage

---

*Tài liệu tạo bởi AI Assistant - 23/12/2024*

