<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Goods Receipt</h2>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Step 1: Select Purchase Order</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        This is a placeholder for the Goods Receipt Wizard. A full implementation would guide the user through selecting a PO, scanning barcodes to confirm items and quantities, and completing the receipt to update inventory levels.
      </p>
      <div class="max-w-md space-y-4">
        <select class="form-input">
          <option>PO-12345 - Good Smile Company (15 items open)</option>
          <option>PO-12346 - Alter (5 items open)</option>
        </select>
        <div class="relative">
          <input type="text" placeholder="Scan Barcode..." class="form-input pl-10 animate-pulse-border" />
          <ScanLine class="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500 h-5 w-5" />
        </div>
        <button class="btn btn-primary w-full">Start Receiving</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ScanLine } from 'lucide-vue-next';
</script>

<style scoped>
.form-input { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-pink-400 dark:focus:border-pink-400; }
@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0 0 rgba(219, 39, 119, 0.4); }
  50% { box-shadow: 0 0 0 4px rgba(219, 39, 119, 0); }
}
.animate-pulse-border {
  animation: pulse-border 2s infinite;
}
</style>
