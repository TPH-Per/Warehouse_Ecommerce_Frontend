<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section py-16 position-relative overflow-hidden">
      <div class="hero-bg" />
      <div class="hero-particles" />
      
      <v-container class="position-relative" style="z-index: 2;">
        <v-row align="center">
          <v-col cols="12" lg="6" class="pr-lg-12">
            <v-chip
              prepend-icon="mdi-sparkles"
              color="primary"
              variant="flat"
              class="mb-6 animate-neon-pulse"
              rounded="pill"
            >
              Drop mới mỗi thứ 6 — Song song Nhật Bản
            </v-chip>

            <h1 class="text-h3 text-md-h2 font-weight-bold mb-6">
              Chắp cánh cho
              <span class="gradient-text d-block">giấc mơ wibu của bạn</span>
            </h1>

            <p class="text-body-1 text-medium-emphasis mb-8" style="max-width: 500px; line-height: 1.8;">
              Săn figures, nendoroids và plushies giới hạn với bảo chứng chính hãng,
              vận chuyển quốc tế siêu tốc.
            </p>

            <div class="d-flex flex-wrap ga-4 mb-10">
              <v-btn
                :to="{ name: 'ProductList' }"
                color="primary"
                size="large"
                rounded="pill"
                class="neon-btn-primary"
                append-icon="mdi-chevron-right"
              >
                Mua sắm ngay
              </v-btn>
              <v-btn variant="outlined" size="large" rounded="pill" class="neon-btn-outline">
                Xem figure hot
              </v-btn>
            </div>

            <!-- Stats -->
            <v-row dense>
              <v-col v-for="stat in stats" :key="stat.label" cols="4">
                <v-card variant="flat" class="stat-card text-center py-4 rounded-xl">
                  <div class="text-h5 font-weight-bold neon-text-primary">{{ stat.value }}</div>
                  <div class="text-caption text-medium-emphasis">{{ stat.label }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" lg="5">
            <v-card class="featured-card pa-5 rounded-xl">
              <div class="d-flex justify-space-between align-center mb-3">
                <span class="text-overline text-medium-emphasis">Studio Exclusive</span>
                <v-chip size="x-small" color="success" prepend-icon="mdi-shield-check">Chính hãng</v-chip>
              </div>
              <v-img
                src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000"
                :aspect-ratio="4/3"
                cover
                class="rounded-xl mb-4"
                max-height="320"
              >
                <v-chip size="small" class="ma-3 bg-surface font-weight-bold trending-chip">
                  <v-icon start size="small">mdi-fire</v-icon>
                  Trending
                </v-chip>
              </v-img>
              <div class="d-flex justify-space-between align-end">
                <div>
                  <div class="text-overline text-medium-emphasis">Featured Item</div>
                  <h3 class="text-h5 font-weight-bold">Shonen Icons Vol.4</h3>
                </div>
                <div class="text-right">
                  <div class="text-caption text-medium-emphasis">Giá từ</div>
                  <div class="text-h5 font-weight-bold neon-text-secondary">1.990.000₫</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Categories Section -->
    <v-container class="py-16">
      <div class="text-center mb-12">
        <div class="text-overline text-primary tracking-widest mb-2">KHÁM PHÁ</div>
        <h2 class="text-h4 font-weight-bold">Mua sắm theo vibes</h2>
      </div>

      <v-row>
        <v-col v-for="cat in categories" :key="cat.name" cols="12" sm="6" lg="3">
          <v-hover v-slot:default="{ isHovering, props }">
            <v-card
              v-bind="props"
              class="category-card rounded-xl overflow-hidden cursor-pointer position-relative"
              height="300"
            >
              <v-img
                :src="cat.image"
                cover
                class="fill-height transition-transform"
                :class="{ 'scale-up': isHovering }"
              />
              <div class="category-overlay d-flex flex-column justify-space-between pa-6">
                <div>
                  <div class="text-caption" style="color: rgba(255,255,255,0.7);">{{ cat.count }} sản phẩm</div>
                  <h3 class="text-h5 font-weight-bold text-white mt-2">{{ cat.name }}</h3>
                </div>
                <v-btn
                  variant="text"
                  color="white"
                  class="px-0 category-link"
                  append-icon="mdi-chevron-right"
                  :to="{ name: 'ProductList', query: { category: cat.slug } }"
                >
                  Khám phá
                </v-btn>
              </div>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>

    <!-- Featured Products Section -->
    <v-container class="py-16">
      <div class="d-flex justify-space-between align-end mb-10">
        <div>
          <div class="text-overline text-primary mb-1">WEEKLY PICKS</div>
          <h2 class="text-h4 font-weight-bold">Mẫu đáng đầu tư tuần này</h2>
        </div>
        <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">Xem tất cả</v-btn>
      </div>

      <v-row>
        <v-col v-for="product in featuredProducts" :key="product.id" cols="12" sm="6" lg="3">
          <v-card class="product-card rounded-xl pa-3" variant="outlined">
            <v-img :src="product.image" class="rounded-lg mb-4" cover height="240">
              <v-btn
                icon
                size="small"
                variant="flat"
                class="ma-2 wishlist-btn"
              >
                <v-icon>mdi-heart-outline</v-icon>
              </v-btn>
            </v-img>
            <div class="text-caption text-primary">{{ product.category }}</div>
            <h4 class="text-subtitle-1 font-weight-bold text-truncate">{{ product.name }}</h4>
            <div class="d-flex justify-space-between align-center mt-3">
              <span class="text-h6 font-weight-bold neon-text-secondary">{{ product.price }}</span>
              <v-btn icon="mdi-cart-plus" variant="flat" size="small" color="primary" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Flash Sale Section -->
    <section class="flash-sale-section py-16 overflow-hidden">
      <v-container>
        <div class="text-center mb-12">
          <v-chip color="error" variant="flat" class="mb-4 animate-pulse">
            <v-icon start>mdi-lightning-bolt</v-icon>
            FLASH SALE
          </v-chip>
          <h2 class="text-h3 font-weight-bold text-white">Ưu đãi giới hạn 72h</h2>
        </div>
        
        <v-row>
          <v-col v-for="deal in flashDeals" :key="deal.id" cols="12" md="4">
            <v-card class="deal-card rounded-xl pa-5">
              <div class="d-flex justify-space-between mb-4">
                <span class="d-flex align-center text-caption">
                  <v-icon icon="mdi-fire" color="error" class="mr-1" />
                  HOT
                </span>
                <v-chip color="error" size="x-small">{{ deal.discount }}</v-chip>
              </div>
              <v-img :src="deal.image" class="rounded-lg mb-4" cover height="180" />
              <h3 class="text-h6 font-weight-bold text-truncate mb-2">{{ deal.name }}</h3>
              <div class="d-flex align-center ga-2 mb-4">
                <span class="text-h6 font-weight-bold neon-text-secondary">{{ deal.salePrice }}</span>
                <span class="text-caption text-decoration-line-through text-medium-emphasis">{{ deal.originalPrice }}</span>
              </div>
              <v-btn block color="primary" variant="flat" rounded="lg">Mua ngay</v-btn>
            </v-card>
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
const stats = [
  { label: 'Collectors', value: '120K+' },
  { label: 'Figures', value: '3.4K+' },
  { label: 'Đánh giá', value: '4.9/5' },
];

const categories = [
  { name: 'Figures', slug: 'figures', count: 1240, image: 'https://images.unsplash.com/photo-1559535332-db9971090d5e?q=80&w=500' },
  { name: 'Nendoroid', slug: 'nendoroids', count: 850, image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=500' },
  { name: 'Plushies', slug: 'plushies', count: 420, image: 'https://images.unsplash.com/photo-1559131397-f94da358f7ca?q=80&w=500' },
  { name: 'Limited', slug: 'limited', count: 150, image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=500' },
];

const featuredProducts = [
  { id: 1, name: 'Gojo Satoru - Limited Ver', category: 'Nendoroid', price: '1.250.000₫', image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=400' },
  { id: 2, name: 'Nezuko Kamado Figure', category: 'Figures', price: '2.450.000₫', image: 'https://images.unsplash.com/photo-1559535332-db9971090d5e?q=80&w=400' },
  { id: 3, name: 'Rem Crystal Dress', category: 'Figures', price: '3.890.000₫', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=400' },
  { id: 4, name: 'Pikachu Plushie XL', category: 'Plushies', price: '890.000₫', image: 'https://images.unsplash.com/photo-1559131397-f94da358f7ca?q=80&w=400' },
];

const flashDeals = [
  { id: 1, name: 'Saber Alter 1/7 Scale', discount: '-20%', salePrice: '3.450.000₫', originalPrice: '4.200.000₫', image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=400' },
  { id: 2, name: 'Power Chainsaw Man', discount: '-15%', salePrice: '1.850.000₫', originalPrice: '2.100.000₫', image: 'https://images.unsplash.com/photo-1559535332-db9971090d5e?q=80&w=400' },
  { id: 3, name: 'Miku 15th Anniversary', discount: '-25%', salePrice: '4.500.000₫', originalPrice: '6.000.000₫', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=400' },
];
</script>

<style scoped>
/* Hero Section */
.hero-section {
  min-height: 700px;
  position: relative;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at top left, rgba(0, 212, 255, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(255, 0, 255, 0.12) 0%, transparent 50%);
  z-index: 0;
}

.hero-particles {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(0, 212, 255, 0.15) 1px, transparent 0);
  background-size: 40px 40px;
  opacity: 0.5;
  z-index: 1;
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
  background: rgba(0, 212, 255, 0.05) !important;
  border: 1px solid rgba(0, 212, 255, 0.15) !important;
}

.featured-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
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

/* Categories */
.category-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: rgba(0, 212, 255, 0.4);
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.15);
}

.category-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
  z-index: 2;
}

.category-link:hover {
  color: #00d4ff !important;
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