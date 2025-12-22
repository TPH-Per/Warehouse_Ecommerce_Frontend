/**
 * Discounts API Service
 * Các API call liên quan đến mã giảm giá
 */
import apiClient from '@/api';

export interface Discount {
    Id: number;
    Code: string;
    Type: 'percentage' | 'fixed';  // percentage = giảm %, fixed = giảm số tiền cố định
    Value: number;
    MinOrderAmount: number | null;
    MaxUses: number | null;
    UsedCount: number;
    StartAt: string | null;
    EndAt: string | null;
    IsActive: boolean;
    CreatedAt: string | null;
    UpdatedAt: string | null;
}

export const discountsApi = {
    /**
     * Lấy tất cả mã giảm giá đang active và còn hiệu lực
     */
    getActiveDiscounts: () => {
        return apiClient.get('/discounts/active');
    },

    /**
     * Lấy tất cả mã giảm giá (admin)
     */
    getAll: () => {
        return apiClient.get('/discounts');
    },

    /**
     * Kiểm tra mã giảm giá có hợp lệ không
     */
    validateCode: (code: string) => {
        return apiClient.get(`/discounts/validate/${code}`);
    },

    /**
     * Áp dụng mã giảm giá vào đơn hàng
     */
    applyDiscount: (code: string, orderTotal: number) => {
        return apiClient.post('/discounts/apply', { code, orderTotal });
    },
};

export default discountsApi;
