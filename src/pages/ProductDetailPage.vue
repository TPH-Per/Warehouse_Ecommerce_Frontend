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

      <!-- Reviews Section -->
      <v-row class="mt-8">
        <v-col cols="12">
          <v-card class="reviews-section rounded-xl" variant="outlined">
            <!-- Header -->
            <v-card-title class="d-flex align-center justify-space-between pa-5">
              <div class="d-flex align-center">
                <v-icon start color="warning" size="28">mdi-star-circle</v-icon>
                <span class="text-h5 font-weight-bold">Đánh giá sản phẩm</span>
                <v-chip color="primary" variant="tonal" size="small" class="ml-3">
                  {{ reviews.length }} đánh giá
                </v-chip>
              </div>
            </v-card-title>
            
            <v-divider />

            <v-card-text class="pa-5">
              <v-row>
                <!-- Rating Summary (Left) -->
                <v-col cols="12" md="4">
                  <div class="rating-summary text-center pa-6 rounded-xl">
                    <!-- Overall Score -->
                    <div class="overall-score mb-4">
                      <span class="text-h2 font-weight-black neon-score">{{ averageRating.toFixed(1) }}</span>
                      <span class="text-h5 text-medium-emphasis">/5</span>
                    </div>
                    
                    <!-- Stars -->
                    <v-rating
                      :model-value="averageRating"
                      color="warning"
                      half-increments
                      readonly
                      size="large"
                      class="mb-3"
                    />
                    
                    <p class="text-body-2 text-medium-emphasis mb-6">
                      Dựa trên {{ reviews.length }} đánh giá
                    </p>
                    
                    <!-- Rating Breakdown -->
                    <div class="rating-breakdown">
                      <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="rating-bar d-flex align-center ga-3 mb-2">
                        <div class="d-flex align-center" style="width: 60px;">
                          <span class="text-body-2 font-weight-medium mr-1">{{ star }}</span>
                          <v-icon size="16" color="warning">mdi-star</v-icon>
                        </div>
                        <v-progress-linear
                          :model-value="getRatingPercentage(star)"
                          color="warning"
                          bg-color="rgba(255,255,255,0.1)"
                          height="8"
                          rounded
                          class="flex-grow-1"
                        />
                        <span class="text-caption text-medium-emphasis" style="width: 40px;">
                          {{ getRatingCount(star) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Write Review & Reviews List (Right) -->
                <v-col cols="12" md="8">
                  <!-- Write Review Form -->
                  <v-card class="write-review-card rounded-xl mb-6 pa-5" variant="flat">
                    <div class="d-flex align-center mb-4">
                      <v-icon start color="primary">mdi-pencil-plus</v-icon>
                      <span class="text-subtitle-1 font-weight-bold">Viết đánh giá của bạn</span>
                    </div>
                    
                    <!-- Not Logged In -->
                    <div v-if="!authStore.isAuthenticated" class="text-center py-6">
                      <v-icon size="48" color="primary" class="mb-3 opacity-50">mdi-account-circle</v-icon>
                      <p class="text-body-2 text-medium-emphasis mb-4">
                        Vui lòng đăng nhập để viết đánh giá
                      </p>
                      <v-btn 
                        color="primary" 
                        variant="tonal" 
                        rounded="lg"
                        @click="router.push({ name: 'Login', query: { redirect: route.fullPath } })"
                      >
                        <v-icon start>mdi-login</v-icon>
                        Đăng nhập ngay
                      </v-btn>
                    </div>

                    <!-- Already Reviewed -->
                    <div v-else-if="hasUserReviewed" class="text-center py-6">
                      <v-icon size="48" color="success" class="mb-3">mdi-check-circle</v-icon>
                      <p class="text-body-2 text-medium-emphasis">
                        Bạn đã đánh giá sản phẩm này
                      </p>
                    </div>

                    <!-- Review Form -->
                    <div v-else>
                      <!-- Rating Selection -->
                      <div class="mb-4">
                        <label class="text-body-2 text-medium-emphasis d-block mb-2">
                          Đánh giá của bạn <span class="text-error">*</span>
                        </label>
                        <v-rating
                          v-model="newReview.rating"
                          color="warning"
                          hover
                          size="x-large"
                          class="rating-input"
                        />
                        <div class="rating-labels d-flex ga-2 mt-2">
                          <v-chip 
                            v-for="label in ratingLabels" 
                            :key="label.value"
                            :color="newReview.rating === label.value ? 'warning' : 'default'"
                            :variant="newReview.rating === label.value ? 'flat' : 'outlined'"
                            size="x-small"
                            class="cursor-pointer"
                            @click="newReview.rating = label.value"
                          >
                            {{ label.text }}
                          </v-chip>
                        </div>
                      </div>

                      <!-- Comment -->
                      <v-textarea
                        v-model="newReview.comment"
                        label="Nhận xét của bạn"
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        variant="outlined"
                        rounded="lg"
                        rows="4"
                        counter="1000"
                        maxlength="1000"
                        class="mb-4"
                      />

                      <!-- Submit Button -->
                      <div class="d-flex justify-end">
                        <v-btn
                          color="primary"
                          rounded="lg"
                          size="large"
                          :loading="isSubmittingReview"
                          :disabled="newReview.rating === 0"
                          @click="submitReview"
                        >
                          <v-icon start>mdi-send</v-icon>
                          Gửi đánh giá
                        </v-btn>
                      </div>
                    </div>
                  </v-card>

                  <!-- Reviews List -->
                  <div class="reviews-list">
                    <div class="d-flex align-center justify-space-between mb-4">
                      <span class="text-subtitle-1 font-weight-bold">
                        <v-icon start size="small">mdi-comment-text-multiple</v-icon>
                        Tất cả đánh giá
                      </span>
                      <v-select
                        v-model="reviewSortBy"
                        :items="reviewSortOptions"
                        density="compact"
                        variant="outlined"
                        hide-details
                        rounded="lg"
                        style="max-width: 180px;"
                      />
                    </div>

                    <!-- Empty State -->
                    <div v-if="reviews.length === 0" class="empty-reviews text-center py-12">
                      <v-icon size="64" color="primary" class="mb-4 opacity-30">mdi-comment-off-outline</v-icon>
                      <p class="text-h6 font-weight-medium mb-2">Chưa có đánh giá nào</p>
                      <p class="text-body-2 text-medium-emphasis">
                        Hãy là người đầu tiên đánh giá sản phẩm này!
                      </p>
                    </div>

                    <!-- Reviews -->
                    <v-card
                      v-for="review in sortedReviews"
                      :key="`${review.user_id}-${review.created_at}`"
                      class="review-card rounded-xl mb-4 pa-4"
                      variant="flat"
                    >
                      <div class="d-flex ga-4">
                        <!-- Avatar -->
                        <v-avatar color="primary" size="48">
                          <span class="text-h6 font-weight-bold">{{ getInitials(review.user_name) }}</span>
                        </v-avatar>

                        <div class="flex-grow-1">
                          <!-- Header -->
                          <div class="d-flex align-center justify-space-between mb-2">
                            <div>
                              <span class="font-weight-bold">{{ review.user_name }}</span>
                              <v-chip 
                                v-if="review.is_verified_purchase" 
                                color="success" 
                                size="x-small" 
                                variant="tonal"
                                class="ml-2"
                              >
                                <v-icon start size="x-small">mdi-check-decagram</v-icon>
                                Đã mua hàng
                              </v-chip>
                            </div>
                            <span class="text-caption text-medium-emphasis">
                              {{ formatReviewDate(review.created_at) }}
                            </span>
                          </div>

                          <!-- Rating -->
                          <v-rating
                            :model-value="review.rating"
                            color="warning"
                            density="compact"
                            size="small"
                            readonly
                            class="mb-2"
                          />

                          <!-- Comment -->
                          <p class="text-body-2 mb-0 review-comment">
                            {{ review.comment || 'Không có nhận xét.' }}
                          </p>
                        </div>
                      </div>
                    </v-card>

                    <!-- Load More -->
                    <div v-if="reviews.length > 5 && !showAllReviews" class="text-center mt-4">
                      <v-btn 
                        variant="outlined" 
                        rounded="lg"
                        @click="showAllReviews = true"
                      >
                        <v-icon start>mdi-chevron-down</v-icon>
                        Xem thêm {{ reviews.length - 5 }} đánh giá
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
import { useWishlistStore } from '@/stores/wishlist.store';
import { useToast } from '@/composables/useToast';
import { getProductReviews, createReview } from '@/api/reviews.api';
import type { Review } from '@/api/reviews.api';
import type { ProductDetail } from '@/types';

// ========== ROUTER ==========
const route = useRoute();
const router = useRouter();

// ========== STORES ==========
const productsStore = useProductsStore();
const branchesStore = useBranchesStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const wishlistStore = useWishlistStore();

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
const selectedBranchId = ref<number>(1);
const selectedVariantId = ref<number | null>(null);

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

// Kiểm tra sản phẩm có trong wishlist không
const isInWishlist = computed(() => {
  if (!selectedVariant.value) return false;
  return wishlistStore.isInWishlist(selectedVariant.value.id);
});

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
  }
}, { immediate: true });

