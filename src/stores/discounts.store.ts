/**
 * Discounts Store
 * Quản lý state của mã giảm giá
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { discountsApi, type Discount } from '@/api/discounts.api';

export const useDiscountsStore = defineStore('discounts', () => {
    // ========== STATE ==========
    const discounts = ref<Discount[]>([]);
    const isLoading = ref(false);
    const error = ref('');
    const copiedCode = ref<string | null>(null);

    // ========== GETTERS ==========
    const hasDiscounts = computed(() => discounts.value.length > 0);

    // Lọc discounts còn hiệu lực (client-side check thêm)
    const validDiscounts = computed(() => {
        const now = new Date();
        return discounts.value.filter(d => {
            const isActive = d.IsActive ?? (d as any).is_active;
            const startAt = d.StartAt ?? (d as any).start_at;
            const endAt = d.EndAt ?? (d as any).end_at;
            const maxUses = d.MaxUses ?? (d as any).max_uses;
            const usedCount = d.UsedCount ?? (d as any).used_count ?? 0;

            // Kiểm tra active
            if (!isActive) return false;

            // Kiểm tra thời gian bắt đầu
            if (startAt && new Date(startAt) > now) return false;

            // Kiểm tra thời gian kết thúc
            if (endAt && new Date(endAt) < now) return false;

            // Kiểm tra số lượt dùng
            if (maxUses && usedCount >= maxUses) return false;

            return true;
        });
    });

    // ========== HELPER: Xử lý response ==========
    const handleResponse = (data: any) => {
        const isSuccess = data.Success ?? data.success;
        const items = data.Data ?? data.data ?? [];
        const message = data.Message ?? data.message;
        return { isSuccess, items, message };
    };

    // ========== ACTIONS ==========

    /**
     * Lấy danh sách mã giảm giá active
     */
    const fetchActiveDiscounts = async () => {
        isLoading.value = true;
        error.value = '';

        try {
            const response = await discountsApi.getActiveDiscounts();
            const { isSuccess, items, message } = handleResponse(response.data);

            if (isSuccess) {
                discounts.value = items;
            } else {
                error.value = message || 'Không thể tải mã giảm giá';
            }
        } catch (err: any) {
            error.value = err.response?.data?.Message || 'Không thể kết nối server';
            console.error('fetchActiveDiscounts error:', err);

            // Fallback: thử gọi getAll nếu active endpoint chưa có
            try {
                const fallbackResponse = await discountsApi.getAll();
                const { isSuccess, items } = handleResponse(fallbackResponse.data);
                if (isSuccess) {
                    discounts.value = items;
                }
            } catch {
                // Ignore fallback error
            }
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Copy mã giảm giá vào clipboard
     */
    const copyDiscountCode = async (code: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(code);
            copiedCode.value = code;

            // Reset sau 3 giây
            setTimeout(() => {
                if (copiedCode.value === code) {
                    copiedCode.value = null;
                }
            }, 3000);

            return true;
        } catch {
            // Fallback cho browser cũ
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            copiedCode.value = code;
            setTimeout(() => {
                if (copiedCode.value === code) {
                    copiedCode.value = null;
                }
            }, 3000);

            return true;
        }
    };

    /**
     * Tính giá trị giảm từ mã
     */
    const calculateDiscount = (discount: Discount, orderTotal: number): number => {
        const type = discount.Type ?? (discount as any).type;
        const value = discount.Value ?? (discount as any).value ?? 0;
        const minOrderAmount = discount.MinOrderAmount ?? (discount as any).min_order_amount ?? 0;

        // Kiểm tra đơn hàng tối thiểu
        if (minOrderAmount && orderTotal < minOrderAmount) {
            return 0;
        }

        if (type === 'percentage') {
            return Math.round((orderTotal * value) / 100);
        } else {
            // fixed amount
            return Math.min(value, orderTotal);
        }
    };

    /**
     * Format giá trị giảm để hiển thị
     */
    const formatDiscountValue = (discount: Discount): string => {
        const type = discount.Type ?? (discount as any).type;
        const value = discount.Value ?? (discount as any).value ?? 0;

        if (type === 'percentage') {
            return `${value}%`;
        } else {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(value);
        }
    };

    return {
        // State
        discounts,
        isLoading,
        error,
        copiedCode,
        // Getters
        hasDiscounts,
        validDiscounts,
        // Actions
        fetchActiveDiscounts,
        copyDiscountCode,
        calculateDiscount,
        formatDiscountValue,
    };
});
