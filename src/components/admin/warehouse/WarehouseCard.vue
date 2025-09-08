<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-6 flex flex-col justify-between group transition-all hover:shadow-lg hover:-translate-y-1">
    <div>
      <div class="flex justify-between items-start">
        <div class="font-bold text-lg text-gray-800 dark:text-gray-100">{{ warehouse.name }}</div>
        <span 
          class="px-2 py-1 text-xs rounded-full font-medium"
          :class="warehouse.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'"
        >
          {{ warehouse.isActive ? 'Active' : 'Inactive' }}
        </span>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ warehouse.code }} • {{ warehouse.city }}</p>
    </div>
    <div class="mt-4 space-y-3">
      <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
        <User class="h-4 w-4 mr-2" />
        Manager: {{ warehouse.managerName }}
      </div>
      <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
        <Package class="h-4 w-4 mr-2" />
        {{ warehouse.skuCount.toLocaleString() }} SKUs
      </div>
    </div>
    <div class="mt-6 border-t dark:border-gray-700 pt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
      <div class="flex space-x-2">
        <button @click="$emit('edit', warehouse)" class="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Edit class="h-4 w-4" />
        </button>
        <button @click="$emit('view-zones', warehouse)" class="p-2 text-gray-400 hover:text-purple-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Grid3x3 class="h-4 w-4" />
        </button>
      </div>
      <button class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <Trash2 class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Package, Edit, Grid3x3, Trash2 } from 'lucide-vue-next';
import type { Warehouse } from '@/types';

defineProps<{
  warehouse: Warehouse;
}>();

defineEmits(['edit', 'view-zones']);
</script>
