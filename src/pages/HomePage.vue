<template>
  <div class="home-page">
    <!-- Hero Section with Video Banner -->
    <section class="hero-section position-relative overflow-hidden">
      <!-- Video Background -->
      <div class="hero-video-wrapper">
        <video
          ref="heroVideo"
          :src="studioVideoUrl"
          autoplay
          loop
          muted
          playsinline
          class="hero-video-bg"
        />
        <div class="hero-video-overlay" />
      </div>
      
      <v-container class="position-relative py-16" style="z-index: 2;">
        <v-row align="center">
          <v-col cols="12" lg="7" class="pr-lg-12">
            <v-chip
              prepend-icon="mdi-sparkles"
              color="primary"
              variant="flat"
              class="mb-6 animate-neon-pulse"
              rounded="pill"
            >
              Drop mới mỗi thứ 6 — Song song Nhật Bản
            </v-chip>

            <h1 class="text-h2 text-md-h1 font-weight-bold mb-6 hero-title">
              Chắp cánh cho
              <span class="gradient-text d-block">giấc mơ wibu của bạn</span>
            </h1>

            <p class="text-h6 text-medium-emphasis mb-8 hero-subtitle" style="max-width: 600px; line-height: 1.8;">
              Săn figures, nendoroids và plushies giới hạn với bảo chứng chính hãng,
              vận chuyển quốc tế siêu tốc.
            </p>

            <div class="d-flex flex-wrap ga-4 mb-10">
              <v-btn
                :to="{ name: 'ProductList' }"
                color="primary"
                size="x-large"
                rounded="pill"
                class="neon-btn-primary px-8"
                append-icon="mdi-chevron-right"
              >
                Mua sắm ngay
              </v-btn>
              <v-btn 
                variant="outlined" 
                size="x-large" 
                rounded="pill" 
                class="neon-btn-outline px-8"
              >
                <v-icon start>mdi-play-circle</v-icon>
                Xem figure hot
              </v-btn>
            </div>

            <!-- Stats -->
            <v-row dense>
              <v-col v-for="stat in stats" :key="stat.label" cols="4">
                <v-card variant="flat" class="stat-card text-center py-4 rounded-xl">
                  <div class="text-h4 font-weight-bold neon-text-primary">{{ stat.value }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{ stat.label }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Categories Section - Simple & Clean Design -->
    <v-container class="py-16">
      <div class="text-center mb-10">
        <div class="text-overline text-primary tracking-widest mb-2">KHÁM PHÁ</div>
        <h2 class="text-h4 font-weight-bold">Mua sắm theo vibes</h2>
      </div>

      <!-- Loading State -->
      <v-row v-if="categoriesStore.isLoading">
        <v-col v-for="n in 4" :key="n" cols="6" md="3">
          <v-skeleton-loader type="image, text" height="280" class="rounded-xl" />
        </v-col>
      </v-row>

      <!-- Categories Grid - Simple Cards -->
      <v-row v-else>
        <v-col v-for="(cat, index) in displayCategories" :key="cat.id" cols="6" md="3">
          <router-link 
            :to="{ name: 'ProductList', query: { category: cat.id } }"
            class="category-card-link"
          >
            <div class="simple-category-card">
              <!-- Image with bottom gradient -->
              <div class="category-image-wrapper">
                <img 
                  :src="getCategoryImage(index)" 
                  :alt="cat.name"
                  class="category-img"
                />
                <div class="category-gradient-overlay" />
              </div>
              
              <!-- Text Content - Positioned at bottom -->
              <div class="category-content">
                <span class="category-tag">Bộ sưu tập</span>
                <h3 class="category-title">{{ cat.name }}</h3>
                <span class="category-cta">
                  Khám phá <v-icon size="16">mdi-arrow-right</v-icon>
                </span>
              </div>
            </div>
          </router-link>
        </v-col>
      </v-row>
    </v-container>

    <!-- Discount Coupons Section -->
    <section class="discount-section py-16 overflow-hidden">
      <v-container>
        <div class="text-center mb-10">
          <v-chip color="secondary" variant="flat" class="mb-4">
            <v-icon start>mdi-ticket-percent</v-icon>
            MÃ GIẢM GIÁ
          </v-chip>
          <h2 class="text-h3 font-weight-bold text-white">Nhập mã — Tiết kiệm ngay</h2>
          <p class="text-medium-emphasis mt-2">Sử dụng mã giảm giá khi thanh toán để được giảm trực tiếp</p>
        </div>
        
        <!-- Loading State -->
        <div v-if="discountsStore.isLoading" class="text-center py-8">
          <v-progress-circular indeterminate color="secondary" size="48" />
          <p class="mt-4 text-medium-emphasis">Đang tải mã giảm giá...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!discountsStore.hasDiscounts" class="text-center py-8">
          <v-icon size="64" color="grey">mdi-ticket-outline</v-icon>
          <p class="mt-4 text-medium-emphasis">Chưa có mã giảm giá nào</p>
        </div>
        
        <!-- Discount Cards -->
        <v-row v-else>
          <v-col 
            v-for="discount in displayDiscounts" 
            :key="getDiscountId(discount)" 
            cols="12" 
            sm="6" 
            md="4"
          >
            <div class="discount-card">
              <!-- Left: Discount Value -->
              <div class="discount-value-section">
                <div class="discount-value">
                  {{ discountsStore.formatDiscountValue(discount) }}
                </div>
                <div class="discount-type">
                  {{ getDiscountType(discount) === 'percentage' ? 'GIẢM' : 'GIẢM' }}
                </div>
              </div>
              
              <!-- Right: Details -->
              <div class="discount-details">
                <div class="discount-code-row">
                  <span class="discount-code">{{ getDiscountCode(discount) }}</span>
                  <v-btn
                    size="small"
                    :color="discountsStore.copiedCode === getDiscountCode(discount) ? 'success' : 'primary'"
                    variant="flat"
                    @click="handleCopyCode(getDiscountCode(discount))"
                    class="copy-btn"
                  >
                    <v-icon size="16" class="mr-1">
                      {{ discountsStore.copiedCode === getDiscountCode(discount) ? 'mdi-check' : 'mdi-content-copy' }}
                    </v-icon>
                    {{ discountsStore.copiedCode === getDiscountCode(discount) ? 'Đã copy' : 'Copy' }}
                  </v-btn>
                </div>
                
                <div class="discount-condition" v-if="getMinOrderAmount(discount)">
                  <v-icon size="14" class="mr-1">mdi-cart-outline</v-icon>
                  Đơn tối thiểu {{ formatPrice(getMinOrderAmount(discount)) }}
                </div>
                
                <div class="discount-expiry" v-if="getEndAt(discount)">
                  <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                  Hết hạn: {{ formatDate(getEndAt(discount)) }}
                </div>
                
                <div class="discount-remaining" v-if="getRemainingUses(discount)">
                  <v-icon size="14" class="mr-1">mdi-fire</v-icon>
                  Còn {{ getRemainingUses(discount) }} lượt sử dụng
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Newsletter CTA Section -->
    <v-container class="py-16">
      <v-card class="cta-card rounded-xl pa-10">
        <v-row align="center">
          <v-col cols="12" lg="7">
            <h2 class="text-h4 font-weight-bold mb-4">
              Nhận lịch phát hành & mã giảm độc quyền
            </h2>
            <p class="text-medium-emphasis">
              Đăng ký để không bỏ lỡ những mẫu figure hiếm nhất.
            </p>
          </v-col>
          <v-col cols="12" lg="5" class="d-flex ga-3">
            <v-text-field
              placeholder="Email của bạn"
              variant="outlined"
              hide-details
              rounded="pill"
              density="comfortable"
              class="cta-input"
            />
            <v-btn color="secondary" size="large" rounded="pill" class="flex-shrink-0">
              Đăng ký
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCategoriesStore } from '@/stores/categories.store';
import { useDiscountsStore } from '@/stores/discounts.store';

