<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ pageTitle }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'product' : 'products' }} found
          </p>
        </div>
        
        <!-- View Toggle -->
        <div class="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-pink-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
            class="p-2 border dark:border-gray-600 rounded-lg hover:bg-pink-600 hover:text-white transition-colors"
          >
            <Grid class="h-5 w-5" />
          </button>
          <button
            @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-pink-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
            class="p-2 border dark:border-gray-600 rounded-lg hover:bg-pink-600 hover:text-white transition-colors"
          >
            <List class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 mb-6">
        <!-- Search Bar -->
        <div class="relative mb-6">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search for figures, characters, series..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 dark:bg-gray-700"
          />
        </div>

        <!-- Filters Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select v-model="filters.category" class="form-select">
            <option value="">All Categories</option>
            <option value="figure">Figures</option>
            <option value="nendoroid">Nendoroids</option>
            <option value="plushie">Plushies</option>
            <option value="figma">Figma</option>
          </select>

          <select v-model="filters.character" class="form-select">
            <option value="">All Characters</option>
            <option v-for="char in availableCharacters" :key="char" :value="char">{{ char }}</option>
          </select>
          
          <select v-model="filters.scale" class="form-select">
            <option value="">All Scales</option>
            <option v-for="scale in availableScales" :key="scale" :value="scale">{{ scale }}</option>
          </select>

          <select v-model="filters.condition" class="form-select">
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="used">Pre-owned</option>
            <option value="damaged-box">Damaged Box</option>
          </select>

          <select v-model="filters.exclusivity" class="form-select">
            <option value="">All Items</option>
            <option value="exclusive">Exclusive</option>
            <option value="limited-edition">Limited Edition</option>
          </select>

          <!-- Sort -->
          <select v-model="sortBy" class="form-select">
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="eta">ETA (Pre-orders)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Grid/List -->
    <div v-if="paginatedProducts.length > 0">
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in paginatedProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>

      <div v-else class="space-y-6">
        <!-- List view item structure remains the same -->
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center">
        <!-- Pagination structure remains the same -->
      </div>
    </div>

    <!-- No Results -->
    <div v-else class="text-center py-16">
      <Package class="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search criteria or filters</p>
      <button @click="clearAllFilters" class="btn btn-primary">Clear all filters</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, Grid, List, X, Star, Heart, Lock, Package, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import ProductCard from '@/components/ProductCard.vue';
import { allProducts } from '@/data/mockData';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const router = useRouter();
const { addToCart } = useCart();
const { toggleWishlist, isInWishlist } = useWishlist();
const { currentUser } = useAuth();

const products = allProducts;
const viewMode = ref<'grid' | 'list'>('grid');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 24;

const filters = ref({
  category: '',
  character: '',
  scale: '',
  condition: '',
  exclusivity: '',
  priceRange: '',
});

const sortBy = ref('name');

// NSFW filtering removed

// Get unique values for filter options
const availableCharacters = computed(() => [...new Set(products.map(p => p.character))].sort());
const availableScales = computed(() => [...new Set(products.map(p => p.scale))].sort());

// Filter and search logic
const filteredProducts = computed(() => {
  let result = products.filter(product => {
    // NSFW filtering removed
    if (searchQuery.value && !product.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false;
    if (filters.value.category && product.category !== filters.value.category) return false;
    if (filters.value.character && product.character !== filters.value.character) return false;
    if (filters.value.scale && product.scale !== filters.value.scale) return false;
    if (filters.value.condition && product.condition !== filters.value.condition) return false;
    if (filters.value.exclusivity && !product.tags.includes(filters.value.exclusivity)) return false;
    return true;
  });

  // Sort products
  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'eta':
      result.sort((a, b) => {
        if (!a.eta) return 1;
        if (!b.eta) return -1;
        return new Date(a.eta).getTime() - new Date(b.eta).getTime();
      });
      break;
    default: // name
      result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const pageTitle = computed(() => {
  if (route.query.category) {
    const category = route.query.category as string;
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  if (route.query.search) {
    return `Search Results for "${route.query.search}"`;
  }
  return 'All Products';
});

const clearAllFilters = () => {
  searchQuery.value = '';
  Object.keys(filters.value).forEach(key => {
    (filters.value as any)[key] = '';
  });
  currentPage.value = 1;
};

// Watch for route changes
watch(() => route.query, (newQuery) => {
  if (newQuery.category) {
    filters.value.category = newQuery.category as string;
  }
  if (newQuery.search) {
    searchQuery.value = newQuery.search as string;
  }
}, { immediate: true });

// Reset page when filters change
watch([searchQuery, filters], () => {
  currentPage.value = 1;
}, { deep: true });

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('search')) {
    searchQuery.value = urlParams.get('search') || '';
  }
  if (urlParams.get('category')) {
    filters.value.category = urlParams.get('category') || '';
  }
});
</script>

<style scoped>
.form-select {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 dark:bg-gray-700;
}
</style>
