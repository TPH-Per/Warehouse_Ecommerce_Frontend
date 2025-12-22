# 🔐 Hướng Dẫn Sửa Lỗi Authentication Cho Frontend

> **Ngày tạo:** 22/12/2025  
> **Vấn đề:** Lỗi 401 Unauthorized khi gọi API `/api/cart` (và các API yêu cầu đăng nhập khác)

---

## 📋 Mô Tả Vấn Đề

Khi user đã đăng nhập thành công nhưng vẫn nhận lỗi `401 Unauthorized` khi thêm sản phẩm vào giỏ hàng:

```
POST https://localhost:44377/api/cart
Status: 401
Response: { Success: false, Message: "Vui lòng đăng nhập" }
```

---

## 🔍 Nguyên Nhân

Backend sử dụng **Cookie-based Authentication** (FormsAuthentication). Khi login thành công, server sẽ trả về cookie `.ASPXAUTH`. Cookie này cần được gửi kèm trong **MỌI request tiếp theo** để server nhận diện user.

**Vấn đề:** Mặc định, trình duyệt **KHÔNG** tự động gửi cookies trong các request cross-origin (frontend `localhost:3000` → backend `localhost:44377`).

---

## ✅ Giải Pháp

### 1. Cấu Hình Axios Instance

Tìm file cấu hình Axios (thường là `src/api/index.ts`, `src/utils/axios.ts`, hoặc `src/lib/api.ts`) và thêm `withCredentials: true`:

```typescript
// ✅ ĐÚNG - Cấu hình đầy đủ
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44377',
  withCredentials: true,  // 🔴 BẮT BUỘC - Gửi cookies kèm request
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api;
```

### 2. Cập Nhật Các API Calls

Nếu bạn đang gọi API trực tiếp mà không dùng instance, hãy thêm `withCredentials`:

```typescript
// ❌ SAI - Không gửi cookies
axios.post('https://localhost:44377/api/cart', data);

// ✅ ĐÚNG - Gửi cookies kèm request
axios.post('https://localhost:44377/api/cart', data, {
  withCredentials: true
});
```

### 3. Nếu Dùng Fetch API

```typescript
// ❌ SAI
fetch('https://localhost:44377/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

// ✅ ĐÚNG
fetch('https://localhost:44377/api/cart', {
  method: 'POST',
  credentials: 'include',  // 🔴 BẮT BUỘC
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

---

## 📁 Các File Cần Kiểm Tra & Sửa

| File (tùy cấu trúc dự án) | Cần sửa |
|---------------------------|---------|
| `src/api/index.ts` hoặc `src/lib/axios.ts` | Thêm `withCredentials: true` vào Axios instance |
| `src/api/auth.api.ts` | Đảm bảo login request có `withCredentials: true` |
| `src/api/cart.api.ts` | Đảm bảo tất cả cart requests có `withCredentials: true` |
| `src/stores/auth.store.ts` | Kiểm tra logic lưu user sau login |
| Tất cả file gọi API khác | Đảm bảo dùng Axios instance đã cấu hình |

---

## 🔄 Cập Nhật API Login Request

Backend đã thêm field `rememberMe` vào API login. Cập nhật interface và request:

```typescript
// Interface cho login request
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;  // 👈 THÊM MỚI (optional, default = false)
}

// Gọi API login
const login = async (email: string, password: string, rememberMe: boolean = false) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
    rememberMe  // 👈 Gửi lên server
  });
  
  // Sau khi login thành công, cookie đã được set tự động
  // Lưu thông tin user vào store
  if (response.data.Success) {
    userStore.setUser(response.data.Data);
  }
  
  return response.data;
};
```

---

## 🧪 Kiểm Tra Cookie Đã Được Set

Sau khi login thành công, kiểm tra trong **DevTools → Application → Cookies**:

| Cookie Name | Giá trị |
|-------------|---------|
| `.ASPXAUTH` | Encrypted token (dạng dài) |

**Nếu không thấy cookie `.ASPXAUTH`:**
- Kiểm tra lại `withCredentials: true`
- Kiểm tra Console có lỗi CORS không
- Đảm bảo backend đang chạy trên `https://localhost:44377`

---

## 🔧 Ví Dụ Hoàn Chỉnh

### File: `src/api/index.ts`

```typescript
import axios, { AxiosError, AxiosResponse } from 'axios';

// Tạo Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:44377',
  timeout: 10000,
  withCredentials: true,  // 🔴 QUAN TRỌNG
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Chưa đăng nhập hoặc session hết hạn
      console.warn('⚠️ Chưa đăng nhập hoặc phiên hết hạn');
      // Có thể redirect về trang login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### File: `src/api/auth.api.ts`

```typescript
import api from './index';

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  Success: boolean;
  Message: string;
  Data?: {
    Id: number;
    Name: string;
    FullName: string;
    Email: string;
    PhoneNumber: string | null;
    RoleId: number;
    RoleName: string;
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: any) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  // Kiểm tra trạng thái đăng nhập (gọi khi load app)
  checkAuth: async () => {
    try {
      const response = await api.get('/api/cart/count');
      return response.data.Success;
    } catch {
      return false;
    }
  }
};
```

### File: `src/api/cart.api.ts`

```typescript
import api from './index';

interface AddToCartRequest {
  productVariantId: number;
  quantity: number;
  price?: number;
}

export const cartApi = {
  // Lấy giỏ hàng
  getCart: async () => {
    const response = await api.get('/api/cart');
    return response.data;
  },

  // Thêm vào giỏ
  addToCart: async (data: AddToCartRequest) => {
    const response = await api.post('/api/cart', {
      ProductVariantId: data.productVariantId,
      Quantity: data.quantity,
      Price: data.price || 0
    });
    return response.data;
  },

  // Cập nhật số lượng
  updateQuantity: async (cartItemId: number, quantity: number) => {
    const response = await api.put(`/api/cart/${cartItemId}`, {
      Quantity: quantity
    });
    return response.data;
  },

  // Xóa item
  removeItem: async (cartItemId: number) => {
    const response = await api.delete(`/api/cart/${cartItemId}`);
    return response.data;
  },

  // Xóa toàn bộ giỏ
  clearCart: async () => {
    const response = await api.delete('/api/cart/clear');
    return response.data;
  },

  // Đếm số lượng trong giỏ
  getCartCount: async () => {
    const response = await api.get('/api/cart/count');
    return response.data;
  }
};
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **HTTPS Required**: Backend đang chạy trên HTTPS (`https://localhost:44377`). Đảm bảo dùng đúng URL.

2. **Cookie SameSite**: Trong môi trường development, browser có thể block cookies cross-site. Nếu vẫn lỗi:
   - Thử chạy frontend trên `localhost` (không phải `127.0.0.1`)
   - Hoặc cấu hình frontend proxy đến backend

3. **Session Timeout**: Cookie hết hạn sau 1 ngày (hoặc 7 ngày nếu `rememberMe = true`). Xử lý redirect về login khi nhận 401.

4. **Logout**: Khi logout, gọi API và clear user state trong store:
   ```typescript
   const logout = async () => {
     await api.post('/api/auth/logout');
     userStore.clearUser();
     router.push('/login');
   };
   ```

---

## 📞 Liên Hệ

Nếu vẫn gặp vấn đề sau khi áp dụng các thay đổi trên, hãy:

1. Chụp screenshot Network tab (request headers + response)
2. Chụp screenshot Console errors
3. Gửi lại để debug tiếp

---

**Chúc bạn fix bug thành công! 🚀**
