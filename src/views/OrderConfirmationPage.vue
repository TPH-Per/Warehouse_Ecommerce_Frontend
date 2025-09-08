<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <!-- Success Message -->
      <div class="text-center mb-12">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle class="h-12 w-12 text-green-600" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p class="text-xl text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        <div class="bg-gray-50 rounded-lg p-4 inline-block">
          <span class="text-sm text-gray-600">Order Number: </span>
          <span class="text-lg font-mono font-semibold text-gray-900">{{ orderId }}</span>
        </div>
      </div>

      <!-- Order Details -->
      <div class="bg-white rounded-lg border p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Order Details</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Order Items -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
            <div class="space-y-4">
              <div v-for="item in mockOrderItems" :key="item.id" class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    :src="item.image" 
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                  <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
                  <p class="text-sm font-medium text-gray-900">¥{{ (item.price * item.quantity).toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Tạm tính</span>
                <span class="text-gray-900">¥{{ subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Vận chuyển</span>
                <span class="text-gray-900">¥{{ shipping.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Thuế</span>
                <span class="text-gray-900">¥{{ tax.toLocaleString() }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between text-lg font-semibold">
                  <span class="text-gray-900">Tổng cộng</span>
                  <span class="text-gray-900">¥{{ total.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shipping & Payment Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <!-- Shipping Address -->
        <div class="bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Truck class="h-5 w-5 mr-2" />
            Shipping Address
          </h3>
          <div class="text-gray-700">
            <p class="font-medium">{{ mockOrder.shippingAddress.firstName }} {{ mockOrder.shippingAddress.lastName }}</p>
            <p>{{ mockOrder.shippingAddress.street }}</p>
            <p>{{ mockOrder.shippingAddress.city }}, {{ mockOrder.shippingAddress.state }} {{ mockOrder.shippingAddress.zipCode }}</p>
            <p>{{ mockOrder.shippingAddress.country }}</p>
            <p>{{ mockOrder.shippingAddress.phone }}</p>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard class="h-5 w-5 mr-2" />
            Payment Method
          </h3>
          <div class="text-gray-700">
            <p class="font-medium capitalize">{{ mockOrder.paymentMethod }}</p>
            <p class="text-sm text-green-600 mt-2">✓ Payment Confirmed</p>
          </div>
        </div>
      </div>

      <!-- Status Timeline -->
      <div class="bg-white rounded-lg border p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-900">Order Placed</span>
                <span class="text-sm text-gray-600">{{ formatDate(mockOrder.createdAt) }}</span>
              </div>
              <p class="text-sm text-gray-600">Your order has been received and is being processed</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-600">Processing</span>
                <span class="text-sm text-gray-600">Expected: 1-2 business days</span>
              </div>
              <p class="text-sm text-gray-600">We're preparing your items for shipment</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-600">Shipped</span>
                <span class="text-sm text-gray-600">Expected: 3-5 business days</span>
              </div>
              <p class="text-sm text-gray-600">Your package is on its way</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-600">Delivered</span>
                <span class="text-sm text-gray-600">{{ mockOrder.estimatedDelivery ? formatDate(mockOrder.estimatedDelivery) : 'TBD' }}</span>
              </div>
              <p class="text-sm text-gray-600">Package delivered to your address</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">What happens next?</h3>
        <div class="space-y-3 text-blue-800">
          <div class="flex items-start">
            <Mail class="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium">Email confirmation</p>
              <p class="text-sm">You'll receive an order confirmation email shortly</p>
            </div>
          </div>
          <div class="flex items-start">
            <Package class="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium">Order processing</p>
              <p class="text-sm">We'll prepare and package your items within 1-2 business days</p>
            </div>
          </div>
          <div class="flex items-start">
            <Truck class="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium">Shipping updates</p>
              <p class="text-sm">Track your package with the tracking number we'll send you</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
        <router-link to="/orders" class="btn btn-primary px-8 py-3">
          <Eye class="h-5 w-5 mr-2" />
          Track Order
        </router-link>
        <router-link to="/products" class="btn btn-outline px-8 py-3">
          Continue Shopping
        </router-link>
        <button @click="downloadInvoice" class="btn btn-outline px-8 py-3">
          <Download class="h-5 w-5 mr-2" />
          Download Invoice
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { 
  CheckCircle, Truck, CreditCard, Mail, Package, Eye, Download 
} from 'lucide-vue-next';
import { generateMockOrders } from '@/data/mockData';

const route = useRoute();
const orderId = ref('');

// Mock order data
const mockOrder = generateMockOrders()[0];
const mockOrderItems = mockOrder.items;

const subtotal = computed(() => mockOrder.subtotal);
const shipping = computed(() => mockOrder.shippingCost);
const tax = computed(() => mockOrder.tax);
const total = computed(() => mockOrder.total);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const downloadInvoice = () => {
  // In a real app, this would generate and download a PDF invoice
  const invoiceData = {
    orderId: orderId.value,
    items: mockOrderItems,
    total: total.value,
    date: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${orderId.value}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

onMounted(() => {
  orderId.value = route.params.id as string || mockOrder.id;
});
</script>
