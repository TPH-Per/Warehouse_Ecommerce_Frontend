import apiClient from '@/api/index.ts';

export const productsApi = {
  /**
   * Lấy tất cả sản phẩm
   */
  getAll: () => {
    return apiClient.get('/products');
  },

  /**
   * Lấy sản phẩm theo ID
   */
  getById: (id: number) => {
    return apiClient.get(`/products/${id}`);
  },

  /**
   * Lấy sản phẩm theo category
   */
  getByCategory: (categoryId: number) => {
    return apiClient.get(`/products/category/${categoryId}`);
  },

  /**
   * Tìm kiếm sản phẩm
   */
  search: (keyword: string) => {
    return apiClient.get('/products/search', {
      params: { q: keyword }
    });
  },
};

export default productsApi;