// ========== STORES ==========
const categoriesStore = useCategoriesStore();
const discountsStore = useDiscountsStore();

// ========== VIDEO ==========
const heroVideo = ref<HTMLVideoElement | null>(null);

// URL video từ server ASP.NET
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://localhost:44377';
const studioVideoUrl = `${API_BASE_URL}/wwwroot/uploads/video/video_1.mp4`;

// ========== STATIC DATA ==========
const stats = [
  { label: 'Collectors', value: '120K+' },
  { label: 'Figures', value: '3.4K+' },
  { label: 'Đánh giá', value: '4.9/5' },
];

// Ảnh cho categories - lấy từ server
// Các ảnh được lưu tại: /wwwroot/uploads/categories/
const categoryImages = [
  `${API_BASE_URL}/wwwroot/uploads/categories/category_1.jpg`,
  `${API_BASE_URL}/wwwroot/uploads/categories/category_2.jpg`,
  `${API_BASE_URL}/wwwroot/uploads/categories/category_3.jpg`,
  `${API_BASE_URL}/wwwroot/uploads/categories/category_4.jpg`,
];

// ========== COMPUTED ==========
// Chuyển đổi categories từ store sang format hiển thị
const displayCategories = computed(() => {
  return categoriesStore.categories.map((cat: any) => ({
    id: cat.Id ?? cat.id,
    name: cat.Name ?? cat.name,
    slug: cat.Slug ?? cat.slug ?? '',
  })).slice(0, 4); // Chỉ lấy 4 categories đầu
});

