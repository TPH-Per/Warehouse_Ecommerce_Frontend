<template>
  <v-card class="product-card rounded-xl pa-3 h-100" variant="outlined">
    <!-- Image Container -->
    <div class="image-container position-relative overflow-hidden rounded-lg">
      <v-img :src="product.image" class="product-img" cover height="240">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="primary" />
          </v-row>
        </template>
      </v-img>

      <!-- Badges -->
      <div class="badges-container position-absolute top-0 left-0 pa-2 d-flex flex-column ga-1">
        <v-chip v-if="product.isNew" size="x-small" color="success" variant="flat">
          <v-icon start size="small">mdi-new-box</v-icon>
          Mới
        </v-chip>
        <v-chip v-if="product.discount" size="x-small" color="error" variant="flat">
          -{{ product.discount }}%
        </v-chip>
        <v-chip v-if="product.isPreOrder" size="x-small" color="info" variant="flat">
          Pre-Order
        </v-chip>
      </div>

      <!-- Wishlist Button -->
      <v-btn
        icon
        size="small"
        variant="flat"
        class="wishlist-btn position-absolute top-0 right-0 ma-2"
        @click.stop="toggleWishlist"
      >
        <v-icon :color="isInWishlist ? 'secondary' : undefined">
          {{ isInWishlist ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>

      <!-- Quick Add Overlay -->
      <div class="quick-actions pa-2">
        <v-btn color="primary" block rounded="lg" size="small" @click="addToCart">
          <v-icon start>mdi-cart-plus</v-icon>
          Thêm giỏ
        </v-btn>
      </div>
    </div>

    <!-- Product Info -->
    <div class="pt-4">
      <div class="text-caption text-primary font-weight-medium">{{ product.category }}</div>
      <h4 class="text-subtitle-1 font-weight-bold text-truncate product-title">
        {{ product.name }}
      </h4>
      
      <!-- Rating -->
      <div class="d-flex align-center ga-1 my-2">
        <v-rating
          :model-value="product.rating"
          color="warning"
          density="compact"
          size="x-small"
          readonly
          half-increments
        />
        <span class="text-caption text-medium-emphasis">({{ product.reviewCount }})</span>
      </div>

      <!-- Price -->
      <div class="d-flex justify-space-between align-center">
        <div>
          <span class="text-h6 font-weight-bold neon-text-secondary">
            {{ formatPrice(product.price) }}
          </span>
          <span v-if="product.originalPrice" class="text-caption text-decoration-line-through text-medium-emphasis ml-2">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>
        <v-btn
          icon="mdi-eye"
          variant="text"
          size="small"
          color="primary"
          :to="`/product?id=${product.id}`"
        />
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Product {
  id: number | string;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isPreOrder?: boolean;
  discount?: number;
}

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits(['add-to-cart', 'toggle-wishlist']);

const isInWishlist = ref(false);

const formatPrice = (price: number) => {
  return price.toLocaleString() + '₫';
};

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value;
  emit('toggle-wishlist', props.product);
};

const addToCart = () => {
  emit('add-to-cart', props.product);
  alert(`Đã thêm "${props.product.name}" vào giỏ hàng!`);
};
</script>

<style scoped>
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

.product-card:hover .product-title {
  color: #00d4ff;
}

.image-container {
  position: relative;
}

.product-img {
  transition: transform 0.5s ease;
}

.image-container:hover .product-img {
  transform: scale(1.1);
}

.wishlist-btn {
  background: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  z-index: 2;
  opacity: 0;
  transition: all 0.3s ease;
}

.image-container:hover .wishlist-btn {
  opacity: 1;
}

.wishlist-btn:hover {
  background: rgba(255, 0, 255, 0.8) !important;
}

.quick-actions {
  position: absolute;
  bottom: -60px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  z-index: 3;
}

.image-container:hover .quick-actions {
  bottom: 0;
}

.product-title {
  transition: color 0.3s ease;
}

.neon-text-secondary {
  color: #ff00ff;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.badges-container {
  z-index: 2;
}
</style>