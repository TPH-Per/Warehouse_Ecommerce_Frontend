<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

    <div v-if="cartItems.length === 0" class="text-center py-16">
      <ShoppingBag class="h-24 w-24 text-gray-300 mx-auto mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
      <p class="text-gray-600 mb-6">Add some amazing anime figures to get started!</p>
      <router-link to="/products" class="btn btn-primary">Continue Shopping</router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div 
          v-for="item in cartItemsWithProducts" 
          :key="item.productId"
          class="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start space-x-4">
            <!-- Product Image -->
            <div class="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                :src="item.product.images[0]" 
                :alt="item.product.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Product Details -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-semibold text-gray-900">
                    <router-link :to="`/products/${item.productId}`" class="hover:text-pink-600">
                      {{ item.product.name }}
                    </router-link>
                  </h3>
                  <p class="text-sm text-gray-600">{{ item.product.series }}</p>
                  <p class="text-sm text-gray-500">{{ item.product.manufacturer }}</p>
                </div>
                <button 
                  @click="removeFromCart(item.productId)"
                  class="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X class="h-5 w-5" />
                </button>
              </div>

              <!-- Quantity and Price -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      @click="updateQuantity(item.productId, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      class="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus class="h-4 w-4" />
                    </button>
                    <input 
                      :value="item.quantity" 
                      @input="updateQuantity(item.productId, parseInt(($event.target as HTMLInputElement).value))"
                      type="number" 
                      min="1" 
                      :max="item.product.stock"
                      class="w-16 text-center border-0 focus:ring-0"
                    />
                    <button 
                      @click="updateQuantity(item.productId, item.quantity + 1)"
                      :disabled="item.quantity >= item.product.stock"
                      class="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus class="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div v-if="item.product.stock < 10" class="text-sm text-orange-600">
                    Only {{ item.product.stock }} left
                  </div>
                </div>

                <div class="text-right">
                  <div class="font-semibold text-gray-900">
                    ¥{{ (item.price * item.quantity).toLocaleString() }}
                  </div>
                  <div class="text-sm text-gray-600">
                    ¥{{ item.price.toLocaleString() }} each
                  </div>
                </div>
              </div>

              <!-- Pre-order Notice -->
              <div v-if="item.product.availability === 'pre-order'" 
                   class="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                <Clock class="h-4 w-4 inline mr-1" />
                Pre-order item • ETA: {{ item.product.eta ? formatDate(item.product.eta) : 'TBA' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg border p-6 sticky top-20">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal ({{ cartCount }} items)</span>
              <span class="text-gray-900">¥{{ cartTotal.toLocaleString() }}</span>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Estimated Shipping</span>
              <span class="text-gray-900">¥{{ estimatedShipping.toLocaleString() }}</span>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Tax</span>
              <span class="text-gray-900">¥{{ estimatedTax.toLocaleString() }}</span>
            </div>

            <!-- Coupon Code -->
            <div class="pt-3 border-t border-gray-200">
              <div class="flex space-x-2">
                <input 
                  v-model="couponCode"
                  type="text" 
                  placeholder="Coupon code"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button 
                  @click="applyCoupon"
                  :disabled="!couponCode.trim()"
                  class="btn btn-outline text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
              
              <div v-if="appliedCoupon" class="mt-2 flex items-center justify-between text-sm">
                <span class="text-green-600 flex items-center">
                  <Tag class="h-4 w-4 mr-1" />
                  {{ appliedCoupon.description }}
                </span>
                <span class="text-green-600">-¥{{ couponDiscount.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4 mb-6">
            <div class="flex justify-between text-lg font-semibold">
              <span class="text-gray-900">Total</span>
              <span class="text-gray-900">¥{{ orderTotal.toLocaleString() }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <router-link 
              to="/checkout" 
              class="w-full btn btn-primary py-3 text-lg font-semibold"
            >
              Proceed to Checkout
            </router-link>
            
            <router-link 
              to="/products" 
              class="w-full btn btn-outline py-2"
            >
              Continue Shopping
            </router-link>
          </div>

          <!-- Security Notice -->
          <div class="mt-6 flex items-center text-sm text-gray-600">
            <Shield class="h-4 w-4 mr-2 text-green-500" />
            <span>Secure checkout with SSL encryption</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended Products -->
    <div v-if="cartItems.length > 0" class="mt-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in recommendedProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  ShoppingBag, X, Minus, Plus, Clock, Tag, Shield 
} from 'lucide-vue-next';
import ProductCard from '@/components/ProductCard.vue';
import { useCart } from '@/composables/useCart';
import { allProducts } from '@/data/mockData';
import type { Product, Coupon } from '@/types';

const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();

const couponCode = ref('');
const appliedCoupon = ref<Coupon | null>(null);

const cartItemsWithProducts = computed(() => {
  return cartItems.value.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return {
      ...item,
      product: product!
    };
  }).filter(item => item.product);
});

const estimatedShipping = computed(() => {
  const totalWeight = cartItemsWithProducts.value.reduce((sum, item) => 
    sum + (item.product.weight_kg * item.quantity), 0
  );
  
  if (totalWeight <= 1) return 500;
  if (totalWeight <= 3) return 800;
  if (totalWeight <= 5) return 1200;
  return 1500;
});

const estimatedTax = computed(() => {
  return Math.round(cartTotal.value * 0.1); // 10% tax
});

const couponDiscount = computed(() => {
  if (!appliedCoupon.value) return 0;
  
  if (appliedCoupon.value.type === 'percentage') {
    return Math.round(cartTotal.value * (appliedCoupon.value.value / 100));
  } else {
    return appliedCoupon.value.value;
  }
});

const orderTotal = computed(() => {
  const total = cartTotal.value + estimatedShipping.value + estimatedTax.value - couponDiscount.value;
  return total > 0 ? total : 0;
});

const recommendedProducts = computed(() => {
  // Get products from same series as cart items
  const cartSeries = [...new Set(cartItemsWithProducts.value.map(item => item.product.series))];
  return allProducts
    .filter(product => 
      cartSeries.includes(product.series) && 
      !cartItems.value.some(item => item.productId === product.id)
    )
    .slice(0, 4);
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const applyCoupon = () => {
  // Mock coupon validation
  const mockCoupons: Coupon[] = [
    {
      id: '1',
      code: 'WELCOME10',
      description: '10% off your first order',
      type: 'percentage',
      value: 10,
      minOrderAmount: 3000,
      expiresAt: '2025-12-31',
      isActive: true,
      usageCount: 0,
    },
    {
      id: '2',
      code: 'SAVE500',
      description: '¥500 off orders over ¥5000',
      type: 'fixed',
      value: 500,
      minOrderAmount: 5000,
      expiresAt: '2025-12-31',
      isActive: true,
      usageCount: 0,
    },
  ];

  const coupon = mockCoupons.find(c => 
    c.code.toLowerCase() === couponCode.value.toLowerCase() && 
    c.isActive &&
    (!c.minOrderAmount || cartTotal.value >= c.minOrderAmount)
  );

  if (coupon) {
    appliedCoupon.value = coupon;
    couponCode.value = '';
  } else {
    alert('Invalid coupon code or minimum order amount not met');
  }
};
</script>
