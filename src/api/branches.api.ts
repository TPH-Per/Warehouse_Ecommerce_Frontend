/**
 * Branches API Service
 * API cho chi nhánh và tồn kho
 */
import apiClient from '@/api/index';

export const branchesApi = {
    /**
     * Lấy tất cả chi nhánh
     */
    getAll: () => {
        return apiClient.get('/branches');
    },

    /**
     * Lấy chi nhánh theo ID
     */
    getById: (id: number) => {
        return apiClient.get(`/branches/${id}`);
    },

    /**
     * Lấy tồn kho của 1 variant tại tất cả chi nhánh
     * @param variantId - ID của product variant
     */
    getStockByVariant: (variantId: number) => {
        return apiClient.get(`/branches/stock/variant/${variantId}`);
    },

    /**
     * Lấy tồn kho của 1 product tại tất cả chi nhánh
     * @param productId - ID của product
     */
    getStockByProduct: (productId: number) => {
        return apiClient.get(`/branches/stock/product/${productId}`);
    },
};

export default branchesApi;
