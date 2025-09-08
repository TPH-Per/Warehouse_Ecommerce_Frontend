<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Stock Transfer</h2>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Create New Transfer</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        This is a placeholder for the Transfer Wizard. A full implementation would allow selecting source and destination warehouses, adding SKUs and quantities to transfer, and confirming the operation to create an in-transit record.
      </p>
      <div class="max-w-lg space-y-4">
        <div>
          <label class="form-label">Source Warehouse</label>
          <select class="form-input"></select>
        </div>
        <div>
          <label class="form-label">Destination Warehouse</label>
          <select class="form-input"></select>
        </div>
        <button class="btn btn-primary w-full">Start Transfer</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
.form-input { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-pink-400 dark:focus:border-pink-400; }
</style>
