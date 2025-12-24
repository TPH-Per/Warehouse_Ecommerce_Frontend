<template>
  <div class="product-detail-page">
    <!-- Loading State -->
    <v-container v-if="isLoading" class="py-16">
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary" size="64" />
          <p class="mt-4 text-h6">Đang tải sản phẩm...</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Error State -->
    <v-container v-else-if="error" class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="6" class="text-center">
          <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
          <h2 class="text-h5 mb-4">Không thể tải sản phẩm</h2>
          <p class="text-medium-emphasis mb-4">{{ error }}</p>
          <v-btn color="primary" to="/productlist" rounded="lg">
            <v-icon start>mdi-arrow-left</v-icon>
            Quay lại danh sách
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Product Content -->
    <template v-else-if="product">
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

            <!-- Rating & Stats (dynamic from reviews) -->
            <div class="d-flex align-center flex-wrap ga-4 mb-6">
              <div class="d-flex align-center">
                <v-rating
                  :model-value="averageRating"
                  color="amber"
                  density="compact"
                  size="small"
                  readonly
                  half-increments
                />
                <span class="ml-2 text-body-2 font-weight-bold text-amber">{{ averageRating.toFixed(1) }}</span>
                <span class="text-body-2 text-medium-emphasis ml-1">({{ reviews.length }} đánh giá)</span>
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
                  @click="selectedVariantId = variant.id"
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
                <v-progress-circular v-if="isLoadingStock" indeterminate size="16" width="2" class="ml-2" />
              </div>
              
              <!-- Loading Stock -->
              <v-card v-if="isLoadingStock" class="branch-selector rounded-xl pa-4 text-center" variant="outlined">
                <v-progress-circular indeterminate size="24" class="mr-2" />
                <span class="text-medium-emphasis">Đang tải thông tin tồn kho...</span>
              </v-card>
              
              <!-- No Branches -->
              <v-card v-else-if="availableBranches.length === 0" class="branch-selector rounded-xl pa-4 text-center" variant="outlined">
                <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
                <span class="text-medium-emphasis">Không có chi nhánh nào có sẵn sản phẩm này</span>
              </v-card>
              
              <!-- Branch List -->
              <v-card v-else class="branch-selector rounded-xl pa-1" variant="outlined">
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
                            {{ branch.location || 'Chưa cập nhật địa chỉ' }}
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

    <!-- Related Products Carousel -->
    <v-container v-if="relatedProducts.length > 0" class="related-products-section py-8">
      <div class="d-flex align-center justify-space-between mb-6">
        <div>
          <h2 class="text-h5 font-weight-bold mb-1">
            <v-icon color="primary" class="mr-2">mdi-lightning-bolt</v-icon>
            Sản phẩm liên quan
          </h2>
          <p class="text-medium-emphasis text-body-2">Những sản phẩm cùng danh mục bạn có thể quan tâm</p>
        </div>
        <v-btn 
          variant="text" 
          color="primary" 
          :to="`/productlist?categoryId=${product?.category?.id}`"
          class="text-none"
        >
          Xem tất cả
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>

      <!-- Carousel Container -->
      <v-slide-group show-arrows class="related-carousel">
        <v-slide-group-item v-for="relatedProduct in relatedProducts" :key="getProductId(relatedProduct)">
          <v-card 
            class="related-product-card ma-2 rounded-xl" 
            width="220"
            variant="flat"
            @click="goToProduct(getProductId(relatedProduct))"
          >
            <v-img
              :src="getRelatedProductImage(relatedProduct)"
              height="220"
              cover
              class="related-product-image"
            >
              <div class="fill-height d-flex align-end">
                <v-chip
                  v-if="getRelatedProductDiscount(relatedProduct) > 0"
                  color="error"
                  size="x-small"
                  class="ma-2"
                >
                  -{{ getRelatedProductDiscount(relatedProduct) }}%
                </v-chip>
              </div>
            </v-img>

            <v-card-text class="pa-3">
              <h4 class="related-product-name text-body-2 font-weight-medium mb-2">
                {{ relatedProduct.Name || relatedProduct.name }}
              </h4>
              
              <div class="d-flex align-center ga-2 mb-2">
                <span class="text-primary font-weight-bold">
                  {{ formatPrice(getRelatedProductPrice(relatedProduct)) }}
                </span>
                <span 
                  v-if="getRelatedProductOriginalPrice(relatedProduct)" 
                  class="text-decoration-line-through text-medium-emphasis text-caption"
                >
                  {{ formatPrice(getRelatedProductOriginalPrice(relatedProduct)) }}
                </span>
              </div>

              <div class="d-flex align-center">
                <v-icon size="x-small" color="amber">mdi-star</v-icon>
                <span class="text-caption text-medium-emphasis ml-1">
                  {{ relatedProduct.Rating || relatedProduct.rating || 0 }}
                </span>
                <span class="text-caption text-medium-emphasis mx-1">•</span>
                <span class="text-caption text-medium-emphasis">
                  Đã bán {{ relatedProduct.SoldCount || relatedProduct.soldCount || 0 }}
                </span>
              </div>
            </v-card-text>

            <v-overlay
              :model-value="true"
              contained
              class="align-center justify-center product-overlay"
              scrim="transparent"
            >
              <v-btn 
                color="primary" 
                variant="flat" 
                size="small" 
                rounded="lg"
                class="px-4"
              >
                <v-icon start size="small">mdi-eye</v-icon>
                Xem ngay
              </v-btn>
            </v-overlay>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>

      <!-- Loading state for related products -->
      <div v-if="isLoadingRelated" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </v-container>

    <!-- Reviews Section -->
    <v-container class="reviews-section py-8">
      <div class="d-flex align-center justify-space-between mb-6">
        <div>
          <h2 class="text-h5 font-weight-bold mb-1">
            <v-icon color="amber" class="mr-2">mdi-star</v-icon>
            Đánh giá sản phẩm
          </h2>
          <p class="text-medium-emphasis text-body-2">
            {{ reviews.length }} đánh giá • Trung bình {{ averageRating.toFixed(1) }}/5 sao
          </p>
        </div>
      </div>

      <!-- Review Stats -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card class="review-stats-card rounded-xl pa-6 text-center" variant="outlined">
            <div class="text-h2 font-weight-bold text-primary mb-2">{{ averageRating.toFixed(1) }}</div>
            <v-rating
              :model-value="averageRating"
              color="amber"
              half-increments
              readonly
              size="small"
              class="mb-2"
            />
            <div class="text-caption text-medium-emphasis">{{ reviews.length }} đánh giá</div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="8">
          <!-- Write Review Form -->
          <v-card v-if="canWriteReview" class="write-review-card rounded-xl pa-4" variant="outlined">
            <div class="text-subtitle-1 font-weight-bold mb-3">
              <v-icon start color="primary">mdi-pencil</v-icon>
              Viết đánh giá của bạn
            </div>
            
            <div class="mb-3">
              <div class="text-caption text-medium-emphasis mb-1">Đánh giá</div>
              <v-rating
                v-model="newReview.rating"
                color="amber"
                hover
                size="large"
              />
            </div>
            
            <v-textarea
              v-model="newReview.comment"
              label="Nhận xét của bạn"
              variant="outlined"
              rounded="lg"
              rows="3"
              counter
              maxlength="500"
              class="mb-3"
            />
            
            <v-btn
              color="primary"
              rounded="lg"
              :loading="isSubmittingReview"
              :disabled="!newReview.rating || !newReview.comment.trim()"
              @click="submitReview"
            >
              <v-icon start>mdi-send</v-icon>
              Gửi đánh giá
            </v-btn>
          </v-card>
          
          <!-- Login prompt for guests -->
          <v-card v-else-if="!authStore.isAuthenticated" class="write-review-card rounded-xl pa-6 text-center" variant="outlined">
            <v-icon size="48" color="primary" class="mb-3">mdi-account-question</v-icon>
            <div class="text-subtitle-1 font-weight-bold mb-2">Đăng nhập để đánh giá</div>
            <p class="text-caption text-medium-emphasis mb-4">Bạn cần đăng nhập để viết đánh giá cho sản phẩm này</p>
            <v-btn to="/login" color="primary" variant="outlined" rounded="lg">
              Đăng nhập
            </v-btn>
          </v-card>
          
          <!-- Already reviewed or not purchased -->
          <v-card v-else class="write-review-card rounded-xl pa-6 text-center" variant="outlined">
            <v-icon size="48" color="info" class="mb-3">mdi-information</v-icon>
            <div class="text-subtitle-1 font-weight-bold mb-2">
              {{ hasReviewed ? 'Bạn đã đánh giá sản phẩm này' : 'Chỉ khách hàng đã mua mới có thể đánh giá' }}
            </div>
            <p class="text-caption text-medium-emphasis">
              {{ hasReviewed ? 'Cảm ơn bạn đã chia sẻ đánh giá!' : 'Hãy mua sản phẩm để có thể viết đánh giá.' }}
            </p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Reviews List -->
      <div v-if="isLoadingReviews" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <div v-else-if="reviews.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey" class="mb-4">mdi-comment-text-outline</v-icon>
        <p class="text-medium-emphasis">Chưa có đánh giá nào cho sản phẩm này</p>
      </div>

      <v-card v-else class="reviews-list-card rounded-xl" variant="outlined">
        <v-list class="bg-transparent">
          <template v-for="(review, index) in reviews" :key="index">
            <v-list-item class="py-4">
              <template v-slot:prepend>
                <v-avatar color="primary" size="40">
                  <span class="text-caption font-weight-bold">{{ getReviewerInitials(review) }}</span>
                </v-avatar>
              </template>
              
              <v-list-item-title class="font-weight-bold mb-1">
                {{ getReviewerName(review) }}
              </v-list-item-title>
              
              <template v-slot:subtitle>
                <div class="d-flex align-center ga-2 mb-2">
                  <v-rating
                    :model-value="getReviewRating(review)"
                    color="amber"
                    density="compact"
                    half-increments
                    readonly
                    size="x-small"
                  />
                  <span class="text-caption text-medium-emphasis">
                    {{ formatReviewDate(review) }}
                  </span>
                </div>
                <p class="text-body-2 review-comment">{{ getReviewComment(review) }}</p>
              </template>
            </v-list-item>
            <v-divider v-if="index < reviews.length - 1" />
          </template>
        </v-list>
      </v-card>
    </v-container>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products.store';