// Lấy ảnh cho category theo index
const getCategoryImage = (index: number): string => {
  return categoryImages[index % categoryImages.length];
};

// ========== DISCOUNTS HELPERS ==========
const displayDiscounts = computed(() => {
  return discountsStore.validDiscounts.slice(0, 6); // Hiển thị tối đa 6 mã
});

const getDiscountId = (discount: any): number => discount.Id ?? discount.id ?? 0;
const getDiscountCode = (discount: any): string => discount.Code ?? discount.code ?? '';
const getDiscountType = (discount: any): string => discount.Type ?? discount.type ?? 'fixed';
const getMinOrderAmount = (discount: any): number | null => discount.MinOrderAmount ?? discount.min_order_amount ?? null;
const getEndAt = (discount: any): string | null => discount.EndAt ?? discount.end_at ?? null;

const getRemainingUses = (discount: any): number | null => {
  const maxUses = discount.MaxUses ?? discount.max_uses;
  const usedCount = discount.UsedCount ?? discount.used_count ?? 0;
  if (!maxUses) return null;
  return Math.max(0, maxUses - usedCount);
};

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const handleCopyCode = async (code: string) => {
  await discountsStore.copyDiscountCode(code);
};

// ========== LIFECYCLE ==========
onMounted(async () => {
  // Fetch categories và discounts từ API
  await Promise.all([
    categoriesStore.fetchCategories(),
    discountsStore.fetchActiveDiscounts(),
  ]);
});
</script>

<style scoped>
/* Hero Section with Video Background */
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
}

/* Video Background Wrapper */
.hero-video-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.hero-video-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-video-overlay {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(135deg, rgba(10, 10, 15, 0.9) 0%, rgba(10, 10, 15, 0.7) 50%, rgba(10, 10, 15, 0.85) 100%),
    radial-gradient(ellipse at top left, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(255, 0, 255, 0.15) 0%, transparent 50%);
}

/* Hero Text Styles */
.hero-title {
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  text-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  background: linear-gradient(90deg, #00d4ff 0%, #ff00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.neon-text-primary {
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.neon-text-secondary {
  color: #ff00ff;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.stat-card {
  background: rgba(0, 212, 255, 0.08) !important;
  border: 1px solid rgba(0, 212, 255, 0.2) !important;
  backdrop-filter: blur(10px);
}

.trending-chip {
  border: 1px solid rgba(255, 0, 255, 0.3);
}

.neon-btn-primary {
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  transition: all 0.3s ease;
}

.neon-btn-primary:hover {
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
}

.neon-btn-outline {
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.neon-btn-outline:hover {
  border-color: rgba(0, 212, 255, 0.6) !important;
  background: rgba(0, 212, 255, 0.1) !important;
}

.animate-neon-pulse {
  animation: neonPulse 2s ease-in-out infinite;
}

@keyframes neonPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(0, 212, 255, 0.3); }
  50% { box-shadow: 0 0 25px rgba(0, 212, 255, 0.5); }
}

/* ========== SIMPLE CATEGORY CARDS ========== */
.category-card-link {
  text-decoration: none;
  display: block;
}

.simple-category-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 280px;
  background: #0a0a0f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.4s ease;
}

