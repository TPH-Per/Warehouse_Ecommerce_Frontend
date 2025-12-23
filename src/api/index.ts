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
// SESSION HANDLER
// Xử lý hết phiên làm việc
// ==========================================

let isRedirecting = false; // Tránh redirect nhiều lần

/**
 * Xử lý khi session hết hạn hoặc server không khả dụng
 * Clear auth state và redirect về trang login
 */
const handleSessionExpired = async (reason: string) => {
  // Tránh redirect nhiều lần
  if (isRedirecting) return;
  isRedirecting = true;

  console.warn(`⚠️ Session expired: ${reason}`);

  // Clear localStorage
  localStorage.removeItem('user');

  // Thêm flag để trang login biết là session expired
  sessionStorage.setItem('session_expired', 'true');
  sessionStorage.setItem('session_expired_reason', reason);

  // Redirect về trang login (dùng window.location để đảm bảo reload hoàn toàn)
  // Chỉ redirect nếu không phải đang ở trang login/register
  const currentPath = window.location.pathname;
  if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
    window.location.href = '/login';
  }

  // Reset flag sau 2 giây
  setTimeout(() => {
    isRedirecting = false;
  }, 2000);
};

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
    const url = error.config?.url || '';

    // Bỏ qua các API không yêu cầu auth (login, register, public endpoints)
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
    const isPublicEndpoint = url.includes('/products') && !url.includes('/cart') && !url.includes('/order');

    // Lỗi 401 - Chưa đăng nhập hoặc phiên hết hạn
    if (status === 401) {
      console.error('❌ Chưa đăng nhập hoặc phiên hết hạn');

      // Chỉ xử lý session expired cho các endpoint yêu cầu auth
      if (!isAuthEndpoint) {
        handleSessionExpired('Xin vui lòng đăng nhập để tiếp tục.');
      }
    }

    // Lỗi 403 - Không có quyền
    if (status === 403) {
      console.error('❌ Không có quyền truy cập');

      // Có thể session bị invalidated hoặc role thay đổi
      if (!isAuthEndpoint) {
        handleSessionExpired('Xin vui lòng đăng nhập để tiếp tục.');
      }
    }

    // Lỗi 422 - Validation
    if (status === 422) {
      console.error('❌ Dữ liệu không hợp lệ:', error.response?.data);
    }

    // Lỗi 500 - Server error (có thể server vừa restart)
    if (status === 500) {
      console.error('❌ Lỗi server');

      // Kiểm tra nếu là lỗi liên quan đến session/auth
      const errorData = error.response?.data as any;
      const errorMessage = errorData?.Message || errorData?.message || '';

      if (errorMessage.toLowerCase().includes('session') ||
        errorMessage.toLowerCase().includes('auth') ||
        errorMessage.toLowerCase().includes('token') ||
        errorMessage.toLowerCase().includes('cookie')) {
        handleSessionExpired('Xin vui lòng đăng nhập để tiếp tục.');
      }
    }

    // Lỗi network - không kết nối được (server tắt, khởi động lại, CORS, SSL)
    if (!error.response) {
      console.error('❌ Lỗi Network (có thể là CORS, SSL, hoặc server không khả dụng):', error.message);
      console.error('💡 Thử mở URL trực tiếp trong browser để accept SSL certificate');

      // Nếu là network error và user đang đăng nhập, có thể server đã restart
      // Chỉ redirect nếu đang cố gọi API yêu cầu auth
      const hasLocalUser = localStorage.getItem('user');
      if (hasLocalUser && !isAuthEndpoint && !isPublicEndpoint) {
        // Đợi 1 chút xem có phải server đang restart
        // Nếu lỗi xảy ra liên tục, sẽ redirect
        const networkErrorKey = 'network_error_count';
        const currentCount = parseInt(sessionStorage.getItem(networkErrorKey) || '0', 10);

        if (currentCount >= 2) {
          // Đã thử 3 lần mà vẫn lỗi => redirect
          sessionStorage.removeItem(networkErrorKey);
          handleSessionExpired('Xin vui lòng đăng nhập để tiếp tục.');
        } else {
          sessionStorage.setItem(networkErrorKey, String(currentCount + 1));

          // Reset counter sau 10 giây
          setTimeout(() => {
            sessionStorage.removeItem(networkErrorKey);
          }, 10000);
        }
      }
    } else {
      // Reset network error counter khi có response (dù lỗi)
      sessionStorage.removeItem('network_error_count');
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
