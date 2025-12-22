/**
 * Cart API Service
 * Các API call liên quan đến giỏ hàng
 * Yêu cầu: User phải đăng nhập (cookie authentication)
 * 
 * LƯU Ý: Request body dùng PascalCase để phù hợp với C# backend
 */
import apiClient from '@/api';

// ========== INTERFACES ==========
export interface CartItem {
    Id: number;
    UserId: number;
    ProductVariantId: number;
    Quantity: number;
    Price: number;
    CreatedAt: string | null;
    UpdatedAt: string | null;
    // Joined data
    ProductId?: number;
    ProductName?: string;
    ProductSlug?: string;
    VariantName?: string;
    VariantSku?: string;
    VariantImageUrl?: string;
    OriginalPrice?: number;
    BranchId?: number;
    BranchName?: string;
    StockQuantity?: number;
}

export interface AddToCartRequest {
    productVariantId: number;
    quantity: number;
    price: number;
    branchId?: number;
}

export interface UpdateCartRequest {
    quantity: number;
}

export interface CartSummary {
    TotalItems: number;
    TotalQuantity: number;
    SubTotal: number;
    ShippingFee: number;
    DiscountAmount: number;
    DiscountCode: string | null;
    Total: number;
}

// ========== API METHODS ==========
export const cartApi = {
    /**
     * Lấy giỏ hàng của user hiện tại
     */
    getCart: () => {
        return apiClient.get('/cart');
    },

    /**
     * Thêm sản phẩm vào giỏ hàng
     * Nếu sản phẩm đã có trong giỏ -> tăng quantity
     * 
     * Request body dùng PascalCase cho C# backend
     */
    addToCart: (data: AddToCartRequest) => {
        return apiClient.post('/cart', {
            ProductVariantId: data.productVariantId,
            Quantity: data.quantity,
            Price: data.price || 0,
            BranchId: data.branchId || null
        });
    },

    /**
     * Cập nhật số lượng sản phẩm trong giỏ
     */
    updateQuantity: (cartItemId: number, data: UpdateCartRequest) => {
        return apiClient.put(`/cart/${cartItemId}`, {
            Quantity: data.quantity
        });
    },

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    removeItem: (cartItemId: number) => {
        return apiClient.delete(`/cart/${cartItemId}`);
    },

    /**
     * Xóa tất cả sản phẩm trong giỏ hàng
     */
    clearCart: () => {
        return apiClient.delete('/cart/clear');
    },

    /**
     * Lấy số lượng items trong giỏ (cho badge trên header)
     */
    getCartCount: () => {
        return apiClient.get('/cart/count');
    },

    /**
     * Áp dụng mã giảm giá
     */
    applyDiscount: (code: string, subTotal: number) => {
        return apiClient.post('/cart/apply-discount', {
            Code: code,
            SubTotal: subTotal
        });
    },

    /**
     * Xóa mã giảm giá đã áp dụng
     */
    removeDiscount: () => {
        return apiClient.delete('/cart/discount');
    },

    /**
     * Lấy tổng kết giỏ hàng
     */
    getSummary: () => {
        return apiClient.get('/cart/summary');
    },
};

export default cartApi;

