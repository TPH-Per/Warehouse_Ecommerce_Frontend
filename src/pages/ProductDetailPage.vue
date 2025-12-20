<template>
  <div class="product-detail-page">
    <!-- Breadcrumbs -->
    <v-container class="py-4">
      <v-breadcrumbs :items="breadcrumbs" class="px-0">
        <template v-slot:divider>
          <v-icon size="small">mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-container>

    <!-- Main Content -->
    <v-container class="pb-12">
      <v-row>
        <!-- Left: Product Gallery -->
        <v-col cols="12" lg="5">
          <div class="gallery-wrapper">
            <!-- Main Image -->
            <v-card class="main-image-card rounded-xl overflow-hidden mb-4" variant="flat">
              <v-img
                :src="currentImage"
                :aspect-ratio="1"
                cover
                class="main-image"
              >
                <!-- Badges -->
                <div class="badges-container pa-4">
                  <v-chip v-if="product.status === 'pre-order'" color="info" size="small" class="mr-2">
                    <v-icon start size="small">mdi-clock</v-icon>
                    PRE-ORDER
                  </v-chip>
                  <v-chip v-if="discountPercent > 0" color="error" size="small">
                    -{{ discountPercent }}%
                  </v-chip>
                </div>
                
                <!-- Zoom Hint -->
                <div class="zoom-hint">
                  <v-icon size="small">mdi-magnify-plus</v-icon>
                </div>
              </v-img>
            </v-card>

            <!-- Thumbnails -->
            <div class="thumbnails-container d-flex ga-2 justify-center">
              <v-card
                v-for="(image, index) in allImages"
                :key="index"
                class="thumbnail-card rounded-lg overflow-hidden cursor-pointer"
                :class="{ 'thumbnail-active': selectedImageIndex === index }"
                width="70"
                height="70"
                variant="outlined"
                @click="selectedImageIndex = index"
              >
                <v-img :src="image" cover class="fill-height" />
              </v-card>
            </div>
          </div>
        </v-col>

        <!-- Right: Product Info -->
        <v-col cols="12" lg="7">
          <div class="product-info-wrapper pl-lg-6">
            <!-- Category & Supplier Tags -->
            <div class="d-flex flex-wrap ga-2 mb-4">
              <v-chip color="primary" variant="flat" size="small" class="font-weight-medium">
                {{ product.category.name }}
              </v-chip>
              <v-chip variant="outlined" size="small">
                <v-icon start size="small">mdi-factory</v-icon>
                {{ product.supplier.name }}
              </v-chip>
              <v-chip v-if="product.rating >= 4.5" color="warning" variant="tonal" size="small">
                <v-icon start size="small">mdi-star</v-icon>
                Best Seller
              </v-chip>
            </div>

            <!-- Product Title -->
            <h1 class="text-h4 text-lg-h3 font-weight-bold mb-3 product-title">
              {{ product.name }}
            </h1>

            <!-- Rating & Stats -->
            <div class="d-flex align-center flex-wrap ga-4 mb-6">
              <div class="d-flex align-center">
                <v-rating
                  :model-value="product.rating"
                  color="warning"
                  density="compact"
                  size="small"
                  readonly
                  half-increments
                />
                <span class="ml-2 text-body-2 font-weight-medium">{{ product.rating }}</span>
                <span class="text-body-2 text-medium-emphasis ml-1">({{ product.reviewCount }} đánh giá)</span>
              </div>
              <v-divider vertical class="mx-1" />
              <span class="text-body-2">
                <v-icon size="small" color="success" class="mr-1">mdi-check-decagram</v-icon>
                {{ product.soldCount }}+ đã bán
              </span>
            </div>

            <!-- Price Section -->
            <v-card class="price-card rounded-xl pa-5 mb-6" variant="flat">
              <div class="d-flex align-center flex-wrap ga-3">
                <div class="price-main">
                  <span class="text-h3 font-weight-black neon-price">{{ formatPrice(currentPrice) }}</span>
                </div>
                <div v-if="selectedVariant?.original_price" class="price-original">
                  <span class="text-h6 text-decoration-line-through text-medium-emphasis">
                    {{ formatPrice(selectedVariant.original_price) }}
                  </span>
                  <v-chip color="error" size="small" class="ml-2 font-weight-bold">
                    Tiết kiệm {{ formatPrice(selectedVariant.original_price - selectedVariant.price) }}
                  </v-chip>
                </div>
              </div>
              <p class="text-caption text-medium-emphasis mt-2">
                <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
                Giá đã bao gồm VAT. Phí vận chuyển tính khi thanh toán.
              </p>
            </v-card>

            <!-- Variant Selection -->
            <div class="selection-section mb-5">
              <div class="d-flex align-center mb-3">
                <span class="text-subtitle-2 font-weight-bold text-uppercase">Phiên bản</span>
                <v-chip size="x-small" color="primary" variant="tonal" class="ml-2">
                  {{ product.variants.length }} lựa chọn
                </v-chip>
              </div>
              <div class="d-flex flex-wrap ga-2">
                <v-card
                  v-for="variant in product.variants"
                  :key="variant.id"
                  class="variant-card pa-3 rounded-lg cursor-pointer"
                  :class="{ 'variant-selected': selectedVariant?.id === variant.id }"
                  variant="outlined"
                  @click="selectedVariant = variant"
                >
                  <div class="d-flex align-center ga-3">
                    <v-avatar size="40" rounded="lg">
                      <v-img :src="variant.image_url" cover />
                    </v-avatar>
                    <div>
                      <div class="text-body-2 font-weight-bold">{{ variant.name }}</div>
                      <div class="text-caption neon-text-secondary font-weight-medium">
                        {{ formatPrice(variant.price) }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>
            </div>

            <!-- Branch Selection -->
            <div class="selection-section mb-5">
              <div class="d-flex align-center mb-3">
                <span class="text-subtitle-2 font-weight-bold text-uppercase">
                  <v-icon size="small" class="mr-1">mdi-store</v-icon>
                  Chi nhánh giao hàng
                </span>
              </div>
              <v-card class="branch-selector rounded-xl pa-1" variant="outlined">
                <v-radio-group v-model="selectedBranchId" hide-details class="ma-0">
                  <v-radio
                    v-for="branch in availableBranches"
                    :key="branch.id"
                    :value="branch.id"
                    class="branch-radio pa-3 rounded-lg ma-1"
                    :class="{ 'branch-selected': selectedBranchId === branch.id }"
                  >
                    <template v-slot:label>
                      <div class="d-flex justify-space-between align-center w-100">
                        <div>
                          <div class="text-body-2 font-weight-bold">{{ branch.name }}</div>
                          <div class="text-caption text-medium-emphasis">
                            <v-icon size="x-small" class="mr-1">mdi-map-marker</v-icon>
                            {{ branch.location }}
                          </div>
                        </div>
                        <v-chip
                          :color="branch.stock > 10 ? 'success' : branch.stock > 0 ? 'warning' : 'error'"
                          size="x-small"
                          variant="tonal"
                        >
                          {{ branch.stock > 0 ? `Còn ${branch.stock}` : 'Hết hàng' }}
                        </v-chip>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-card>
            </div>

            <!-- Quantity & Add to Cart -->
            <div class="action-section">
              <v-row align="center" class="mb-4">
                <v-col cols="auto">
                  <span class="text-subtitle-2 font-weight-bold text-uppercase">Số lượng</span>
                </v-col>
                <v-col cols="auto">
                  <div class="quantity-control d-flex align-center">
                    <v-btn
                      icon="mdi-minus"
                      variant="text"
                      size="small"
                      :disabled="quantity <= 1"
                      @click="quantity--"
                    />
                    <div class="quantity-value">{{ quantity }}</div>
                    <v-btn
                      icon="mdi-plus"
                      variant="text"
                      size="small"
                      :disabled="quantity >= maxStock"
                      @click="quantity++"
                    />
                  </div>
                </v-col>
                <v-col>
                  <span class="text-caption text-medium-emphasis">
                    {{ maxStock }} sản phẩm có sẵn
                  </span>
                </v-col>
              </v-row>

              <v-row class="mb-4">
                <v-col cols="12" sm="8">
                  <v-btn
                    block
                    color="primary"
                    size="x-large"
                    rounded="xl"
                    class="add-cart-btn font-weight-bold"
                    :disabled="maxStock === 0"
                    @click="addToCart"
                  >
                    <v-icon start>mdi-cart-plus</v-icon>
                    Thêm vào giỏ hàng
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-btn
                    block
                    variant="outlined"
                    size="x-large"
                    rounded="xl"
                    :color="isInWishlist ? 'secondary' : undefined"
                    @click="toggleWishlist"
                  >
                    <v-icon :color="isInWishlist ? 'secondary' : undefined">
                      {{ isInWishlist ? 'mdi-heart' : 'mdi-heart-outline' }}
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- Trust Badges -->
            <v-card variant="flat" class="trust-badges rounded-xl pa-4">
              <v-row dense>
                <v-col cols="4" class="text-center">
                  <v-icon color="success" size="24" class="mb-1">mdi-shield-check</v-icon>
                  <div class="text-caption font-weight-medium">Chính hãng</div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <v-icon color="primary" size="24" class="mb-1">mdi-truck-fast</v-icon>
                  <div class="text-caption font-weight-medium">Giao nhanh 72h</div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <v-icon color="warning" size="24" class="mb-1">mdi-package-variant-closed</v-icon>
                  <div class="text-caption font-weight-medium">Đóng gói cẩn thận</div>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-col>
      </v-row>

      <!-- Product Information Section -->
      <v-row class="mt-8">
        <v-col cols="12" lg="8">
          <!-- Description -->
          <v-card class="info-card rounded-xl mb-6" variant="outlined">
            <v-card-title class="d-flex align-center pa-4">
              <v-icon start color="primary">mdi-text-box</v-icon>
              Mô tả sản phẩm
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <div class="description-content" v-html="formattedDescription"></div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" lg="4">
          <!-- Specifications Table -->
          <v-card class="info-card rounded-xl" variant="outlined">
            <v-card-title class="d-flex align-center pa-4">
              <v-icon start color="primary">mdi-format-list-bulleted</v-icon>
              Thông tin chi tiết
            </v-card-title>
            <v-divider />
            <v-table class="specs-table" density="comfortable">
              <tbody>
                <tr>
                  <td class="spec-label">Danh mục</td>
                  <td>{{ product.category.name }}</td>
                </tr>
                <tr>
                  <td class="spec-label">Nhà cung cấp</td>
                  <td>{{ product.supplier.name }}</td>
                </tr>
                <tr>
                  <td class="spec-label">SKU</td>
                  <td><code>{{ selectedVariant?.sku }}</code></td>
                </tr>
                <tr>
                  <td class="spec-label">Phiên bản</td>
                  <td>{{ selectedVariant?.name }}</td>
                </tr>
                <tr>
                  <td class="spec-label">Trạng thái</td>
                  <td>
                    <v-chip :color="product.status === 'active' ? 'success' : 'info'" size="x-small">
                      {{ product.status === 'active' ? 'Sẵn hàng' : 'Pre-order' }}
                    </v-chip>
                  </td>
                </tr>
                <tr>
                  <td class="spec-label">Đã bán</td>
                  <td>{{ product.soldCount }}+</td>
                </tr>
                <tr>
                  <td class="spec-label">Đánh giá</td>
                  <td>
                    <span class="font-weight-bold">{{ product.rating }}</span>/5 
                    ({{ product.reviewCount }} reviews)
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

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

interface Branch {
  id: number;
  name: string;
  location: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'pre-order';
  category: Category;
  supplier: Supplier;
  variants: ProductVariant[];
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
}

// State
const selectedImageIndex = ref(0);
const quantity = ref(1);
const isInWishlist = ref(false);
const selectedBranchId = ref<number>(1);

// Mock Data
const product = ref<Product>({
  id: 1,
  name: 'Gojo Satoru: Shibuya Incident Ver. 1/7 Scale Figure',
  slug: 'gojo-satoru-shibuya-incident',
  description: `Mẫu figure Gojo Satoru được chế tác tỉ mỉ dựa trên phân cảnh Shibuya Incident trong bộ anime đình đám Jujutsu Kaisen.

**Đặc điểm nổi bật:**
• Chất liệu PVC cao cấp kết hợp ABS
• Chiều cao 25cm (không tính đế)
• 3 đôi tay có thể thay thế
• 2 biểu cảm mặt khác nhau  
• Đế LED có thể bật/tắt

**Lưu ý quan trọng:**
Sản phẩm chính hãng 100%, có tem chống hàng giả. Đóng gói kỹ lưỡng 3 lớp để đảm bảo an toàn khi vận chuyển.`,
  status: 'active',
  category: { id: 1, name: 'Figures', slug: 'figures' },
  supplier: { id: 1, name: 'Good Smile Company' },
  variants: [
    { id: 1, name: 'Standard Edition', sku: 'GSC-GOJO-STD', price: 4250000, original_price: 5100000, image_url: 'https://picsum.photos/600/600?random=1' },
    { id: 2, name: 'Deluxe Edition', sku: 'GSC-GOJO-DLX', price: 5800000, original_price: 6500000, image_url: 'https://picsum.photos/600/600?random=2' },
    { id: 3, name: 'Limited Edition', sku: 'GSC-GOJO-LTD', price: 8500000, image_url: 'https://picsum.photos/600/600?random=3' },
  ],
  images: [
    'https://picsum.photos/600/600?random=1',
    'https://picsum.photos/600/600?random=4',
    'https://picsum.photos/600/600?random=5',
    'https://picsum.photos/600/600?random=6',
  ],
  rating: 4.8,
  reviewCount: 142,
  soldCount: 356,
});

const selectedVariant = ref<ProductVariant>(product.value.variants[0]);

const availableBranches = ref<Branch[]>([
  { id: 1, name: 'Chi nhánh Hà Nội', location: '77 Nguyễn Trãi, Thanh Xuân', stock: 5 },
  { id: 2, name: 'Chi nhánh Hồ Chí Minh', location: '123 Lê Lợi, Quận 1', stock: 12 },
  { id: 3, name: 'Chi nhánh Đà Nẵng', location: '45 Bạch Đằng, Hải Châu', stock: 0 },
]);

const breadcrumbs = [
  { title: 'Trang chủ', disabled: false, to: '/' },
  { title: product.value.category.name, disabled: false, to: '/productlist' },
  { title: product.value.name, disabled: true },
];

// Computed
const allImages = computed(() => {
  const variantImages = product.value.variants.map(v => v.image_url);
  return [...new Set([...variantImages, ...product.value.images])].slice(0, 5);
});

const currentImage = computed(() => allImages.value[selectedImageIndex.value]);

const currentPrice = computed(() => selectedVariant.value?.price || 0);

const discountPercent = computed(() => {
  if (!selectedVariant.value?.original_price) return 0;
  return Math.round((1 - selectedVariant.value.price / selectedVariant.value.original_price) * 100);
});

const selectedBranch = computed(() => availableBranches.value.find(b => b.id === selectedBranchId.value));

const maxStock = computed(() => selectedBranch.value?.stock || 0);

const formattedDescription = computed(() => {
  return product.value.description
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
});

// Watchers
watch(selectedVariant, (newVariant) => {
  const idx = allImages.value.indexOf(newVariant.image_url);
  if (idx >= 0) selectedImageIndex.value = idx;
});

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const addToCart = () => {
  alert(`Đã thêm ${quantity.value}x "${selectedVariant.value.name}" từ ${selectedBranch.value?.name} vào giỏ hàng!`);
};

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value;
};
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
}

