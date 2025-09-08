import { ref, computed } from 'vue';
import { generateMockUsers } from '@/data/mockData';
import type { User, UserRole } from '@/types';
import { rolePermissions } from '@/config/permissions';

const currentUser = ref<User | null>(null);
const isAuthenticated = computed(() => currentUser.value !== null);

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

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would make an API call with password hashing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = userDatabase.find(u => u.email === email);
    
    // For this mock, we'll accept the password '123sinhtobO' for the specified accounts
    const isPasswordCorrect = (user?.email === 'admin@gmail.com' || user?.email === 'customer@gmail.com' || user?.email === 'manager@gmail.com') && password === '123sinhtobO';

    if (user && (isPasswordCorrect || password !== '123sinhtobO')) { // Allow other mock users to log in with any password
        currentUser.value = user;
        return { success: true, user };
    }

    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    currentUser.value = null;
  };

  const register = async (userData: Partial<User>) => {
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
  };

  const hasPermission = (permission: string) => {
    const userRole = currentUser.value?.role;
    if (!userRole) return false;
    return rolePermissions[userRole]?.includes(permission);
  };
  
  const canAccessAdmin = computed(() => {
    const userRole = currentUser.value?.role;
    if (!userRole) return false;
    return ['admin', 'manager', 'staff'].includes(userRole);
  });

  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated,
    login,
    logout,
    register,
    hasPermission,
    canAccessAdmin
  };
};