// ========== METHODS ==========
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
    router.push({ name: 'Login', query: { redirect: route.fullPath } });
    return;
  }
  
  // Gọi cart store để thêm sản phẩm
  const result = await cartStore.addToCart({
    productVariantId: selectedVariant.value.id,
    quantity: quantity.value,
    price: selectedVariant.value.price,
    branchId: selectedBranch.value.id,
  });
  
  if (result.success) {
    toast.success(`Đã thêm ${quantity.value}x "${selectedVariant.value.name}" vào giỏ hàng!`);
  } else {
    toast.error(result.message);
  }
};

const toggleWishlist = () => {
  if (!product.value || !selectedVariant.value) {
    toast.warning('Vui lòng chọn phiên bản sản phẩm');
    return;
  }
  
  // Kiểm tra đăng nhập
  if (!authStore.isAuthenticated) {
    toast.warning('Vui lòng đăng nhập để sử dụng danh sách yêu thích');
    router.push({ name: 'Login', query: { redirect: route.fullPath } });
    return;
  }
  
  // Tạo product và variant objects cho wishlist
  const wishlistProduct = {
    id: product.value.id,
    name: product.value.name,
    slug: product.value.slug,
    status: product.value.status as 'active' | 'pre-order' | 'inactive',
    category: product.value.category,
    supplier: product.value.supplier,
  };
  
  const wishlistVariant = {
    id: selectedVariant.value.id,
    name: selectedVariant.value.name,
    sku: selectedVariant.value.sku,
    price: selectedVariant.value.price,
    original_price: selectedVariant.value.original_price,
    image_url: selectedVariant.value.image_url,
  };
  
  const result = wishlistStore.toggleWishlist(wishlistProduct, wishlistVariant);
  
  if (result.success) {
    if (result.added) {
      toast.success(result.message);
    } else {
      toast.info(result.message);
    }
  } else {
    toast.error(result.message);
  }
};

