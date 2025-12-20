// ==========================================
// Axios Instance - Đơn giản cho ASP.NET MVC5
// File: src/api/index.ts
// ==========================================

import axios from 'axios';
import type { AxiosError } from 'axios';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// ==========================================
// RESPONSE INTERCEPTOR
// Xử lý lỗi tập trung
// ==========================================

apiClient.interceptors.response.use(
  // Response thành công - trả về bình thường
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },

  // Response lỗi - xử lý các mã lỗi
  (error: AxiosError) => {
    // Log chi tiết để debug
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    });

    const status = error.response?.status;

    // Lỗi 401 - Chưa đăng nhập
    if (status === 401) {
      console.error('❌ Chưa đăng nhập hoặc phiên hết hạn');
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

    // Lỗi network - không kết nối được (thường là CORS hoặc SSL)
    if (!error.response) {
      console.error('❌ Lỗi Network (có thể là CORS hoặc SSL certificate):', error.message);
      console.error('💡 Thử mở URL trực tiếp trong browser để accept SSL certificate');
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
