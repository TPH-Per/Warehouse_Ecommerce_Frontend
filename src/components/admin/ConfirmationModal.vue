<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <div class="flex items-start space-x-4">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle class="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100" id="modal-title">{{ title }}</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
        <button 
          type="button" 
          @click="$emit('confirm')" 
          class="w-full sm:w-auto btn bg-red-600 text-white hover:bg-red-700"
        >
          Confirm
        </button>
        <button 
          type="button" 
          @click="$emit('close')" 
          class="w-full sm:w-auto btn btn-outline"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
}>();

defineEmits(['close', 'confirm']);
</script>