// ========== REVIEWS SECTION ==========

// Sử dụng Review interface từ @/api/reviews.api.ts

// State cho reviews
const reviews = ref<Review[]>([]);
const isLoadingReviews = ref(false);
const isSubmittingReview = ref(false);
const showAllReviews = ref(false);
const reviewSortBy = ref('newest');

// Form viết review mới
const newReview = ref({
  rating: 0,
  comment: ''
});

// Rating labels
const ratingLabels = [
  { value: 1, text: 'Rất tệ' },
  { value: 2, text: 'Tệ' },
  { value: 3, text: 'Bình thường' },
  { value: 4, text: 'Tốt' },
  { value: 5, text: 'Tuyệt vời' },
];

// Sort options
const reviewSortOptions = [
  { title: 'Mới nhất', value: 'newest' },
  { title: 'Cũ nhất', value: 'oldest' },
  { title: 'Cao nhất', value: 'highest' },
  { title: 'Thấp nhất', value: 'lowest' },
];

// Computed: Kiểm tra user đã review chưa
const hasUserReviewed = computed(() => {
  if (!authStore.user?.id) return false;
  return reviews.value.some(r => r.user_id === authStore.user!.id);
});

// Computed: Average rating
const averageRating = computed(() => {
  if (reviews.value.length === 0) return product.value?.rating || 0;
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.value.length;
});

