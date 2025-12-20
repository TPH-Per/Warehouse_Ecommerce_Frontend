// ==========================================
// Auth Store - Lưu thông tin user đơn giản
// File: src/stores/auth.store.ts
// ==========================================

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Interface đơn giản cho user - khớp với API response
export interface AuthUser {
    id: number;
    name: string;
    full_name: string;
    email: string;
    phone_number?: string | null;
    role_id?: number;
    role_name?: string;
}

export const useAuthStore = defineStore('auth', () => {
    // ========== STATE ==========
    // Lưu thông tin user đang đăng nhập
    const user = ref<AuthUser | null>(null);
    const isLoading = ref(false);

    // ========== GETTERS ==========
    // Kiểm tra đã đăng nhập chưa
    const isAuthenticated = computed(() => user.value !== null);

    // Lấy tên hiển thị
    const displayName = computed(() => user.value?.full_name || user.value?.name || 'Guest');

    // Lấy chữ cái đầu để hiển thị avatar
    const initials = computed(() => {
        if (!user.value?.full_name) return 'G';
        return user.value.full_name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    });

    // ========== ACTIONS ==========

    /**
     * Khởi tạo - Load user từ localStorage khi app start
     */
    const initialize = () => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                user.value = JSON.parse(savedUser);
            } catch {
                localStorage.removeItem('user');
            }
        }
    };

    /**
     * Đăng nhập - Lưu user sau khi API trả về thành công
     * @param userData - Thông tin user từ API response
     */
    const login = (userData: AuthUser) => {
        user.value = userData;
        // Lưu vào localStorage để maintain session khi refresh
        localStorage.setItem('user', JSON.stringify(userData));
    };

    /**
     * Đăng xuất - Xóa thông tin user
     */
    const logout = () => {
        user.value = null;
        localStorage.removeItem('user');
        // Có thể gọi API logout ở backend nếu cần
    };

    /**
     * Cập nhật thông tin user
     */
    const updateUser = (userData: Partial<AuthUser>) => {
        if (user.value) {
            user.value = { ...user.value, ...userData };
            localStorage.setItem('user', JSON.stringify(user.value));
        }
    };

    return {
        // State
        user,
        isLoading,
        // Getters
        isAuthenticated,
        displayName,
        initials,
        // Actions
        initialize,
        login,
        logout,
        updateUser,
    };
});

// ==========================================
// CÁCH SỬ DỤNG
// ==========================================
/*
  // Trong component hoặc file khác:
  import { useAuthStore } from '@/stores/auth.store';
  
  const authStore = useAuthStore();
  
  // Kiểm tra đăng nhập
  if (authStore.isAuthenticated) {
    console.log('Đã đăng nhập:', authStore.user?.name);
  }
  
  // Sau khi gọi API login thành công:
  const response = await apiClient.post('/auth/login', { email, password });
  if (response.data.success) {
    authStore.login(response.data.user);
  }
  
  // Đăng xuất:
  authStore.logout();
  
  // Trong App.vue - khởi tạo khi app load:
  onMounted(() => {
    authStore.initialize();
  });
*/
