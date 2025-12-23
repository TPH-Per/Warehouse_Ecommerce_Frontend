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
              @keyup.enter="applyFilters"
              @click:clear="clearSearch"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <!-- Filters Section -->
    <v-container class="py-2">
      <v-card class="filter-card pa-4 rounded-xl" variant="outlined">
        <!-- Thông báo về chính sách hiển thị sản phẩm -->
        <v-alert
          v-if="!loading && totalProducts > 0 && productsStore.useInStockApi"
          type="info"
          variant="tonal"
          density="compact"
          class="mb-3"
          closable
        >
          <v-icon start size="small">mdi-information</v-icon>
          Chỉ hiển thị sản phẩm <strong>có sẵn trong kho</strong> tại các chi nhánh.
          <span v-if="selectedBranchId"> Đang lọc theo chi nhánh đã chọn.</span>
        </v-alert>

        <!-- Thông báo chế độ test (hiển thị tất cả sản phẩm) -->
        <v-alert
          v-if="!loading && totalProducts > 0 && !productsStore.useInStockApi"
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-3"
          closable
        >
          <v-icon start size="small">mdi-alert</v-icon>
          <strong>CHẾ ĐỘ TEST:</strong> Đang hiển thị tất cả sản phẩm active. 
          Bật <code>useInStockApi = true</code> trong store để chỉ hiển thị sản phẩm có trong kho.
        </v-alert>

        <v-row align="center" dense>
          <v-col cols="12" md="2">
            <div class="d-flex align-center ga-2">
              <v-icon size="small" color="success">mdi-check-circle</v-icon>
              <div class="text-caption text-medium-emphasis">{{ totalProducts }} sản phẩm</div>
            </div>
          </v-col>

          <!-- Bộ lọc Chi nhánh -->
          <v-col cols="6" sm="4" md="2">
            <v-select
              v-model="selectedBranchId"
              :items="branches"
              item-title="name"
              item-value="id"
              label="Chi nhánh"
              variant="outlined"
              rounded="lg"
              density="compact"
              hide-details
              clearable
              prepend-inner-icon="mdi-store"
              placeholder="Tất cả chi nhánh"
            >
              <template v-slot:prepend-item>
                <v-list-item
                  title="Tất cả chi nhánh"
                  @click="selectedBranchId = null"
                >
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-store-check</v-icon>
                  </template>
                </v-list-item>
                <v-divider class="my-1" />
              </template>
            </v-select>
          </v-col>

          <!-- Bộ lọc Danh mục -->
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
              prepend-inner-icon="mdi-shape-outline"
            />
          </v-col>

          <!-- Bộ lọc Nhà cung cấp -->
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
              prepend-inner-icon="mdi-domain"
            />
          </v-col>

          <!-- Bộ lọc Giá -->
          <v-col cols="6" sm="4" md="2">
            <v-select
              v-model="filters.price_range"
              :items="priceRanges"
              label="Khoảng giá"
              variant="outlined"
              rounded="lg"
              density="compact"
              hide-details
              clearable
              prepend-inner-icon="mdi-currency-usd"
            />
          </v-col>

          <!-- Sort và View Mode -->
          <v-col cols="12" sm="8" md="2" class="d-flex align-center ga-2">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Sắp xếp"
              variant="outlined"
              rounded="lg"
              density="compact"
              hide-details
              class="flex-grow-1"
            />
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
        <v-col v-for="n in itemsPerPage" :key="n" cols="6" sm="4" md="3">
          <v-skeleton-loader type="image, article" class="rounded-xl" />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-card v-else-if="paginatedProducts.length === 0" class="empty-state text-center py-12 rounded-xl" variant="outlined">
        <v-icon size="64" color="primary" class="mb-4">mdi-package-variant</v-icon>
        <h3 class="text-h6 font-weight-bold">Không tìm thấy sản phẩm</h3>
        <p class="text-medium-emphasis mb-4">Hãy thử điều chỉnh từ khóa hoặc bộ lọc của bạn.</p>
        <v-btn color="primary" rounded="lg" size="small" @click="clearFilters">Xóa bộ lọc</v-btn>
      </v-card>

      <!-- Grid View (4 cột x 2 hàng = 8 sản phẩm/trang) -->
      <v-row v-else-if="viewMode === 'grid'">
        <v-col v-for="product in paginatedProducts" :key="product.Id" cols="6" md="3">
          <v-card class="product-card rounded-xl h-100 d-flex flex-column" variant="outlined">
            <div class="image-container position-relative overflow-hidden">
              <v-img 
                :src="getProductImage(product)" 
                class="product-img" 
                :aspect-ratio="1"
                cover
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary" size="24" />
                  </v-row>
                </template>
                <template v-slot:error>
                  <v-row class="fill-height ma-0 bg-grey-darken-3" align="center" justify="center">
                    <v-icon size="48" color="grey">mdi-image-broken</v-icon>
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
            </div>
            <v-card-text class="pa-3 d-flex flex-column flex-grow-1">
              <div class="text-caption text-primary">{{ product.CategoryName || 'Chưa phân loại' }}</div>
              <div class="text-body-2 font-weight-bold text-truncate-2 product-title mb-1">{{ product.Name }}</div>
              <div class="text-caption text-medium-emphasis text-truncate mb-auto">{{ product.SupplierName || '' }}</div>
              <div class="d-flex justify-space-between align-center mt-2">
                <span class="text-subtitle-2 font-weight-bold neon-text-secondary">
                  {{ formatPrice(getLowestPrice(product)) }}
                </span>
                <v-btn :to="`/product?id=${product.Id}`" variant="text" color="primary" size="x-small" icon="mdi-eye" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- List View -->
      <v-row v-else>
        <v-col v-for="product in paginatedProducts" :key="product.Id" cols="12">
          <v-card class="product-card-list rounded-xl overflow-hidden d-flex flex-column flex-sm-row" variant="outlined">
            <v-img
              :src="getProductImage(product)"
              :aspect-ratio="1"
              cover
              class="product-list-image flex-shrink-0"
            >
              <template v-slot:error>
                <v-row class="fill-height ma-0 bg-grey-darken-3" align="center" justify="center">
                  <v-icon size="48" color="grey">mdi-image-broken</v-icon>
                </v-row>
              </template>
            </v-img>
            <v-card-text class="pa-4 d-flex flex-column flex-grow-1">
              <div class="d-flex justify-space-between align-start mb-2">
                <div>
                  <v-chip size="x-small" color="primary" variant="tonal" class="mb-1">{{ product.CategoryName || 'Chưa phân loại' }}</v-chip>
                  <h3 class="text-subtitle-1 font-weight-bold">{{ product.Name }}</h3>
                  <div class="text-caption text-medium-emphasis">{{ product.SupplierName || '' }}</div>
                </div>
              </div>
              <p class="text-caption text-medium-emphasis line-clamp-2 mb-auto">{{ product.Description || '' }}</p>
              <div class="d-flex align-center justify-space-between mt-2">
                <div class="text-h6 font-weight-bold neon-text-secondary">
                  {{ formatPrice(getLowestPrice(product)) }}
                </div>
                <div class="d-flex ga-2">
                  <v-btn variant="outlined" size="small" rounded="lg">
                    <v-icon start size="small">mdi-heart-outline</v-icon>
                    Lưu
                  </v-btn>
                  <v-btn :to="`/product?id=${product.Id}`" color="primary" size="small" rounded="lg">
                    Chi tiết
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Pagination -->
      <div v-if="filteredProducts.length > 0" class="d-flex justify-center mt-8">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          rounded="circle"
          color="primary"
          size="small"
          :total-visible="5"
        />
      </div>

      <!-- Showing info -->
      <div v-if="filteredProducts.length > 0" class="text-center mt-2 text-caption text-medium-emphasis">
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} 
        trong tổng số {{ filteredProducts.length }} sản phẩm
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products.store';
import { useCategoriesStore } from '@/stores/categories.store';
import { useSuppliersStore } from '@/stores/suppliers.store';
import { useBranchesStore } from '@/stores/branches.store';
import type { Product } from '@/types';

