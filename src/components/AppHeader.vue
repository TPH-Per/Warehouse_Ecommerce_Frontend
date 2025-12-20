<template>
  <v-app-bar flat class="app-header px-md-4" height="70">
    <!-- Logo -->
    <v-btn to="/" variant="text" class="pa-0 h-auto" :ripple="false">
      <div class="logo-container d-flex align-center justify-center px-4 py-2 rounded-xl">
        <span class="text-h5 font-weight-bold neon-text-primary">Wibu</span>
        <span class="text-h5 font-weight-black neon-text-secondary ml-1">Shop</span>
      </div>
    </v-btn>

    <v-spacer />

    <!-- Desktop Navigation -->
    <div class="hidden-sm-and-down d-flex align-center ga-2">
      <v-btn
        to="/"
        variant="text"
        class="nav-link"
        prepend-icon="mdi-home-variant-outline"
      >
        Home
      </v-btn>

      <v-btn
        :to="{ name: 'ProductList', query: { id: 1 } }"
        variant="text"
        class="nav-link"
        prepend-icon="mdi-store-outline"
      >
        Products
      </v-btn>

      <v-menu open-on-hover transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="nav-link"
            append-icon="mdi-chevron-down"
          >
            Danh mục
          </v-btn>
        </template>
        <v-list class="neon-dropdown" rounded="lg" elevation="16">
          <v-list-item
            v-for="category in categoryQuickLinks"
            :key="category.to"
            :to="category.to"
            :title="category.label"
            class="dropdown-item"
          />
        </v-list>
      </v-menu>
    </div>

    <!-- Search Box -->
    <v-responsive max-width="360" class="mx-4 hidden-sm-and-down">
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm kiếm figure anime..."
        variant="outlined"
        hide-details
        rounded="xl"
        density="compact"
        class="search-field"
        bg-color="surface-variant"
        @keyup.enter="handleSearch"
      />
    </v-responsive>

    <v-spacer />

    <!-- Action Buttons -->
    <div class="d-flex align-center ga-1">
      <!-- Notifications -->
      <v-btn v-if="isAuthenticated" icon variant="text" class="action-btn" @click="toggleNotifications">
        <v-badge :content="userUnreadCount" color="secondary" :model-value="userUnreadCount > 0">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- Wishlist -->
      <v-btn icon :to="{ name: 'WishList', query: { id: 1 } }" variant="text" class="action-btn">
        <v-badge :content="wishlistCount" color="secondary" :model-value="wishlistCount > 0">
          <v-icon>mdi-heart-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- Cart -->
      <v-btn icon :to="{ name: 'Cart', query: { id: 1 } }" variant="text" class="action-btn">
        <v-badge :content="cartCount" color="secondary" :model-value="cartCount > 0">
          <v-icon>mdi-shopping-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- User Menu -->
      <v-menu v-if="isAuthenticated">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="ml-2 user-btn" variant="outlined" rounded="xl">
            <v-avatar size="24" color="primary" class="mr-2">
              <span class="text-caption text-black font-weight-bold">{{ currentUser.firstName.charAt(0) }}</span>
            </v-avatar>
            <v-icon size="small">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="neon-dropdown" rounded="lg" min-width="180" elevation="16">
          <v-list-item to="/profile" title="Hồ sơ" prepend-icon="mdi-account-circle" class="dropdown-item" />
          <v-list-item to="/orders" title="Đơn hàng" prepend-icon="mdi-package-variant" class="dropdown-item" />
          <v-divider class="my-1" />
          <v-list-item @click="handleLogout" title="Đăng xuất" prepend-icon="mdi-logout" class="dropdown-item text-error" />
        </v-list>
      </v-menu>

      <v-btn v-else to="/auth" variant="flat" color="primary" class="ml-2" rounded="xl">
        Đăng nhập
      </v-btn>

      <!-- Mobile Menu Toggle -->
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="showMobileMenu = !showMobileMenu" />
    </div>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="showMobileMenu" location="right" temporary class="mobile-drawer">
    <v-list class="pa-4">
      <v-list-item to="/" title="Trang chủ" prepend-icon="mdi-home" class="dropdown-item mb-2" />
      <v-list-item :to="{ name: 'ProductList' }" title="Sản phẩm" prepend-icon="mdi-store" class="dropdown-item mb-2" />
      <v-list-item :to="{ name: 'WishList' }" title="Yêu thích" prepend-icon="mdi-heart" class="dropdown-item mb-2" />
      <v-list-item :to="{ name: 'Cart' }" title="Giỏ hàng" prepend-icon="mdi-cart" class="dropdown-item mb-2" />
      <v-divider class="my-4" />
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm kiếm..."
        variant="outlined"
        rounded="lg"
        density="compact"
        hide-details
        class="search-field"
        @keyup.enter="handleSearch"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Mock Data
const isAuthenticated = ref(true);
const cartCount = ref(3);
const wishlistCount = ref(1);
const userUnreadCount = ref(5);
const currentUser = ref({
  firstName: 'Hoàng',
});

const searchQuery = ref('');
const showMobileMenu = ref(false);

const categoryQuickLinks = [
  { label: '🎭 Figures', to: '/products?category=figures' },
  { label: '🐣 Nendoroids', to: '/products?category=nendoroids' },
  { label: '🧸 Plushies', to: '/products?category=plushies' },
  { label: '🤖 Figma', to: '/products?category=figma' },
];

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
.app-header {
  background: rgba(10, 10, 15, 0.95) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.15) !important;
}

.logo-container {
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.2);
  transition: all 0.3s ease;
}

.logo-container:hover {
  background: rgba(0, 212, 255, 0.15);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
}

.nav-link {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #00d4ff !important;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.search-field :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-field :deep(.v-field:focus-within) {
  border-color: rgba(0, 212, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
}

.action-btn {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.3s ease;
}

.action-btn:hover {
  color: #00d4ff !important;
}

.user-btn {
  border-color: rgba(0, 212, 255, 0.3) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.user-btn:hover {
  border-color: rgba(0, 212, 255, 0.6) !important;
  background: rgba(0, 212, 255, 0.1) !important;
}

.neon-dropdown {
  background: rgba(18, 18, 26, 0.98) !important;
  border: 1px solid rgba(0, 212, 255, 0.2) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5),
              0 0 20px rgba(0, 212, 255, 0.1) !important;
}

.dropdown-item {
  border-radius: 8px;
  margin: 2px 8px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(0, 212, 255, 0.1) !important;
}

.mobile-drawer {
  background: rgba(10, 10, 15, 0.98) !important;
}
</style>