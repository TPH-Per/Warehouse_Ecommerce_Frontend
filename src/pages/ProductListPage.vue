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
              v-model="sortBy"
              :items="sortOptions"
              label="Sắp xếp"
              variant="outlined"
              rounded="lg"
              density="compact"
              hide-details
            />
          </v-col>

          <v-col cols="12" sm="4" md="2" class="d-flex justify-end ga-2">
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
        <v-col v-for="product in products" :key="product.Id" cols="6" sm="4" lg="3">
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
            </div>
            <v-card-text class="pa-3">
              <div class="text-caption text-primary">{{ product.CategoryName || 'Chưa phân loại' }}</div>
              <div class="text-body-2 font-weight-bold text-truncate product-title">{{ product.Name }}</div>
              <div class="text-caption text-medium-emphasis text-truncate">{{ product.Description || '' }}</div>
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
        <v-col v-for="product in products" :key="product.Id" cols="12">
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
                  <v-chip size="x-small" color="primary" variant="tonal" class="mb-1">{{ product.CategoryName || 'Chưa phân loại' }}</v-chip>
                  <h3 class="text-subtitle-1 font-weight-bold">{{ product.Name }}</h3>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useProductsStore } from '@/stores/products.store';
import { useCategoriesStore } from '@/stores/categories.store';
import { useSuppliersStore } from '@/stores/suppliers.store';
import { useBranchesStore } from '@/stores/branches.store';
import type { Product } from '@/types';

// ========== PINIA STORES ==========
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const suppliersStore = useSuppliersStore();
const branchesStore = useBranchesStore();

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
  status: null as string | null,
});

// ========== COMPUTED ==========
// Lấy products từ store
const products = computed(() => productsStore.products);
const loading = computed(() => productsStore.isLoading);
const totalProducts = computed(() => productsStore.total);
const totalPages = computed(() => Math.ceil(productsStore.total / 12) || 1);

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

// ========== STATIC OPTIONS ==========
const sortOptions = [
  { title: 'Mới nhất', value: 'newest' },
  { title: 'Tên A-Z', value: 'name_asc' },
  { title: 'Giá thấp đến cao', value: 'price_asc' },
  { title: 'Giá cao đến thấp', value: 'price_desc' },
];

// ========== PLACEHOLDER IMAGE ==========
// SVG placeholder cho sản phẩm không có ảnh
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
// Base URL của API server để load ảnh
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://localhost:44377';

// Lấy hình ảnh sản phẩm - với placeholder nếu không có ảnh
const getProductImage = (product: Product) => {
  const imageUrl = (product as any).ImageUrl || (product as any).imageUrl || product.ImageUrl;
  
  // Kiểm tra có ảnh hay không
  if (!imageUrl || imageUrl === '' || imageUrl === null || imageUrl === 'null') {
    return PLACEHOLDER_IMAGE;
  }
  
  // Xử lý đường dẫn ảnh từ server ASP.NET
  // Giữ nguyên path từ database (bao gồm /wwwroot nếu có)
  let cleanPath = imageUrl;
  
  // Nếu đường dẫn bắt đầu bằng http/https thì đã đầy đủ
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  
  // Nếu là đường dẫn tương đối, thêm base URL
  if (cleanPath.startsWith('/')) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  
  // Trường hợp còn lại (chỉ có tên file)
  return `${API_BASE_URL}/wwwroot/uploads/products/${cleanPath}`;
};

// Lấy giá thấp nhất
const getLowestPrice = (product: Product) => {
  const price = (product as any).Price || (product as any).price;
  return price || 0;
};

// Fetch products từ store - CHỈ LẤY SẢN PHẨM CÓ TRONG KHO
const fetchProducts = async () => {
  // Cập nhật branch được chọn vào store
  productsStore.setSelectedBranch(selectedBranchId.value);
  
  if (searchQuery.value.trim()) {
    await productsStore.searchProducts(searchQuery.value);
  } else if (filters.value.category_id) {
    await productsStore.fetchByCategory(filters.value.category_id);
  } else {
    // Mặc định: Lấy sản phẩm có trong kho
    await productsStore.fetchProducts();
  }
};

// Clear filters
const clearFilters = () => {
  searchQuery.value = '';
  filters.value = { category_id: null, supplier_id: null, status: null };
  sortBy.value = 'newest';
  fetchProducts();
};

// Watch for filter changes
watch(
  () => filters.value.category_id,
  (newVal) => {
    productsStore.setSelectedBranch(selectedBranchId.value);
    if (newVal) {
      productsStore.fetchByCategory(newVal);
    } else {
      productsStore.fetchProducts();
    }
  }
);

// Watch for branch changes - Khi đổi chi nhánh, fetch lại sản phẩm có trong kho của chi nhánh đó
watch(
  () => selectedBranchId.value,
  (newBranchId) => {
    console.log('🏪 Đổi chi nhánh:', newBranchId ?? 'Tất cả');
    productsStore.setSelectedBranch(newBranchId);
    fetchProducts();
  }
);

// ========== LIFECYCLE ==========
onMounted(async () => {
  // Fetch tất cả data cần thiết khi component mount
  // Bao gồm cả danh sách chi nhánh để người dùng có thể lọc
  await Promise.all([
    branchesStore.fetchBranches(),
    productsStore.fetchProducts(), // Mặc định chỉ lấy sản phẩm có trong kho
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