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
        :to="{ name: 'ProductList' }"
        variant="text"
        class="nav-link"
        prepend-icon="mdi-store-outline"
      >
        Products
      </v-btn>

      <!-- 2-Level Category Menu with Flyout Submenu -->
      <v-menu open-on-hover :close-on-content-click="false" transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="nav-link"
            append-icon="mdi-chevron-down"
            prepend-icon="mdi-shape-outline"
          >
            Danh mục
          </v-btn>
        </template>
        
        <!-- Two-Column Flyout Menu -->
        <v-card class="category-flyout-menu rounded-xl" width="520">
          <div class="d-flex">
            <!-- LEFT: Category List (Level 1) -->
            <div class="category-left-panel">
              <div class="pa-3 pb-2">
                <span class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                  Danh mục
                </span>
              </div>
              
              <!-- Loading State -->
              <div v-if="categoriesStore.isLoading" class="pa-4 text-center">
                <v-progress-circular indeterminate color="primary" size="20" />
              </div>
              
              <!-- Categories -->
              <div v-else class="category-list-wrapper">
                <div
                  v-for="cat in displayCategories"
                  :key="cat.id"
                  class="category-item-row"
                  :class="{ 'is-active': hoveredCategoryId === cat.id }"
                  @mouseenter="hoveredCategoryId = cat.id"
                >
                  <router-link
                    :to="{ name: 'ProductList', query: { category: cat.id } }"
                    class="category-item-link"
                  >
                    <v-avatar size="28" :color="getCategoryColor(cat.id)" variant="tonal">
                      <v-icon size="14">{{ getCategoryIcon(cat.id) }}</v-icon>
                    </v-avatar>
                    <span class="category-item-name">{{ cat.name }}</span>
                    <v-icon size="16" class="chevron-icon">mdi-chevron-right</v-icon>
                  </router-link>
                </div>
              </div>
              
              <v-divider class="mx-3 my-2" />
              
              <!-- View All -->
              <div class="pa-3 pt-1">
                <v-btn
                  :to="{ name: 'ProductList' }"
                  variant="text"
                  color="primary"
                  size="small"
                  block
                  class="text-none"
                >
                  Xem tất cả sản phẩm →
                </v-btn>
              </div>
            </div>
            
            <!-- RIGHT: Submenu (Level 2) -->
            <div class="category-right-panel">
              <div v-if="hoveredCategory" class="h-100">
                <div class="pa-3 pb-2 d-flex align-center">
                  <v-avatar size="24" :color="getCategoryColor(hoveredCategory.id)" variant="tonal" class="mr-2">
                    <v-icon size="12">{{ getCategoryIcon(hoveredCategory.id) }}</v-icon>
                  </v-avatar>
                  <span class="text-body-2 font-weight-bold">{{ hoveredCategory.name }}</span>
                </div>
                
                <v-divider class="mx-3 mb-2" />
                
                <!-- Quick Filters -->
                <div class="px-3">
                  <div class="text-caption text-medium-emphasis mb-2">Lọc nhanh</div>
                  <div class="d-flex flex-wrap ga-2">
                    <v-chip
                      v-for="filter in getQuickFilters(hoveredCategory.id)"
                      :key="filter.label"
                      :to="{ name: 'ProductList', query: { category: hoveredCategory.id, ...filter.query } }"
                      size="small"
                      variant="outlined"
                      class="submenu-chip"
                    >
                      {{ filter.label }}
                    </v-chip>
                  </div>
                </div>
                
                <!-- Price Range -->
                <div class="px-3 mt-4">
                  <div class="text-caption text-medium-emphasis mb-2">Theo giá</div>
                  <div class="d-flex flex-wrap ga-2">
                    <v-chip
                      :to="{ name: 'ProductList', query: { category: hoveredCategory.id, price_max: 500000 } }"
                      size="small"
                      variant="tonal"
                      class="submenu-chip"
                    >
                      Dưới 500K
                    </v-chip>
                    <v-chip
                      :to="{ name: 'ProductList', query: { category: hoveredCategory.id, price_min: 500000, price_max: 2000000 } }"
                      size="small"
                      variant="tonal"
                      class="submenu-chip"
                    >
                      500K - 2M
                    </v-chip>
                    <v-chip
                      :to="{ name: 'ProductList', query: { category: hoveredCategory.id, price_min: 2000000 } }"
                      size="small"
                      variant="tonal"
                      class="submenu-chip"
                    >
                      Trên 2M
                    </v-chip>
                  </div>
                </div>
                
                <!-- CTA Button -->
                <div class="pa-3 mt-auto">
                  <v-btn
                    :to="{ name: 'ProductList', query: { category: hoveredCategory.id } }"
                    color="primary"
                    variant="flat"
                    block
                    size="small"
                  >
                    Xem {{ hoveredCategory.name }}
                  </v-btn>
                </div>
              </div>
              
              <!-- Empty state when no category hovered -->
              <div v-else class="d-flex flex-column align-center justify-center h-100 text-medium-emphasis">
                <v-icon size="48" color="grey-darken-1">mdi-cursor-default-click-outline</v-icon>
                <span class="text-body-2 mt-2">Di chuột vào danh mục</span>
              </div>
            </div>
          </div>
        </v-card>
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
              <span class="text-caption text-black font-weight-bold">{{ userInitials }}</span>
            </v-avatar>
            <span class="hidden-sm-and-down mr-1">{{ displayName }}</span>
            <v-icon size="small">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="neon-dropdown" rounded="lg" min-width="180" elevation="16">
          <v-list-item to="/profile" title="Hồ sơ" prepend-icon="mdi-account-circle" class="dropdown-item" />
          <v-list-item to="/order" title="Đơn hàng" prepend-icon="mdi-package-variant" class="dropdown-item" />
          <v-divider class="my-1" />
          <v-list-item @click="handleLogout" title="Đăng xuất" prepend-icon="mdi-logout" class="dropdown-item text-error" />
        </v-list>
      </v-menu>

      <v-btn v-else to="/login" variant="flat" color="primary" class="ml-2" rounded="xl">
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
      
      <!-- Mobile Categories -->
      <v-list-group value="categories">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Danh mục" prepend-icon="mdi-shape" class="dropdown-item" />
        </template>
        <v-list-item
          v-for="cat in displayCategories"
          :key="cat.id"
          :to="{ name: 'ProductList', query: { category: cat.id } }"
          :title="cat.name"
          density="compact"
          class="dropdown-item pl-8"
        />
      </v-list-group>
      
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useCategoriesStore } from '@/stores/categories.store';
import { useCartStore } from '@/stores/cart.store';

