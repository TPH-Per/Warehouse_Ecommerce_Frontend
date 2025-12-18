<template>
  <v-app-bar
    color="primary"
    flat
    class="px-md-4 border-b"
    style="background: linear-gradient(to right, #0ea5e9, #3b82f6, #ec4899) !important;"
  >
    <v-btn to="/" variant="text" class="pa-0 h-auto" :ripple="false">
      <div class="logo-container d-flex align-center justify-center px-4 py-2 rounded-xl">
        <span class="text-h5 font-weight-bold text-white">Per</span>
        <span class="text-h6 font-weight-black text-yellow-accent-2 animate-pulse ml-1">W</span>
      </div>
    </v-btn>

    <v-spacer></v-spacer>

    <div class="hidden-sm-and-down d-flex align-center">
      <v-btn
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        variant="text"
        class="text-capitalize text-white"
      >
        {{ link.label }}
      </v-btn>

      <v-menu open-on-hover transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="text-capitalize text-white"
            append-icon="mdi-chevron-down"
          >
            Danh mục
          </v-btn>
        </template>
        <v-list border rounded="lg" elevation="10">
          <v-list-item
            v-for="category in categoryQuickLinks"
            :key="category.to"
            :to="category.to"
            :title="category.label"
            hover
          ></v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-responsive max-width="400" class="mx-4 hidden-sm-and-down">
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm kiếm figure anime..."
        variant="solo-filled"
        flat
        hide-details
        rounded="xl"
        density="compact"
        bg-color="white-lighten-4"
        @keyup.enter="handleSearch"
      ></v-text-field>
    </v-responsive>

    <v-spacer></v-spacer>

    <div class="d-flex align-center">
      <v-btn v-if="isAuthenticated" icon class="text-white" @click="toggleNotifications">
        <v-badge :content="userUnreadCount" color="white" text-color="pink" :model-value="userUnreadCount > 0">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <v-btn icon to="/wishlist" class="text-white">
        <v-badge :content="wishlistCount" color="pink" :model-value="wishlistCount > 0">
          <v-icon>mdi-heart-outline</v-icon>
        </v-badge>
      </v-btn>

      <v-btn icon to="/cart" class="text-white">
        <v-badge :content="cartCount" color="pink" :model-value="cartCount > 0">
          <v-icon>mdi-shopping-outline</v-icon>
        </v-badge>
      </v-btn>

      <v-menu v-if="isAuthenticated">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="ml-2 rounded-xl text-white" variant="outlined">
            <v-avatar size="24" color="white-lighten-2" class="mr-2">
              <span class="text-caption">{{ currentUser.firstName.charAt(0) }}</span>
            </v-avatar>
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list  rounded="lg" min-width="150" elevation="10">
          <v-list-item to="/profile" title="Hồ sơ" prepend-icon="mdi-account-circle"></v-list-item>
          <v-list-item to="/orders" title="Đơn hàng" prepend-icon="mdi-package-variant"></v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="handleLogout" title="Đăng xuất" prepend-icon="mdi-logout" base-color="error"></v-list-item>
        </v-list>
      </v-menu>

      <v-btn v-else to="/auth" variant="outlined" class="ml-2 rounded-xl text-white text-capitalize">
        Đăng nhập
      </v-btn>

      <v-app-bar-nav-icon class="hidden-md-and-up text-white" @click="showMobileMenu = !showMobileMenu"></v-app-bar-nav-icon>
    </div>
  </v-app-bar>

  <v-navigation-drawer v-model="showMobileMenu" location="right" temporary>
    <v-list>
      <v-list-item to="/" title="Trang chủ" prepend-icon="mdi-home"></v-list-item>
      <v-list-item to="/products" title="Sản phẩm" prepend-icon="mdi-star"></v-list-item>
      <v-divider></v-divider>
      <v-list-item class="mt-2">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          placeholder="Tìm kiếm..."
          variant="outlined"
          rounded="lg"
          density="compact"
          hide-details
          @keyup.enter="handleSearch"
        ></v-text-field>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// --- DỮ LIỆU GIẢ ĐỂ LÀM GIAO DIỆN (Thay thế cho Composables) ---
const isAuthenticated = ref(true); // Thử đổi thành false để xem nút Đăng nhập
const cartCount = ref(3);
const wishlistCount = ref(1);
const userUnreadCount = ref(5);
const currentUser = ref({
  firstName: 'Hoàng',
});

const searchQuery = ref('');
const showMobileMenu = ref(false);

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Sản phẩm', to: '/products' },
];

const categoryQuickLinks = [
  { label: 'Figures', to: '/products?category=figures' },
  { label: 'Nendoroids', to: '/products?category=nendoroids' },
  { label: 'Plushies', to: '/products?category=plushies' },
  { label: 'Figma', to: '/products?category=figma' },
];

// --- CÁC HÀM XỬ LÝ GIAO DIỆN TẠM THỜI ---
const handleSearch = () => {
  alert('Bạn đang tìm: ' + searchQuery.value);
};

const handleLogout = () => {
  isAuthenticated.value = false;
  alert('Đã đăng xuất!');
};

const toggleNotifications = () => {
  alert('Mở danh sách thông báo');
};
</script>

<style scoped>
.logo-container {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>