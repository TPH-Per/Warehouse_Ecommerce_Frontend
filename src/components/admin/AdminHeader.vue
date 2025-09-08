<template>
  <header class="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800">
    <div class="flex items-center">
      <button @click="$emit('toggle-sidebar')" class="text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden">
        <Menu class="h-6 w-6" />
      </button>
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 ml-4">{{ pageTitle }}</h1>
    </div>

    <div class="flex items-center space-x-4">
      <ThemeToggle />
      
      <!-- Notifications -->
      <div class="relative">
        <button 
          @click="toggleNotifications"
          class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none relative"
        >
          <Bell class="h-6 w-6" />
          <span 
            v-if="userUnreadCount > 0"
            class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full"
          >
            {{ userUnreadCount > 99 ? '99+' : userUnreadCount }}
          </span>
        </button>
      </div>

      <div class="relative">
        <button @click="dropdownOpen = !dropdownOpen" class="flex items-center space-x-2 focus:outline-none">
          <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold">{{ currentUser?.firstName?.charAt(0) }}{{ currentUser?.lastName?.charAt(0) }}</span>
          </div>
          <span class="hidden md:block text-gray-700 dark:text-gray-300 font-medium">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</span>
          <ChevronDown class="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div v-if="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 h-full w-full z-10"></div>

        <div v-if="dropdownOpen" class="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl z-20 border dark:border-gray-700">
          <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Hồ sơ</router-link>
          <router-link to="/" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cửa hàng</router-link>
          <div class="border-t my-1 dark:border-gray-700"></div>
          <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Menu, Bell, ChevronDown } from 'lucide-vue-next';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useAuth } from '@/composables/useAuth';
import { useNotifications } from '@/composables/useNotifications';

defineEmits(['toggle-sidebar']);

const route = useRoute();
const router = useRouter();
const { currentUser, logout } = useAuth();
const { userUnreadCount, togglePanel } = useNotifications();

const dropdownOpen = ref(false);

const toggleNotifications = () => {
  togglePanel();
  dropdownOpen.value = false; // Close user dropdown when opening notifications
};

const pageTitle = computed(() => {
  const name = route.name as string;
  if (name) {
    return name.replace('Admin', '');
  }
  return 'Dashboard';
});

const handleLogout = () => {
  logout();
  router.push('/auth');
};
</script>
