<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Product Management</h2>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <!-- Actions and Search -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div class="relative w-full md:w-1/3">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search products by name or SKU..." 
            class="w-full pl-10 pr-4 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" 
          />
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <button @click="openCreateModal" class="btn btn-primary w-full md:w-auto">
          <Plus class="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      <!-- Products Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700">
              <th class="py-3 px-4 font-medium">Product</th>
              <th class="py-3 px-4 font-medium">SKU</th>
              <th class="py-3 px-4 font-medium">Category</th>
              <th class="py-3 px-4 font-medium">Stock</th>
              <th class="py-3 px-4 font-medium">Price</th>
              <th class="py-3 px-4 font-medium">Status</th>
              <th class="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedProducts.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-500 dark:text-gray-400">No products found.</td>
            </tr>
            <tr v-for="product in paginatedProducts" :key="product.id" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="py-3 px-4 flex items-center">
                <img :src="product.imageUrl || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/40x40'" class="h-10 w-10 object-cover rounded-md mr-4" />
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ product.name }}</span>
              </td>
              <td class="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">{{ product.sku }}</td>
              <td class="py-3 px-4 capitalize text-gray-600 dark:text-gray-300">{{ getCategoryName(product.categoryId) }}</td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-300">{{ product.stock }}</td>
              <td class="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">¥{{ product.price.toLocaleString() }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 text-xs rounded-full font-medium" :class="product.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'">
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-end space-x-2">
                  <button @click="openEditModal(product)" class="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="openDeleteModal(product)" class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} of {{ filteredProducts.length }} products
        </span>
        <div class="flex items-center space-x-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft class="h-5 w-5" />
          </button>
          <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProductFormModal
      :is-open="isFormModalOpen"
      :product="selectedProductForEdit"
      :categories="allCategories"
      @close="closeFormModal"
      @save="handleSaveProduct"
    />
    <ConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Delete Product"
      :message="`Are you sure you want to delete the product '${productToDelete?.name}'? This action cannot be undone.`"
      @close="isDeleteModalOpen = false"
      @confirm="handleDeleteProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { allProducts, allCategories } from '@/data/mockData';
import type { Product } from '@/types';
import ProductFormModal from '@/components/admin/ProductFormModal.vue';
import ConfirmationModal from '@/components/admin/ConfirmationModal.vue';

const products = ref<Product[]>(allProducts);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedProductForEdit = ref<Product | null>(null);
const productToDelete = ref<Product | null>(null);

const filteredProducts = computed(() => {
  const activeProducts = products.value.filter(p => !p.isDeleted);
  if (!searchQuery.value) return activeProducts;
  const lowerQuery = searchQuery.value.toLowerCase();
  return activeProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) || p.sku.toLowerCase().includes(lowerQuery)
  );
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const getCategoryName = (categoryId: string | null) => {
  if (!categoryId) return 'N/A';
  return allCategories.find(c => c.id === categoryId)?.name || 'Unknown';
};

const openCreateModal = () => {
  selectedProductForEdit.value = null;
  isFormModalOpen.value = true;
};

const openEditModal = (product: Product) => {
  selectedProductForEdit.value = { ...product };
  isFormModalOpen.value = true;
};

const closeFormModal = () => {
  isFormModalOpen.value = false;
  selectedProductForEdit.value = null;
};

const handleSaveProduct = (productData: Product) => {
  if (selectedProductForEdit.value && selectedProductForEdit.value.id) {
    // Update existing product
    const index = products.value.findIndex(p => p.id === productData.id);
    if (index !== -1) {
      products.value[index] = productData;
    }
  } else {
    // Add new product
    products.value.unshift({ ...productData, id: `new-${Date.now()}` });
  }
  closeFormModal();
};

const openDeleteModal = (product: Product) => {
  productToDelete.value = product;
  isDeleteModalOpen.value = true;
};

const handleDeleteProduct = () => {
  if (productToDelete.value) {
    const index = products.value.findIndex(p => p.id === productToDelete.value?.id);
    if (index !== -1) {
      // Soft delete
      products.value[index].isDeleted = true;
    }
  }
  isDeleteModalOpen.value = false;
  productToDelete.value = null;
};
</script>
