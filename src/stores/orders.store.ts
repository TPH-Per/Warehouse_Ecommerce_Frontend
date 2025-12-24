/**
 * Orders Store
 * Quản lý state đơn hàng - sync với database
 * Yêu cầu: User phải đăng nhập
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ordersApi, type Order, type CreateOrderRequest } from '@/api/orders.api';
import { useAuthStore } from './auth.store';
import { useCartStore } from './cart.store';

export const useOrdersStore = defineStore('orders', () => {
    // ========== STATE ==========
    const orders = ref<Order[]>([]);
    const currentOrder = ref<Order | null>(null);
    const isLoading = ref(false);
    const error = ref('');

    // ========== AUTH STORE ==========
    const authStore = useAuthStore();

    // ========== GETTERS ==========
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    /**
     * Tổng số đơn hàng
     */
    const totalOrders = computed(() => orders.value.length);

    /**
     * Đơn hàng theo status
     */
    const ordersByStatus = (status: string) => {
        if (status === 'all') return orders.value;
        return orders.value.filter(o => o.status === status);
    };

    /**
     * Đơn hàng pending (chưa xử lý)
     */
    const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'));

    /**
     * Đơn hàng đang xử lý
     */
    const processingOrders = computed(() => orders.value.filter(o => o.status === 'processing'));

    // ========== HELPER ==========
    const handleResponse = (data: any) => {
        const isSuccess = data.Success ?? data.success;
        const result = data.Data ?? data.data;
        const message = data.Message ?? data.message;
        return { isSuccess, result, message };
    };

    /**
     * Normalize order item từ API response (hỗ trợ cả PascalCase và camelCase)
     */
    const normalizeOrderItem = (item: any) => ({
        product_variant_id: item.ProductVariantId ?? item.product_variant_id,
        product_id: item.ProductId ?? item.product_id,
        product_name: item.ProductName ?? item.product_name ?? '',
        variant_name: item.VariantName ?? item.variant_name ?? '',
        quantity: item.Quantity ?? item.quantity ?? 0,
        price_at_purchase: item.PriceAtPurchase ?? item.price_at_purchase ?? 0,
        subtotal: item.Subtotal ?? item.subtotal ?? 0,
        image_url: item.ImageUrl ?? item.image_url ?? '',
    });

    /**
     * Normalize order từ API response
     */
    const normalizeOrder = (order: any): Order => ({
        id: order.Id ?? order.id,
        order_code: order.OrderCode ?? order.order_code ?? '',
        user_id: order.UserId ?? order.user_id,
        status: order.Status ?? order.status ?? 'pending',
        shipping_recipient_name: order.ShippingRecipientName ?? order.shipping_recipient_name ?? '',
        shipping_recipient_phone: order.ShippingRecipientPhone ?? order.shipping_recipient_phone ?? '',
        shipping_address: order.ShippingAddress ?? order.shipping_address ?? '',
        sub_total: order.SubTotal ?? order.sub_total ?? 0,
        shipping_fee: order.ShippingFee ?? order.shipping_fee ?? 0,
        discount_amount: order.DiscountAmount ?? order.discount_amount ?? 0,
        total_amount: order.TotalAmount ?? order.total_amount ?? 0,
        discount_id: order.DiscountId ?? order.discount_id,
        branch_id: order.BranchId ?? order.branch_id,
        branch_name: order.BranchName ?? order.branch_name ?? '',
        created_at: order.CreatedAt ?? order.created_at ?? '',
        updated_at: order.UpdatedAt ?? order.updated_at,
        items: (order.Items ?? order.items ?? []).map(normalizeOrderItem),
        payment: order.Payment ?? order.payment ? {
            id: (order.Payment ?? order.payment).Id ?? (order.Payment ?? order.payment).id,
            payment_method_id: (order.Payment ?? order.payment).PaymentMethodId ?? (order.Payment ?? order.payment).payment_method_id,
            method_name: (order.Payment ?? order.payment).MethodName ?? (order.Payment ?? order.payment).method_name ?? '',
            status: (order.Payment ?? order.payment).Status ?? (order.Payment ?? order.payment).status ?? '',
            amount: (order.Payment ?? order.payment).Amount ?? (order.Payment ?? order.payment).amount ?? 0,
            transaction_code: (order.Payment ?? order.payment).TransactionCode ?? (order.Payment ?? order.payment).transaction_code,
            created_at: (order.Payment ?? order.payment).CreatedAt ?? (order.Payment ?? order.payment).created_at,
        } : undefined,
    });

    // ========== ACTIONS ==========

    /**
     * Fetch đơn hàng của user hiện tại
     */
    const fetchOrders = async (status?: string) => {
        if (!isAuthenticated.value) {
            orders.value = [];
            return;
        }

        isLoading.value = true;
        error.value = '';

        try {
            const response = await ordersApi.getMyOrders({ status });
            const { isSuccess, result, message } = handleResponse(response.data);

            // DEBUG: Log raw response
            console.log('📦 [OrdersStore] Raw API Response:', response.data);
            console.log('📦 [OrdersStore] isSuccess:', isSuccess);
            console.log('📦 [OrdersStore] result:', result);

            if (isSuccess && Array.isArray(result)) {
                orders.value = result.map(normalizeOrder);
                console.log('📦 [OrdersStore] Normalized orders:', orders.value);
            } else if (isSuccess && result) {
                // Nếu result là object có data array
                const data = result.Data ?? result.data ?? result;
                if (Array.isArray(data)) {
                    orders.value = data.map(normalizeOrder);
                    console.log('📦 [OrdersStore] Normalized orders (from nested):', orders.value);
                }
            } else {
                orders.value = [];
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                orders.value = [];
                return;
            }
            error.value = err.response?.data?.Message || 'Không thể tải danh sách đơn hàng';
            console.error('fetchOrders error:', err);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Fetch chi tiết một đơn hàng
     */
    const fetchOrderById = async (orderId: number) => {
        if (!isAuthenticated.value) return null;

        isLoading.value = true;
        error.value = '';

        try {
            const response = await ordersApi.getOrderById(orderId);
            const { isSuccess, result } = handleResponse(response.data);

            if (isSuccess && result) {
                currentOrder.value = normalizeOrder(result);
                return currentOrder.value;
            }
            return null;
        } catch (err: any) {
            error.value = err.response?.data?.Message || 'Không thể tải chi tiết đơn hàng';
            console.error('fetchOrderById error:', err);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Tạo đơn hàng mới từ giỏ hàng
     */
    const createOrder = async (data: CreateOrderRequest): Promise<{ success: boolean; message: string; order?: Order }> => {
        if (!isAuthenticated.value) {
            return { success: false, message: 'Vui lòng đăng nhập để đặt hàng' };
        }

        isLoading.value = true;
        error.value = '';

        try {
            const response = await ordersApi.createOrder(data);
            const { isSuccess, result, message } = handleResponse(response.data);

            if (isSuccess && result) {
                const newOrder = normalizeOrder(result);
                orders.value.unshift(newOrder);

                // Clear cart sau khi đặt hàng thành công
                const cartStore = useCartStore();
                await cartStore.clearCart();

                return { success: true, message: message || 'Đặt hàng thành công!', order: newOrder };
            }

            return { success: false, message: message || 'Không thể tạo đơn hàng' };
        } catch (err: any) {
            const msg = err.response?.data?.Message || 'Không thể tạo đơn hàng';
            return { success: false, message: msg };
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Hủy đơn hàng
     */
    const cancelOrder = async (orderId: number, reason?: string): Promise<{ success: boolean; message: string }> => {
        if (!isAuthenticated.value) {
            return { success: false, message: 'Vui lòng đăng nhập' };
        }

        try {
            const response = await ordersApi.cancelOrder(orderId, reason);
            const { isSuccess, message } = handleResponse(response.data);

            if (isSuccess) {
                // Update local state
                const order = orders.value.find(o => o.id === orderId);
                if (order) {
                    order.status = 'cancelled';
                }
                return { success: true, message: message || 'Đã hủy đơn hàng' };
            }

            return { success: false, message: message || 'Không thể hủy đơn hàng' };
        } catch (err: any) {
            const msg = err.response?.data?.Message || 'Không thể hủy đơn hàng';
            return { success: false, message: msg };
        }
    };

    /**
     * Xác nhận đã nhận hàng
     */
    const confirmReceived = async (orderId: number): Promise<{ success: boolean; message: string }> => {
        if (!isAuthenticated.value) {
            return { success: false, message: 'Vui lòng đăng nhập' };
        }

        try {
            const response = await ordersApi.confirmReceived(orderId);
            const { isSuccess, message } = handleResponse(response.data);

            if (isSuccess) {
                // Update local state
                const order = orders.value.find(o => o.id === orderId);
                if (order) {
                    order.status = 'delivered';
                }
                return { success: true, message: message || 'Đã xác nhận nhận hàng' };
            }

            return { success: false, message: message || 'Không thể xác nhận' };
        } catch (err: any) {
            const msg = err.response?.data?.Message || 'Không thể xác nhận';
            return { success: false, message: msg };
        }
    };

    /**
     * Reset store
     */
    const resetOrders = () => {
        orders.value = [];
        currentOrder.value = null;
        error.value = '';
    };

    return {
        // State
        orders,
        currentOrder,
        isLoading,
        error,
        // Getters
        isAuthenticated,
        totalOrders,
        ordersByStatus,
        pendingOrders,
        processingOrders,
        // Actions
        fetchOrders,
        fetchOrderById,
        createOrder,
        cancelOrder,
        confirmReceived,
        resetOrders,
    };
});
