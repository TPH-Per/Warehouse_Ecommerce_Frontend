# 📋 TODO LIST: Kết nối Frontend với Backend

## Mục tiêu: Render dữ liệu động từ Database thay vì dữ liệu fix cứng

---

## 🎯 PHASE 1: SETUP CƠ BẢN

### 1.1 Cài đặt Axios
- [ ] Cài đặt axios: `npm install axios`
- [ ] Tạo file `src/api/axios.ts` hoặc `src/api/index.ts`
- [ ] Cấu hình axios instance với:
  - `baseURL` từ environment variable
  - `timeout` (30 giây)
  - `headers` mặc định (Content-Type, Accept)

### 1.2 Cấu hình Environment
- [ ] Tạo file `.env` ở root project
- [ ] Thêm biến `VITE_API_BASE_URL=http://localhost:8000/api` (hoặc URL backend của bạn)
- [ ] Tạo `.env.example` để team member khác biết cần những gì

### 1.3 Tạo Types/Interfaces
- [ ] Tạo folder `src/types/`
- [ ] Tạo file `src/types/index.ts`
- [ ] Định nghĩa interface cho từng entity theo database:
  - [ ] `User` (map với bảng `users`)
  - [ ] `Product` (map với bảng `products`)
  - [ ] `ProductVariant` (map với bảng `product_variants`)
  - [ ] `Category` (map với bảng `categories`)
  - [ ] `CartItem` (map với bảng `carts`)
  - [ ] `Order` (map với bảng `purchase_orders`)
  - [ ] `OrderItem` (map với bảng `purchase_order_details`)
  - [ ] `Address` (map với bảng `addresses`)
  - [ ] `Payment` (map với bảng `payments`)
  - [ ] `Branch` (map với bảng `branches`)

💡 **Tip**: Mở file `db(1).txt`, xem cấu trúc bảng, tạo interface tương ứng

---

## 🎯 PHASE 2: TẠO API SERVICES

### 2.1 Axios Interceptors
- [ ] Thêm **Request Interceptor**:
  - Đọc token từ `localStorage`
  - Gắn token vào header `Authorization: Bearer {token}`
- [ ] Thêm **Response Interceptor**:
  - Xử lý lỗi 401 (Unauthorized) → Logout và redirect về login
  - Xử lý lỗi 422 (Validation) → Hiển thị lỗi
  - Xử lý lỗi 500 (Server Error) → Thông báo lỗi server

### 2.2 Tạo các API Files
Tạo folder `src/api/` và các files:

- [ ] **`auth.api.ts`** - Xác thực người dùng:
  ```
  - login(email, password)
  - register(userData)
  - logout()
  - getProfile()
  - updateProfile(data)
  ```

- [ ] **`products.api.ts`** - Sản phẩm:
  ```
  - getProducts(filters?) → PaginatedResponse
  - getProductBySlug(slug) → Product
  - getCategories() → Category[]
  - getVariantStock(variantId, branchId) → number
  ```

- [ ] **`cart.api.ts`** - Giỏ hàng:
  ```
  - getCart() → CartItem[]
  - addToCart(variantId, quantity)
  - updateCartItem(itemId, quantity)
  - removeCartItem(itemId)
  - clearCart()
  ```

- [ ] **`wishlist.api.ts`** - Danh sách yêu thích:
  ```
  - getWishlist() → WishlistItem[]
  - addToWishlist(productId)
  - removeFromWishlist(productId)
  ```

- [ ] **`orders.api.ts`** - Đơn hàng:
  ```
  - getOrders(status?) → Order[]
  - getOrderById(id) → Order
  - createOrder(orderData) → Order
  - cancelOrder(id)
  ```

- [ ] **`address.api.ts`** - Địa chỉ:
  ```
  - getAddresses() → Address[]
  - createAddress(data)
  - updateAddress(id, data)
  - deleteAddress(id)
  - setDefaultAddress(id)
  ```

---

## 🎯 PHASE 3: TẠO PINIA STORES

### 3.1 Tại sao dùng Pinia?
- Quản lý state toàn cục
- Giỏ hàng và Wishlist cần truy cập từ nhiều components
- Persist data khi user chưa đăng nhập (localStorage)

