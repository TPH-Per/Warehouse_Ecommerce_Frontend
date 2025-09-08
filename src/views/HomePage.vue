<template>
  <div class="animate-fade-in">
    <!-- Hero Banner -->
    <section class="relative h-96 md:h-[500px] bg-gradient-to-r from-pink-600 to-purple-700 overflow-hidden">
      <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      <div class="relative container mx-auto px-4 h-full flex items-center">
        <div class="text-white max-w-2xl">
          <h1 class="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">
            Đồ sưu tập Anime
            <span class="block text-pink-300">Cao cấp</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up" style="animation-delay: 0.2s;">
            Khám phá các figures, nendoroids và gấu bông chính hãng từ series yêu thích của bạn
          </p>
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up" style="animation-delay: 0.4s;">
            <router-link to="/products" class="btn bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Mua ngay
            </router-link>
            <router-link to="/products?category=figures" class="btn border-2 border-white text-white hover:bg-white hover:text-pink-600 px-8 py-3 text-lg font-semibold">
              Xem Figures
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Floating Elements -->
      <div class="absolute top-10 right-10 w-20 h-20 bg-pink-400 rounded-full opacity-20 animate-bounce-gentle"></div>
      <div class="absolute bottom-20 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-20 animate-bounce-gentle" style="animation-delay: 1s;"></div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mua sắm theo danh mục</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập được chọn lọc của chúng tôi với các sản phẩm anime cao cấp
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            v-for="category in allCategories" 
            :key="category.id"
            class="group cursor-pointer"
            @click="$router.push(`/products?category=${category.slug}`)"
          >
            <div class="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-4">
              <img 
                :src="category.image" 
                :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div class="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p class="font-semibold">{{ category.productCount }} sản phẩm</p>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Sản phẩm nổi bật</h2>
            <p class="text-xl text-gray-600">Những sản phẩm yêu thích được chọn lọc từ bộ sưu tập của chúng tôi</p>
          </div>
          <router-link to="/products" class="btn btn-outline hidden md:inline-flex">
            Xem tất cả
            <ChevronRight class="ml-2 h-4 w-4" />
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>

        <div class="text-center md:hidden">
          <router-link to="/products" class="btn btn-outline">
            Xem tất cả sản phẩm
            <ChevronRight class="ml-2 h-4 w-4" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Hot Deals -->
    <section class="py-16 bg-gradient-to-r from-red-600 to-pink-600 text-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">🔥 Ưu đãi hấp dẫn</h2>
          <p class="text-xl opacity-90 max-w-2xl mx-auto">
            Các ưu đãi có thời hạn cho figures và đồ sưu tập phổ biến
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="product in hotDeals" 
            :key="product.id"
            class="bg-white rounded-lg overflow-hidden text-gray-900 hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
            @click="$router.push(`/products/${product.id}`)"
          >
            <div class="relative aspect-[4/3] overflow-hidden">
              <img 
                :src="product.images[0]" 
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {{ Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) }}% OFF
              </div>
            </div>
            <div class="p-6">
              <h3 class="font-semibold text-lg mb-2 line-clamp-1">{{ product.name }}</h3>
              <p class="text-gray-600 mb-4">{{ product.series }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-red-600">¥{{ product.price.toLocaleString() }}</span>
                  <span class="text-gray-500 line-through">¥{{ product.originalPrice!.toLocaleString() }}</span>
                </div>
                <button class="btn btn-primary text-sm">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Giữ liên lạc</h2>
          <p class="text-xl text-gray-600 mb-8">
            Nhận thông báo về các sản phẩm mới, ưu đãi đặc biệt và cơ hội đặt hàng trước
          </p>
          <div class="flex flex-col sm:flex-row max-w-md mx-auto space-y-4 sm:space-y-0 sm:space-x-4">
            <input 
              type="email" 
              placeholder="Nhập địa chỉ email của bạn"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <button class="btn btn-primary px-8 py-3">Đăng ký</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight } from 'lucide-vue-next';
import ProductCard from '@/components/ProductCard.vue';
import { allProducts, allCategories } from '@/data/mockData';

const featuredProducts = computed(() => 
  allProducts.filter(p => p.tags.includes('popular')).slice(0, 8)
);

const hotDeals = computed(() => 
  allProducts.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 6)
);
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
