<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Checkout Form -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Shipping Address -->
        <div class="bg-white rounded-lg border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
          
          <form class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input 
                  v-model="shippingAddress.firstName"
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input 
                  v-model="shippingAddress.lastName"
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input 
                v-model="shippingAddress.street"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input 
                  v-model="shippingAddress.city"
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">State/Prefecture</label>
                <input 
                  v-model="shippingAddress.state"
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <input 
                  v-model="shippingAddress.zipCode"
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select 
                v-model="shippingAddress.country"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select Country</option>
                <option value="JP">Japan</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input 
                v-model="shippingAddress.phone"
                type="tel" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </form>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-lg border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Phương thức thanh toán</h2>
          
          <div class="space-y-4">
            <!-- Payment Options -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label class="relative cursor-pointer">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="vnpay"
                  class="sr-only"
                />
                <div class="border rounded-lg p-4 text-center transition-all"
                     :class="paymentMethod === 'vnpay' ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-gray-400'">
                  <CreditCard class="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div class="font-medium text-gray-900">VNPay</div>
                  <div class="text-sm text-gray-600">Thanh toán Việt Nam</div>
                </div>
              </label>

              <label class="relative cursor-pointer">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="momo"
                  class="sr-only"
                />
                <div class="border rounded-lg p-4 text-center transition-all"
                     :class="paymentMethod === 'momo' ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-gray-400'">
                  <Smartphone class="h-8 w-8 mx-auto mb-2 text-pink-600" />
                  <div class="font-medium text-gray-900">MoMo</div>
                  <div class="text-sm text-gray-600">Mobile Wallet</div>
                </div>
              </label>

              <label class="relative cursor-pointer">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="cod"
                  class="sr-only"
                />
                <div class="border rounded-lg p-4 text-center transition-all"
                     :class="paymentMethod === 'cod' ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-gray-400'">
                  <Wallet class="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div class="font-medium text-gray-900">Pay on Delivery</div>
                  <div class="text-sm text-gray-600">Cash or Card</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Order Notes -->
        <div class="bg-white rounded-lg border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Notes (Optional)</h2>
          <textarea 
            v-model="orderNotes"
            rows="3"
            placeholder="Special instructions for your order..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          ></textarea>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg border p-6 sticky top-20">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

          <!-- Cart Items -->
          <div class="space-y-4 mb-6">
            <div 
              v-for="item in cartItemsWithProducts" 
              :key="item.productId"
              class="flex items-center space-x-3"
            >
              <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  :src="item.product.images[0]" 
                  :alt="item.product.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.product.name }}</h4>
                <p class="text-sm text-gray-600">Qty: {{ item.quantity }}</p>
              </div>
              <div class="text-sm font-medium text-gray-900">
                ¥{{ (item.price * item.quantity).toLocaleString() }}
              </div>
            </div>
          </div>

          <!-- Pricing Breakdown -->
          <div class="space-y-3 mb-6 border-t border-gray-200 pt-6">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="text-gray-900">¥{{ cartTotal.toLocaleString() }}</span>
            </div>
            
            <div class="flex justify-between text-sm items-center">
              <label class="text-gray-600 flex items-center">
                <input type="checkbox" v-model="expressShipping" class="mr-2" />
                Express
              </label>
              <span class="text-gray-900">¥{{ shippingCost.toLocaleString() }}</span>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Tax</span>
              <span class="text-gray-900">¥{{ estimatedTax.toLocaleString() }}</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4 mb-6">
            <div class="flex justify-between text-lg font-semibold">
              <span class="text-gray-900">Total</span>
              <span class="text-gray-900">¥{{ orderTotal.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Terms Acceptance -->
          <div class="mb-6">
            <label class="flex items-start space-x-3">
              <input 
                type="checkbox" 
                v-model="acceptTerms"
                class="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <span class="text-sm text-gray-700">
                Tôi đồng ý với 
                <a href="#" class="text-pink-600 hover:text-pink-500">Điều khoản & Điều kiện</a> 
                và 
                <a href="#" class="text-pink-600 hover:text-pink-500">Chính sách Bảo mật</a>
              </span>
            </label>
          </div>

          <!-- Place Order Button -->
          <button 
            @click="handlePlaceOrder"
            :disabled="!canPlaceOrder || processing"
            class="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader v-if="processing" class="animate-spin h-5 w-5 mr-2" />
            {{ processing ? 'Đang xử lý...' : 'Đặt hàng' }}
          </button>

          <!-- Security Notice -->
          <div class="mt-4 flex items-center justify-center text-sm text-gray-600">
            <Shield class="h-4 w-4 mr-2 text-green-500" />
            <span>Mã hóa SSL 256-bit bảo mật</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { CreditCard, Smartphone, Shield, Loader, Wallet } from 'lucide-vue-next';
import { useCart } from '@/composables/useCart';
import { allProducts } from '@/data/mockData';
import type { Address } from '@/types';
import { getShippingCost, clearShippingCache } from '@/services/shippingService';

const router = useRouter();
const { cartItems, cartTotal, clearCart } = useCart();

const processing = ref(false);
const acceptTerms = ref(false);
const paymentMethod = ref('vnpay');
const orderNotes = ref('');

const shippingAddress = ref<Partial<Address>>({
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: '',
});

const cartItemsWithProducts = computed(() => {
  return cartItems.value.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return {
      ...item,
      product: product!
    };
  }).filter(item => item.product);
});
const expressShipping = ref(false);
const shippingCost = ref(0);
const totalWeight = computed(() =>
  cartItemsWithProducts.value.reduce((sum, item) =>
    sum + item.product.weight_kg * item.quantity,
  0)
);

const updateShipping = async () => {
  const dest = {
    zoneName: 'default',
    country: shippingAddress.value.country,
    city: shippingAddress.value.city,
  };
  shippingCost.value = await getShippingCost(dest, totalWeight.value, expressShipping.value);
};

watch([totalWeight, () => shippingAddress.value.country, () => shippingAddress.value.city, expressShipping], updateShipping, { immediate: true });

watch(() => shippingAddress.value.country, clearShippingCache);

const estimatedTax = computed(() => {
  return Math.round(cartTotal.value * 0.1); // 10% tax
});

const orderTotal = computed(() => {
  return cartTotal.value + shippingCost.value + estimatedTax.value;
});

const canPlaceOrder = computed(() => {
  const hasRequiredFields = shippingAddress.value.firstName &&
                           shippingAddress.value.lastName &&
                           shippingAddress.value.street &&
                           shippingAddress.value.city &&
                           shippingAddress.value.state &&
                           shippingAddress.value.zipCode &&
                           shippingAddress.value.country &&
                           shippingAddress.value.phone;
  
  return hasRequiredFields && paymentMethod.value && acceptTerms.value && cartItems.value.length > 0;
});

const handlePlaceOrder = async () => {
  if (!canPlaceOrder.value) return;
  
  processing.value = true;
  
  try {
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}`;
    
    // Clear cart
    clearCart();
    
    // Redirect to confirmation page
    router.push(`/order-confirmation/${orderId}`);
  } catch (error) {
    console.error('Order processing error:', error);
    alert('There was an error processing your order. Please try again.');
  } finally {
    processing.value = false;
  }
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
