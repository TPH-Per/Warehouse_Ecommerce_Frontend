<template>
  <div class="product-list-page">
    <!-- Hero Section -->
    <v-container class="pt-8 pb-4">
      <v-card class="hero-card pa-6 rounded-xl overflow-hidden position-relative" variant="flat">
        <div class="hero-glow" />
        <v-row align="center" class="position-relative" style="z-index: 1;">
          <v-col cols="12" lg="7">
            <div class="text-overline text-primary tracking-widest mb-2">KHÁM PHÁ BỘ SƯU TẬP</div>
            <h1 class="text-h4 font-weight-bold mb-3">
              Tìm kiếm figure <span class="gradient-text">mơ ước</span> của bạn
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-6" style="max-width: 500px;">
              Sản phẩm chính hãng từ các nhà cung cấp uy tín, giao hàng từ chi nhánh gần bạn nhất.
            </p>
          </v-col>

          <v-col cols="12" lg="5">
            <v-text-field
              v-model="searchQuery"
              label="Tìm theo tên, danh mục..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              rounded="xl"
              class="search-field"
              hide-details
              clearable
              @keyup.enter="fetchProducts"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <!-- Filters Section -->
    <v-container class="py-2">
      <v-card class="filter-card pa-4 rounded-xl" variant="outlined">
        <v-row align="center" dense>
          <v-col cols="12" md="3">
            <div class="text-caption text-medium-emphasis">{{ totalProducts }} sản phẩm</div>
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <v-select
              v-model="filters.category_id"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Danh mục"
              variant="outlined"
              rounded="lg"
              density="compact"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <v-select
              v-model="filters.supplier_id"
              :items="suppliers"
              item-title="name"
              item-value="id"
              label="Nhà cung cấp"
              variant="outlined"
              rounded="lg"
              density="compact"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="Trạng thái"
              variant="outlined"
              rounded="lg"
              density="compact"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Sắp xếp"
              variant="outlined"
              rounded="lg"
              density="compact"
              hide-details
            />
          </v-col>

          <v-col cols="12" sm="4" md="1" class="d-flex justify-end">
            <v-btn-toggle v-model="viewMode" mandatory rounded="lg" color="primary" variant="outlined" density="compact">
              <v-btn value="grid" icon="mdi-view-grid" size="small" />
              <v-btn value="list" icon="mdi-view-list" size="small" />
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <!-- Products Grid -->
    <v-container class="py-4">
      <!-- Loading State -->
      <v-row v-if="loading">
        <v-col v-for="n in 8" :key="n" cols="6" sm="4" lg="3">
          <v-skeleton-loader type="image, article" class="rounded-xl" />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-card v-else-if="products.length === 0" class="empty-state text-center py-12 rounded-xl" variant="outlined">
        <v-icon size="64" color="primary" class="mb-4">mdi-package-variant</v-icon>
        <h3 class="text-h6 font-weight-bold">Không tìm thấy sản phẩm</h3>
        <p class="text-medium-emphasis mb-4">Hãy thử điều chỉnh từ khóa hoặc bộ lọc của bạn.</p>
        <v-btn color="primary" rounded="lg" size="small" @click="clearFilters">Xóa bộ lọc</v-btn>
      </v-card>

      <!-- Grid View -->
      <v-row v-else-if="viewMode === 'grid'">
        <v-col v-for="product in products" :key="product.id" cols="6" sm="4" lg="3">
          <v-card class="product-card rounded-xl" variant="outlined">
            <div class="image-container position-relative overflow-hidden">
              <v-img :src="getProductImage(product)" class="product-img" cover height="180">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary" size="24" />
                  </v-row>
                </template>
              </v-img>
              <v-btn icon size="x-small" variant="flat" class="wishlist-btn position-absolute top-0 right-0 ma-2">
                <v-icon size="small">mdi-heart-outline</v-icon>
              </v-btn>
              <div class="quick-actions pa-2">
                <v-btn color="primary" block rounded="lg" size="small" density="comfortable">
                  <v-icon start size="small">mdi-cart-plus</v-icon>
                  Thêm giỏ
                </v-btn>
              </div>
              <div class="badges position-absolute top-0 left-0 pa-2 d-flex flex-column ga-1">
                <v-chip v-if="product.status === 'pre-order'" size="x-small" color="info">Pre-order</v-chip>
              </div>
            </div>
            <v-card-text class="pa-3">
              <div class="text-caption text-primary">{{ product.category.name }}</div>
              <div class="text-body-2 font-weight-bold text-truncate product-title">{{ product.name }}</div>
              <div class="text-caption text-medium-emphasis text-truncate">{{ product.supplier.name }}</div>
              <div class="d-flex justify-space-between align-center mt-2">
                <span class="text-subtitle-2 font-weight-bold neon-text-secondary">
                  {{ formatPrice(getLowestPrice(product)) }}
                </span>
                <v-btn :to="`/product?id=${product.id}`" variant="text" color="primary" size="x-small" icon="mdi-eye" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- List View -->
      <v-row v-else>
        <v-col v-for="product in products" :key="product.id" cols="12">
          <v-card class="product-card-list rounded-xl overflow-hidden d-flex" variant="outlined">
            <v-img
              :src="getProductImage(product)"
              cover
              width="160"
              height="140"
              class="flex-shrink-0"
            />
            <v-card-text class="pa-4 d-flex flex-column flex-grow-1">
              <div class="d-flex justify-space-between align-start mb-2">
                <div>
                  <v-chip size="x-small" color="primary" variant="tonal" class="mb-1">{{ product.category.name }}</v-chip>
                  <h3 class="text-subtitle-1 font-weight-bold">{{ product.name }}</h3>
                  <div class="text-caption text-medium-emphasis">NCC: {{ product.supplier.name }}</div>
                </div>
                <v-chip v-if="product.status === 'pre-order'" size="x-small" color="info">Pre-order</v-chip>
              </div>
              <p class="text-caption text-medium-emphasis line-clamp-2 mb-auto">{{ product.description }}</p>
              <div class="d-flex align-center justify-space-between mt-2">
                <div class="text-h6 font-weight-bold neon-text-secondary">
                  {{ formatPrice(getLowestPrice(product)) }}
                </div>
                <div class="d-flex ga-2">
                  <v-btn variant="outlined" size="small" rounded="lg">
                    <v-icon start size="small">mdi-heart-outline</v-icon>
                    Lưu
                  </v-btn>
                  <v-btn :to="`/product?id=${product.id}`" color="primary" size="small" rounded="lg">
                    Chi tiết
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Pagination -->
      <div v-if="products.length > 0" class="d-flex justify-center mt-8">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          rounded="circle"
          color="primary"
          size="small"
        />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Types matching database structure
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
  image_url?: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'pre-order' | 'inactive';
  category: Category;
  supplier: Supplier;
  variants: ProductVariant[];
}

