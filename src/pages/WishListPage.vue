<template>
  <div class="wishlist-page">
    <!-- Hero Header -->
    <section class="wishlist-hero py-10">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center ga-4 mb-4">
              <v-avatar size="64" class="hero-avatar">
                <v-icon size="32">mdi-heart</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 text-md-h3 font-weight-bold">Danh sách yêu thích</h1>
                <p class="text-body-1 text-medium-emphasis mb-0">
                  Lưu giữ những món đồ bạn yêu thích để mua sau
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="stats-card pa-4 rounded-xl" variant="flat">
              <div class="d-flex justify-space-around text-center">
                <div>
                  <div class="text-h4 font-weight-bold neon-text-primary">{{ wishlistStore.itemCount }}</div>
                  <div class="text-caption text-medium-emphasis">Sản phẩm</div>
                </div>
                <v-divider vertical />
                <div>
                  <div class="text-h4 font-weight-bold neon-text-secondary">{{ formatPrice(wishlistStore.totalValue) }}</div>
                  <div class="text-caption text-medium-emphasis">Tổng giá trị</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <div class="hero-glow" />
    </section>

    <v-container class="py-8">
      <!-- Login Required State -->
      <v-card v-if="!isAuthenticated" class="empty-state rounded-2xl overflow-hidden" variant="flat">
        <div class="empty-content text-center py-16 px-6">
          <div class="empty-icon-wrapper mb-6">
            <v-icon size="80" class="empty-icon">mdi-account-lock-outline</v-icon>
          </div>
          <h2 class="text-h5 font-weight-bold mb-3">Vui lòng đăng nhập</h2>
          <p class="text-body-1 text-medium-emphasis mb-8" style="max-width: 400px; margin: 0 auto;">
            Đăng nhập để xem và quản lý danh sách yêu thích của bạn
          </p>
          <v-btn 
            :to="{ name: 'Login', query: { redirect: '/wishlist' } }" 
            color="secondary" 
            size="large" 
            rounded="xl"
            class="explore-btn px-8"
          >
            <v-icon start>mdi-login</v-icon>
            Đăng nhập ngay
          </v-btn>
        </div>
        <div class="empty-decoration" />
      </v-card>

      <!-- Empty State -->
      <v-card v-else-if="wishlistStore.isEmpty" class="empty-state rounded-2xl overflow-hidden" variant="flat">
        <div class="empty-content text-center py-16 px-6">
          <div class="empty-icon-wrapper mb-6">
            <v-icon size="80" class="empty-icon">mdi-heart-broken-outline</v-icon>
          </div>
          <h2 class="text-h5 font-weight-bold mb-3">Chưa có sản phẩm yêu thích</h2>
          <p class="text-body-1 text-medium-emphasis mb-8" style="max-width: 400px; margin: 0 auto;">
            Khám phá bộ sưu tập của chúng tôi và lưu những món đồ bạn yêu thích để mua sau nhé!
          </p>
          <v-btn 
            :to="{ name: 'ProductList' }" 
            color="secondary" 
            size="large" 
            rounded="xl"
            class="explore-btn px-8"
          >
            <v-icon start>mdi-compass</v-icon>
            Khám phá ngay
          </v-btn>
        </div>
        <div class="empty-decoration" />
      </v-card>

      <!-- Wishlist Content -->
      <template v-else>
        <!-- Actions Bar -->
        <v-card class="actions-bar rounded-xl pa-4 mb-6" variant="outlined">
          <div class="d-flex flex-wrap justify-space-between align-center ga-3">
            <div class="d-flex align-center ga-2">
              <v-chip color="primary" variant="tonal">
                <v-icon start size="small">mdi-heart</v-icon>
                {{ wishlistStore.itemCount }} sản phẩm
              </v-chip>
              <v-btn variant="text" size="small" color="primary" @click="sortBy = sortBy === 'newest' ? 'price' : 'newest'">
                <v-icon start size="small">mdi-sort</v-icon>
                {{ sortBy === 'newest' ? 'Mới nhất' : 'Theo giá' }}
              </v-btn>
            </div>
            <div class="d-flex ga-2">
              <v-btn-toggle v-model="viewMode" mandatory variant="outlined" color="primary" density="compact" rounded="lg">
                <v-btn value="grid" icon="mdi-view-grid" size="small" />
                <v-btn value="list" icon="mdi-view-list" size="small" />
              </v-btn-toggle>
              <v-btn variant="outlined" size="small" rounded="lg" prepend-icon="mdi-share-variant-outline">
                Chia sẻ
              </v-btn>
              <v-btn variant="outlined" color="error" size="small" rounded="lg" prepend-icon="mdi-delete-sweep" @click="handleClearWishlist">
                Xóa hết
              </v-btn>
            </div>
          </div>
        </v-card>

        <!-- Grid View -->
        <v-row v-if="viewMode === 'grid'">
          <v-col v-for="(item, index) in sortedItems" :key="item.id" cols="6" sm="4" lg="3">
            <v-card 
              class="wishlist-card rounded-xl overflow-hidden h-100"
              variant="outlined"
              :style="{ '--delay': index * 0.05 + 's' }"
            >
              <!-- Image Section -->
              <div class="card-image-wrapper">
                <v-img :src="getImageUrl(item.variant.image_url)" cover height="200" class="card-image">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="primary" size="32" />
                    </div>
                  </template>
                  <template v-slot:error>
                    <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
                      <v-icon size="48" color="grey">mdi-image-broken</v-icon>
                    </div>
                  </template>
                </v-img>
                
                <!-- Overlay Actions -->
                <div class="card-overlay">
                  <v-btn
                    icon
                    size="small"
                    class="remove-btn"
                    @click.stop="handleRemoveItem(item)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  
                  <div class="overlay-actions">
                    <v-btn
                      color="white"
                      block
                      rounded="lg"
                      class="cart-btn font-weight-bold"
                      @click="handleAddToCart(item)"
                    >
                      <v-icon start>mdi-cart-plus</v-icon>
                      Thêm giỏ hàng
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      color="white"
                      block
                      rounded="lg"
                      size="small"
                      class="mt-2"
                      :to="`/product?id=${item.product.id}`"
                    >
                      Xem chi tiết
                    </v-btn>
                  </div>
                </div>

                <!-- Badges -->
                <div class="card-badges">
                  <v-chip v-if="item.product.status === 'pre-order'" size="x-small" color="info" class="mb-1">
                    Pre-Order
                  </v-chip>
                  <v-chip v-if="hasDiscount(item)" size="x-small" color="error">
                    -{{ getDiscountPercent(item) }}%
                  </v-chip>
                </div>
              </div>

              <!-- Content Section -->
              <v-card-text class="card-content pa-4">
                <div class="d-flex align-center justify-space-between mb-2">
                  <v-chip size="x-small" color="primary" variant="tonal">
                    {{ item.product.category?.name || 'Figures' }}
                  </v-chip>
                  <div class="d-flex align-center">
                    <v-icon size="x-small" color="warning" class="mr-1">mdi-star</v-icon>
                    <span class="text-caption font-weight-medium">4.8</span>
                  </div>
                </div>

                <h3 class="text-body-1 font-weight-bold card-title mb-1">
                  {{ item.product.name }}
                </h3>
                <p class="text-caption text-medium-emphasis mb-3">
                  {{ item.variant.name }} • {{ item.product.supplier?.name || 'Unknown' }}
                </p>

                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-subtitle-1 font-weight-black neon-text-secondary">
                      {{ formatPrice(item.variant.price) }}
                    </div>
                    <div v-if="item.variant.original_price" class="text-caption text-decoration-line-through text-medium-emphasis">
                      {{ formatPrice(item.variant.original_price) }}
                    </div>
                  </div>
                  <v-btn
                    icon
                    size="small"
                    color="secondary"
                    variant="tonal"
                    class="quick-cart-btn"
                    @click="handleAddToCart(item)"
                  >
                    <v-icon>mdi-cart-plus</v-icon>
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- List View -->
        <div v-else class="list-view">
          <v-card
            v-for="(item, index) in sortedItems"
            :key="item.id"
            class="list-card rounded-xl overflow-hidden mb-4"
            variant="outlined"
            :style="{ '--delay': index * 0.05 + 's' }"
          >
            <div class="d-flex flex-column flex-sm-row">
              <!-- Image -->
              <div class="list-image-wrapper">
                <v-img :src="getImageUrl(item.variant.image_url)" cover height="180" width="180" class="list-image">
                  <template v-slot:error>
                    <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
                      <v-icon size="48" color="grey">mdi-image-broken</v-icon>
                    </div>
                  </template>
                </v-img>
                <div class="list-badges">
                  <v-chip v-if="item.product.status === 'pre-order'" size="x-small" color="info">Pre-Order</v-chip>
                </div>
              </div>

              <!-- Content -->
              <div class="list-content pa-5 d-flex flex-column flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2">
                  <div>
                    <div class="d-flex align-center ga-2 mb-2">
                      <v-chip size="x-small" color="primary" variant="tonal">{{ item.product.category?.name || 'Figures' }}</v-chip>
                      <v-chip size="x-small" variant="outlined">{{ item.product.supplier?.name || 'Unknown' }}</v-chip>
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-1">{{ item.product.name }}</h3>
                    <p class="text-body-2 text-medium-emphasis">
                      Phiên bản: {{ item.variant.name }} • SKU: {{ item.variant.sku }}
                    </p>
                  </div>
                  <v-btn icon="mdi-close" variant="text" size="small" color="error" @click="handleRemoveItem(item)" />
                </div>

                <v-spacer />

                <div class="d-flex flex-wrap justify-space-between align-center ga-3 mt-3">
                  <div>
                    <span class="text-h5 font-weight-black neon-text-secondary">{{ formatPrice(item.variant.price) }}</span>
                    <span v-if="item.variant.original_price" class="text-body-2 text-decoration-line-through text-medium-emphasis ml-2">
                      {{ formatPrice(item.variant.original_price) }}
                    </span>
                    <v-chip v-if="hasDiscount(item)" color="error" size="x-small" class="ml-2">
                      -{{ getDiscountPercent(item) }}%
                    </v-chip>
                  </div>
                  <div class="d-flex ga-2">
                    <v-btn :to="`/product?id=${item.product.id}`" variant="outlined" rounded="lg">
                      Chi tiết
                    </v-btn>
                    <v-btn color="secondary" rounded="lg" prepend-icon="mdi-cart-plus" class="cart-action-btn" @click="handleAddToCart(item)">
                      Thêm giỏ
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </div>

        <!-- Add All Section -->
        <v-card class="add-all-section rounded-xl pa-6 mt-8" variant="flat">
          <div class="d-flex flex-column flex-sm-row align-center justify-space-between ga-4">
            <div>
              <h3 class="text-h6 font-weight-bold mb-1">Thêm tất cả vào giỏ hàng?</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ wishlistStore.itemCount }} sản phẩm • Tổng {{ formatPrice(wishlistStore.totalValue) }}
              </p>
            </div>
            <v-btn
              color="secondary"
              size="large"
              rounded="xl"
              class="add-all-btn px-8 font-weight-bold"
              prepend-icon="mdi-cart-arrow-down"
              :loading="isAddingAll"
              @click="handleAddAllToCart"
            >
              Thêm tất cả
            </v-btn>
          </div>
        </v-card>
      </template>
    </v-container>

    <!-- Snackbar Notification -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Đóng
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWishlistStore, type WishlistItem } from '@/stores/wishlist.store';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const authStore = useAuthStore();

