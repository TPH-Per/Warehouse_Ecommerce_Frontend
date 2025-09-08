<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Wishlist</h1>
      <div v-if="wishlistProducts.length > 0" class="flex items-center space-x-4">
        <button @click="shareWishlist" class="btn btn-outline">
          <Share class="h-4 w-4 mr-2" />
          Share Wishlist
        </button>
        <button @click="clearWishlist" class="btn btn-outline text-red-600 hover:bg-red-50">
          Clear All
        </button>
      </div>
    </div>

    <div v-if="wishlistProducts.length === 0" class="text-center py-16">
      <Heart class="h-24 w-24 text-gray-300 mx-auto mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
      <p class="text-gray-600 mb-6">Save items you love to your wishlist and purchase them later!</p>
      <router-link to="/products" class="btn btn-primary">Browse Products</router-link>
    </div>

    <div v-else>
      <!-- View Toggle -->
      <div class="flex justify-between items-center mb-6">
        <p class="text-gray-600">{{ wishlistProducts.length }} {{ wishlistProducts.length === 1 ? 'item' : 'items' }} saved</p>
        <div class="flex items-center space-x-2">
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-pink-600 text-white' : 'bg-white text-gray-600'"
            class="p-2 border rounded-lg hover:bg-pink-600 hover:text-white transition-colors"
          >
            <Grid class="h-5 w-5" />
          </button>
          <button
            @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-pink-600 text-white' : 'bg-white text-gray-600'"
            class="p-2 border rounded-lg hover:bg-pink-600 hover:text-white transition-colors"
          >
            <List class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="product in wishlistProducts" 
          :key="product.id"
          class="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden relative"
        >
          <!-- Remove Button -->
          <button 
            @click="removeFromWishlist(product.id)"
            class="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <X class="h-4 w-4 text-gray-600" />
          </button>

          <div class="relative aspect-[3/4] overflow-hidden">
            <img 
              :src="product.images[0]" 
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            <!-- NSFW content blocking removed -->

            <!-- Badges -->
            <div class="absolute top-2 left-2 flex flex-col space-y-1">
              <span v-if="product.availability === 'pre-order'" class="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Pre-Order
              </span>
              <span v-if="product.originalPrice" class="bg-red-600 text-white text-xs px-2 py-1 rounded">
                Sale
              </span>
            </div>

            <!-- Quick Actions -->
            <div class="absolute bottom-2 left-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="flex space-x-2">
                <button 
                  @click="addToCart(product)"
                  :disabled="product.availability === 'out-of-stock'"
                  class="flex-1 btn btn-primary text-xs py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ product.availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart' }}
                </button>
                <router-link 
                  :to="`/products/${product.id}`" 
                  class="btn btn-outline text-xs py-2 px-3"
                >
                  View
                </router-link>
              </div>
            </div>
          </div>

          <div class="p-4">
            <h3 class="font-semibold text-gray-900 line-clamp-2 mb-1">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ product.series }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-lg font-bold text-gray-900">¥{{ product.price.toLocaleString() }}</span>
                <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through">
                  ¥{{ product.originalPrice.toLocaleString() }}
                </span>
              </div>
              <div class="flex items-center">
                <Star class="h-4 w-4 text-yellow-400 fill-current" />
                <span class="text-sm text-gray-600 ml-1">{{ product.rating }}</span>
              </div>
            </div>

            <!-- Price Drop Alert -->
            <div v-if="product.originalPrice" class="mt-2 flex items-center text-sm text-green-600">
              <TrendingDown class="h-4 w-4 mr-1" />
              {{ Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) }}% off
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div 
          v-for="product in wishlistProducts" 
          :key="product.id"
          class="bg-white rounded-lg border hover:shadow-md transition-shadow duration-300 overflow-hidden"
        >
          <div class="flex flex-col md:flex-row">
            <div class="md:w-48 h-48 md:h-auto relative overflow-hidden">
              <img 
                :src="product.images[0]" 
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <!-- NSFW content blocking removed -->
            </div>
            
            <div class="flex-1 p-6">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
                  <p class="text-gray-600 mb-1">{{ product.series }}</p>
                  <p class="text-sm text-gray-500">{{ product.manufacturer }} • {{ product.scale }}</p>
                  
                  <div class="flex items-center mt-2">
                    <Star class="h-4 w-4 text-yellow-400 fill-current" />
                    <span class="text-sm text-gray-600 ml-1">{{ product.rating }} ({{ product.reviewCount }} reviews)</span>
                  </div>
                </div>
                
                <button 
                  @click="removeFromWishlist(product.id)"
                  class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X class="h-5 w-5" />
                </button>
              </div>
              
              <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>
              
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="text-2xl font-bold text-gray-900">¥{{ product.price.toLocaleString() }}</span>
                    <span v-if="product.originalPrice" class="text-lg text-gray-500 line-through">
                      ¥{{ product.originalPrice.toLocaleString() }}
                    </span>
                  </div>
                  
                  <span class="text-sm px-2 py-1 rounded" 
                        :class="getAvailabilityColor(product.availability)">
                    {{ formatAvailability(product.availability) }}
                  </span>
                </div>
                
                <div class="flex items-center space-x-3">
                  <router-link 
                    :to="`/products/${product.id}`" 
                    class="btn btn-outline px-4 py-2"
                  >
                    View Details
                  </router-link>
                  <button 
                    @click="addToCart(product)"
                    :disabled="product.availability === 'out-of-stock'"
                    class="btn btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ product.availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div v-if="wishlistProducts.length > 1" class="mt-8 flex justify-center">
        <button @click="addAllToCart" class="btn btn-primary px-8 py-3">
          <ShoppingCart class="h-5 w-5 mr-2" />
          Add All to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Heart, Share, Grid, List, X, Lock, Star, TrendingDown, ShoppingCart 
} from 'lucide-vue-next';
import { useWishlist } from '@/composables/useWishlist';
import { useCart } from '@/composables/useCart';
import { useAuth } from '@/composables/useAuth';
import { allProducts } from '@/data/mockData';

