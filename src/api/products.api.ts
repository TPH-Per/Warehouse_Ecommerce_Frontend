import apiClient from '@/api/index.ts';

export interface ProductsQueryParams {
  branchId?: number;
  categoryId?: number;
  supplierId?: number;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
}

export const productsApi = {
  /**
   * Lấy tất cả sản phẩm
   * @param params - Query parameters for filtering
   */
  getAll: (params?: ProductsQueryParams) => {
    return apiClient.get('/products', { params });
  },

  /**
   * Lấy sản phẩm có trong kho của chi nhánh
   * Endpoint này chỉ trả về sản phẩm có quantity_on_hand > 0 trong branch_inventories
   * @param branchId - Optional branch ID to filter, if not provided returns products available in ANY branch
   */
  getProductsInStock: (branchId?: number) => {
    const params: Record<string, any> = { inStock: true };
    if (branchId) {
      params.branchId = branchId;
    }
    return apiClient.get('/products/in-stock', { params });
  },

  /**
   * Lấy sản phẩm theo ID
   */
  getById: (id: number) => {
    return apiClient.get(`/products/${id}`);
  },

  /**
   * Lấy sản phẩm theo category (chỉ sản phẩm có trong kho)
   * @param categoryId - Category ID
   * @param branchId - Optional branch ID to filter by branch inventory
   */
  getByCategory: (categoryId: number, branchId?: number) => {
    const params: Record<string, any> = {};
    if (branchId) {
      params.branchId = branchId;
    }
    return apiClient.get(`/products/category/${categoryId}`, { params });
  },

  /**
   * Tìm kiếm sản phẩm (chỉ sản phẩm có trong kho)
   * @param keyword - Search keyword
   * @param branchId - Optional branch ID to filter by branch inventory
   */
  search: (keyword: string, branchId?: number) => {
    const params: Record<string, any> = { q: keyword };
    if (branchId) {
      params.branchId = branchId;
    }
    return apiClient.get('/products/search', { params });
  },
};

export default productsApi;