// State
const viewMode = ref<'grid' | 'list'>('grid');
const sortBy = ref<'newest' | 'price'>('newest');
const isAddingAll = ref(false);
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
});

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated);

const sortedItems = computed(() => {
  const items = [...wishlistStore.items];
  if (sortBy.value === 'price') {
    return items.sort((a, b) => a.variant.price - b.variant.price);
  }
  return items.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime());
});

// API Base URL for images
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

/**
 * Xử lý URL hình ảnh - thêm base URL nếu cần
 */
const getImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) {
    return 'https://picsum.photos/400/500?random=' + Math.random();
  }
  // Nếu đã là URL đầy đủ
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // Nếu là đường dẫn tương đối, thêm base URL
  return `${apiBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

const showSnackbar = (text: string, color: string = 'success') => {
  snackbar.value = { show: true, text, color };
};

const hasDiscount = (item: WishlistItem) => {
  return item.variant.original_price && item.variant.original_price > item.variant.price;
};

const getDiscountPercent = (item: WishlistItem) => {
  if (!item.variant.original_price) return 0;
  return Math.round((1 - item.variant.price / item.variant.original_price) * 100);
};

const handleRemoveItem = (item: WishlistItem) => {
  const result = wishlistStore.removeById(item.id);
  if (result.success) {
    showSnackbar(result.message);
  } else {
    showSnackbar(result.message, 'error');
  }
};

const handleClearWishlist = () => {
  if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?')) {
    const result = wishlistStore.clearWishlist();
    showSnackbar(result.message);
  }
};

const handleAddToCart = async (item: WishlistItem) => {
  if (!isAuthenticated.value) {
    showSnackbar('Vui lòng đăng nhập để thêm vào giỏ hàng', 'warning');
    router.push({ name: 'Login', query: { redirect: '/wishlist' } });
    return;
  }
  
  const result = await cartStore.addToCart({
    productVariantId: item.variant.id,
    quantity: 1,
    price: item.variant.price,
  });
  
  if (result.success) {
    showSnackbar(`Đã thêm "${item.product.name}" vào giỏ hàng!`);
  } else {
    showSnackbar(result.message, 'error');
  }
};

const handleAddAllToCart = async () => {
  if (!isAuthenticated.value) {
    showSnackbar('Vui lòng đăng nhập để thêm vào giỏ hàng', 'warning');
    router.push({ name: 'Login', query: { redirect: '/wishlist' } });
    return;
  }
  
  isAddingAll.value = true;
  let successCount = 0;
  
  for (const item of wishlistStore.items) {
    const result = await cartStore.addToCart({
      productVariantId: item.variant.id,
      quantity: 1,
      price: item.variant.price,
    });
    if (result.success) successCount++;
  }
  
  isAddingAll.value = false;
  
  if (successCount > 0) {
    showSnackbar(`Đã thêm ${successCount} sản phẩm vào giỏ hàng!`);
  } else {
    showSnackbar('Không thể thêm sản phẩm vào giỏ hàng', 'error');
  }
};

// Lifecycle
onMounted(() => {
  // Khởi tạo wishlist store
  wishlistStore.initialize();
});
</script>

<style scoped>
.wishlist-page {
  min-height: 100vh;
}

/* Hero Section */
.wishlist-hero {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.08) 0%, rgba(0, 212, 255, 0.05) 100%);
  overflow: hidden;
}

.hero-avatar {
  background: linear-gradient(135deg, #ff00ff 0%, #00d4ff 100%);
}

.hero-glow {
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 0, 255, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.stats-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.neon-text-primary {
  color: #00d4ff;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.neon-text-secondary {
  color: #ff00ff;
  text-shadow: 0 0 15px rgba(255, 0, 255, 0.4);
}

/* Empty State */
.empty-state {
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.05) 0%, rgba(0, 212, 255, 0.03) 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.empty-icon-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  color: rgba(255, 255, 255, 0.5);
}

.explore-btn {
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.3);
}

.empty-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff00ff, #00d4ff, #ff00ff);
}

/* Actions Bar */
.actions-bar {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

/* Grid Cards */
.wishlist-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.wishlist-card:hover {
  border-color: rgba(255, 0, 255, 0.5) !important;
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 0, 255, 0.15);
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
}

.card-image {
  transition: transform 0.5s ease;
}

.wishlist-card:hover .card-image {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.wishlist-card:hover .card-overlay {
  opacity: 1;
}

.remove-btn {
  background: rgba(255, 71, 87, 0.9) !important;
  color: white !important;
  align-self: flex-end;
}

.overlay-actions {
  margin-top: auto;
}

.cart-btn {
  background: linear-gradient(135deg, #ff00ff 0%, #cc00cc 100%) !important;
  color: white !important;
}

.card-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
}

.card-content {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.wishlist-card:hover .card-title {
  color: #ff00ff;
}

.quick-cart-btn {
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.wishlist-card:hover .quick-cart-btn {
  opacity: 1;
  transform: scale(1);
}

/* List Cards */
.list-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

.list-card:hover {
  border-color: rgba(255, 0, 255, 0.4) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.list-image-wrapper {
  position: relative;
  flex-shrink: 0;
}

.list-badges {
  position: absolute;
  top: 8px;
  left: 8px;
}

.list-content {
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}

.cart-action-btn {
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
}

/* Add All Section */
.add-all-section {
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.08) 0%, rgba(0, 212, 255, 0.05) 100%) !important;
  border: 1px solid rgba(255, 0, 255, 0.2);
}

.add-all-btn {
  background: linear-gradient(135deg, #ff00ff 0%, #cc00cc 100%) !important;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.4);
  transition: all 0.3s ease;
}

.add-all-btn:hover {
  box-shadow: 0 0 50px rgba(255, 0, 255, 0.6);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .list-image-wrapper {
    width: 100%;
    height: 200px;
  }
  
  .list-content {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
}
</style>