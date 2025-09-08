<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Order Management</h2>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700">
              <th class="py-3 px-4 font-medium">Order ID</th>
              <th class="py-3 px-4 font-medium">Date</th>
              <th class="py-3 px-4 font-medium">Customer</th>
              <th class="py-3 px-4 font-medium">Total</th>
              <th class="py-3 px-4 font-medium">Status</th>
              <th class="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
             <tr v-if="orders.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500 dark:text-gray-400">No orders found.</td>
            </tr>
            <tr v-for="order in orders" :key="order.id" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">{{ order.id }}</td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-300">{{ new Date(order.createdAt).toLocaleDateString() }}</td>
              <td class="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</td>
              <td class="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">¥{{ order.total.toLocaleString() }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 text-xs rounded-full font-medium" :class="getStatusColor(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button @click="viewOrder(order)" class="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Eye class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <OrderDetailModal 
      :is-open="isDetailModalOpen"
      :order="selectedOrder"
      @close="isDetailModalOpen = false"
      @update-status="updateOrderStatus"
      @create-shipment="openShipmentModal"
    />

    <CreateShipmentModal
      :is-open="isShipmentModalOpen"
      :order="selectedOrder"
      @close="isShipmentModalOpen = false"
      @save="saveShipment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Eye } from 'lucide-vue-next';
import { generateMockOrders } from '@/data/mockData';
import type { Order, OrderItem } from '@/types';
import OrderDetailModal from '@/components/admin/OrderDetailModal.vue';
import CreateShipmentModal from '@/components/admin/CreateShipmentModal.vue';

const orders = ref<Order[]>(generateMockOrders(20));
const selectedOrder = ref<Order | null>(null);
const isDetailModalOpen = ref(false);
const isShipmentModalOpen = ref(false);

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const viewOrder = (order: Order) => {
  selectedOrder.value = order;
  isDetailModalOpen.value = true;
};

const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const order = orders.value.find(o => o.id === orderId);
  if (order) {
    order.status = status;
  }
  isDetailModalOpen.value = false;
};

const openShipmentModal = (order: Order) => {
  selectedOrder.value = order;
  isDetailModalOpen.value = false;
  isShipmentModalOpen.value = true;
};

const saveShipment = (orderId: string, trackingNumber: string, shippedItems: OrderItem[]) => {
  const order = orders.value.find(o => o.id === orderId);
  if (order) {
    order.trackingNumber = trackingNumber;
    order.status = 'shipped';
    shippedItems.forEach(shippedItem => {
      const itemInOrder = order.items.find(i => i.productId === shippedItem.productId);
      if(itemInOrder) {
        itemInOrder.status = 'shipped';
      }
    });
  }
  isShipmentModalOpen.value = false;
};
</script>