// State
const loading = ref(false);
const viewMode = ref<'grid' | 'list'>('grid');
const searchQuery = ref('');
const sortBy = ref('newest');
const currentPage = ref(1);
const totalProducts = ref(0);
const totalPages = ref(1);

const filters = ref({
  category_id: null as number | null,
  supplier_id: null as number | null,
  status: null as string | null,
});

// Mock data matching database
const categories = ref<Category[]>([
  { id: 1, name: 'Figures', slug: 'figures' },
  { id: 2, name: 'Nendoroids', slug: 'nendoroids' },
  { id: 3, name: 'Plushies', slug: 'plushies' },
  { id: 4, name: 'Figma', slug: 'figma' },
]);

const suppliers = ref<Supplier[]>([
  { id: 1, name: 'Good Smile Company' },
  { id: 2, name: 'Aniplex' },
  { id: 3, name: 'Kotobukiya' },
  { id: 4, name: 'Bandai Namco' },
]);

const statusOptions = [
  { title: 'Đang bán', value: 'active' },
  { title: 'Pre-order', value: 'pre-order' },
];

const sortOptions = [
  { title: 'Mới nhất', value: 'newest' },
  { title: 'Tên A-Z', value: 'name_asc' },
  { title: 'Giá thấp đến cao', value: 'price_asc' },
  { title: 'Giá cao đến thấp', value: 'price_desc' },
];

const products = ref<Product[]>([]);

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const getProductImage = (product: Product) => {
  return product.variants[0]?.image_url || 'https://picsum.photos/400/400?random=' + product.id;
};

const getLowestPrice = (product: Product) => {
  if (!product.variants.length) return 0;
  return Math.min(...product.variants.map(v => v.price));
};

const fetchProducts = async () => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    products.value = Array(8).fill(null).map((_, i): Product => ({
      id: i + 1,
      name: `Figure Anime Character #${i + 1}`,
      slug: `figure-anime-character-${i + 1}`,
      description: 'Mô tả chi tiết về figure cao cấp chính hãng từ Nhật Bản, bảo hành 12 tháng, đóng gói cẩn thận.',
      status: i % 3 === 0 ? 'pre-order' : 'active',
      category: "ahihi",
      supplier: suppliers.value[i % 4],
      variants: [
        {
          id: i * 10 + 1,
          name: 'Standard',
          sku: `SKU-${i + 1}-STD`,
          price: 1250000 + (i * 250000),
          original_price: i % 2 === 0 ? 1500000 + (i * 250000) : undefined,
          image_url: `https://picsum.photos/400/400?random=${i + 1}`,
        },
        {
          id: i * 10 + 2,
          name: 'Deluxe',
          sku: `SKU-${i + 1}-DLX`,
          price: 2250000 + (i * 250000),
          image_url: `https://picsum.photos/400/400?random=${i + 10}`,
        },
      ],
    }));
    totalProducts.value = 32;
    totalPages.value = 4;
    loading.value = false;
  }, 600);
};

const clearFilters = () => {
  searchQuery.value = '';
  filters.value = { category_id: null, supplier_id: null, status: null };
  sortBy.value = 'newest';
  fetchProducts();
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #00d4ff 0%, #ff00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.neon-text-secondary {
  color: #ff00ff;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.hero-card {
  background: rgba(0, 212, 255, 0.03) !important;
  border: 1px solid rgba(0, 212, 255, 0.15) !important;
}

.hero-glow {
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%);
}

.filter-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.search-field :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05) !important;
}

.product-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: rgba(0, 212, 255, 0.4) !important;
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.product-card:hover .product-title {
  color: #00d4ff;
}

.product-card-list {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s ease;
}

.product-card-list:hover {
  border-color: rgba(0, 212, 255, 0.4) !important;
}

.image-container {
  position: relative;
}

.product-img {
  transition: transform 0.4s ease;
}

.image-container:hover .product-img {
  transform: scale(1.08);
}

.wishlist-btn {
  background: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  opacity: 0;
  transition: all 0.3s ease;
}

.image-container:hover .wishlist-btn {
  opacity: 1;
}

.quick-actions {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.85);
  transition: all 0.3s ease;
}

.image-container:hover .quick-actions {
  bottom: 0;
}

.product-title {
  transition: color 0.3s ease;
}

.empty-state {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>