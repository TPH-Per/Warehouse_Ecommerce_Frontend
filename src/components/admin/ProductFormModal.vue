<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
        </h3>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <X class="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="flex-1 overflow-y-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Left Column -->
          <div class="md:col-span-2 space-y-6">
            <!-- Basic Info -->
            <div class="p-4 border rounded-lg dark:border-gray-700">
              <h4 class="font-medium mb-4 text-gray-700 dark:text-gray-300">Basic Information</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="productName" class="form-label">Product Name *</label>
                  <input type="text" id="productName" v-model="formData.name" class="form-input" required>
                </div>
                <div>
                  <label for="productSku" class="form-label">SKU *</label>
                  <input type="text" id="productSku" v-model="formData.sku" class="form-input" required>
                </div>
              </div>
              <div class="mt-4">
                <label for="productDescription" class="form-label">Description</label>
                <textarea id="productDescription" v-model="formData.description" rows="5" class="form-input"></textarea>
              </div>
            </div>
            
            <!-- Image Upload -->
            <div class="p-4 border rounded-lg dark:border-gray-700">
              <h4 class="font-medium mb-4 text-gray-700 dark:text-gray-300">Image</h4>
              <div class="flex items-center space-x-6">
                <div class="shrink-0">
                  <img class="h-24 w-24 object-cover rounded-md" :src="imagePreview || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/96x96/e2e8f0/e2e8f0'" alt="Current product image" />
                </div>
                <label class="block">
                  <span class="sr-only">Choose profile photo</span>
                  <input type="file" @change="handleFileChange" accept="image/png, image/jpeg" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"/>
                </label>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Note: In a real app, this file would be uploaded to a server. Here, we are creating a local preview.
              </p>
            </div>
            
            <!-- Pricing -->
            <div class="p-4 border rounded-lg dark:border-gray-700">
              <h4 class="font-medium mb-4 text-gray-700 dark:text-gray-300">Pricing</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="productPrice" class="form-label">Price (¥) *</label>
                  <input type="number" id="productPrice" v-model.number="formData.price" class="form-input" required min="0" step="0.01">
                </div>
                <div>
                  <label for="productCostPrice" class="form-label">Cost Price (¥)</label>
                  <input type="number" id="productCostPrice" v-model.number="formData.costPrice" class="form-input" min="0" step="0.01">
                </div>
              </div>
            </div>
            
            <!-- Shipping -->
            <div class="p-4 border rounded-lg dark:border-gray-700">
              <h4 class="font-medium mb-4 text-gray-700 dark:text-gray-300">Shipping</h4>
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label for="productWeight" class="form-label">Weight (kg)</label>
                  <input type="number" id="productWeight" v-model.number="formData.weight_kg" class="form-input" min="0" step="0.001">
                </div>
                <div>
                  <label for="dimL" class="form-label">Length (cm)</label>
                  <input type="number" id="dimL" v-model.number="dimensions.length" class="form-input" min="0">
                </div>
                <div>
                  <label for="dimW" class="form-label">Width (cm)</label>
                  <input type="number" id="dimW" v-model.number="dimensions.width" class="form-input" min="0">
                </div>
                <div>
                  <label for="dimH" class="form-label">Height (cm)</label>
                  <input type="number" id="dimH" v-model.number="dimensions.height" class="form-input" min="0">
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Status -->
            <div class="p-4 border rounded-lg dark:border-gray-700">
              <h4 class="font-medium mb-4 text-gray-700 dark:text-gray-300">Status</h4>
              <div class="flex items-center justify-between">
                <label for="isActive" class="form-label mb-0">Active</label>
                <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" id="isActive" v-model="formData.isActive" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                  <label for="isActive" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>

            <!-- Organization -->
            <div class="p-4 border rounded-lg dark:border-gray-700">
              <h4 class="font-medium mb-4 text-gray-700 dark:text-gray-300">Organization</h4>
              <div class="space-y-4">
                <div>
                  <label for="productCategory" class="form-label">Category</label>
                  <select id="productCategory" v-model="formData.categoryId" class="form-input">
                    <option :value="null">-- Select a category --</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Inventory -->
            <div class="p-4 border rounded-lg dark:border-gray-700">
              <h4 class="font-medium mb-4 text-gray-700 dark:text-gray-300">Inventory</h4>
              <div class="space-y-4">
                <div>
                  <label for="productStock" class="form-label">Stock Quantity</label>
                  <input type="number" id="productStock" v-model.number="formData.stock" class="form-input" required min="0">
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <!-- Footer -->
      <div class="p-6 border-t dark:border-gray-700 flex justify-end space-x-4 flex-shrink-0">
        <button @click="$emit('close')" class="btn btn-secondary">Cancel</button>
        <button @click="submitForm" class="btn btn-primary" :disabled="!isFormValid">
          {{ isEditMode ? 'Save Changes' : 'Create Product' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { X } from 'lucide-vue-next';
import type { Product, Category } from '@/types';

const props = defineProps<{
  isOpen: boolean;
  product: Product | null;
  categories: Category[];
}>();

const emit = defineEmits(['close', 'save']);

const isEditMode = computed(() => !!props.product);
const imagePreview = ref<string | null>(null);

const defaultFormData = (): Omit<Product, 'id' | 'isDeleted' | 'createdAt'> & { id?: string } => ({
  sku: '', name: '', description: null, categoryId: null, price: 0, costPrice: null, weight_kg: 0,
  dimensions_json: null, imageUrl: null, isActive: true,
  // Deprecated fields for compatibility
  series: '', character: '', manufacturer: '', scale: '', images: [], category: 'figure', condition: 'new',
  availability: 'in-stock', stock: 0, rating: 0, reviewCount: 0, tags: []
});

const formData = ref<any>(defaultFormData());
const dimensions = ref({ length: 0, width: 0, height: 0 });

const isFormValid = computed(() => {
  return formData.value.name && formData.value.sku && formData.value.price >= 0 && formData.value.stock >= 0;
});

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.value = { ...newProduct };
    imagePreview.value = newProduct.imageUrl;
    if (newProduct.dimensions_json) {
      try {
        dimensions.value = JSON.parse(newProduct.dimensions_json);
      } catch (e) {
        dimensions.value = { length: 0, width: 0, height: 0 };
      }
    } else {
      dimensions.value = { length: 0, width: 0, height: 0 };
    }
  } else {
    formData.value = defaultFormData();
    dimensions.value = { length: 0, width: 0, height: 0 };
    imagePreview.value = null;
  }
}, { immediate: true, deep: true });

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      imagePreview.value = result;
      formData.value.imageUrl = result; // Simulate upload by using the local data URL
    };
    reader.readAsDataURL(file);
  }
};

const submitForm = () => {
  if (!isFormValid.value) {
    alert('Please fill all required fields correctly.');
    return;
  }
  
  // Combine dimensions into JSON string
  if (dimensions.value.length > 0 || dimensions.value.width > 0 || dimensions.value.height > 0) {
    formData.value.dimensions_json = JSON.stringify(dimensions.value);
  } else {
    formData.value.dimensions_json = null;
  }

  emit('save', formData.value);
};
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}
.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500
  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-pink-400 dark:focus:border-pink-400;
}
.toggle-checkbox:checked {
  @apply: right-0 border-pink-600;
  right: 0;
  border-color: #db2777;
}
.toggle-checkbox:checked + .toggle-label {
  @apply: bg-pink-600;
  background-color: #db2777;
}
</style>
