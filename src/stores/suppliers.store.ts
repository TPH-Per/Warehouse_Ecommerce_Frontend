/**
 * Suppliers Store
 * Quản lý state của nhà cung cấp
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import suppliersApi from '@/api/suppliers.api';

export interface Supplier {
    Id: number;
    Name: string;
    ContactInfo?: string;
}

export const useSuppliersStore = defineStore('suppliers', () => {
    // ========== STATE ==========
    const suppliers = ref<Supplier[]>([]);
    const isLoading = ref(false);
    const error = ref('');

    // ========== GETTERS ==========
    const hasSuppliers = computed(() => suppliers.value.length > 0);

    // Chuyển đổi cho v-select (id, name)
    const supplierOptions = computed(() =>
        suppliers.value.map(s => ({
            id: s.Id,
            name: s.Name
        }))
    );

    // ========== HELPER ==========
    const handleResponse = (data: any) => {
        const isSuccess = data.Success ?? data.success;
        const items = data.Data ?? data.data;
        const message = data.Message ?? data.message;
        return { isSuccess, items, message };
    };

    // ========== ACTIONS ==========
    const fetchSuppliers = async () => {
        // Không fetch lại nếu đã có data
        if (suppliers.value.length > 0) return;

        isLoading.value = true;
        error.value = '';

        try {
            const response = await suppliersApi.getAll();
            const { isSuccess, items, message } = handleResponse(response.data);

            if (isSuccess) {
                suppliers.value = items || [];
            } else {
                error.value = message || 'Lỗi khi tải nhà cung cấp';
            }
        } catch (err: any) {
            error.value = err.response?.data?.Message || 'Không thể tải nhà cung cấp';
            console.error('fetchSuppliers error:', err);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        // State
        suppliers,
        isLoading,
        error,
        // Getters
        hasSuppliers,
        supplierOptions,
        // Actions
        fetchSuppliers,
    };
});
