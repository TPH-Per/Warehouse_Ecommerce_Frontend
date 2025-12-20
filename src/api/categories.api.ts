/**
 * Categories API Service
 * API cho danh mục sản phẩm
 */
import apiClient from '@/api/index';

export const categoriesApi = {
    /**
     * Lấy tất cả danh mục
     */
    getAll: () => {
        return apiClient.get('/categories');
    },

    /**
     * Lấy danh mục theo ID
     */
    getById: (id: number) => {
        return apiClient.get(`/categories/${id}`);
    },
};

export default categoriesApi;
