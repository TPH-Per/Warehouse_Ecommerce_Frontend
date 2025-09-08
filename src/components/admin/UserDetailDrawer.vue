<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
    @click="$emit('close')"
  ></div>
  
  <div 
    class="fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div v-if="user" class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">User Details</h2>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <X class="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Profile Info -->
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white text-2xl font-bold">{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ user.firstName }} {{ user.lastName }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Vai trò:</span>
            <span class="px-2 py-1 text-xs rounded-full font-medium" :class="getRoleColor(user.role)">
              {{ translateRole(user.role) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Trạng thái:</span>
            <span class="px-2 py-1 text-xs rounded-full" :class="user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'">
              {{ user.isActive ? 'Hoạt động' : 'Không hoạt động' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Đăng nhập lần cuối:</span>
            <span class="text-gray-800 dark:text-gray-200">{{ new Date(user.lastLogin).toLocaleString('vi-VN') }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Xác minh tuổi:</span>
            <span class="text-gray-800 dark:text-gray-200">{{ user.isAgeVerified ? 'Có' : 'Không' }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="border-t dark:border-gray-700 pt-6 space-y-3">
          <h4 class="font-semibold text-gray-700 dark:text-gray-300">Actions</h4>
          <button class="w-full btn btn-secondary">
            <UserCog class="h-4 w-4 mr-2" />
            Edit User
          </button>
          <button class="w-full btn btn-secondary">
            <KeyRound class="h-4 w-4 mr-2" />
            Reset Password
          </button>
          <button class="w-full btn btn-secondary text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50">
            <UserSwitch class="h-4 w-4 mr-2" />
            Impersonate User
          </button>
          <button class="w-full btn btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50">
            <Lock class="h-4 w-4 mr-2" />
            {{ user.isActive ? 'Lock Account' : 'Unlock Account' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, UserCog, KeyRound, UserSwitch, Lock } from 'lucide-vue-next';
import type { User, UserRole } from '@/types';

defineProps<{
  user: User | null;
  isOpen: boolean;
}>();

defineEmits(['close']);

const getRoleColor = (role: UserRole) => {
  const colors: Record<UserRole, string> = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    staff: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    customer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return colors[role];
};

const translateRole = (role: UserRole) => {
  const translations: Record<UserRole, string> = {
    admin: 'Quản trị viên',
    manager: 'Quản lý',
    staff: 'Nhân viên',
    customer: 'Khách hàng',
  };
  return translations[role];
};
</script>
