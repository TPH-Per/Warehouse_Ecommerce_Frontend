/**
 * Categories Store
 * Quản lý state của danh mục
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import categoriesApi from '@/api/categories.api';

export interface Category {
    Id: number;
    Name: string;
    Slug?: string;
    Description?: string;
}

export const useCategoriesStore = defineStore('categories', () => {
    // ========== STATE ==========
    const categories = ref<Category[]>([]);
    const isLoading = ref(false);
    const error = ref('');

    // ========== GETTERS ==========
    const hasCategories = computed(() => categories.value.length > 0);

    // Chuyển đổi cho v-select (id, name)
    const categoryOptions = computed(() =>
        categories.value.map(c => ({
            id: c.Id,
            name: c.Name
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
    const fetchCategories = async () => {
        // Không fetch lại nếu đã có data
        if (categories.value.length > 0) return;

        isLoading.value = true;
        error.value = '';

        try {
            const response = await categoriesApi.getAll();
            const { isSuccess, items, message } = handleResponse(response.data);

            if (isSuccess) {
                categories.value = items || [];
            } else {
                error.value = message || 'Lỗi khi tải danh mục';
            }
        } catch (err: any) {
            error.value = err.response?.data?.Message || 'Không thể tải danh mục';
            console.error('fetchCategories error:', err);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        // State
        categories,
        isLoading,
        error,
        // Getters
        hasCategories,
        categoryOptions,
        // Actions
        fetchCategories,
    };
});