### 3.2 Tạo các Store Files (`src/stores/`)

- [ ] **`auth.store.ts`** - Quản lý authentication:
  ```
  State:
    - user: User | null
    - token: string | null
    - isLoading: boolean
  
  Getters:
    - isAuthenticated
    - userName
  
  Actions:
    - initialize() → Load từ localStorage khi app start
    - login(credentials)
    - logout()
    - fetchProfile()
  ```

- [ ] **`cart.store.ts`** - Quản lý giỏ hàng:
  ```
  State:
    - items: CartItem[]
    - isLoading: boolean
  
  Getters:
    - totalItems → Tổng số lượng
    - totalPrice → Tổng tiền
    - isEmpty
  
  Actions:
    - initialize() → Load từ localStorage (guest) hoặc API (logged in)
    - addToCart(variant, product, quantity)
    - updateQuantity(variantId, quantity)
    - removeFromCart(variantId)
    - clearCart()
    - syncToServer() → Sync local cart lên server khi login
  ```

  💡 **Logic quan trọng**:
  - Nếu user CHƯA đăng nhập → Lưu vào localStorage
  - Nếu user ĐÃ đăng nhập → Gọi API
  - Khi user đăng nhập → Sync localStorage lên server

- [ ] **`wishlist.store.ts`** - Tương tự cart store
  ```
  State:
    - items: WishlistItem[]
  
  Actions:
    - toggleWishlist(product) → Thêm nếu chưa có, xóa nếu có
    - isInWishlist(productId) → boolean
  ```

- [ ] **`products.store.ts`** (optional) - Cache products
  ```
  State:
    - products: Product[]
    - categories: Category[]
    - currentProduct: Product | null
  
  Actions:
    - fetchProducts(filters)
    - fetchProductBySlug(slug)
  ```

---

## 🎯 PHASE 4: CẬP NHẬT PAGES

### 4.1 HomePage.vue
- [ ] Import `productsApi` và gọi `getProducts()` trong `onMounted()`
- [ ] Thay mock data bằng data từ API
- [ ] Thêm loading state cho skeleton loading
- [ ] Xử lý error state

### 4.2 ProductListPage.vue
- [ ] Gọi API lấy danh sách sản phẩm
- [ ] Implement filters (category, price, sort)
- [ ] Implement pagination hoặc infinite scroll
- [ ] Loading và Error states

### 4.3 ProductDetailPage.vue
- [ ] Gọi API lấy chi tiết sản phẩm theo slug
- [ ] Gọi API lấy tồn kho theo branch
- [ ] Sử dụng `cartStore.addToCart()` thay vì logic local
- [ ] Sử dụng `wishlistStore.toggleWishlist()` cho nút yêu thích

### 4.4 CartPage.vue
- [ ] Import `useCartStore()`
- [ ] Hiển thị `cartStore.items` thay vì mock data
- [ ] Các nút +/- gọi `cartStore.updateQuantity()`
- [ ] Nút xóa gọi `cartStore.removeFromCart()`
- [ ] Tổng tiền lấy từ `cartStore.totalPrice`

### 4.5 WishListPage.vue
- [ ] Import `useWishlistStore()`
- [ ] Hiển thị `wishlistStore.items`
- [ ] Nút xóa gọi `wishlistStore.removeFromWishlist()`
- [ ] Nút thêm vào giỏ → `cartStore.addToCart()`

### 4.6 CheckoutPage.vue
- [ ] Lấy cart items từ `cartStore`
- [ ] Gọi API lấy danh sách địa chỉ
- [ ] Gọi API lấy phương thức thanh toán
- [ ] Submit form → Gọi `ordersApi.createOrder()`
- [ ] Clear cart sau khi đặt hàng thành công

### 4.7 OrderPage.vue
- [ ] Gọi `ordersApi.getOrders()` lấy danh sách đơn hàng
- [ ] Filter theo status
- [ ] Hiển thị chi tiết đơn hàng (order items, payment, shipping)

### 4.8 ProfilePage.vue
- [ ] Tab Thông tin: Lấy từ `authStore.user`
- [ ] Tab Địa chỉ: Gọi `addressApi.getAddresses()`
- [ ] Tab Đánh giá: Gọi API lấy reviews của user
- [ ] Chức năng edit: Gọi API update