const router = useRouter();
const authStore = useAuthStore();
const categoriesStore = useCategoriesStore();
const cartStore = useCartStore();

// Computed từ auth store
const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUser = computed(() => authStore.user);

// Lấy chữ cái đầu để hiển thị avatar
const userInitials = computed(() => {
  if (!currentUser.value?.full_name) return 'U';
  return currentUser.value.full_name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

// Tên hiển thị
const displayName = computed(() => {
  return currentUser.value?.full_name || currentUser.value?.name || 'User';
});

// Cart count từ store
const cartCount = computed(() => cartStore.totalQuantity);

// Mock data cho wishlist/notifications (sẽ config sau)
const wishlistCount = ref(0);
const userUnreadCount = ref(0);

const searchQuery = ref('');
const showMobileMenu = ref(false);

// ========== DYNAMIC CATEGORIES ==========
const displayCategories = computed(() => {
  return categoriesStore.categories.map((cat: any) => ({
    id: cat.Id ?? cat.id,
    name: cat.Name ?? cat.name,
    slug: cat.Slug ?? cat.slug ?? '',
  }));
});

// Icon và màu cho từng category (có thể mở rộng)
const getCategoryIcon = (categoryId: number): string => {
  const icons: Record<number, string> = {
    1: 'mdi-book-open-variant',
    2: 'mdi-emoticon-cool',
    3: 'mdi-teddy-bear',
    4: 'mdi-star-circle',
    5: 'mdi-robot',
  };
  return icons[categoryId] || 'mdi-tag';
};

const getCategoryColor = (categoryId: number): string => {
  const colors: Record<number, string> = {
    1: 'pink',
    2: 'cyan',
    3: 'orange',
    4: 'purple',
    5: 'blue',
  };
  return colors[categoryId] || 'primary';
};

// ========== 2-LEVEL MENU LOGIC ==========
const hoveredCategoryId = ref<number | null>(null);

const hoveredCategory = computed(() => {
  if (!hoveredCategoryId.value) return null;
  return displayCategories.value.find(cat => cat.id === hoveredCategoryId.value) || null;
});

// Quick filters cho Level 2 submenu
const getQuickFilters = (categoryId: number): Array<{ label: string; query: Record<string, any> }> => {
  // Có thể customize theo từng category
  const filters: Record<number, Array<{ label: string; query: Record<string, any> }>> = {
    1: [
      { label: 'Mới nhất', query: { sort: 'newest' } },
      { label: 'Bán chạy', query: { sort: 'bestselling' } },
      { label: 'Đang giảm giá', query: { sale: true } },
    ],
    2: [
      { label: 'Mới nhất', query: { sort: 'newest' } },
      { label: 'Hot trend', query: { sort: 'trending' } },
    ],
  };
  return filters[categoryId] || [
    { label: 'Mới nhất', query: { sort: 'newest' } },
    { label: 'Bán chạy', query: { sort: 'bestselling' } },
    { label: 'Đang giảm giá', query: { sale: true } },
  ];
};

// ========== METHODS ==========
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/productlist', query: { search: searchQuery.value } });
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const toggleNotifications = () => {
  alert('Mở danh sách thông báo');
};

// Khởi tạo auth store và fetch data khi component mount
onMounted(async () => {
  // 1. Initialize auth store trước (load từ localStorage)
  authStore.initialize();
  
  // 2. Fetch categories (không cần auth)
  await categoriesStore.fetchCategories();
  
  // 3. Chỉ fetch cart nếu đã đăng nhập
  if (authStore.isAuthenticated) {
    await cartStore.fetchCart();
  }
});
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

/* Category Dropdown Styles - Traditional Vertical Layout */
.category-dropdown {
  background: rgba(18, 18, 26, 0.98) !important;
  border: 1px solid rgba(0, 212, 255, 0.2) !important;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.5),
    0 0 25px rgba(0, 212, 255, 0.1) !important;
  overflow: hidden;
}

.category-dropdown .v-list {
  background: transparent !important;
  max-height: 400px;
  overflow-y: auto;
}

/* Custom scrollbar for category list */
.category-dropdown .v-list::-webkit-scrollbar {
  width: 4px;
}

.category-dropdown .v-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.category-dropdown .v-list::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 2px;
}

