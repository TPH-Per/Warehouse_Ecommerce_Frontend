/**
 * Branches Store
 * Quản lý state của chi nhánh và tồn kho
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import branchesApi from '@/api/branches.api';

export interface Branch {
    Id: number;
    Name: string;
    Location?: string;
    Address?: string;
    Phone?: string;
}

export interface BranchStock {
    BranchId: number;
    BranchName: string;
    Location?: string;
    VariantId: number;
    VariantName?: string;
    Stock: number;
}

export const useBranchesStore = defineStore('branches', () => {
    // ========== STATE ==========
    const branches = ref<Branch[]>([]);
    const variantStocks = ref<BranchStock[]>([]);
    const isLoading = ref(false);
    const error = ref('');

    // ========== GETTERS ==========
    const hasBranches = computed(() => branches.value.length > 0);

    // Lấy danh sách chi nhánh có hàng
    const availableBranches = computed(() =>
        variantStocks.value.filter(s => s.Stock > 0)
    );

    // Tổng tồn kho của variant hiện tại
    const totalStock = computed(() =>
        variantStocks.value.reduce((sum, s) => sum + s.Stock, 0)
    );

    // ========== HELPER ==========
    const handleResponse = (data: any) => {
        const isSuccess = data.Success ?? data.success;
        const items = data.Data ?? data.data;
        const message = data.Message ?? data.message;
        return { isSuccess, items, message };
    };

    // ========== ACTIONS ==========

    /**
     * Lấy danh sách tất cả chi nhánh
     */
    const fetchBranches = async () => {
        if (branches.value.length > 0) return;

        isLoading.value = true;
        error.value = '';

        try {
            const response = await branchesApi.getAll();
            const { isSuccess, items, message } = handleResponse(response.data);

            if (isSuccess) {
                branches.value = items || [];
            } else {
                error.value = message || 'Lỗi khi tải chi nhánh';
            }
        } catch (err: any) {
            error.value = err.response?.data?.Message || 'Không thể tải chi nhánh';
            console.error('fetchBranches error:', err);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Lấy tồn kho theo variant ID
     */
    const fetchStockByVariant = async (variantId: number) => {
        isLoading.value = true;
        error.value = '';
        variantStocks.value = [];

        try {
            const response = await branchesApi.getStockByVariant(variantId);
            const { isSuccess, items, message } = handleResponse(response.data);

            if (isSuccess) {
                // Map response sang format chuẩn
                variantStocks.value = (items || []).map((s: any) => ({
                    BranchId: s.BranchId ?? s.branchId ?? s.branch_id,
                    BranchName: s.BranchName ?? s.branchName ?? s.branch_name ?? 'Chi nhánh',
                    Location: s.Location ?? s.location ?? s.BranchLocation ?? '',
                    VariantId: s.VariantId ?? s.variantId ?? s.variant_id ?? variantId,
                    VariantName: s.VariantName ?? s.variantName ?? '',
                    Stock: s.Stock ?? s.stock ?? s.Quantity ?? s.quantity ?? 0,
                }));
            } else {
                error.value = message || 'Lỗi khi tải tồn kho';
            }
        } catch (err: any) {
            error.value = err.response?.data?.Message || 'Không thể tải tồn kho';
            console.error('fetchStockByVariant error:', err);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Lấy tồn kho theo product ID (tất cả variants)
     */
    const fetchStockByProduct = async (productId: number) => {
        isLoading.value = true;
        error.value = '';

        try {
            const response = await branchesApi.getStockByProduct(productId);
            const { isSuccess, items, message } = handleResponse(response.data);

            if (isSuccess) {
                variantStocks.value = (items || []).map((s: any) => ({
                    BranchId: s.BranchId ?? s.branchId ?? s.branch_id,
                    BranchName: s.BranchName ?? s.branchName ?? s.branch_name ?? 'Chi nhánh',
                    Location: s.Location ?? s.location ?? '',
                    VariantId: s.VariantId ?? s.variantId ?? s.variant_id,
                    VariantName: s.VariantName ?? s.variantName ?? '',
                    Stock: s.Stock ?? s.stock ?? s.Quantity ?? s.quantity ?? 0,
                }));
            }
        } catch (err: any) {
            error.value = err.response?.data?.Message || 'Không thể tải tồn kho';
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Lọc tồn kho theo variant ID từ data đã có
     */
    const getStockForVariant = (variantId: number) => {
        return variantStocks.value.filter(s => s.VariantId === variantId);
    };

    /**
     * Clear stock data
     */
    const clearStocks = () => {
        variantStocks.value = [];
    };

    return {
        // State
        branches,
        variantStocks,
        isLoading,
        error,
        // Getters
        hasBranches,
        availableBranches,
        totalStock,
        // Actions
        fetchBranches,
        fetchStockByVariant,
        fetchStockByProduct,
        getStockForVariant,
        clearStocks,
    };
});