const { wishlistItems, removeFromWishlist } = useWishlist();
const { addToCart } = useCart();
const { currentUser } = useAuth();

const viewMode = ref<'grid' | 'list'>('grid');

// NSFW filtering removed

const wishlistProducts = computed(() => {
  return wishlistItems.value
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean) as typeof allProducts;
});

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'in-stock': return 'bg-green-100 text-green-800';
    case 'pre-order': return 'bg-blue-100 text-blue-800';
    case 'out-of-stock': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatAvailability = (availability: string) => {
  switch (availability) {
    case 'in-stock': return 'In Stock';
    case 'pre-order': return 'Pre-Order';
    case 'out-of-stock': return 'Out of Stock';
    default: return availability;
  }
};

const shareWishlist = () => {
  const url = `${window.location.origin}/wishlist?shared=true`;
  if (navigator.share) {
    navigator.share({
      title: 'My Anime Figure Wishlist',
      text: 'Check out my anime figure wishlist!',
      url: url,
    });
  } else {
    navigator.clipboard.writeText(url);
    alert('Wishlist link copied to clipboard!');
  }
};

const clearWishlist = () => {
  if (confirm('Are you sure you want to clear your entire wishlist?')) {
    const idsToRemove = [...wishlistItems.value];
    idsToRemove.forEach(id => removeFromWishlist(id));
  }
};

const addAllToCart = () => {
  const availableProducts = wishlistProducts.value.filter(p => p.availability !== 'out-of-stock');
  availableProducts.forEach(product => addToCart(product));
  
  const count = availableProducts.length;
  alert(`Added ${count} ${count === 1 ? 'item' : 'items'} to cart!`);
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