.category-list-item {
  margin-bottom: 2px;
  transition: all 0.2s ease;
  min-height: 48px;
}

.category-list-item:hover {
  background: rgba(0, 212, 255, 0.1) !important;
}

.category-list-item:hover .v-list-item-title {
  color: #00d4ff;
}

.category-list-item:hover .v-icon {
  color: #00d4ff !important;
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

/* ========== FLYOUT MENU 2 LEVELS ========== */
.category-flyout-menu {
  background: rgba(18, 18, 26, 0.98) !important;
  border: 1px solid rgba(0, 212, 255, 0.2) !important;
  box-shadow: 
    0 15px 50px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(0, 212, 255, 0.1) !important;
  overflow: hidden;
}

.category-left-panel {
  width: 220px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
}

.category-right-panel {
  flex: 1;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
}

.category-list-wrapper {
  max-height: 280px;
  overflow-y: auto;
}

.category-list-wrapper::-webkit-scrollbar {
  width: 3px;
}

.category-list-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 2px;
}

.category-item-row {
  transition: all 0.15s ease;
}

.category-item-row.is-active {
  background: rgba(0, 212, 255, 0.1);
}

.category-item-row.is-active .category-item-name {
  color: #00d4ff;
}

.category-item-row.is-active .chevron-icon {
  color: #00d4ff !important;
  transform: translateX(3px);
}

.category-item-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.15s ease;
}

.category-item-link:hover {
  background: rgba(0, 212, 255, 0.08);
}

.category-item-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
}

.chevron-icon {
  color: rgba(255, 255, 255, 0.4) !important;
  transition: all 0.2s ease;
}

.submenu-chip {
  transition: all 0.2s ease;
  cursor: pointer;
}

.submenu-chip:hover {
  border-color: rgba(0, 212, 255, 0.5) !important;
  background: rgba(0, 212, 255, 0.15) !important;
  color: #00d4ff !important;
}
</style>