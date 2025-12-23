# CHANGELOG - Session Expired Fix

## Ngày thực hiện: 2025-12-23

## Vấn đề
Khi server vừa mới khởi động hoặc tắt giữa chừng, người dùng gặp lỗi hết phiên làm việc (session expired) nhưng không được thông báo hoặc redirect về trang login một cách rõ ràng.

## Giải pháp
Thêm logic xử lý session expired trong axios interceptor và hiển thị thông báo phù hợp trên trang login.

---

## Files đã thay đổi

### 1. `src/api/index.ts`

**Các thay đổi:**

- **Thêm Session Handler**: Tạo function `handleSessionExpired()` để xử lý khi session hết hạn
  - Clear localStorage (xóa user data)
  - Lưu flag và lý do vào sessionStorage
  - Redirect về trang login nếu không phải đang ở trang login/register
  - Tránh redirect nhiều lần với flag `isRedirecting`

- **Cập nhật Response Interceptor**:
  - **Lỗi 401 (Unauthorized)**: Redirect về login với thông báo "Phiên đăng nhập đã hết hạn"
  - **Lỗi 403 (Forbidden)**: Redirect về login với thông báo "Bạn không có quyền truy cập"
  - **Lỗi 500 (Server Error)**: Kiểm tra nếu lỗi liên quan đến session/auth/token/cookie thì redirect
  - **Network Error**: Đếm số lần lỗi liên tục, nếu >= 3 lần thì redirect (server có thể đã restart)

- **Bỏ qua các endpoint không yêu cầu auth**:
  - `/auth/login`
  - `/auth/register`
  - Public product endpoints

### 2. `src/pages/LoginPage.vue`

**Các thay đổi:**

- **Thêm import `onMounted`** từ Vue

- **Thêm state `sessionExpiredMessage`**: Lưu thông báo session expired để hiển thị

- **Thêm `onMounted` hook**: Kiểm tra sessionStorage để lấy thông báo session expired khi component mount

- **Thêm function `clearSessionExpiredMessage()`**: Clear thông báo và xóa data trong sessionStorage

- **Thêm Session Expired Alert**: Hiển thị thông báo warning khi user bị redirect do session expired

- **Cập nhật `handleLogin()`**: Clear session expired message khi bắt đầu login

---

## Cách hoạt động

### Kịch bản 1: Session hết hạn (401)
```
1. User đang dùng app
2. Session hết hạn (server restart, cookie expired, etc.)
3. User gọi API cần auth → Server trả về 401
4. Axios interceptor bắt lỗi 401
5. Clear localStorage, lưu lý do vào sessionStorage
6. Redirect về /login
7. LoginPage mount, đọc sessionStorage, hiển thị warning
8. User đăng nhập lại
```

### Kịch bản 2: Server không khả dụng (Network Error)
```
1. User đang dùng app
2. Server tắt hoặc restart
3. User gọi API → Network error (không có response)
4. Axios interceptor đếm số lần lỗi
5. Sau 3 lần liên tục, redirect về /login
6. User đăng nhập lại khi server hoạt động
```

### Kịch bản 3: Không có quyền (403)
```
1. User đang dùng app
2. Role/permission thay đổi trên server
3. User gọi API → Server trả về 403
4. Redirect về /login với thông báo phù hợp
```

---

## Testing

### Test Case 1: Session Expired
1. Đăng nhập vào app
2. Tắt server hoặc xóa cookie authentication
3. Thực hiện action cần auth (add to cart, view orders, etc.)
4. ✅ Expect: Redirect về /login với thông báo session expired

### Test Case 2: Server Restart
1. Đăng nhập vào app
2. Restart server
3. Thực hiện action cần auth
4. ✅ Expect: Sau vài giây (3 lần retry), redirect về /login

### Test Case 3: Public Pages
1. Không đăng nhập
2. Truy cập trang chủ, xem sản phẩm
3. ✅ Expect: Không bị redirect (public pages không yêu cầu auth)

### Test Case 4: Login Page
1. Đang ở /login
2. Có lỗi network
3. ✅ Expect: Không bị redirect loop

---

## Lưu ý cho Developer

1. **Sử dụng `window.location.href`** thay vì Vue Router để đảm bảo reload hoàn toàn app state

2. **SessionStorage vs LocalStorage**: 
   - LocalStorage: Lưu user data (persistent)
   - SessionStorage: Lưu session expired flags (tạm thời, sẽ mất khi đóng tab)

3. **Retry Logic**: Network error có retry 3 lần để tránh redirect sai khi chỉ là network glitch tạm thời

4. **Endpoint Detection**: Phân biệt auth endpoints vs public endpoints để không redirect sai