// ========== ROUTER ==========
const route = useRoute();
const router = useRouter();

// ========== PINIA STORES ==========
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const suppliersStore = useSuppliersStore();
const branchesStore = useBranchesStore();

// ========== CONSTANTS ==========
const itemsPerPage = 8; // 4 cột x 2 hàng

// ========== LOCAL STATE ==========
const viewMode = ref<'grid' | 'list'>('grid');
const searchQuery = ref('');
const sortBy = ref('newest');
const currentPage = ref(1);

// Chi nhánh được chọn để lọc sản phẩm
const selectedBranchId = ref<number | null>(null);

const filters = ref({
  category_id: null as number | null,
  supplier_id: null as number | null,
  price_range: null as string | null,
});

// ========== STATIC OPTIONS ==========
const sortOptions = [
  { title: 'Mới nhất', value: 'newest' },
  { title: 'Tên A-Z', value: 'name_asc' },
  { title: 'Tên Z-A', value: 'name_desc' },
  { title: 'Giá thấp đến cao', value: 'price_asc' },
  { title: 'Giá cao đến thấp', value: 'price_desc' },
];

const priceRanges = [
  { title: 'Dưới 500K', value: '0-500000' },
  { title: '500K - 1 triệu', value: '500000-1000000' },
  { title: '1 - 2 triệu', value: '1000000-2000000' },
  { title: '2 - 5 triệu', value: '2000000-5000000' },
  { title: 'Trên 5 triệu', value: '5000000-999999999' },
];