import { useBranchesStore } from '@/stores/branches.store';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { useToast } from '@/composables/useToast';
import type { ProductDetail } from '@/types';

// ========== ROUTER ==========
const route = useRoute();
const router = useRouter();

// ========== STORES ==========
const productsStore = useProductsStore();
const branchesStore = useBranchesStore();
const cartStore = useCartStore();
const authStore = useAuthStore();

// ========== TOAST ==========
const toast = useToast();

// ========== LOADING & ERROR ==========
const isLoading = computed(() => productsStore.isLoading);
const error = computed(() => productsStore.error);

// ========== PLACEHOLDER IMAGE ==========
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect fill="#1a1a2e" width="600" height="600"/>
    <rect fill="#16213e" x="50" y="50" width="500" height="500" rx="20"/>
    <path fill="#0f3460" d="M300 150 L450 350 L150 350 Z"/>
    <circle fill="#e94560" cx="420" cy="180" r="40"/>
    <text x="300" y="480" text-anchor="middle" fill="#666" font-family="Arial" font-size="24">No Image</text>
  </svg>
`);

// ========== IMAGE HELPER ==========
// Base URL của API server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://localhost:44377';

/**
 * Chuyển đổi đường dẫn ảnh từ database thành URL đầy đủ
 */
const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath || imagePath === '' || imagePath === 'null') {
    return PLACEHOLDER_IMAGE;
  }
  
  // Nếu đường dẫn đã đầy đủ (http/https)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Nếu là đường dẫn tương đối, thêm base URL
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Trường hợp còn lại (chỉ có tên file)
  return `${API_BASE_URL}/wwwroot/uploads/products/${imagePath}`;
};

// ========== LOCAL STATE ==========
const selectedImageIndex = ref(0);
const quantity = ref(1);
const isInWishlist = ref(false);
const selectedBranchId = ref<number>(1);
const selectedVariantId = ref<number | null>(null);

// Related products
const relatedProducts = ref<any[]>([]);
const isLoadingRelated = ref(false);

// Reviews
const reviews = ref<any[]>([]);
const isLoadingReviews = ref(false);
const isSubmittingReview = ref(false);
const canWriteReview = ref(false);
const hasReviewed = ref(false);
const newReview = ref({
  rating: 0,
  comment: '',
});

// Helper function for review rating (needed by computed below)
const getReviewRating = (r: any): number => {
  return r.Rating ?? r.rating ?? 0;
};

// Average rating computed
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const total = reviews.value.reduce((sum, r) => sum + getReviewRating(r), 0);
  return total / reviews.value.length;
});

// ========== COMPUTED: PRODUCT DATA ==========
// Lấy product từ store - hỗ trợ cả PascalCase và camelCase
const product = computed(() => {
  const p = productsStore.currentProduct;
  if (!p) return null;
  
  return {
    id: (p as any).Id ?? (p as any).id ?? 0,
    name: (p as any).Name ?? (p as any).name ?? 'Sản phẩm',
    slug: (p as any).Slug ?? (p as any).slug ?? '',
    description: (p as any).Description ?? (p as any).description ?? '',
    status: (p as any).Status ?? (p as any).status ?? 'active',
    category: {
      id: (p as any).Category?.Id ?? (p as any).category?.id ?? 0,
      name: (p as any).Category?.Name ?? (p as any).CategoryName ?? (p as any).category?.name ?? 'Chưa phân loại',
      slug: (p as any).Category?.Slug ?? (p as any).category?.slug ?? ''
    },
    supplier: {
      id: (p as any).Supplier?.Id ?? (p as any).supplier?.id ?? 0,
      name: (p as any).Supplier?.Name ?? (p as any).SupplierName ?? (p as any).supplier?.name ?? ''
    },
    variants: ((p as any).Variants ?? (p as any).variants ?? []).map((v: any) => ({
      id: v.Id ?? v.id,
      name: v.Name ?? v.name ?? 'Standard',
      sku: v.Sku ?? v.sku ?? '',
      price: v.Price ?? v.price ?? 0,
      original_price: v.OriginalPrice ?? v.original_price ?? null,
      // Xử lý đường dẫn ảnh - chuyển đổi sang URL đầy đủ
      image_url: getImageUrl(v.ImageUrl ?? v.image_url)
    })),
    images: (p as any).Images ?? (p as any).images ?? [],
    rating: (p as any).Rating ?? (p as any).rating ?? 0,
    reviewCount: (p as any).ReviewCount ?? (p as any).review_count ?? 0,
    soldCount: (p as any).SoldCount ?? (p as any).sold_count ?? 0,
  };
});

// Selected variant
const selectedVariant = computed(() => {
  if (!product.value || product.value.variants.length === 0) return null;
  
  if (selectedVariantId.value) {
    return product.value.variants.find((v: any) => v.id === selectedVariantId.value) || product.value.variants[0];
  }
  return product.value.variants[0];
});

// ========== BRANCHES & STOCK ==========
// Lấy danh sách chi nhánh với tồn kho từ store
const availableBranches = computed(() => {
  return branchesStore.variantStocks.map(s => ({
    id: s.BranchId,
    name: s.BranchName,
    location: s.Location || '',
    stock: s.Stock
  }));
});

// Kiểm tra có đang load stock không
const isLoadingStock = computed(() => branchesStore.isLoading);

// Breadcrumbs
const breadcrumbs = computed(() => [
  { title: 'Trang chủ', disabled: false, to: '/' },
  { title: product.value?.category.name || 'Danh mục', disabled: false, to: '/productlist' },
  { title: product.value?.name || 'Sản phẩm', disabled: true },
]);

// All images for gallery
const allImages = computed(() => {
  if (!product.value) return [PLACEHOLDER_IMAGE];
  
  // Variant images đã được xử lý qua getImageUrl trong product computed
  const variantImages = product.value.variants
    .map((v: any) => v.image_url)
    .filter((url: string) => url && url !== PLACEHOLDER_IMAGE);
  
  // Product images cũng cần xử lý qua getImageUrl
  const rawProductImages = product.value.images || [];
  const productImages = rawProductImages.map((img: string) => getImageUrl(img));
  
  const allImgs = [...new Set([...variantImages, ...productImages])].slice(0, 5);
  
  return allImgs.length > 0 ? allImgs : [PLACEHOLDER_IMAGE];
});

const currentImage = computed(() => allImages.value[selectedImageIndex.value] || PLACEHOLDER_IMAGE);

const currentPrice = computed(() => selectedVariant.value?.price || 0);

const discountPercent = computed(() => {
  if (!selectedVariant.value?.original_price) return 0;
  return Math.round((1 - selectedVariant.value.price / selectedVariant.value.original_price) * 100);
});

const selectedBranch = computed(() => availableBranches.value.find(b => b.id === selectedBranchId.value));

const maxStock = computed(() => selectedBranch.value?.stock || 0);

// Tổng tồn kho tất cả chi nhánh
const totalStockAllBranches = computed(() => branchesStore.totalStock);

const formattedDescription = computed(() => {
  if (!product.value?.description) return '';
  return product.value.description
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
});

// ========== REVIEWS METHODS (defined before watchers) ==========
import { getProductReviews, createReview } from '@/api/reviews.api';
import apiClient from '@/api/index';

// Fetch reviews for product
const fetchReviews = async (productId: number) => {
  isLoadingReviews.value = true;
  try {
    const response = await getProductReviews(productId);
    const data = response.data.Data || response.data.data || [];
    reviews.value = data;
    console.log(`📝 Loaded ${reviews.value.length} reviews for product ${productId}`);
  } catch (error) {
    console.error('Error loading reviews:', error);
    reviews.value = [];
  } finally {
    isLoadingReviews.value = false;
  }
};

// Check if current user can write a review
const checkCanReview = async (productId: number) => {
  if (!authStore.isAuthenticated) {
    canWriteReview.value = false;
    return;
  }
  
  try {
    const response = await apiClient.get(`/reviews/can-review/${productId}`);
    const data = response.data;
    canWriteReview.value = data.CanReview ?? data.canReview ?? false;
    hasReviewed.value = data.HasReviewed ?? data.hasReviewed ?? false;
    console.log(`📝 Can review: ${canWriteReview.value}, Has reviewed: ${hasReviewed.value}`);
  } catch (error) {
    console.warn('Can-review API not available, using fallback');
    canWriteReview.value = authStore.isAuthenticated;
    hasReviewed.value = false;
  }
};

// ========== WATCHERS ==========

// Watch variant change to update image và fetch stock
watch(() => selectedVariant.value, async (newVariant) => {
  if (newVariant?.image_url) {
    const idx = allImages.value.indexOf(newVariant.image_url);
    if (idx >= 0) selectedImageIndex.value = idx;
  }
  
  // Fetch stock cho variant mới
  if (newVariant?.id) {
    await branchesStore.fetchStockByVariant(newVariant.id);
    
    // Tự động chọn chi nhánh đầu tiên có hàng
    const branches = availableBranches.value;
    const firstAvailable = branches.find(b => b.stock > 0);
    if (firstAvailable) {
      selectedBranchId.value = firstAvailable.id;
    } else if (branches.length > 0 && branches[0]) {
      selectedBranchId.value = branches[0].id;
    }
  }
});

// Watch route change to fetch new product
watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      const productId = Number(newId);
      if (!isNaN(productId)) {
        productsStore.fetchProductById(productId);
        branchesStore.clearStocks(); // Clear old stock data
        selectedVariantId.value = null; // Reset variant selection
        selectedBranchId.value = 0; // Reset branch selection
        quantity.value = 1;
      }
    }
  },
  { immediate: true }
);

// Watch product để set default variant và fetch stock
watch(() => product.value, async (newProduct) => {
  if (newProduct && newProduct.variants.length > 0) {
    // Auto-select first variant nếu chưa chọn
    if (!selectedVariantId.value) {
      const firstVariant = newProduct.variants[0];
      if (firstVariant) {
        selectedVariantId.value = firstVariant.id;
        // Fetch stock cho variant đầu tiên
        await branchesStore.fetchStockByVariant(firstVariant.id);
        
        // Tự động chọn chi nhánh đầu tiên có hàng
        const branches = availableBranches.value;
        const firstAvailable = branches.find(b => b.stock > 0);
        if (firstAvailable) {
          selectedBranchId.value = firstAvailable.id;
        }
      }
    }
    
    // Fetch related products từ cùng category
    if (newProduct.category?.id) {
      fetchRelatedProducts(newProduct.category.id, newProduct.id);
    }
    
    // Fetch reviews for this product
    fetchReviews(newProduct.id);
    checkCanReview(newProduct.id);
  }
}, { immediate: true });

// ========== METHODS ==========
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// ========== RELATED PRODUCTS METHODS ==========
// Helper to get product ID from both PascalCase and camelCase
const getProductId = (p: any): number => {
  return p.Id || p.id || 0;
};

const goToProduct = (productId: number) => {
  if (!productId) {
    console.error('Invalid productId:', productId);
    return;
  }
  router.push({ path: '/product', query: { id: productId.toString() } });
};

const getRelatedProductImage = (p: any): string => {
  // First try direct ImageUrl on product (from in-stock API)
  let imgUrl = p.ImageUrl || p.image_url;
  
  // If not found, try from Variants array
  if (!imgUrl) {
    const variants = p.Variants || p.variants || [];
    if (variants.length > 0) {
      imgUrl = variants[0].ImageUrl || variants[0].image_url;
    }
  }
  
  if (!imgUrl) return PLACEHOLDER_IMAGE;
  
  // If already full URL, return as is
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
    return imgUrl;
  }
  
  // Build full URL - server serves static files from /wwwroot path
  return `${API_BASE_URL}${imgUrl}`;
};

const getRelatedProductPrice = (p: any): number => {
  // First try direct Price on product
  if (p.Price !== undefined) return p.Price;
  if (p.price !== undefined) return p.price;
  
  // Then try from Variants
  const variants = p.Variants || p.variants || [];
  if (variants.length > 0) {
    return variants[0].Price || variants[0].price || 0;
  }
  return 0;
};

const getRelatedProductOriginalPrice = (p: any): number | null => {
  // First try direct OriginalPrice on product
  if (p.OriginalPrice !== undefined && p.OriginalPrice !== null) return p.OriginalPrice;
  if (p.original_price !== undefined && p.original_price !== null) return p.original_price;
  
  // Then try from Variants
  const variants = p.Variants || p.variants || [];
  if (variants.length > 0) {
    return variants[0].OriginalPrice || variants[0].original_price || null;
  }
  return null;
};

const getRelatedProductDiscount = (p: any): number => {
  const price = getRelatedProductPrice(p);
  const originalPrice = getRelatedProductOriginalPrice(p);
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
};

const fetchRelatedProducts = async (categoryId: number, currentProductId: number) => {
  isLoadingRelated.value = true;
  try {
    // Fetch products in stock
    await productsStore.fetchProductsInStock();
    
    // Filter by same category, exclude current product, limit to 10
    const allProducts = productsStore.products || [];
    relatedProducts.value = allProducts
      .filter((p: any) => {
        const pId = p.Id || p.id;
        const pCategoryId = p.CategoryId || p.category_id || (p.Category?.Id) || (p.category?.id);
        // Same category, different product, not deleted
        return pCategoryId === categoryId && pId !== currentProductId;
      })
      .slice(0, 10);
      
    console.log(`Found ${relatedProducts.value.length} related products in category ${categoryId}`);
  } catch (error) {
    console.error('Error fetching related products:', error);
    relatedProducts.value = [];
  } finally {
    isLoadingRelated.value = false;
  }
};

// ========== REVIEWS HELPER METHODS ==========
// Note: imports and main functions are defined before watchers
// Note: getReviewRating is defined earlier (before averageRating computed)

const getReviewComment = (r: any): string => {
  return r.Comment ?? r.comment ?? '';
};

const getReviewerName = (r: any): string => {
  return r.UserName ?? r.user_name ?? r.User?.Name ?? r.user?.name ?? 'Khách hàng';
};

const getReviewerInitials = (r: any): string => {
  const name = getReviewerName(r);
  return name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'KH';
};

const formatReviewDate = (r: any): string => {
  const dateStr = r.CreatedAt ?? r.created_at;
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
};


// Submit a new review
const submitReview = async () => {
  if (!product.value || !newReview.value.rating || !newReview.value.comment.trim()) {
    toast.warning('Vui lòng chọn số sao và nhập nhận xét');
    return;
  }
  
  isSubmittingReview.value = true;
  try {
    const response = await createReview({
      ProductId: product.value.id,
      Rating: newReview.value.rating,
      Comment: newReview.value.comment.trim(),
    });
    
    const success = response.data.Success ?? response.data.success;
    if (success) {
      toast.success('Đánh giá của bạn đã được gửi thành công!');
      // Reset form
      newReview.value = { rating: 0, comment: '' };
      canWriteReview.value = false;
      hasReviewed.value = true;
      // Reload reviews
      await fetchReviews(product.value.id);
    } else {
      toast.error(response.data.Message ?? response.data.message ?? 'Có lỗi xảy ra');
    }
  } catch (error: any) {
    console.error('Error submitting review:', error);
    toast.error(error.response?.data?.Message ?? 'Không thể gửi đánh giá');
  } finally {
    isSubmittingReview.value = false;
  }
};

const selectVariant = (variantId: number) => {
  selectedVariantId.value = variantId;
};

const addToCart = async () => {
  if (!selectedVariant.value || !selectedBranch.value) {
    toast.warning('Vui lòng chọn phiên bản và chi nhánh');
    return;
  }
  
  if (maxStock.value === 0) {
    toast.error('Sản phẩm đã hết hàng tại chi nhánh này');
    return;
  }
  
  // Kiểm tra đăng nhập
  if (!authStore.isAuthenticated) {
    toast.warning('Vui lòng đăng nhập để thêm vào giỏ hàng');
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }
  
  // Gọi cart store để thêm sản phẩm (với extra fields cho optimistic update)
  const result = await cartStore.addToCart({
    productVariantId: selectedVariant.value.id,
    quantity: quantity.value,
    price: selectedVariant.value.price,
    branchId: selectedBranch.value.id,
    // Extra fields for optimistic UI
    branchName: selectedBranch.value.name,
    productName: product.value?.name || '',
    variantName: selectedVariant.value.name,
    imageUrl: selectedVariant.value.image_url || (product.value?.images?.[0]) || '',
  });
  
  if (result.success) {
    toast.success(`Đã thêm ${quantity.value}x "${selectedVariant.value.name}" vào giỏ hàng!`);
  } else {
    toast.error(result.message);
  }
};

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value;
  // TODO: Implement wishlist store
};

// ========== LIFECYCLE ==========
onMounted(() => {
  const productId = route.query.id;
  if (productId) {
    productsStore.fetchProductById(Number(productId));
  }
});
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

/* Related Products Section */
.related-products-section {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 212, 255, 0.02) 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.related-carousel :deep(.v-slide-group__prev),
.related-carousel :deep(.v-slide-group__next) {
  background: rgba(0, 212, 255, 0.1) !important;
  color: #00d4ff !important;
  border-radius: 50%;
}

.related-carousel :deep(.v-slide-group__prev:hover),
.related-carousel :deep(.v-slide-group__next:hover) {
  background: rgba(0, 212, 255, 0.2) !important;
}

.related-product-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.related-product-card:hover {
  transform: translateY(-8px);
  border-color: rgba(0, 212, 255, 0.3) !important;
  box-shadow: 0 12px 40px rgba(0, 212, 255, 0.15);
}

.related-product-card .product-overlay {
  opacity: 0;
  transition: opacity 0.3s ease;
  background: rgba(0, 0, 0, 0.6) !important;
}

.related-product-card:hover .product-overlay {
  opacity: 1;
}

.related-product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  min-height: 2.8em;
}

.related-product-image {
  transition: transform 0.4s ease;
}

.related-product-card:hover .related-product-image {
  transform: scale(1.05);
}

/* ========== REVIEWS SECTION ========== */
.reviews-section {
  background: linear-gradient(180deg, rgba(0, 212, 255, 0.03) 0%, transparent 100%);
  border-top: 1px solid rgba(0, 212, 255, 0.1);
}

.review-stats-card {
  background: rgba(0, 212, 255, 0.05) !important;
  border-color: rgba(0, 212, 255, 0.2) !important;
}

.write-review-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.reviews-list-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.review-comment {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
}
</style>