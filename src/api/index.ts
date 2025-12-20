// ==========================================
// Axios Instance - Đơn giản cho ASP.NET MVC5
// File: src/api/index.ts
// ==========================================

import axios from 'axios';
import type { AxiosError } from 'axios';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  // URL API backend ASP.NET MVC5
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

  // Timeout 30 giây
  timeout: 30000,

  // Headers mặc định
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // QUAN TRỌNG cho ASP.NET: Cho phép gửi cookies/session
  // Nếu backend dùng session-based auth, cần bật này
  withCredentials: true,
});

// ==========================================
// RESPONSE INTERCEPTOR
// Xử lý lỗi tập trung
// ==========================================

apiClient.interceptors.response.use(
  // Response thành công - trả về bình thường
  (response) => response,

  // Response lỗi - xử lý các mã lỗi
  (error: AxiosError) => {
    const status = error.response?.status;

    // Lỗi 401 - Chưa đăng nhập
    if (status === 401) {
      console.error('❌ Chưa đăng nhập hoặc phiên hết hạn');
      // Có thể redirect về login nếu cần
      // window.location.href = '/login';
    }

    // Lỗi 403 - Không có quyền
    if (status === 403) {
      console.error('❌ Không có quyền truy cập');
    }

    // Lỗi 422 - Validation
    if (status === 422) {
      console.error('❌ Dữ liệu không hợp lệ:', error.response?.data);
    }

    // Lỗi 500 - Server error
    if (status === 500) {
      console.error('❌ Lỗi server');
    }

    // Lỗi network - không kết nối được
    if (!error.response) {
      console.error('❌ Không thể kết nối đến server');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// ==========================================
// CÁCH SỬ DỤNG
// ==========================================
/*
  import apiClient from '@/api';
  
  // GET request
  const response = await apiClient.get('/products');
  
  // POST request  
  const response = await apiClient.post('/auth/login', {
    email: 'user@example.com',
    password: '123456'
  });
  
  // Response từ ASP.NET MVC5 thường có dạng:
  // { success: true, data: {...}, message: "..." }
*/
