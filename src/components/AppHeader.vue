<template>
  <header class="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">OP</span>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-gray-50 hidden sm:block">Otaku Paradise</span>
        </router-link>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Trang chủ</router-link>
          <router-link to="/products" class="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Sản phẩm</router-link>
          <div class="relative group">
            <button class="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center">
              Danh mục
              <ChevronDown class="ml-1 h-4 w-4" />
            </button>
            <div class="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border dark:border-gray-700">
              <div class="py-2">
                <a href="/products?category=figures" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Figures</a>
                <a href="/products?category=nendoroids" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Nendoroids</a>
                <a href="/products?category=plushies" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Gấu bông</a>
                <a href="/products?category=figma" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Figma</a>
              </div>
            </div>
          </div>
        </nav>

        <!-- Search -->
        <div class="flex-1 max-w-md mx-4 hidden lg:block">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm figure anime..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>

        <!-- User Actions -->
        <div class="flex items-center space-x-2">
          <ThemeToggle />
          
          <!-- Notifications (only for authenticated users) -->
          <div v-if="isAuthenticated" class="relative">
            <button 
              @click="toggleNotifications"
              class="relative p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            >
              <Bell class="h-6 w-6" />
              <span 
                v-if="userUnreadCount > 0" 
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
              >
                {{ userUnreadCount > 99 ? '99+' : userUnreadCount }}
              </span>
            </button>
          </div>
          
          <!-- Wishlist -->
          <router-link to="/wishlist" class="relative p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
            <Heart class="h-6 w-6" />
            <span v-if="wishlistCount > 0" class="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ wishlistCount }}
            </span>
          </router-link>

          <!-- Cart -->
          <router-link to="/cart" class="relative p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
            <ShoppingBag class="h-6 w-6" />
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div class="relative" v-if="isAuthenticated">
            <button @click="showUserMenu = !showUserMenu" class="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">{{ currentUser?.firstName?.charAt(0) }}</span>
              </div>
            </button>
            <div v-if="showUserMenu" class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700">
              <div class="py-2">
                <router-link to="/profile" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Hồ sơ</router-link>
                <router-link to="/orders" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Đơn hàng</router-link>
                <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Đăng xuất</button>
              </div>
            </div>
          </div>
          <router-link v-else to="/auth" class="btn btn-primary px-4 py-2">Đăng nhập</router-link>

          <!-- Mobile Menu -->
          <button @click="showMobileMenu = !showMobileMenu" class="md:hidden p-2 text-gray-700 dark:text-gray-300">
            <Menu class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden border-t dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="py-4 space-y-2">
          <router-link to="/" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Trang chủ</router-link>
          <router-link to="/products" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Sản phẩm</router-link>
          <div class="px-4 py-2">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                v-model="searchQuery"
                @keyup.enter="handleSearch"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Heart, ShoppingBag, Menu, ChevronDown, Bell } from 'lucide-vue-next';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { useAuth } from '@/composables/useAuth';
import { useNotifications } from '@/composables/useNotifications';

const router = useRouter();
const { cartCount } = useCart();
const { wishlistCount } = useWishlist();
const { isAuthenticated, currentUser, logout } = useAuth();
const { userUnreadCount, togglePanel } = useNotifications();

const searchQuery = ref('');
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

const toggleNotifications = () => {
  togglePanel();
  showUserMenu.value = false; // Close user menu when opening notifications
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/products?search=${encodeURIComponent(searchQuery.value)}`);
    showMobileMenu.value = false;
  }
};

const handleLogout = () => {
  logout();
  showUserMenu.value = false;
  router.push('/auth');
};
</script>
