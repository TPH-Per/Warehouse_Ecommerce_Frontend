# 📋 CHANGELOG: Cart & Discounts Feature

> **Ngày:** 22/12/2024  
> **Mục tiêu:** Implement chức năng giỏ hàng + áp dụng mã giảm giá

---

## 📁 FILES MỚI TẠO

### Frontend (Vue.js)

| File | Mô tả |
|------|-------|
| `src/api/cart.api.ts` | API service cho giỏ hàng (CRUD operations) |
| `src/stores/cart.store.ts` | Pinia store quản lý state giỏ hàng |
| `src/composables/useToast.ts` | Composable quản lý toast notifications |
| `src/components/ToastContainer.vue` | Component hiển thị toast notifications |

### Documentation

| File | Mô tả |
|------|-------|
| `GUIDE-BACKEND-CART.md` | Hướng dẫn tạo API Cart cho Backend |
| `GUIDE-BACKEND-DISCOUNTS.md` | Hướng dẫn tạo API Discounts cho Backend |
| `FRONTEND_AUTH_FIX_GUIDE.md` | Hướng dẫn fix lỗi authentication (do Backend tạo) |

---

## 📝 FILES ĐÃ CẬP NHẬT

### 1. `src/App.vue`
**Thay đổi:** Thêm ToastContainer component
```vue
<template>
  <v-app>
    <router-view />
    <!-- Toast Notifications -->
    <ToastContainer />
  </v-app>
</template>

<script lang="ts" setup>
import ToastContainer from '@/components/ToastContainer.vue';
</script>
```

---

### 2. `src/api/cart.api.ts`
**Thay đổi:** Sử dụng PascalCase cho request body để phù hợp với C# Backend

```typescript
// Request body dùng PascalCase
addToCart: (data: AddToCartRequest) => {
    return apiClient.post('/cart', {
        ProductVariantId: data.productVariantId,
        Quantity: data.quantity,
        Price: data.price || 0,
        BranchId: data.branchId || null
    });
},
```

---

### 3. `src/stores/auth.store.ts`
**Thay đổi:**
- Thêm `normalizeUser()` function để handle cả PascalCase và camelCase từ API
- Thêm `setUser()` và `clearUser()` methods
- Cập nhật `logout()` để gọi API logout

```typescript
// Normalize user data từ API
const normalizeUser = (data: any): AuthUser | null => {
    if (!data) return null;
    return {
        id: data.Id ?? data.id,
        name: data.Name ?? data.name ?? '',
        full_name: data.FullName ?? data.full_name ?? '',
        email: data.Email ?? data.email ?? '',
        // ...
    };
};

// Logout gọi API để xóa cookie
const logout = async () => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.log('Logout API error (ignored):', error);
    }
    user.value = null;
    localStorage.removeItem('user');
};

// Clear user không gọi API (dùng khi session hết hạn)
const clearUser = () => {
    user.value = null;
    localStorage.removeItem('user');
};
```

---

### 4. `src/stores/cart.store.ts`
**Thay đổi:**
- Xử lý lỗi 401 sử dụng `clearUser()` thay vì `logout()` để tránh API loop
- Thêm xử lý im lặng cho fetchCart khi 401

```typescript
// Xử lý lỗi 401 trong addToCart
if (err.response?.status === 401) {
    authStore.clearUser();  // Không gọi API logout
    return {
        success: false,
        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    };
}
```

---

### 5. `src/pages/ProductDetailPage.vue`
**Thay đổi:**
- Import `useCartStore`, `useAuthStore`, `useToast`
- Cập nhật function `addToCart()` để gọi cart store thực sự
- Thay thế `alert()` bằng toast notification

```typescript
const addToCart = async () => {
    // Kiểm tra đăng nhập
    if (!authStore.isAuthenticated) {
        toast.warning('Vui lòng đăng nhập...');
        router.push({ name: 'Login' });
        return;
    }
    
    // Gọi cart store
    const result = await cartStore.addToCart({
        productVariantId: selectedVariant.value.id,
        quantity: quantity.value,
        price: selectedVariant.value.price,
        branchId: selectedBranch.value.id,
    });
    
    if (result.success) {
        toast.success(`Đã thêm vào giỏ hàng!`);
    } else {
        toast.error(result.message);
    }
};
```

---

### 6. `src/components/ProductCard.vue`
**Thay đổi:**
- Import router, toast, cart store, auth store
- Cập nhật `addToCart()` để gọi cart store
- Thay thế `alert()` bằng toast notification

