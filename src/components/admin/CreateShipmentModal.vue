<template>
  <div v-if="isOpen && order" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Create Shipment for Order {{ order.id }}
        </h3>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <X class="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- Form -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label for="trackingNumber" class="form-label">Tracking Number</label>
          <input type="text" id="trackingNumber" v-model="trackingNumber" class="form-input" placeholder="e.g., JP1234567890">
        </div>
        <div>
          <h4 class="form-label mb-2">Items to Ship</h4>
          <p v-if="unshippedItems.length === 0" class="text-sm text-gray-500">All items have been shipped.</p>
          <div v-else class="space-y-2">
            <label v-for="item in unshippedItems" :key="item.productId" class="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <input type="checkbox" v-model="selectedItems" :value="item" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded">
              <img :src="item.image" class="w-10 h-10 object-cover rounded-md mx-4">
              <div class="flex-1">
                <p class="font-medium text-sm">{{ item.name }}</p>
                <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t dark:border-gray-700 flex justify-end space-x-4">
        <button @click="$emit('close')" class="btn btn-secondary">Cancel</button>
        <button @click="handleSave" class="btn btn-primary" :disabled="selectedItems.length === 0">
          Save Shipment
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { X } from 'lucide-vue-next';
import type { Order, OrderItem } from '@/types';

const props = defineProps<{
  isOpen: boolean;
  order: Order | null;
}>();

const emit = defineEmits(['close', 'save']);

const trackingNumber = ref('');
const selectedItems = ref<OrderItem[]>([]);

const unshippedItems = computed(() => {
  return props.order?.items.filter(item => item.status !== 'shipped' && item.status !== 'delivered') || [];
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset form when modal opens
    trackingNumber.value = '';
    selectedItems.value = [...unshippedItems.value]; // Pre-select all unshipped items
  }
});

const handleSave = () => {
  if (props.order && selectedItems.value.length > 0) {
    emit('save', props.order.id, trackingNumber.value, selectedItems.value);
  }
};
</script>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
.form-input { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-pink-400 dark:focus:border-pink-400; }
</style>
