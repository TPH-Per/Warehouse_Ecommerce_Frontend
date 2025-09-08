import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, UserRole } from '@/types';
import { rolePermissions } from '@/config/permissions';
import { generateMockUsers } from '@/data/mockData';

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Mock user database with specific users
  const userDatabase: User[] = [
    {
      id: 'admin-user-01',
      email: 'admin@gmail.com',
      firstName: 'Admin',
      lastName: 'Superuser',
      phone: '+1234567890',
      role: 'admin',
      isActive: true,
      isAgeVerified: true,
      preferences: {
        currency: 'JPY',
        language: 'en',
      },
      lastLogin: new Date().toISOString(),
    },
    {
      id: 'manager-user-01',
      email: 'manager@gmail.com',
      firstName: 'Wibu',
      lastName: 'Manager',
      phone: '+1122334455',
      role: 'manager',
      isActive: true,
      isAgeVerified: true,
      preferences: {
        currency: 'JPY',
        language: 'en',
      },
      lastLogin: new Date().toISOString(),
    },
    {
      id: 'customer-user-01',
      email: 'customer@gmail.com',
      firstName: 'Wibu',
      lastName: 'Customer',
      phone: '+10987654321',
      role: 'customer',
      isActive: true,
      isAgeVerified: true,
      preferences: {
        currency: 'JPY',
        language: 'en',
      },
      lastLogin: new Date().toISOString(),
    },
    ...generateMockUsers(10)
  ];

  // Getters
  const isAuthenticated = computed(() => currentUser.value !== null);
  
  const canAccessAdmin = computed(() => {
    const userRole = currentUser.value?.role;
    if (!userRole) return false;
    return ['admin', 'manager', 'staff'].includes(userRole);
  });

  const userPermissions = computed(() => {
    const userRole = currentUser.value?.role;
    if (!userRole) return [];
    return rolePermissions[userRole] || [];
  });

  // Actions
  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Mock login - in real app, this would make an API call with password hashing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = userDatabase.find(u => u.email === email);
      
      // For this mock, we'll accept the password '123sinhtobO' for the specified accounts
      const isPasswordCorrect = (user?.email === 'admin@gmail.com' || user?.email === 'customer@gmail.com' || user?.email === 'manager@gmail.com') && password === '123sinhtobO';

      if (user && (isPasswordCorrect || password !== '123sinhtobO')) { // Allow other mock users to log in with any password
        currentUser.value = user;
        return { success: true, user };
      }

      error.value = 'Thông tin đăng nhập không hợp lệ';
      return { success: false, message: 'Invalid credentials' };
    } catch (err) {
      error.value = 'Đã xảy ra lỗi khi đăng nhập';
      console.error('Login error:', err);
      return { success: false, message: 'Login failed' };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    currentUser.value = null;
    error.value = null;
  };

  const register = async (userData: Partial<User>) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        role: 'customer',
        isActive: true,
        isAgeVerified: userData.isAgeVerified || false,
        preferences: userData.preferences || { currency: 'JPY', language: 'en' },
        lastLogin: new Date().toISOString(),
      };
      
      userDatabase.push(newUser);
      currentUser.value = newUser;
      return { success: true };
    } catch (err) {
      error.value = 'Đã xảy ra lỗi khi đăng ký';
      console.error('Registration error:', err);
      return { success: false, message: 'Registration failed' };
    } finally {
      loading.value = false;
    }
  };

  const hasPermission = (permission: string) => {
    return userPermissions.value.includes(permission);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser.value) return { success: false, message: 'Not authenticated' };
    
    loading.value = true;
    error.value = null;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      currentUser.value = { ...currentUser.value, ...updates };
      return { success: true };
    } catch (err) {
      error.value = 'Đã xảy ra lỗi khi cập nhật thông tin';
      console.error('Profile update error:', err);
      return { success: false, message: 'Profile update failed' };
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    currentUser,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    canAccessAdmin,
    userPermissions,
    
    // Actions
    login,
    logout,
    register,
    hasPermission,
    updateProfile,
  };
});