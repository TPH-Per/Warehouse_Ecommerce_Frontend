<template>
  <div v-if="isOpen && order" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Order Details: {{ order.id }}
        </h3>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <X class="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left Column: Items & Summary -->
        <div class="md:col-span-2 space-y-6">
          <div>
            <h4 class="font-medium mb-2 text-gray-700 dark:text-gray-300">Items</h4>
            <div class="space-y-2">
              <div v-for="item in order.items" :key="item.productId" class="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <img :src="item.image" class="w-12 h-12 object-cover rounded-md mr-4">
                <div class="flex-1">
                  <p class="font-medium text-sm text-gray-800 dark:text-gray-200">{{ item.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Qty: {{ item.quantity }}</p>
                </div>
                <p class="font-medium text-sm text-gray-800 dark:text-gray-200">¥{{ (item.price * item.quantity).toLocaleString() }}</p>
              </div>
            </div>
          </div>
          <div>
            <h4 class="font-medium mb-2 text-gray-700 dark:text-gray-300">Pricing</h4>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Subtotal:</span><span>¥{{ order.subtotal.toLocaleString() }}</span></div>
              <div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Shipping:</span><span>¥{{ order.shippingCost.toLocaleString() }}</span></div>
              <div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Tax:</span><span>¥{{ order.tax.toLocaleString() }}</span></div>
              <div class="flex justify-between font-bold text-base border-t dark:border-gray-600 pt-2 mt-2"><span class="text-gray-800 dark:text-gray-200">Total:</span><span class="text-gray-800 dark:text-gray-200">¥{{ order.total.toLocaleString() }}</span></div>
            </div>
          </div>
        </div>

        <!-- Right Column: Customer & Shipping -->
        <div class="space-y-6">
          <div>
            <h4 class="font-medium mb-2 text-gray-700 dark:text-gray-300">Customer</h4>
            <div class="text-sm">
              <p class="font-semibold text-gray-800 dark:text-gray-200">{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</p>
              <p class="text-gray-600 dark:text-gray-400">{{ order.shippingAddress.phone }}</p>
            </div>
          </div>
          <div>
            <h4 class="font-medium mb-2 text-gray-700 dark:text-gray-300">Shipping Address</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <p>{{ order.shippingAddress.street }}</p>
              <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
              <p>{{ order.shippingAddress.country }}</p>
            </div>
          </div>
          <div>
            <h4 class="font-medium mb-2 text-gray-700 dark:text-gray-300">Payment</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <p>Method: {{ order.paymentMethod }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-6 border-t dark:border-gray-700 flex justify-end space-x-4 flex-shrink-0">
        <button v-if="order.status === 'pending'" @click="$emit('update-status', order.id, 'confirmed')" class="btn btn-secondary">Approve Order</button>
        <button v-if="['confirmed', 'processing'].includes(order.status)" @click="$emit('create-shipment', order)" class="btn btn-primary">Create Shipment</button>
        <button v-if="['pending', 'confirmed'].includes(order.status)" @click="$emit('update-status', order.id, 'cancelled')" class="btn btn-outline text-red-600 hover:bg-red-50">Cancel Order</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import type { Order } from '@/types';

defineProps<{
  isOpen: boolean;
  order: Order | null;
}>();

defineEmits(['close', 'update-status', 'create-shipment']);
</script>
