<template>
  <div class="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden">
    <div class="relative aspect-[3/4] overflow-hidden">
      <img 
        :src="product.images[0]" 
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      <!-- NSFW Overlay - Removed -->
      <!-- 18+ content restrictions have been removed -->

      <!-- Badges -->
      <div class="absolute top-2 left-2 flex flex-col space-y-1">
        <span v-if="product.availability === 'pre-order'" class="bg-blue-600 text-white text-xs px-2 py-1 rounded">
          Đặt trước
        </span>
        <span v-if="product.originalPrice" class="bg-red-600 text-white text-xs px-2 py-1 rounded">
          Giảm giá
        </span>
        <span v-if="product.tags.includes('new-release')" class="bg-green-600 text-white text-xs px-2 py-1 rounded">
          Mới
        </span>
      </div>

      <!-- Wishlist Button -->
      <button 
        @click.prevent="toggleWishlist(product.id)"
        class="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
      >
        <Heart 
          class="h-5 w-5" 
          :class="isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'"
        />
      </button>

      <!-- Quick Actions (on hover) -->
      <div class="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          @click.prevent="addToCart(product)"
          :disabled="product.availability === 'out-of-stock'"
          class="w-full btn btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart class="h-4 w-4 mr-2" />
          {{ product.availability === 'out-of-stock' ? 'Hết hàng' : 'Thêm vào giỏ' }}
        </button>
      </div>
    </div>

    <router-link :to="`/products/${product.id}`" class="block p-4">
      <div class="mb-2">
        <h3 class="font-semibold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {{ product.name }}
        </h3>
        <p class="text-sm text-gray-600">{{ product.series }}</p>
      </div>

      <div class="flex items-center mb-2">
        <div class="flex items-center">
          <Star class="h-4 w-4 text-yellow-400 fill-current" />
          <span class="text-sm text-gray-600 ml-1">{{ product.rating }} ({{ product.reviewCount }})</span>
        </div>
        <span class="mx-2 text-gray-300">•</span>
        <span class="text-sm text-gray-600">{{ product.manufacturer }}</span>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-lg font-bold text-gray-900">¥{{ product.price.toLocaleString() }}</span>
          <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through">
            ¥{{ product.originalPrice.toLocaleString() }}
          </span>
        </div>
        <div class="flex items-center text-sm text-gray-600">
          <Package class="h-4 w-4 mr-1" />
          {{ product.scale }}
        </div>
      </div>

      <div v-if="product.availability === 'pre-order' && product.eta" class="mt-2 text-sm text-blue-600">
        Dự kiến: {{ formatDate(product.eta) }}
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Heart, ShoppingCart, Star, Package } from 'lucide-vue-next';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

const props = defineProps<Props>();
const { addToCart } = useCart();
const { toggleWishlist, isInWishlist } = useWishlist();

// Removed: NSFW functionality is no longer needed

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
