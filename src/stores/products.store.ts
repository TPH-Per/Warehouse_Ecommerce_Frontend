import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import productsApi from '@/api/products.api';
import type { Product, ProductDetail } from '@/types/index.ts';

export const useProductsStore = defineStore('products', () => {

  const products = ref<Product[]>([]);
  const currentProduct = ref<ProductDetail | null>(null);
  const isLoading = ref(false);
  const error = ref('');
  const total = ref(0);

  // Lưu branch ID được chọn để filter sản phẩm theo chi nhánh
  const selectedBranchId = ref<number | null>(null);

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

  /**
   * Set branch ID để filter sản phẩm theo chi nhánh
   * @param branchId - ID của chi nhánh
   */
  const setSelectedBranch = (branchId: number | null) => {
    selectedBranchId.value = branchId;
  };

  /**
   * Lấy sản phẩm có trong kho của chi nhánh
   * Đây là hàm chính để lấy danh sách sản phẩm - chỉ hiển thị sản phẩm có tồn kho
   * @param branchId - Optional: ID chi nhánh cụ thể, nếu không truyền sẽ lấy sản phẩm có trong BẤT KỲ chi nhánh nào
   */
  const fetchProductsInStock = async (branchId?: number) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await productsApi.getProductsInStock(branchId);
      const { isSuccess, items, message, count } = handleResponse(response.data);

      if (isSuccess) {
        products.value = items || [];
        total.value = count || (items?.length ?? 0);
        console.log(`✅ Đã tải ${products.value.length} sản phẩm có trong kho`);
      } else {
        error.value = message || 'Lỗi khi tải sản phẩm';
      }
    } catch (err: any) {
      // Nếu API /products/in-stock chưa có, fallback về /products
      console.warn('⚠️ API /products/in-stock chưa có, sử dụng fallback /products');
      try {
        const fallbackResponse = await productsApi.getAll({ inStock: true });
        const { isSuccess, items, count } = handleResponse(fallbackResponse.data);
        if (isSuccess) {
          products.value = items || [];
          total.value = count || (items?.length ?? 0);
        }
      } catch (fallbackErr: any) {
        error.value = fallbackErr.response?.data?.Message || 'Không thể kết nối server';
        console.error('fetchProductsInStock error:', fallbackErr);
      }
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Flag để bật/tắt việc sử dụng API in-stock
   * Set = true khi database đã có đầy đủ dữ liệu inventory
   * Set = false khi muốn hiển thị tất cả sản phẩm active (để test)
   */
  const useInStockApi = ref(true); // ✅ BẬT - Chỉ hiển thị sản phẩm có trong kho

  /**
   * Lấy tất cả sản phẩm
   * Nếu useInStockApi = true: Chỉ lấy sản phẩm có trong kho (yêu cầu inventory)
   * Nếu useInStockApi = false: Lấy tất cả sản phẩm active (để test)
   */
  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      let response;

      if (useInStockApi.value) {
        // Chế độ production: Chỉ lấy sản phẩm có trong kho
        console.log('🏪 Đang sử dụng API in-stock...');
        response = await productsApi.getProductsInStock(selectedBranchId.value || undefined);
      } else {
        // Chế độ test: Lấy tất cả sản phẩm active
        console.log('📦 Đang sử dụng API products (all active)...');
        response = await productsApi.getAll();
      }

      const { isSuccess, items, message, count } = handleResponse(response.data);

      if (isSuccess) {
        products.value = items || [];
        total.value = count || (items?.length ?? 0);
        console.log(`✅ Đã tải ${products.value.length} sản phẩm`);
      } else {
        error.value = message || 'Lỗi khi tải sản phẩm';
      }
    } catch (err: any) {
      // Fallback nếu API lỗi
      console.warn('⚠️ API lỗi, thử fallback...');
      try {
        const fallbackResponse = await productsApi.getAll();
        const { isSuccess, items, count } = handleResponse(fallbackResponse.data);
        if (isSuccess) {
          products.value = items || [];
          total.value = count || (items?.length ?? 0);
        }
      } catch (fallbackErr: any) {
        error.value = fallbackErr.response?.data?.Message || 'Không thể kết nối server';
        console.error('fetchProducts error:', fallbackErr);
      }
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Lấy sản phẩm theo ID
   */
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

  /**
   * Lấy sản phẩm theo category (chỉ sản phẩm có trong kho)
   */
  const fetchByCategory = async (categoryId: number) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await productsApi.getByCategory(categoryId, selectedBranchId.value || undefined);
      const { isSuccess, items, count } = handleResponse(response.data);

      if (isSuccess) {
        products.value = items || [];
        total.value = count || (items?.length ?? 0);
      }
    } catch (err: any) {
      error.value = err.response?.data?.Message || 'Lỗi';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Tìm kiếm sản phẩm (chỉ sản phẩm có trong kho)
   */
  const searchProducts = async (keyword: string) => {
    if (!keyword.trim()) {
      products.value = [];
      return;
    }

    isLoading.value = true;
    error.value = '';

    try {
      const response = await productsApi.search(keyword, selectedBranchId.value || undefined);
      const { isSuccess, items, count } = handleResponse(response.data);

      if (isSuccess) {
        products.value = items || [];
        total.value = count || (items?.length ?? 0);
      }
    } catch (err: any) {
      error.value = err.response?.data?.Message || 'Lỗi tìm kiếm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Clear current product
   */
  const clearCurrentProduct = () => {
    currentProduct.value = null;
  };

  /**
   * Clear products list
   */
  const clearProducts = () => {
    products.value = [];
    total.value = 0;
  };

  return {
    // State
    products,
    currentProduct,
    isLoading,
    error,
    total,
    selectedBranchId,
    useInStockApi, // ⚠️ Flag để bật/tắt filter in-stock
    // Getters
    hasProducts,
    getProductCount,
    // Actions
    fetchProducts,
    fetchProductsInStock,
    fetchProductById,
    fetchByCategory,
    searchProducts,
    clearCurrentProduct,
    clearProducts,
    setSelectedBranch,
  };
});
