/**
 * Wishlist Store
 * Quản lý danh sách yêu thích - Lưu trong localStorage
 * Yêu cầu: User phải đăng nhập để thêm/xóa
 * Lưu ý: Database không có bảng wishlists, nên dùng localStorage
 */
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from './auth.store';

// ========== INTERFACES ==========
export interface WishlistProduct {
    id: number;
    name: string;
    slug: string;
    status: 'active' | 'pre-order' | 'inactive';
    category: {
        id: number;
        name: string;
        slug: string;
    };
    supplier: {
        id: number;
        name: string;
    };
}

export interface WishlistVariant {
    id: number;
    name: string;
    sku: string;
    price: number;
    original_price?: number;
    image_url: string;
}

export interface WishlistItem {
    id: number; // Unique ID for the wishlist item (timestamp-based)
    product: WishlistProduct;
    variant: WishlistVariant;
    added_at: string;
}

// Key cho localStorage
const STORAGE_KEY = 'wibu-shop-wishlist';

export const useWishlistStore = defineStore('wishlist', () => {
    // ========== STATE ==========
    const items = ref<WishlistItem[]>([]);
    const isLoading = ref(false);

    // ========== AUTH STORE ==========
    const authStore = useAuthStore();

    // ========== GETTERS ==========
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    /**
     * Số lượng sản phẩm trong wishlist
     */
    const itemCount = computed(() => items.value.length);

    /**
     * Tổng giá trị wishlist
     */
    const totalValue = computed(() => {
        return items.value.reduce((sum, item) => sum + item.variant.price, 0);
    });

    /**
     * Kiểm tra wishlist có rỗng không
     */
    const isEmpty = computed(() => items.value.length === 0);

    /**
     * Lấy danh sách product IDs trong wishlist
     */
    const productIds = computed(() => items.value.map(item => item.product.id));

    /**
     * Lấy danh sách variant IDs trong wishlist
     */
    const variantIds = computed(() => items.value.map(item => item.variant.id));

    // ========== PRIVATE HELPERS ==========
    /**
     * Lấy key localStorage theo user
     * Nếu user đăng nhập -> dùng key riêng
     * Nếu chưa đăng nhập -> dùng key chung (sẽ merge khi login)
     */
    const getStorageKey = () => {
        if (authStore.user?.id) {
            return `${STORAGE_KEY}-${authStore.user.id}`;
        }
        return `${STORAGE_KEY}-guest`;
    };

    /**
     * Load wishlist từ localStorage
     */
    const loadFromStorage = () => {
        try {
            const key = getStorageKey();
            const stored = localStorage.getItem(key);
            if (stored) {
                items.value = JSON.parse(stored);
            } else {
                items.value = [];
            }
        } catch (error) {
            console.error('Error loading wishlist from localStorage:', error);
            items.value = [];
        }
    };

    /**
     * Save wishlist vào localStorage
     */
    const saveToStorage = () => {
        try {
            const key = getStorageKey();
            localStorage.setItem(key, JSON.stringify(items.value));
        } catch (error) {
            console.error('Error saving wishlist to localStorage:', error);
        }
    };

    /**
     * Merge guest wishlist vào user wishlist khi login
     */
    const mergeGuestWishlist = () => {
        try {
            const guestKey = `${STORAGE_KEY}-guest`;
            const guestStored = localStorage.getItem(guestKey);

            if (guestStored && authStore.user?.id) {
                const guestItems: WishlistItem[] = JSON.parse(guestStored);

                // Merge: thêm các item từ guest mà chưa có trong user wishlist
                guestItems.forEach(guestItem => {
                    const exists = items.value.some(
                        item => item.variant.id === guestItem.variant.id
                    );
                    if (!exists) {
                        items.value.push(guestItem);
                    }
                });

                // Xóa guest wishlist
                localStorage.removeItem(guestKey);

                // Save merged result
                saveToStorage();
            }
        } catch (error) {
            console.error('Error merging guest wishlist:', error);
        }
    };

    // ========== ACTIONS ==========
    /**
     * Khởi tạo wishlist - gọi khi app load
     */
    const initialize = () => {
        loadFromStorage();
    };

    /**
     * Kiểm tra sản phẩm có trong wishlist không (theo variant ID)
     */
    const isInWishlist = (variantId: number): boolean => {
        return items.value.some(item => item.variant.id === variantId);
    };

    /**
     * Kiểm tra sản phẩm có trong wishlist không (theo product ID)
     */
    const isProductInWishlist = (productId: number): boolean => {
        return items.value.some(item => item.product.id === productId);
    };

    /**
     * Thêm sản phẩm vào wishlist
     * @returns Object với success và message
     */
    const addToWishlist = (
        product: WishlistProduct,
        variant: WishlistVariant
    ): { success: boolean; message: string } => {
        // Kiểm tra đăng nhập
        if (!isAuthenticated.value) {
            return {
                success: false,
                message: 'Vui lòng đăng nhập để thêm vào danh sách yêu thích',
                requireLogin: true
            } as any;
        }

        // Kiểm tra đã tồn tại chưa
        if (isInWishlist(variant.id)) {
            return {
                success: false,
                message: 'Sản phẩm đã có trong danh sách yêu thích'
            };
        }

        // Thêm mới
        const newItem: WishlistItem = {
            id: Date.now(), // Unique ID
            product,
            variant,
            added_at: new Date().toISOString(),
        };

        items.value.push(newItem);
        saveToStorage();

        return {
            success: true,
            message: `Đã thêm "${product.name}" vào danh sách yêu thích`
        };
    };

    /**
     * Xóa sản phẩm khỏi wishlist (theo variant ID)
     */
    const removeFromWishlist = (variantId: number): { success: boolean; message: string } => {
        const index = items.value.findIndex(item => item.variant.id === variantId);

        if (index === -1) {
            return {
                success: false,
                message: 'Không tìm thấy sản phẩm trong danh sách'
            };
        }

        const removedItem = items.value[index];
        const productName = removedItem?.product?.name || 'sản phẩm';
        items.value.splice(index, 1);
        saveToStorage();

        return {
            success: true,
            message: `Đã xóa "${productName}" khỏi danh sách yêu thích`
        };
    };

    /**
     * Xóa sản phẩm khỏi wishlist (theo wishlist item ID)
     */
    const removeById = (itemId: number): { success: boolean; message: string } => {
        const index = items.value.findIndex(item => item.id === itemId);

        if (index === -1) {
            return {
                success: false,
                message: 'Không tìm thấy sản phẩm trong danh sách'
            };
        }

        const removedItem = items.value[index];
        const productName = removedItem?.product?.name || 'sản phẩm';
        items.value.splice(index, 1);
        saveToStorage();

        return {
            success: true,
            message: `Đã xóa "${productName}" khỏi danh sách yêu thích`
        };
    };

    /**
     * Toggle wishlist - thêm nếu chưa có, xóa nếu có
     */
    const toggleWishlist = (
        product: WishlistProduct,
        variant: WishlistVariant
    ): { success: boolean; message: string; added: boolean } => {
        // Kiểm tra đăng nhập
        if (!isAuthenticated.value) {
            return {
                success: false,
                message: 'Vui lòng đăng nhập để sử dụng danh sách yêu thích',
                added: false
            };
        }

        if (isInWishlist(variant.id)) {
            const result = removeFromWishlist(variant.id);
            return { ...result, added: false };
        } else {
            const result = addToWishlist(product, variant);
            return { ...result, added: true };
        }
    };

    /**
     * Xóa tất cả wishlist
     */
    const clearWishlist = (): { success: boolean; message: string } => {
        const count = items.value.length;
        items.value = [];
        saveToStorage();

        return {
            success: true,
            message: `Đã xóa ${count} sản phẩm khỏi danh sách yêu thích`
        };
    };

    /**
     * Reset wishlist khi logout
     */
    const resetWishlist = () => {
        items.value = [];
    };

    // ========== WATCHERS ==========
    // Khi user đăng nhập, load wishlist của user và merge guest wishlist
    watch(() => authStore.isAuthenticated, (isAuth, wasAuth) => {
        if (isAuth && !wasAuth) {
            // Vừa đăng nhập
            loadFromStorage();
            mergeGuestWishlist();
        } else if (!isAuth && wasAuth) {
            // Vừa logout
            resetWishlist();
        }
    });

    // Auto-save khi items thay đổi
    watch(items, () => {
        saveToStorage();
    }, { deep: true });

    return {
        // State
        items,
        isLoading,
        // Getters
        isAuthenticated,
        itemCount,
        totalValue,
        isEmpty,
        productIds,
        variantIds,
        // Actions
        initialize,
        isInWishlist,
        isProductInWishlist,
        addToWishlist,
        removeFromWishlist,
        removeById,
        toggleWishlist,
        clearWishlist,
        resetWishlist,
    };
});