// ========== COMPUTED ==========
// Lấy products từ store
const allProducts = computed(() => productsStore.products);
const loading = computed(() => productsStore.isLoading);

// Lấy options từ stores - Dynamic data từ API
const categories = computed(() => categoriesStore.categoryOptions);
const suppliers = computed(() => suppliersStore.supplierOptions);

// Chi nhánh - để lọc sản phẩm theo tồn kho tại chi nhánh
const branches = computed(() => {
  return branchesStore.branches.map((b: any) => ({
    id: b.Id ?? b.id,
    name: b.Name ?? b.name ?? 'Chi nhánh',
    location: b.Location ?? b.location ?? ''
  }));
});

// ========== FILTERED & SORTED PRODUCTS ==========
const filteredProducts = computed(() => {
  let result = [...allProducts.value];

  // Lọc theo từ khóa tìm kiếm
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(p => 
      (p.Name?.toLowerCase().includes(query)) ||
      (p.Description?.toLowerCase().includes(query)) ||
      ((p as any).CategoryName?.toLowerCase().includes(query)) ||
      ((p as any).SupplierName?.toLowerCase().includes(query))
    );
  }

  // Lọc theo danh mục
  if (filters.value.category_id) {
    result = result.filter(p => 
      p.CategoryId === filters.value.category_id ||
      (p as any).category_id === filters.value.category_id
    );
  }

  // Lọc theo nhà cung cấp
  if (filters.value.supplier_id) {
    result = result.filter(p => 
      (p as any).SupplierId === filters.value.supplier_id ||
      (p as any).supplier_id === filters.value.supplier_id
    );
  }

  // Lọc theo khoảng giá
  if (filters.value.price_range) {
    const parts = filters.value.price_range.split('-').map(Number);
    const minPrice = parts[0] || 0;
    const maxPrice = parts[1] || 999999999;
    result = result.filter(p => {
      const price = getLowestPrice(p);
      return price >= minPrice && price <= maxPrice;
    });
  }

  // Sắp xếp
  switch (sortBy.value) {
    case 'name_asc':
      result.sort((a, b) => (a.Name || '').localeCompare(b.Name || ''));
      break;
    case 'name_desc':
      result.sort((a, b) => (b.Name || '').localeCompare(a.Name || ''));
      break;
    case 'price_asc':
      result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
      break;
    case 'price_desc':
      result.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
      break;
    case 'newest':
    default:
      // Giữ nguyên thứ tự từ server (mới nhất)
      break;
  }

  return result;
});