// Computed: Sorted reviews
const sortedReviews = computed(() => {
  const reviewsToShow = showAllReviews.value ? reviews.value : reviews.value.slice(0, 5);
  
  const sorted = [...reviewsToShow].sort((a, b) => {
    switch (reviewSortBy.value) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  
  return sorted;
});

// Helper: Get rating count
const getRatingCount = (star: number): number => {
  return reviews.value.filter(r => r.rating === star).length;
};

// Helper: Get rating percentage
const getRatingPercentage = (star: number): number => {
  if (reviews.value.length === 0) return 0;
  return (getRatingCount(star) / reviews.value.length) * 100;
};

// Helper: Get initials from name
const getInitials = (name: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// Helper: Format review date
const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  
  return date.toLocaleDateString('vi-VN');
};

// Fetch reviews - TẠM THỜI DÙNG MOCK DATA
// (Backend EDMX đang có vấn đề, sẽ bật API lại khi fix xong)
const fetchReviews = async () => {
  if (!product.value?.id) return;
  
  isLoadingReviews.value = true;
  
  try {
    // TODO: Bật API khi Backend fix xong EDMX
    // const data = await getProductReviews(product.value.id);
    // reviews.value = data;
    
    // Mock data tạm thời
    reviews.value = [
      {
        user_id: 1,
        product_id: product.value.id,
        user_name: 'Nguyễn Văn An',
        rating: 5,
        comment: 'Sản phẩm tuyệt vời! Chất lượng đúng như mô tả, đóng gói cẩn thận. Sẽ ủng hộ shop dài dài.',
        is_approved: true,
        is_verified_purchase: true,
        status: 'approved',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        user_id: 2,
        product_id: product.value.id,
        user_name: 'Trần Thị Bình',
        rating: 4,
        comment: 'Hàng đẹp, giao hàng nhanh. Chỉ tiếc là box hơi móp một chút nhưng figure bên trong vẫn nguyên vẹn.',
        is_approved: true,
        is_verified_purchase: true,
        status: 'approved',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        user_id: 3,
        product_id: product.value.id,
        user_name: 'Lê Minh Tuấn',
        rating: 5,
        comment: 'Authentic 100%, paint job rất đẹp. Shop uy tín!',
        is_approved: true,
        is_verified_purchase: true,
        status: 'approved',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        user_id: 4,
        product_id: product.value.id,
        user_name: 'Phạm Hoàng Dũng',
        rating: 3,
        comment: 'Sản phẩm OK, nhưng giá hơi cao so với thị trường.',
        is_approved: true,
        is_verified_purchase: false,
        status: 'approved',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    reviews.value = [];
  } finally {
    isLoadingReviews.value = false;
  }
};

// Submit review - TẠM THỜI DÙNG MOCK
// (Backend EDMX đang có vấn đề, sẽ bật API lại khi fix xong)
const submitReview = async () => {
  if (!authStore.isAuthenticated || !product.value) {
    toast.error('Vui lòng đăng nhập để đánh giá');
    return;
  }
  
  if (newReview.value.rating === 0) {
    toast.warning('Vui lòng chọn số sao đánh giá');
    return;
  }
  
  isSubmittingReview.value = true;
  
  try {
    // TODO: Bật API khi Backend fix xong EDMX
    // const result = await createReview(product.value.id, {
    //   Rating: newReview.value.rating,
    //   Comment: newReview.value.comment,
    // });
    
    // Mock: Thêm review mới vào danh sách
    const mockNewReview: Review = {
      user_id: authStore.user!.id,
      product_id: product.value.id,
      user_name: authStore.user!.full_name || authStore.user!.name || 'Bạn',
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      is_approved: true, // Auto approved cho mock
      is_verified_purchase: true,
      status: 'approved',
      created_at: new Date().toISOString(),
    };
    
    reviews.value.unshift(mockNewReview);
    
    // Reset form
    newReview.value = { rating: 0, comment: '' };
    
    toast.success('Đánh giá đã được gửi thành công!');
  } catch (error: any) {
    toast.error(error.response?.data?.Message || 'Không thể gửi đánh giá');
  } finally {
    isSubmittingReview.value = false;
  }
};

// Watch product change để fetch reviews
watch(() => product.value?.id, (newId) => {
  if (newId) {
    fetchReviews();
  }
}, { immediate: true });

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

/* ========== REVIEWS SECTION ========== */
.reviews-section {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

/* Rating Summary */
.rating-summary {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 152, 0, 0.05) 100%);
  border: 1px solid rgba(255, 193, 7, 0.15);
}

.neon-score {
  background: linear-gradient(90deg, #ffc107 0%, #ff9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rating-breakdown {
  text-align: left;
}

/* Write Review Card */
.write-review-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.rating-input :deep(.v-rating__item) {
  padding: 4px;
}

.rating-input :deep(.v-rating__item .v-btn) {
  width: 40px;
  height: 40px;
}

.rating-labels .v-chip {
  transition: all 0.2s ease;
}

.rating-labels .v-chip:hover {
  transform: scale(1.05);
}

/* Review Card */
.review-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.2s ease;
}

.review-card:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1);
}

.review-comment {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
}

/* Empty Reviews State */
.empty-reviews {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

/* Reviews List Sort Select */
.reviews-list :deep(.v-select .v-field) {
  background: rgba(255, 255, 255, 0.03) !important;
}

/* Cursor pointer for clickable elements */
.cursor-pointer {
  cursor: pointer;
}
</style>