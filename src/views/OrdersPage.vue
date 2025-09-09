<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">My Orders</h1>
      <div class="flex items-center space-x-4">
        <select v-model="statusFilter" class="form-select">
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="partially-shipped">Partially Shipped</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div v-if="filteredOrders.length === 0" class="text-center py-16">
      <Package class="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No orders found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">You haven't placed any orders yet.</p>
      <router-link to="/products" class="btn btn-primary">Start Shopping</router-link>
    </div>

    <div v-else class="space-y-6">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
      >
        <!-- Order Header -->
        <div class="p-6 border-b dark:border-gray-700">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <div class="flex items-center space-x-4 mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Order {{ order.id }}</h3>
                <span class="px-3 py-1 text-sm font-medium rounded-full"
                      :class="getStatusColor(order.status)">
                  {{ formatStatus(order.status) }}
                </span>
              </div>
              <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{{ formatDate(order.createdAt) }}</span>
                <span>•</span>
                <span>{{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }}</span>
                <span>•</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">¥{{ order.total.toLocaleString() }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button
                v-if="['pending','confirmed'].includes(order.status)"
                @click="cancelOrder(order)"
                class="btn btn-outline text-sm text-red-600 border-red-600 hover:bg-red-50"
              >
                Cancel Order
              </button>
              <button
                @click="toggleOrderDetails(order.id)"
                class="btn btn-outline text-sm"
              >
                {{ expandedOrders.includes(order.id) ? 'Hide Details' : 'View Details' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Order Body (Expandable) -->
        <div v-if="expandedOrders.includes(order.id)" class="p-6">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">Shipments</h4>
          <div class="space-y-4">
            <div v-for="(shipment, index) in order.shipments" :key="shipment.id" class="border dark:border-gray-600 rounded-lg p-4">
              <div class="flex justify-between items-center mb-3">
                <p class="font-semibold text-gray-800 dark:text-gray-200">Shipment {{ index + 1 }} of {{ order.shipments.length }}</p>
                <button 
                  @click="openTrackingModal(shipment)"
                  class="btn btn-primary btn-sm"
                >
                  <Truck class="h-4 w-4 mr-1" />
                  Track Package
                </button>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Carrier: {{ shipment.carrier }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Tracking: {{ shipment.trackingNumber }}</p>
              
              <div class="mt-4">
                <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items in this shipment:</h5>
                <div class="flex space-x-2">
                  <img v-for="item in shipment.items" :key="item.productId" :src="item.image" :alt="item.name" class="h-12 w-12 rounded-md object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <TrackingModal 
      :is-open="isTrackingModalOpen" 
      :shipment="selectedShipment"
      @close="isTrackingModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Package, Truck } from 'lucide-vue-next';
import { allOrders } from '@/data/mockData';
import type { Order, Shipment } from '@/types';
import TrackingModal from '@/components/TrackingModal.vue';
import { NotificationService } from '@/services/notificationService';

const orders = ref<Order[]>(allOrders);
const statusFilter = ref('');
const expandedOrders = ref<string[]>([]);

const isTrackingModalOpen = ref(false);
const selectedShipment = ref<Shipment | null>(null);
const notificationService = NotificationService.getInstance();

const filteredOrders = computed(() => {
  if (!statusFilter.value) return orders.value;
  return orders.value.filter(order => order.status === statusFilter.value);
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
};

const getStatusColor = (status: Order['status']) => {
  const colors: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'partially-shipped': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const toggleOrderDetails = (orderId: string) => {
  const index = expandedOrders.value.indexOf(orderId);
  if (index > -1) {
    expandedOrders.value.splice(index, 1);
  } else {
    expandedOrders.value.push(orderId);
  }
};

const openTrackingModal = (shipment: Shipment) => {
  selectedShipment.value = shipment;
  isTrackingModalOpen.value = true;
};

const cancelOrder = async (order: Order) => {
  if (!confirm('Cancel this order?')) return;
  try {
    const res = await fetch(`/api/orders/${order.id}/cancel`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to cancel');
    order.status = 'cancelled';
    notificationService.notifyOrderStatusChange(order, 'cancelled');
  } catch (err) {
    alert('Unable to cancel order');
  }
};
</script>

<style scoped>
.form-select {
  @apply px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700;
}
</style>