.simple-category-card:hover {
  border-color: rgba(0, 212, 255, 0.4);
  transform: translateY(-8px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(0, 212, 255, 0.1);
}

.category-image-wrapper {
  position: absolute;
  inset: 0;
}

.category-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.simple-category-card:hover .category-img {
  transform: scale(1.08);
}

/* Gradient overlay - only at bottom for text readability */
.category-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 35%,
    rgba(0, 0, 0, 0.2) 60%,
    transparent 100%
  );
}

/* Text content at bottom */
.category-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  z-index: 2;
}

.category-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #00d4ff;
  margin-bottom: 6px;
}

.category-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  line-height: 1.3;
}

.category-cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.simple-category-card:hover .category-cta {
  color: #00d4ff;
}

.simple-category-card:hover .category-cta .v-icon {
  transform: translateX(4px);
}

.category-cta .v-icon {
  transition: transform 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .simple-category-card {
    height: 200px;
  }
  
  .category-content {
    padding: 16px;
  }
  
  .category-title {
    font-size: 1rem;
  }
}

.transition-transform {
  transition: transform 0.6s ease;
}

.scale-up {
  transform: scale(1.1);
}

/* Products */
.product-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: rgba(0, 212, 255, 0.4) !important;
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.wishlist-btn {
  background: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
}

.wishlist-btn:hover {
  background: rgba(255, 0, 255, 0.8) !important;
}

/* Flash Sale */
.flash-sale-section {
  background: linear-gradient(135deg, 
    rgba(255, 0, 255, 0.15) 0%, 
    rgba(0, 212, 255, 0.1) 50%,
    rgba(168, 85, 247, 0.15) 100%);
  position: relative;
}

.flash-sale-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
  background-size: 30px 30px;
}

.deal-card {
  background: rgba(18, 18, 26, 0.9) !important;
  border: 1px solid rgba(255, 0, 255, 0.2) !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.deal-card:hover {
  border-color: rgba(255, 0, 255, 0.5) !important;
  box-shadow: 0 0 25px rgba(255, 0, 255, 0.2);
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* ========== DISCOUNT SECTION ========== */
.discount-section {
  background: linear-gradient(135deg, 
    rgba(255, 0, 255, 0.1) 0%, 
    rgba(0, 212, 255, 0.08) 50%,
    rgba(168, 85, 247, 0.1) 100%);
  position: relative;
}

.discount-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.03) 1px, transparent 0);
  background-size: 24px 24px;
}

/* Discount Card - Coupon Style */
.discount-card {
  display: flex;
  background: rgba(18, 18, 26, 0.95);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.discount-card::before,
.discount-card::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(10, 10, 15, 1);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.discount-card::before {
  left: -10px;
}

.discount-card::after {
  right: -10px;
}

.discount-card:hover {
  border-color: rgba(255, 0, 255, 0.4);
  transform: translateY(-4px);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 0, 255, 0.1);
}

/* Left section - Discount Value */
.discount-value-section {
  width: 100px;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  border-right: 2px dashed rgba(255, 255, 255, 0.15);
}

.discount-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ff00ff;
  text-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
  line-height: 1.1;
}

.discount-type {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
}

/* Right section - Details */
.discount-details {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.discount-code-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.discount-code {
  font-size: 1rem;
  font-weight: 700;
  font-family: monospace;
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  letter-spacing: 1px;
}

.copy-btn {
  font-size: 12px !important;
  text-transform: none !important;
}

.discount-condition,
.discount-expiry,
.discount-remaining {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.discount-remaining {
  color: #ff6b6b;
}

/* Responsive */
@media (max-width: 600px) {
  .discount-card {
    flex-direction: column;
  }
  
  .discount-value-section {
    width: 100%;
    padding: 16px;
    border-right: none;
    border-bottom: 2px dashed rgba(255, 255, 255, 0.15);
  }
  
  .discount-card::before,
  .discount-card::after {
    top: auto;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .discount-card::before {
    top: -10px;
  }
  
  .discount-card::after {
    bottom: -10px;
    top: auto;
  }
}

/* CTA Section */
.cta-card {
  background: linear-gradient(135deg, 
    rgba(0, 212, 255, 0.1) 0%, 
    rgba(18, 18, 26, 0.95) 50%,
    rgba(255, 0, 255, 0.1) 100%) !important;
  border: 1px solid rgba(0, 212, 255, 0.2) !important;
}

.cta-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05) !important;
}
</style>