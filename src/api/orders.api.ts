/**
 * Orders API Service
 * Các API call liên quan đến đơn hàng
 * Yêu cầu: User phải đăng nhập (cookie authentication)
 */
import apiClient from '@/api';

// ========== INTERFACES ==========
export interface OrderItem {
    product_variant_id: number;
    product_id?: number;
    product_name: string;
    variant_name: string;
    quantity: number;
    price_at_purchase: number;
    subtotal: number;
    image_url?: string;
}

export interface Payment {
    id: number;
    payment_method_id: number;
    method_name: string;
    status: string;
    amount: number;
    transaction_code?: string;
    created_at?: string;
}

export interface Order {
    id: number;
    order_code: string;
    user_id: number;
    status: string; // 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    shipping_recipient_name: string;
    shipping_recipient_phone: string;
    shipping_address: string;
    sub_total: number;
    shipping_fee: number;
    discount_amount: number;
    total_amount: number;
    discount_id?: number;
    branch_id?: number;
    branch_name?: string;
    created_at: string;
    updated_at?: string;
    items: OrderItem[];
    payment?: Payment;
}

export interface CreateOrderRequest {
    BranchId: number; // Required - which branch to checkout from
    ShippingRecipientName: string;
    ShippingRecipientPhone: string;
    ShippingAddress: string;
    PaymentMethodId?: number;
    ShippingFee?: number;
    DiscountAmount?: number;
    DiscountId?: number;
    Notes?: string;
}

// ========== API METHODS ==========
export const ordersApi = {
    /**
     * Lấy danh sách đơn hàng của user hiện tại
     */
    getMyOrders: (params?: { status?: string; page?: number; limit?: number }) => {
        return apiClient.get('/orders', { params });
    },

    /**
     * Lấy chi tiết một đơn hàng
     */
    getOrderById: (orderId: number) => {
        return apiClient.get(`/orders/${orderId}`);
    },

    /**
     * Tạo đơn hàng mới (từ giỏ hàng)
     */
    createOrder: (data: CreateOrderRequest) => {
        return apiClient.post('/orders', data);
    },

    /**
     * Hủy đơn hàng (chỉ khi status = pending)
     */
    cancelOrder: (orderId: number, reason?: string) => {
        return apiClient.put(`/orders/${orderId}/cancel`, { Reason: reason });
    },

    /**
     * Xác nhận đã nhận hàng
     */
    confirmReceived: (orderId: number) => {
        return apiClient.put(`/orders/${orderId}/confirm-received`);
    },
};

export default ordersApi;