/* Gallery Styles */
.main-image-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.main-image {
  transition: transform 0.3s ease;
}

.badges-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.zoom-hint {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-image-card:hover .zoom-hint {
  opacity: 1;
}

.thumbnail-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s ease;
}

.thumbnail-card:hover {
  border-color: rgba(0, 212, 255, 0.5) !important;
  transform: translateY(-2px);
}

.thumbnail-active {
  border-color: #00d4ff !important;
  border-width: 2px !important;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

/* Product Info Styles */
.product-title {
  line-height: 1.2;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

.price-card {
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.08) 0%, rgba(0, 212, 255, 0.05) 100%) !important;
  border: 1px solid rgba(255, 0, 255, 0.15) !important;
}

.neon-price {
  background: linear-gradient(90deg, #ff00ff 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.neon-text-secondary {
  color: #ff00ff;
}

/* Variant Cards */
.variant-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s ease;
  min-width: 180px;
}

.variant-card:hover {
  border-color: rgba(0, 212, 255, 0.4) !important;
  background: rgba(0, 212, 255, 0.05) !important;
}

.variant-selected {
  border-color: #00d4ff !important;
  border-width: 2px !important;
  background: rgba(0, 212, 255, 0.1) !important;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
}

/* Branch Selector */
.branch-selector {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.branch-radio {
  transition: all 0.2s ease;
}

.branch-radio:hover {
  background: rgba(255, 255, 255, 0.03);
}

.branch-selected {
  background: rgba(0, 212, 255, 0.08) !important;
}

.branch-radio :deep(.v-label) {
  width: 100%;
}

/* Quantity Control */
.quantity-control {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
}

.quantity-value {
  min-width: 50px;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
}

/* Add to Cart Button */
.add-cart-btn {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%) !important;
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
  transition: all 0.3s ease;
}

.add-cart-btn:hover {
  box-shadow: 0 6px 30px rgba(0, 212, 255, 0.5);
  transform: translateY(-2px);
}

/* Trust Badges */
.trust-badges {
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
}

/* Info Cards */
.info-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.description-content {
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
}

.description-content :deep(strong) {
  color: #00d4ff;
}

/* Specs Table */
.specs-table {
  background: transparent !important;
}

.specs-table tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.specs-table tr:hover {
  background: rgba(0, 212, 255, 0.03);
}

.spec-label {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  width: 120px;
}

.specs-table code {
  background: rgba(0, 212, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  color: #00d4ff;
}
</style>