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
                  <div class="text-h4 font-weight-bold neon-text-primary">{{ wishlistItems.length }}</div>
                  <div class="text-caption text-medium-emphasis">Sản phẩm</div>
                </div>
                <v-divider vertical />
                <div>
                  <div class="text-h4 font-weight-bold neon-text-secondary">{{ formatPrice(totalValue) }}</div>
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
      <!-- Empty State -->
      <v-card v-if="wishlistItems.length === 0" class="empty-state rounded-2xl overflow-hidden" variant="flat">
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
                {{ wishlistItems.length }} sản phẩm
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
              <v-btn variant="outlined" color="error" size="small" rounded="lg" prepend-icon="mdi-delete-sweep" @click="clearWishlist">
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
                <v-img :src="item.variant.image_url" cover height="200" class="card-image">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="primary" size="32" />
                    </div>
                  </template>
                </v-img>
                
                <!-- Overlay Actions -->
                <div class="card-overlay">
                  <v-btn
                    icon
                    size="small"
                    class="remove-btn"
                    @click.stop="removeFromWishlist(item)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  
                  <div class="overlay-actions">
                    <v-btn
                      color="white"
                      block
                      rounded="lg"
                      class="cart-btn font-weight-bold"
                      @click="addToCart(item)"
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
                    {{ item.product.category.name }}
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
                  {{ item.variant.name }} • {{ item.product.supplier.name }}
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
                    @click="addToCart(item)"
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
                <v-img :src="item.variant.image_url" cover height="180" width="180" class="list-image" />
                <div class="list-badges">
                  <v-chip v-if="item.product.status === 'pre-order'" size="x-small" color="info">Pre-Order</v-chip>
                </div>
              </div>

              <!-- Content -->
              <div class="list-content pa-5 d-flex flex-column flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2">
                  <div>
                    <div class="d-flex align-center ga-2 mb-2">
                      <v-chip size="x-small" color="primary" variant="tonal">{{ item.product.category.name }}</v-chip>
                      <v-chip size="x-small" variant="outlined">{{ item.product.supplier.name }}</v-chip>
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-1">{{ item.product.name }}</h3>
                    <p class="text-body-2 text-medium-emphasis">
                      Phiên bản: {{ item.variant.name }} • SKU: {{ item.variant.sku }}
                    </p>
                  </div>
                  <v-btn icon="mdi-close" variant="text" size="small" color="error" @click="removeFromWishlist(item)" />
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
                    <v-btn color="secondary" rounded="lg" prepend-icon="mdi-cart-plus" class="cart-action-btn" @click="addToCart(item)">
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
                {{ wishlistItems.length }} sản phẩm • Tổng {{ formatPrice(totalValue) }}
              </p>
            </div>
            <v-btn
              color="secondary"
              size="large"
              rounded="xl"
              class="add-all-btn px-8 font-weight-bold"
              prepend-icon="mdi-cart-arrow-down"
              @click="addAllToCart"
            >
              Thêm tất cả
            </v-btn>
          </div>
        </v-card>
      </template>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Types
interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  original_price?: number;
  image_url: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  status: 'active' | 'pre-order';
  category: Category;
  supplier: Supplier;
}

interface WishlistItem {
  id: number;
  product: Product;
  variant: ProductVariant;
  added_at: string;
}

// State
const viewMode = ref<'grid' | 'list'>('grid');
const sortBy = ref<'newest' | 'price'>('newest');

// Mock Data
const wishlistItems = ref<WishlistItem[]>([
  {
    id: 1,
    product: {
      id: 1,
      name: 'Rem: Crystal Dress Ver. 1/7 Scale',
      slug: 'rem-crystal-dress',
      status: 'pre-order',
      category: { id: 1, name: 'Figures', slug: 'figures' },
      supplier: { id: 1, name: 'eStream' },
    },
    variant: {
      id: 1,
      name: 'Standard Edition',
      sku: 'ES-REM-001',
      price: 35000000,
      original_price: 42000000,
      image_url: 'https://picsum.photos/400/500?random=1',
    },
    added_at: '2024-12-19',
  },
  {
    id: 2,
    product: {
      id: 2,
      name: 'Nendoroid Power',
      slug: 'nendoroid-power',
      status: 'active',
      category: { id: 2, name: 'Nendoroids', slug: 'nendoroids' },
      supplier: { id: 2, name: 'Good Smile Company' },
    },
    variant: {
      id: 2,
      name: 'Normal Version',
      sku: 'GSC-PWR-001',
      price: 1550000,
      image_url: 'https://picsum.photos/400/500?random=2',
    },
    added_at: '2024-12-18',
  },
  {
    id: 3,
    product: {
      id: 3,
      name: 'Miku Nakano Wedding Dress',
      slug: 'miku-nakano',
      status: 'active',
      category: { id: 1, name: 'Figures', slug: 'figures' },
      supplier: { id: 3, name: 'Kotobukiya' },
    },
    variant: {
      id: 3,
      name: 'Deluxe Ver.',
      sku: 'KOTO-MK-001',
      price: 4500000,
      original_price: 5000000,
      image_url: 'https://picsum.photos/400/500?random=3',
    },
    added_at: '2024-12-17',
  },
  {
    id: 4,
    product: {
      id: 4,
      name: 'Figma Denji Chainsaw Man',
      slug: 'figma-denji',
      status: 'pre-order',
      category: { id: 4, name: 'Figma', slug: 'figma' },
      supplier: { id: 4, name: 'Max Factory' },
    },
    variant: {
      id: 4,
      name: 'DX Edition',
      sku: 'MF-DNJ-001',
      price: 2800000,
      image_url: 'https://picsum.photos/400/500?random=4',
    },
    added_at: '2024-12-16',
  },
]);

// Computed
const totalValue = computed(() => wishlistItems.value.reduce((sum, item) => sum + item.variant.price, 0));

const sortedItems = computed(() => {
  const items = [...wishlistItems.value];
  if (sortBy.value === 'price') {
    return items.sort((a, b) => a.variant.price - b.variant.price);
  }
  return items.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime());
});

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const hasDiscount = (item: WishlistItem) => {
  return item.variant.original_price && item.variant.original_price > item.variant.price;
};

const getDiscountPercent = (item: WishlistItem) => {
  if (!item.variant.original_price) return 0;
  return Math.round((1 - item.variant.price / item.variant.original_price) * 100);
};

const removeFromWishlist = (item: WishlistItem) => {
  const index = wishlistItems.value.findIndex(i => i.id === item.id);
  if (index > -1) wishlistItems.value.splice(index, 1);
};

const clearWishlist = () => {
  if (confirm('Bạn có chắc muốn xóa tất cả?')) wishlistItems.value = [];
};

const addToCart = (item: WishlistItem) => {
  alert(`Đã thêm "${item.product.name}" vào giỏ hàng!`);
};

const addAllToCart = () => {
  alert(`Đã thêm ${wishlistItems.value.length} sản phẩm vào giỏ hàng!`);
};
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