<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div class="p-6 border-b dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {{ warehouse?.id ? 'Edit Warehouse' : 'Create Warehouse' }}
        </h3>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <X class="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="flex-1 overflow-y-auto p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="warehouseCode" class="form-label">Code *</label>
            <input type="text" id="warehouseCode" v-model="formData.code" @input="formData.code = formData.code.toUpperCase()" class="form-input" required>
          </div>
          <div>
            <label for="warehouseName" class="form-label">Name *</label>
            <input type="text" id="warehouseName" v-model="formData.name" class="form-input" required>
          </div>
        </div>
        <div>
          <label for="warehouseManager" class="form-label">Manager</label>
          <input type="text" id="warehouseManager" v-model="formData.managerName" class="form-input">
        </div>
        <div>
          <label for="warehouseCity" class="form-label">City</label>
          <input type="text" id="warehouseCity" v-model="formData.city" class="form-input">
        </div>
        <div class="flex items-center justify-between">
          <label for="isActive" class="form-label mb-0">Status</label>
          <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" id="isActive" v-model="formData.isActive" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label for="isActive" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
        </div>
      </form>

      <div class="p-6 border-t dark:border-gray-700 flex justify-end space-x-4">
        <button @click="$emit('close')" class="btn btn-secondary">Cancel</button>
        <button @click="submitForm" class="btn btn-primary">Save Warehouse</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import type { Warehouse } from '@/types';

const props = defineProps<{
  isOpen: boolean;
  warehouse: Warehouse | null;
}>();

const emit = defineEmits(['close', 'save']);

const defaultFormData = (): Partial<Warehouse> => ({
  code: '',
  name: '',
  city: '',
  managerName: '',
  isActive: true,
  skuCount: 0,
});

const formData = ref<Partial<Warehouse>>(defaultFormData());

watch(() => props.warehouse, (newVal) => {
  formData.value = newVal ? { ...newVal } : defaultFormData();
}, { immediate: true });

const submitForm = () => {
  emit('save', formData.value);
};
</script>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
.form-input { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-pink-400 dark:focus:border-pink-400; }
.toggle-checkbox:checked { right: 0; border-color: #db2777; }
.toggle-checkbox:checked + .toggle-label { background-color: #db2777; }
</style>