// Tổng số sản phẩm sau khi lọc
const totalProducts = computed(() => filteredProducts.value.length);

// Số trang
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage) || 1);

// Sản phẩm theo trang hiện tại
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

// ========== PLACEHOLDER IMAGE ==========
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect fill="#1a1a2e" width="400" height="400"/>
    <rect fill="#16213e" x="50" y="50" width="300" height="300" rx="20"/>
    <path fill="#0f3460" d="M200 120 L280 220 L120 220 Z"/>
    <circle fill="#e94560" cx="260" cy="140" r="25"/>
    <text x="200" y="320" text-anchor="middle" fill="#666" font-family="Arial" font-size="16">No Image</text>
  </svg>
`);

// ========== METHODS ==========
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(price);
};

// ========== IMAGE HELPER ==========
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://localhost:44377';

const getProductImage = (product: Product) => {
  const imageUrl = (product as any).ImageUrl || (product as any).imageUrl || product.ImageUrl;
  
  if (!imageUrl || imageUrl === '' || imageUrl === null || imageUrl === 'null') {
    return PLACEHOLDER_IMAGE;
  }
  
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  
  return `${API_BASE_URL}/wwwroot/uploads/products/${imageUrl}`;
};

// Lấy giá thấp nhất
const getLowestPrice = (product: Product) => {
  const price = (product as any).Price || (product as any).price;
  return price || 0;
};

// Apply filters
const applyFilters = () => {
  currentPage.value = 1; // Reset về trang 1 khi lọc
};

// Clear search
const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
};

// Clear all filters
const clearFilters = () => {
  searchQuery.value = '';
  filters.value = { category_id: null, supplier_id: null, price_range: null };
  sortBy.value = 'newest';
  currentPage.value = 1;
  router.replace({ query: {} });
};

// Fetch products từ store
const fetchProducts = async () => {
  productsStore.setSelectedBranch(selectedBranchId.value);
  await productsStore.fetchProducts();
};

// ========== WATCHERS ==========
// Reset trang khi thay đổi filter
watch([() => filters.value.category_id, () => filters.value.supplier_id, () => filters.value.price_range, sortBy], () => {
  currentPage.value = 1;
});

// Watch for branch changes
watch(() => selectedBranchId.value, (newBranchId) => {
  console.log('🏪 Đổi chi nhánh:', newBranchId ?? 'Tất cả');
  productsStore.setSelectedBranch(newBranchId);
  fetchProducts();
});

// Watch route query for category from header navigation
watch(() => route.query.category, (newCategoryId) => {
  if (newCategoryId) {
    filters.value.category_id = Number(newCategoryId);
  }
}, { immediate: true });

// Watch route query for supplier
watch(() => route.query.supplier, (newSupplierId) => {
  if (newSupplierId) {
    filters.value.supplier_id = Number(newSupplierId);
  }
}, { immediate: true });

// ========== LIFECYCLE ==========
onMounted(async () => {
  // Lấy category từ URL nếu có
  if (route.query.category) {
    filters.value.category_id = Number(route.query.category);
  }
  if (route.query.supplier) {
    filters.value.supplier_id = Number(route.query.supplier);
  }
  if (route.query.search) {
    searchQuery.value = String(route.query.search);
  }

  // Fetch tất cả data cần thiết khi component mount
  await Promise.all([
    branchesStore.fetchBranches(),
    productsStore.fetchProducts(),
    categoriesStore.fetchCategories(),
    suppliersStore.fetchSuppliers(),
  ]);
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

/* List view image - responsive */
.product-list-image {
  width: 160px;
  min-width: 160px;
  height: 160px;
}

@media (max-width: 600px) {
  .product-list-image {
    width: 100%;
    min-width: 100%;
    height: 200px;
  }
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

/* 2 line truncate */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  min-height: 2.6em;
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