---

## 🎯 PHASE 5: XỬ LÝ AUTHENTICATION

### 5.1 Login Flow
- [ ] Tạo trang `LoginPage.vue` (nếu chưa có)
- [ ] Form đăng nhập
- [ ] Gọi `authStore.login()`
- [ ] Redirect về trang trước đó sau khi login thành công
- [ ] Sync cart/wishlist lên server sau login

### 5.2 Register Flow
- [ ] Tạo trang `RegisterPage.vue`
- [ ] Validation form
- [ ] Gọi `authStore.register()`

### 5.3 Protected Routes
- [ ] Cấu hình Navigation Guard trong router
- [ ] Các trang cần login: checkout, orders, profile
- [ ] Redirect về login nếu chưa đăng nhập

### 5.4 Auto Login
- [ ] Trong `main.ts` hoặc `App.vue`, gọi `authStore.initialize()`
- [ ] Load token từ localStorage
- [ ] Verify token với server (gọi getProfile)

---

## 🎯 PHASE 6: NÂNG CAO

### 6.1 Loading States
- [ ] Thêm skeleton loading cho mỗi page
- [ ] Loading spinner cho các actions (add to cart, checkout)

### 6.2 Error Handling
- [ ] Hiển thị toast notifications cho errors
- [ ] Empty states cho lists rỗng
- [ ] 404 page cho product không tồn tại

### 6.3 Optimistic Updates
- [ ] Update UI ngay lập tức, sau đó sync với server
- [ ] Rollback nếu API fail

### 6.4 Caching
- [ ] Cache products đã fetch
- [ ] Invalidate cache khi cần

---

## 📚 TÀI LIỆU THAM KHẢO

1. **Axios**: https://axios-http.com/docs/intro
2. **Pinia**: https://pinia.vuejs.org/
3. **Vue Composition API**: https://vuejs.org/guide/extras/composition-api-faq.html
4. **Vue Router Navigation Guards**: https://router.vuejs.org/guide/advanced/navigation-guards.html

---

## 🔄 THỨ TỰ THỰC HIỆN ĐỀ XUẤT

```
1. Setup Axios + Environment ─────────────────────────► 30 phút
2. Tạo Types/Interfaces ──────────────────────────────► 1 giờ
3. Tạo Auth API + Auth Store ─────────────────────────► 1-2 giờ
4. Tạo Login/Register Page ───────────────────────────► 1-2 giờ
5. Tạo Products API + Store ──────────────────────────► 1-2 giờ
6. Update HomePage + ProductListPage ─────────────────► 2-3 giờ
7. Tạo Cart Store (với localStorage fallback) ────────► 2-3 giờ
8. Update CartPage ───────────────────────────────────► 1-2 giờ
9. Tạo Wishlist Store ────────────────────────────────► 1-2 giờ
10. Update WishListPage ──────────────────────────────► 1-2 giờ
11. Tạo Orders API + CheckoutPage ────────────────────► 3-4 giờ
12. Update OrderPage + ProfilePage ───────────────────► 2-3 giờ
```

---

## 💡 TIPS

1. **Bắt đầu nhỏ**: Làm 1 API → 1 Store → 1 Page trước, sau đó mở rộng
2. **Console.log nhiều**: Debug bằng console.log để hiểu data flow
3. **Vue DevTools**: Cài extension Vue DevTools để debug Pinia stores
4. **Network Tab**: Dùng Chrome DevTools Network tab để xem API calls
5. **Postman/Insomnia**: Test API trước khi integrate vào FE

---

## ❓ CÂU HỎI TỰ KIỂM TRA

- [ ] Hiểu cách Axios interceptor hoạt động?
- [ ] Hiểu khi nào dùng localStorage vs API?
- [ ] Hiểu Pinia state, getters, actions?
- [ ] Hiểu Vue lifecycle hooks (onMounted, watch)?
- [ ] Hiểu async/await và error handling?

---

✅ **Khi hoàn thành TODO list này, bạn sẽ có một ứng dụng Vue hoàn chỉnh kết nối với Backend!**
