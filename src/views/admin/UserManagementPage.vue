<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">User & Role Management</h2>
    
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <!-- Actions -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div class="relative w-full md:w-1/3">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search users by name or email..." 
            class="w-full pl-10 pr-4 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg" 
          />
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <div class="flex items-center space-x-2">
          <button class="btn btn-secondary">
            <Filter class="h-4 w-4 mr-2" />
            Filter
          </button>
          <button class="btn btn-primary">
            <Plus class="h-4 w-4 mr-2" />
            Create User
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-500 dark:text-gray-400 text-sm">
              <th class="py-2 px-4">Name</th>
              <th class="py-2 px-4">Email</th>
              <th class="py-2 px-4">Role</th>
              <th class="py-2 px-4">Status</th>
              <th class="py-2 px-4">Last Login</th>
              <th class="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in filteredUsers" 
              :key="user.id" 
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              @click="openUserDrawer(user)"
            >
              <td class="py-3 px-4 flex items-center">
                <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white text-sm font-medium">{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
                </div>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ user.firstName }} {{ user.lastName }}</span>
              </td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-300">{{ user.email }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 text-xs rounded-full font-medium" :class="getRoleColor(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 text-xs rounded-full" :class="user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-300">{{ new Date(user.lastLogin).toLocaleString() }}</td>
              <td class="py-3 px-4">
                <button @click.stop="openUserDrawer(user)" class="p-1 text-gray-400 hover:text-blue-600"><Eye class="h-5 w-5" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <UserDetailDrawer :user="selectedUser" :is-open="isDrawerOpen" @close="isDrawerOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Plus, Filter, Eye } from 'lucide-vue-next';
import { generateMockUsers } from '@/data/mockData';
import type { User, UserRole } from '@/types';
import UserDetailDrawer from '@/components/admin/UserDetailDrawer.vue';

const users = ref<User[]>(generateMockUsers(25));
const searchQuery = ref('');
const isDrawerOpen = ref(false);
const selectedUser = ref<User | null>(null);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.firstName.toLowerCase().includes(lowerQuery) ||
    user.lastName.toLowerCase().includes(lowerQuery) ||
    user.email.toLowerCase().includes(lowerQuery)
  );
});

const getRoleColor = (role: UserRole) => {
  const colors: Record<UserRole, string> = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    staff: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    customer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return colors[role];
};

const openUserDrawer = (user: User) => {
  selectedUser.value = user;
  isDrawerOpen.value = true;
};
</script>