---

### 7. `src/pages/WishListPage.vue`
**Thay đổi:**
- Import router, toast, cart store, auth store
- Cập nhật `addToCart()`, `addAllToCart()`, `removeFromWishlist()`, `clearWishlist()`
- Thay thế `alert()` bằng toast notification

---

### 8. `src/pages/CartPage.vue`
**Thay đổi:**
- Tích hợp cart store thay vì mock data
- Thêm state loading và not authenticated
- Cập nhật discount section để hiển thị mã đã áp dụng
- Thêm Snackbar notification

---

### 9. `src/components/AppHeader.vue`
**Thay đổi:**
- Import cart store
- Cart badge count từ `cartStore.totalQuantity` thay vì mock data
- Fetch cart khi app mount (chỉ khi đã đăng nhập)

```typescript
const cartCount = computed(() => cartStore.totalQuantity);

onMounted(async () => {
    authStore.initialize();
    await categoriesStore.fetchCategories();
    if (authStore.isAuthenticated) {
        await cartStore.fetchCart();
    }
});
```

---

## 🎨 TOAST NOTIFICATION SYSTEM

### Cách sử dụng:
```typescript
import { useToast } from '@/composables/useToast';

const toast = useToast();

toast.success('Thành công!');    // 🟢 Xanh lá
toast.error('Có lỗi xảy ra');    // 🔴 Đỏ
toast.warning('Cảnh báo!');      // 🟡 Vàng
toast.info('Thông tin');         // 🔵 Xanh dương
```

### Tính năng:
- Slide-in animation từ phải sang
- Progress bar hiển thị thời gian còn lại
- Auto-dismiss sau 3-4 giây
- Có thể click X để đóng
- Stack multiple toasts

---

## 🛒 CART STORE API

### State:
- `items` - Danh sách cart items
- `isLoading` - Loading state
- `discountCode` - Mã giảm giá đã áp dụng
- `discountAmount` - Số tiền được giảm
- `shippingFee` - Phí vận chuyển (mặc định 30.000đ)

### Getters:
- `isAuthenticated` - Kiểm tra đăng nhập
- `itemCount` - Số items trong giỏ
- `totalQuantity` - Tổng số lượng sản phẩm
- `subTotal` - Tổng tiền tạm tính
- `total` - Tổng tiền sau giảm giá + phí ship
- `groupedByBranch` - Items nhóm theo chi nhánh

### Actions:
- `fetchCart()` - Lấy giỏ hàng từ server
- `addToCart(data)` - Thêm sản phẩm
- `updateQuantity(id, qty)` - Cập nhật số lượng
- `changeQuantity(id, delta)` - Tăng/giảm số lượng
- `removeItem(id)` - Xóa sản phẩm
- `clearCart()` - Xóa tất cả
- `applyDiscountCode(code)` - Áp dụng mã giảm giá
- `removeDiscountCode()` - Xóa mã giảm giá

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Cookie-based Authentication
- Backend sử dụng FormsAuthentication (cookie `.ASPXAUTH`)
- Frontend phải có `withCredentials: true` trong Axios config
- Tất cả request body dùng **PascalCase** cho C# backend

### 2. Backend API Required
Để cart hoạt động, Backend cần implement các API:
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart` - Thêm sản phẩm
- `PUT /api/cart/{id}` - Cập nhật số lượng
- `DELETE /api/cart/{id}` - Xóa sản phẩm
- `DELETE /api/cart/clear` - Xóa tất cả
- `GET /api/cart/count` - Đếm số lượng

Xem chi tiết trong `GUIDE-BACKEND-CART.md`

### 3. GetCurrentUserId trong Backend
```csharp
// KHÔNG dùng Session["user"] - dự án dùng FormsAuth!
// Thay vào đó:
var identity = HttpContext.Current?.User?.Identity;
if (identity == null || !identity.IsAuthenticated) return null;

var user = _db.users.FirstOrDefault(u => u.email == identity.Name);
return user?.id;
```

---

## 📞 LIÊN HỆ

Nếu có vấn đề:
1. Kiểm tra Console trong browser
2. Kiểm tra Network tab → xem request/response
3. Kiểm tra cookie `.ASPXAUTH` đã được gửi chưa
4. Debug Output trong Visual Studio (Backend)

---

**Chúc team làm việc hiệu quả! 🚀**
