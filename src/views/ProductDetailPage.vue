<template>
  <div v-if="product" class="container mx-auto px-4 py-8 animate-fade-in">
    <!-- Breadcrumb -->
    <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
      <router-link to="/" class="hover:text-pink-600 dark:hover:text-pink-400">Trang chủ</router-link>
      <ChevronRight class="h-4 w-4" />
      <router-link to="/products" class="hover:text-pink-600 dark:hover:text-pink-400">Sản phẩm</router-link>
      <ChevronRight class="h-4 w-4" />
      <span class="text-gray-900 dark:text-gray-200 line-clamp-1">{{ product.name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
      <!-- Image Gallery -->
      <div class="space-y-4">
        <div class="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img :src="selectedImage" :alt="product.name" class="w-full h-full object-contain transition-transform duration-300" />
        </div>
        <div class="grid grid-cols-5 gap-4">
          <button v-for="(img, index) in product.images" :key="index" @click="selectedImage = img" class="aspect-square rounded-md overflow-hidden border-2 transition-colors" :class="selectedImage === img ? 'border-pink-500' : 'border-transparent hover:border-pink-300'">
            <img :src="img" :alt="`${product.name} thumbnail ${index + 1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ product.name }}</h1>
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <Star v-for="i in 5" :key="i" class="h-5 w-5" :class="i <= product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'" />
            <a href="#reviews" class="ml-2 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600">{{ product.reviewCount }} reviews</a>
          </div>
          <span class="text-gray-300 dark:text-gray-700">|</span>
          <span class="text-sm px-2 py-1 rounded-full" :class="getAvailabilityColor(product.availability)">
            {{ formatAvailability(product.availability) }}
          </span>
        </div>

        <div class="flex items-baseline space-x-3">
          <span class="text-4xl font-bold text-pink-600">¥{{ product.price.toLocaleString() }}</span>
          <span v-if="product.originalPrice" class="text-2xl text-gray-500 line-through">¥{{ product.originalPrice.toLocaleString() }}</span>
        </div>

        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ product.description }}</p>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
            <button @click="quantity > 1 && quantity--" class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Minus class="h-4 w-4" /></button>
            <span class="px-4 font-semibold">{{ quantity }}</span>
            <button @click="quantity++" class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Plus class="h-4 w-4" /></button>
          </div>
          <button @click="addToCart(product, quantity)" :disabled="product.availability === 'out-of-stock'" class="flex-1 btn btn-primary py-3 text-lg">
            <ShoppingCart class="h-5 w-5 mr-2" />
            Thêm vào giỏ
          </button>
          <button @click="toggleWishlist(product.id)" class="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Heart class="h-6 w-6" :class="isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'" />
          </button>
        </div>

        <!-- Shipping Estimator -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 dark:text-gray-200 mb-2 flex items-center">
            <Truck class="h-5 w-5 mr-2" />
            Ước tính phí vận chuyển
          </h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tỉnh/Thành phố</label>
              <select v-model="selectedCity" @change="onCityChange" class="w-full form-select text-sm">
                <option value="">Chọn tỉnh/thành phố</option>
                <option v-for="city in vietnameseLocations" :key="city.id" :value="city.id">
                  {{ city.name }}
                </option>
              </select>
            </div>
            <div v-if="selectedCity">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quận/Huyện</label>
              <select v-model="selectedDistrict" @change="calculateVietnameseShipping" class="w-full form-select text-sm">
                <option value="">Chọn quận/huyện</option>
                <option v-for="district in availableDistricts" :key="district.id" :value="district.id">
                  {{ district.name }}
                </option>
              </select>
            </div>
            <button @click="calculateVietnameseShipping" :disabled="!selectedDistrict" class="btn btn-secondary text-sm w-full disabled:opacity-50">Tính phí vận chuyển</button>
          </div>
          <div v-if="shippingEstimate" class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p class="text-sm text-blue-800 dark:text-blue-300">
              <strong>Phí vận chuyển:</strong> ¥{{ shippingEstimate.cost.toLocaleString() }}
            </p>
            <p class="text-sm text-blue-800 dark:text-blue-300">
              <strong>Thời gian giao hàng:</strong> {{ shippingEstimate.days }} ngày
            </p>
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
              *Phí vận chuyển đã bao gồm thuế và phí xử lý
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Description and Reviews -->
    <div id="reviews" class="space-y-8">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button @click="activeTab = 'description'" :class="activeTab === 'description' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'" class="py-2 px-1 border-b-2 font-medium text-sm transition-colors">
            Mô tả
          </button>
          <button @click="activeTab = 'reviews'" :class="activeTab === 'reviews' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'" class="py-2 px-1 border-b-2 font-medium text-sm transition-colors">
            Đánh giá ({{ product.reviewCount }})
          </button>
        </nav>
      </div>

      <div v-if="activeTab === 'description'" class="prose dark:prose-invert max-w-none">
        <p>{{ product.description }}</p>
        <ul>
          <li><strong>Series:</strong> {{ product.series }}</li>
          <li><strong>Nhân vật:</strong> {{ product.character }}</li>
          <li><strong>Nhà sản xuất:</strong> {{ product.manufacturer }}</li>
          <li><strong>Tỷ lệ:</strong> {{ product.scale }}</li>
          <li><strong>Tình trạng:</strong> <span class="capitalize">{{ product.condition }}</span></li>
        </ul>
      </div>

      <div v-if="activeTab === 'reviews'" class="space-y-6">
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Đánh giá của khách hàng</h3>
            <div class="relative group">
              <button 
                @click="showReviewForm = !showReviewForm" 
                class="btn btn-outline"
                :disabled="!canWriteReview"
              >
                {{ showReviewForm ? 'Hủy' : 'Viết đánh giá' }}
              </button>
              <div v-if="!canWriteReview" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Bạn phải mua và nhận được sản phẩm để viết đánh giá.
              </div>
            </div>
          </div>
          
          <form v-if="showReviewForm" @submit.prevent="submitReview" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Đánh giá của bạn</label>
              <div class="flex items-center">
                <Star v-for="i in 5" :key="i" @click="newReview.rating = i" class="h-6 w-6 cursor-pointer" :class="i <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'" />
              </div>
            </div>
            <div>
              <label for="reviewComment" class="block text-sm font-medium mb-1">Nhận xét của bạn</label>
              <textarea id="reviewComment" v-model="newReview.comment" rows="4" class="w-full form-input"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tải ảnh lên (Tùy chọn)</label>
              <input type="file" @change="handleReviewImage" accept="image/png, image/jpeg" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"/>
            </div>
            <button type="submit" class="btn btn-primary">Gửi đánh giá</button>
          </form>
        </div>

        <div v-if="reviews.length > 0" class="space-y-6">
          <div v-for="review in reviews" :key="review.id" class="flex items-start space-x-4 border-b dark:border-gray-700 pb-6 last:border-b-0">
            <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold">{{ review.userName.charAt(0) }}</div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <p class="font-semibold text-gray-800 dark:text-gray-200">{{ review.userName }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(review.createdAt) }}</p>
              </div>
              <div class="flex items-center my-1">
                <Star v-for="i in 5" :key="i" class="h-4 w-4" :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'" />
              </div>
              <p class="text-gray-700 dark:text-gray-300">{{ review.comment }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <MessageSquare class="h-12 w-12 mx-auto mb-2" />
          <p>Chưa có đánh giá nào. Hãy là người đầu tiên viết!</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container mx-auto px-4 py-16 text-center">
    <Loader class="h-8 w-8 animate-spin mx-auto mb-4" />
    <p class="text-gray-600 dark:text-gray-400">Đang tải thông tin sản phẩm...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ChevronRight, Star, ShoppingCart, Heart, Truck, 
  Minus, Plus, Loader, MessageSquare
} from 'lucide-vue-next';
import { allProducts, allReviews, allOrders } from '@/data/mockData';
import { vietnameseLocations, getCityById, calculateShippingCost, getEstimatedDeliveryDays, convertVNDtoJPY } from '@/data/vietnameseLocations';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { useAuth } from '@/composables/useAuth';
import type { Product, Review } from '@/types';
import type { District } from '@/data/vietnameseLocations';

