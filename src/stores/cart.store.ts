/**
 * Cart Store
 * Quản lý state giỏ hàng - sync với database
 * Yêu cầu: User phải đăng nhập để thêm/sửa/xóa
 */
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { cartApi, type CartItem, type AddToCartRequest } from '@/api/cart.api';
import { discountsApi, type Discount } from '@/api/discounts.api';
import { useAuthStore } from './auth.store';

export const useCartStore = defineStore('cart', () => {
    // ========== STATE ==========
    const items = ref<CartItem[]>([]);
    const isLoading = ref(false);
    const error = ref('');

    // Discount
    const appliedDiscount = ref<Discount | null>(null);
    const discountCode = ref('');
    const discountAmount = ref(0);
    const discountError = ref('');
    const isApplyingDiscount = ref(false);

    // Shipping
    const shippingFee = ref(30000); // Phí ship mặc định

    // ========== AUTH STORE ==========
    const authStore = useAuthStore();

    // ========== GETTERS ==========

    /**
     * Kiểm tra user đã đăng nhập chưa
     */
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    /**
     * Tổng số items (không phải quantity)
     */
    const itemCount = computed(() => items.value.length);

    /**
     * Tổng số lượng sản phẩm
     */
    const totalQuantity = computed(() => {
        return items.value.reduce((sum, item) => {
            const qty = item.Quantity ?? (item as any).quantity ?? 0;
            return sum + qty;
        }, 0);
    });

    /**
     * Tổng tiền tạm tính (chưa giảm giá, chưa ship)
     */
    const subTotal = computed(() => {
        return items.value.reduce((sum, item) => {
            const price = item.Price ?? (item as any).price ?? 0;
            const qty = item.Quantity ?? (item as any).quantity ?? 0;
            return sum + (price * qty);
        }, 0);
    });

    /**
     * Tổng tiền sau giảm giá + phí ship
     */
    const total = computed(() => {
        return Math.max(0, subTotal.value - discountAmount.value + shippingFee.value);
    });

    /**
     * Giỏ hàng có sản phẩm không
     */
    const hasItems = computed(() => items.value.length > 0);

    /**
     * Group items theo branch
     */
    const groupedByBranch = computed(() => {
        const groups: Record<number, { branch: { id: number; name: string; location?: string }; items: CartItem[] }> = {};

        items.value.forEach(item => {
            const branchId = item.BranchId ?? (item as any).branch_id ?? 0;
            const branchName = item.BranchName ?? (item as any).branch_name ?? 'Không xác định';

            if (!groups[branchId]) {
                groups[branchId] = {
                    branch: { id: branchId, name: branchName },
                    items: []
                };
            }
            groups[branchId].items.push(item);
        });

        return Object.values(groups);
    });

    // ========== HELPER ==========
    const handleResponse = (data: any) => {
        const isSuccess = data.Success ?? data.success;
        const result = data.Data ?? data.data;
        const message = data.Message ?? data.message;
        return { isSuccess, result, message };
    };

    const normalizeCartItem = (item: any): CartItem => {
        return {
            Id: item.Id ?? item.id,
            UserId: item.UserId ?? item.user_id,
            ProductVariantId: item.ProductVariantId ?? item.product_variant_id,
            Quantity: item.Quantity ?? item.quantity,
            Price: item.Price ?? item.price,
            CreatedAt: item.CreatedAt ?? item.created_at,
            UpdatedAt: item.UpdatedAt ?? item.updated_at,
            ProductId: item.ProductId ?? item.product_id,
            ProductName: item.ProductName ?? item.product_name,
            ProductSlug: item.ProductSlug ?? item.product_slug,
            VariantName: item.VariantName ?? item.variant_name,
            VariantSku: item.VariantSku ?? item.variant_sku,
            VariantImageUrl: item.VariantImageUrl ?? item.variant_image_url,
            OriginalPrice: item.OriginalPrice ?? item.original_price,
            BranchId: item.BranchId ?? item.branch_id,
            BranchName: item.BranchName ?? item.branch_name,
            StockQuantity: item.StockQuantity ?? item.stock_quantity,
        };
    };

    /**
     * Fetch giỏ hàng từ server
     */
    const fetchCart = async () => {
        if (!isAuthenticated.value) {
            items.value = [];
            return;
        }

        isLoading.value = true;
        error.value = '';

        try {
            const response = await cartApi.getCart();
            console.log('[CartStore] Raw API response:', response.data);

            const { isSuccess, result, message } = handleResponse(response.data);

            if (isSuccess && Array.isArray(result)) {
                items.value = result.map(normalizeCartItem);
                console.log('[CartStore] Normalized items:', items.value);
                console.log('[CartStore] Grouped by branch:', groupedByBranch.value);
            } else {
                // Không hiển thị lỗi nếu chỉ là empty cart
                items.value = [];
            }
        } catch (err: any) {
            // Xử lý lỗi 401 - im lặng, không log
            if (err.response?.status === 401) {
                items.value = [];
                return;
            }
            error.value = err.response?.data?.Message || 'Lỗi kết nối server';
            console.error('fetchCart error:', err);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Thêm sản phẩm vào giỏ hàng
     * Optimistic Update: Add vào Pinia trước, sau đó sync lên database
     * @returns Object với success và message
     */
    const addToCart = async (data: AddToCartRequest): Promise<{ success: boolean; message: string }> => {
        // Kiểm tra đăng nhập
        if (!isAuthenticated.value) {
            return {
                success: false,
                message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng'
            };
        }

        // Validate branchId
        if (!data.branchId || data.branchId <= 0) {
            return {
                success: false,
                message: 'Vui lòng chọn chi nhánh'
            };
        }

        isLoading.value = true;
        error.value = '';

        // Optimistic Update: Add to local state first
        const tempId = Date.now(); // Temporary ID
        const tempItem: CartItem = {
            Id: tempId,
            UserId: authStore.user?.id || 0,
            ProductVariantId: data.productVariantId,
            Quantity: data.quantity,
            Price: data.price,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: null,
            BranchId: data.branchId,
            BranchName: data.branchName || 'Đang tải...',
            ProductName: data.productName || '',
            VariantName: data.variantName || '',
            VariantImageUrl: data.imageUrl || '',
        };

        // Check if same variant + branch already exists
        const existingIndex = items.value.findIndex(item =>
            item.ProductVariantId === data.productVariantId &&
            item.BranchId === data.branchId
        );

        if (existingIndex >= 0 && items.value[existingIndex]) {
            // Update quantity of existing item
            items.value[existingIndex]!.Quantity += data.quantity;
        } else {
            // Add new item
            items.value.push(tempItem);
        }

        try {
            const response = await cartApi.addToCart(data);
            const { isSuccess, result, message } = handleResponse(response.data);

            if (isSuccess) {
                // Sync with server data to get real IDs
                await fetchCart();
                return { success: true, message: message || 'Đã thêm vào giỏ hàng' };
            } else {
                // Rollback: remove temp item or revert quantity
                if (existingIndex >= 0 && items.value[existingIndex]) {
                    items.value[existingIndex]!.Quantity -= data.quantity;
                } else {
                    const tempIndex = items.value.findIndex(i => i.Id === tempId);
                    if (tempIndex >= 0) items.value.splice(tempIndex, 1);
                }
                return { success: false, message: message || 'Không thể thêm vào giỏ hàng' };
            }
        } catch (err: any) {
            // Rollback on error
            if (existingIndex >= 0 && items.value[existingIndex]) {
                items.value[existingIndex]!.Quantity -= data.quantity;
            } else {
                const tempIndex = items.value.findIndex(i => i.Id === tempId);
                if (tempIndex >= 0) items.value.splice(tempIndex, 1);
            }

            // Xử lý lỗi 401 - session hết hạn
            if (err.response?.status === 401) {
                authStore.clearUser();
                return {
                    success: false,
                    message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
                };
            }

            const msg = err.response?.data?.Message || err.response?.data?.message || 'Không thể kết nối đến server';
            return { success: false, message: msg };
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Cập nhật số lượng
     */
    const updateQuantity = async (cartItemId: number, quantity: number): Promise<boolean> => {
        if (!isAuthenticated.value || quantity < 1) return false;

        try {
            const response = await cartApi.updateQuantity(cartItemId, { quantity });
            const { isSuccess } = handleResponse(response.data);

            if (isSuccess) {
                // Update local state
                const item = items.value.find(i => i.Id === cartItemId);
                if (item) {
                    item.Quantity = quantity;
                }
                return true;
            }
            return false;
        } catch (err) {
            console.error('updateQuantity error:', err);
            return false;
        }
    };

    /**
     * Tăng/giảm số lượng
     */
    const changeQuantity = async (cartItemId: number, delta: number) => {
        const item = items.value.find(i => i.Id === cartItemId);
        if (!item) return;

        const newQty = Math.max(1, item.Quantity + delta);
        await updateQuantity(cartItemId, newQty);
    };

    /**
     * Xóa sản phẩm khỏi giỏ
     */
    const removeItem = async (cartItemId: number): Promise<boolean> => {
        if (!isAuthenticated.value) return false;

        try {
            const response = await cartApi.removeItem(cartItemId);
            const { isSuccess } = handleResponse(response.data);

            if (isSuccess) {
                items.value = items.value.filter(i => i.Id !== cartItemId);
                return true;
            }
            return false;
        } catch (err) {
            console.error('removeItem error:', err);
            return false;
        }
    };

    /**
     * Xóa tất cả giỏ hàng
     */
    const clearCart = async (): Promise<boolean> => {
        if (!isAuthenticated.value) return false;

        try {
            const response = await cartApi.clearCart();
            const { isSuccess } = handleResponse(response.data);

            if (isSuccess) {
                items.value = [];
                discountCode.value = '';
                discountAmount.value = 0;
                appliedDiscount.value = null;
                return true;
            }
            return false;
        } catch (err) {
            console.error('clearCart error:', err);
            return false;
        }
    };

    /**
     * Áp dụng mã giảm giá
     */
    const applyDiscountCode = async (code: string): Promise<{ success: boolean; message: string }> => {
        if (!code.trim()) {
            return { success: false, message: 'Vui lòng nhập mã giảm giá' };
        }

        if (subTotal.value <= 0) {
            return { success: false, message: 'Giỏ hàng trống' };
        }

        isApplyingDiscount.value = true;
        discountError.value = '';

        try {
            // Gọi API validate discount
            const response = await discountsApi.validateCode(code);
            const { isSuccess, result, message } = handleResponse(response.data);

            if (!isSuccess) {
                discountError.value = message || 'Mã giảm giá không hợp lệ';
                return { success: false, message: discountError.value };
            }

            const discount = result as Discount;

            // Kiểm tra đơn hàng tối thiểu
            const minOrderAmount = discount.MinOrderAmount ?? (discount as any).min_order_amount ?? 0;
            if (minOrderAmount > 0 && subTotal.value < minOrderAmount) {
                const formatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(minOrderAmount);
                discountError.value = `Đơn hàng tối thiểu ${formatted} để áp dụng mã này`;
                return { success: false, message: discountError.value };
            }

            // Tính giá trị giảm
            const type = discount.Type ?? (discount as any).type;
            const value = discount.Value ?? (discount as any).value ?? 0;

            if (type === 'percentage') {
                discountAmount.value = Math.round((subTotal.value * value) / 100);
            } else {
                discountAmount.value = Math.min(value, subTotal.value);
            }

            discountCode.value = code.toUpperCase();
            appliedDiscount.value = discount;

            const formatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount.value);
            return { success: true, message: `Áp dụng thành công! Bạn được giảm ${formatted}` };

        } catch (err: any) {
            const msg = err.response?.data?.Message || 'Mã giảm giá không hợp lệ';
            discountError.value = msg;
            return { success: false, message: msg };
        } finally {
            isApplyingDiscount.value = false;
        }
    };

    /**
     * Xóa mã giảm giá
     */
    const removeDiscountCode = () => {
        discountCode.value = '';
        discountAmount.value = 0;
        appliedDiscount.value = null;
        discountError.value = '';
    };

    /**
     * Reset cart khi logout
     */
    const resetCart = () => {
        items.value = [];
        discountCode.value = '';
        discountAmount.value = 0;
        appliedDiscount.value = null;
        error.value = '';
    };

    // ========== WATCHERS ==========
    // Reset discount nếu subtotal thay đổi và không đủ điều kiện
    watch(subTotal, (newValue) => {
        if (appliedDiscount.value) {
            const minOrderAmount = appliedDiscount.value.MinOrderAmount ?? (appliedDiscount.value as any).min_order_amount ?? 0;
            if (minOrderAmount > 0 && newValue < minOrderAmount) {
                removeDiscountCode();
            }
        }
    });

    // Fetch cart khi auth state thay đổi
    watch(() => authStore.isAuthenticated, (isAuth) => {
        if (isAuth) {
            fetchCart();
        } else {
            resetCart();
        }
    });

    return {
        // State
        items,
        isLoading,
        error,
        appliedDiscount,
        discountCode,
        discountAmount,
        discountError,
        isApplyingDiscount,
        shippingFee,
        // Getters
        isAuthenticated,
        itemCount,
        totalQuantity,
        subTotal,
        total,
        hasItems,
        groupedByBranch,
        // Actions
        fetchCart,
        addToCart,
        updateQuantity,
        changeQuantity,
        removeItem,
        clearCart,
        applyDiscountCode,
        removeDiscountCode,
        resetCart,
    };
});
