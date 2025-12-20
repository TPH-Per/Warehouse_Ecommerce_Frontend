import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import productsApi from '@/api/products.api';
import type {Product, ProductDetail} from '@/types/index.ts';

export const useProductsStore = defineStore('products', () => {

    const products = ref<Product[]>([]);
    const currentProduct = ref<ProductDetail | null>(null);
    const isLoading = ref(false);
    const error = ref('');
    const total = ref(0);

    const hasProducts = computed(() => products.value.length > 0);
    const getProductCount = computed(() => products.value.length);

    const handleResponse = (data: any) => {
    // Hỗ trợ cả PascalCase và camelCase
    const isSuccess = data.Success ?? data.success;
    const items = data.Data ?? data.data;
    const message = data.Message ?? data.message;
    const count = data.Total ?? data.total ?? 0;

    return { isSuccess, items, message, count };
  };

    const fetchProducts = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await productsApi.getAll();
      const { isSuccess, items, message, count } = handleResponse(response.data);

      if (isSuccess) {
        products.value = items || [];
        total.value = count;
      } else {
        error.value = message || 'Lỗi khi tải sản phẩm';
      }
    } catch (err: any) {
      error.value = err.response?.data?.Message || 'Không thể kết nối server';
      console.error('fetchProducts error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProductById = async (id: number) => {
    isLoading.value = true;
    error.value = '';
    currentProduct.value = null;

    try {
      const response = await productsApi.getById(id);
      const { isSuccess, items, message } = handleResponse(response.data);

      if (isSuccess) {
        currentProduct.value = items;
      } else {
        error.value = message || 'Không tìm thấy sản phẩm';
      }
    } catch (err: any) {
      error.value = err.response?.data?.Message || 'Không thể tải sản phẩm';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchByCategory = async (categoryId: number) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await productsApi.getByCategory(categoryId);
      const { isSuccess, items, count } = handleResponse(response.data);

      if (isSuccess) {
        products.value = items || [];
        total.value = count;
      }
    } catch (err: any) {
      error.value = err.response?.data?.Message || 'Lỗi';
    } finally {
      isLoading.value = false;
    }
  };

  const searchProducts = async (keyword: string) => {
    if (!keyword.trim()) {
      products.value = [];
      return;
    }

    isLoading.value = true;
    error.value = '';

    try {
      const response = await productsApi.search(keyword);
      const { isSuccess, items, count } = handleResponse(response.data);

      if (isSuccess) {
        products.value = items || [];
        total.value = count;
      }
    } catch (err: any) {
      error.value = err.response?.data?.Message || 'Lỗi tìm kiếm';
    } finally {
      isLoading.value = false;
    }
  };

  const clearCurrentProduct = () => {
    currentProduct.value = null;
  };

  return {
    // State
    products,
    currentProduct,
    isLoading,
    error,
    total,
    // Getters
    hasProducts,
    getProductCount,
    // Actions
    fetchProducts,
    fetchProductById,
    fetchByCategory,
    searchProducts,
    clearCurrentProduct,
  };


});