// ==========================================
// Auth Store - Quản lý authentication với cookie-based auth
// File: src/stores/auth.store.ts
// ==========================================

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/api';

// Interface cho user - normalize từ API response
export interface AuthUser {
    id: number;
    name: string;
    full_name: string;
    email: string;
    phone_number?: string | null;
    role_id?: number;
    role_name?: string;
}

// Normalize user data từ API (support cả PascalCase và camelCase)
const normalizeUser = (data: any): AuthUser | null => {
    if (!data) return null;

    return {
        id: data.Id ?? data.id,
        name: data.Name ?? data.name ?? '',
        full_name: data.FullName ?? data.full_name ?? data.Name ?? data.name ?? '',
        email: data.Email ?? data.email ?? '',
        phone_number: data.PhoneNumber ?? data.phone_number ?? null,
        role_id: data.RoleId ?? data.role_id,
        role_name: data.RoleName ?? data.role_name ?? 'user',
    };
};

export const useAuthStore = defineStore('auth', () => {
    // ========== STATE ==========
    const user = ref<AuthUser | null>(null);
    const isLoading = ref(false);

    // ========== GETTERS ==========
    const isAuthenticated = computed(() => user.value !== null);
    const displayName = computed(() => user.value?.full_name || user.value?.name || 'Guest');

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
                const parsed = JSON.parse(savedUser);
                user.value = normalizeUser(parsed);
            } catch {
                localStorage.removeItem('user');
            }
        }
    };

    /**
     * Đăng nhập - Lưu user sau khi API trả về thành công
     * @param userData - Thông tin user từ API response (PascalCase hoặc camelCase)
     */
    const login = (userData: any) => {
        const normalized = normalizeUser(userData);
        if (normalized) {
            user.value = normalized;
            localStorage.setItem('user', JSON.stringify(normalized));
        }
    };

    /**
     * Đăng xuất - Xóa thông tin user và gọi API logout
     */
    const logout = async () => {
        try {
            // Gọi API logout để xóa cookie phía server
            await apiClient.post('/profile/logout');
        } catch (error) {
            // Ignore error - vẫn xóa local state
            console.log('Logout API error (ignored):', error);
        }

        // Xóa local state
        user.value = null;
        localStorage.removeItem('user');
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

    /**
     * Set user trực tiếp (dùng sau khi login API success)
     */
    const setUser = (userData: any) => {
        login(userData);
    };

    /**
     * Clear user (không gọi API)
     */
    const clearUser = () => {
        user.value = null;
        localStorage.removeItem('user');
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
        setUser,
        clearUser,
    };
});

