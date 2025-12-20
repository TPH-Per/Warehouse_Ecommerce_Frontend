/**
 * Suppliers API Service
 * API cho nhà cung cấp
 */
import apiClient from '@/api/index';

export const suppliersApi = {
    /**
     * Lấy tất cả nhà cung cấp
     */
    getAll: () => {
        return apiClient.get('/suppliers');
    },

    /**
     * Lấy nhà cung cấp theo ID
     */
    getById: (id: number) => {
        return apiClient.get(`/suppliers/${id}`);
    },
};

export default suppliersApi;