const route = useRoute();
const router = useRouter();
const { addToCart } = useCart();
const { toggleWishlist, isInWishlist } = useWishlist();
const { currentUser } = useAuth();

const product = ref<Product | null>(null);
const reviews = ref<Review[]>([]);
const selectedImage = ref('');
const quantity = ref(1);
const activeTab = ref('description');
const showReviewForm = ref(false);

// Vietnamese shipping variables
const selectedCity = ref('');
const selectedDistrict = ref('');
const shippingEstimate = ref<{ cost: number; days: number } | null>(null);

const newReview = ref({
  rating: 0,
  comment: '',
  image: null as File | null,
  imagePreview: ''
});

// NSFW functionality removed

const availableDistricts = computed(() => {
  if (!selectedCity.value) return [];
  const city = getCityById(selectedCity.value);
  return city?.districts || [];
});

const canWriteReview = computed(() => {
  if (!currentUser.value || !product.value) return false;
  return allOrders.some(order => 
    order.userId === currentUser.value?.id &&
    order.status === 'delivered' &&
    order.items.some(item => item.productId === product.value?.id)
  );
});

const onCityChange = () => {
  selectedDistrict.value = '';
  shippingEstimate.value = null;
};

const calculateVietnameseShipping = () => {
  if (!product.value || !selectedCity.value || !selectedDistrict.value) return;
  
  const costInVND = calculateShippingCost(selectedCity.value, selectedDistrict.value, product.value.weight_kg);
  const costInJPY = convertVNDtoJPY(costInVND);
  const estimatedDays = getEstimatedDeliveryDays(selectedCity.value, selectedDistrict.value);
  
  shippingEstimate.value = {
    cost: costInJPY,
    days: estimatedDays
  };
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'in-stock': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pre-order': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'out-of-stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const formatAvailability = (availability: string) => {
  return availability.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const handleReviewImage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    newReview.value.image = file;
  }
};

const submitReview = () => {
  if (newReview.value.rating > 0 && newReview.value.comment.trim() && product.value) {
    // Mock submission
    const reviewData: Review = {
      id: `rev-${Date.now()}`,
      productId: product.value.id,
      productName: product.value.name,
      productImage: product.value.imageUrl || '',
      userId: currentUser.value?.id || 'guest',
      userName: currentUser.value?.firstName || 'Anonymous',
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      createdAt: new Date().toISOString(),
      verified: true,
      status: 'pending',
    };
    allReviews.unshift(reviewData); // Add to all reviews for moderation
    alert('Review submitted for moderation!');
    showReviewForm.value = false;
    newReview.value = { rating: 0, comment: '', image: null, imagePreview: '' };
  } else {
    alert('Please provide a rating and a comment.');
  }
};

onMounted(() => {
  const productId = route.params.id as string;
  const foundProduct = allProducts.find(p => p.id === productId);
  
  if (foundProduct) {
    product.value = foundProduct;
    selectedImage.value = foundProduct.images?.[0] || foundProduct.imageUrl || '';
    reviews.value = allReviews.filter(r => r.productId === productId && r.status === 'approved');
  } else {
    router.push('/products');
  }
});
</script>

<style scoped>
.form-select {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 dark:bg-gray-700;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
