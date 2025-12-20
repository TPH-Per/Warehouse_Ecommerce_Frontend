// ==========================================
// Types/Interfaces - Mapping từ Database Schema
// File: src/types/index.ts
// ==========================================

// ========== USER & AUTH ==========

export interface User {
    id: number;
    name: string;
    full_name: string;
    email: string;
    email_verified_at: string | null;
    role_id: number;
    phone_number: string | null;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    // Populated fields (từ relationship)
    role?: Role;
}

export interface Role {
    id: number;
    name: string;
    description: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    token_type: string;
    expires_in?: number;
}

// ========== CATEGORY ==========

export interface Category {
    id: number;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

// ========== SUPPLIER ==========

export interface Supplier {
    id: number;
    name: string;
    contact_info: string | null;
    created_at?: string;
    updated_at?: string;
}

// ========== PRODUCT ==========

export type ProductStatus = 'draft' | 'active' | 'inactive';

// export interface Product {
//     id: number;
//     category_id: number;
//     supplier_id: number;
//     name: string;
//     description: string | null;
//     slug: string;
//     status: ProductStatus;
//     created_at?: string;
//     updated_at?: string;
//     // Populated fields
//     category?: Category;
//     supplier?: Supplier;
//     variants?: ProductVariant[];
//     // Computed fields (từ backend)
//     images?: string[];
//     rating?: number;
//     review_count?: number;
//     min_price?: number;
//     max_price?: number;
// }

export interface Product{
  Id: number;
  Name: string;
  Slug: string;
  Description?: string;
  CategoryId?: number;
  CategoryName?: string;
  Price: number;
  OriginalPrice?: number;
  ImageUrl?: string;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    name: string;
    sku: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
    created_at?: string;
    updated_at?: string;
    // Computed fields
    stock?: number;
    // Populated
    product?: Product;
}

export interface ProductDetail extends Product {
  Category: {
    Id: number;
    Name: string;
  };
  Variants: Array<{
    Id: number;
    Name: string;
    Sku: string;
    Price: number;
    OriginalPrice?: number;
    ImageUrl?: string;
  }>;
}


// ========== ADDRESS ==========

export interface Address {
    id: number;
    user_id: number;
    recipient_name: string;
    recipient_phone: string;
    street_address: string;
    ward: string;
    district: string;
    city: string;
    is_default: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface AddressFormData {
    recipient_name: string;
    recipient_phone: string;
    street_address: string;
    ward: string;
    district: string;
    city: string;
    is_default: boolean;
}

// ========== CART ==========

export interface CartItem {
    id: number;
    user_id: number;
    product_variant_id: number;
    quantity: number;
    price: number;
    created_at?: string;
    updated_at?: string;
    // Populated fields
    product_variant?: ProductVariant;
    product?: Product;
}

// Dùng cho localStorage khi chưa đăng nhập
export interface CartItemLocal {
    product_variant_id: number;
    quantity: number;
    price: number;
    product_variant: ProductVariant;
    product: Product;
}

// ========== ORDER ==========

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
    id: number;
    user_id: number | null;
    order_code: string;
    status: OrderStatus;
    shipping_recipient_name: string | null;
    shipping_recipient_phone: string | null;
    shipping_address: string | null;
    sub_total: number;
    shipping_fee: number;
    discount_amount: number;
    total_amount: number;
    discount_id: number | null;
    branch_id: number | null;
    created_at?: string;
    updated_at?: string;
    // Populated fields
    items?: OrderItem[];
    payment?: Payment;
    branch?: Branch;
    discount?: Discount;
}

export interface OrderItem {
    order_id: number;
    product_variant_id: number;
    quantity: number;
    price_at_purchase: number;
    subtotal: number;
    created_at?: string;
    updated_at?: string;
    // Populated fields
    product_variant?: ProductVariant;
    product?: Product;
}

export interface CreateOrderRequest {
    address_id?: number;
    shipping_recipient_name: string;
    shipping_recipient_phone: string;
    shipping_address: string;
    payment_method_id: number;
    discount_code?: string;
    branch_id: number;
    items: {
        product_variant_id: number;
        quantity: number;
    }[];
}

// ========== PAYMENT ==========

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentMethod {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Payment {
    id: number;
    order_id: number;
    payment_method_id: number;
    amount: number;
    status: PaymentStatus;
    transaction_code: string | null;
    created_at?: string;
    updated_at?: string;
    // Populated
    payment_method?: PaymentMethod;
}

// ========== DISCOUNT ==========

export type DiscountType = 'percentage' | 'fixed';

export interface Discount {
    id: number;
    code: string;
    type: DiscountType;
    value: number;
    min_order_amount: number | null;
    max_uses: number | null;
    used_count: number;
    start_at: string | null;
    end_at: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

// ========== BRANCH & INVENTORY ==========

export interface Branch {
    id: number;
    name: string;
    warehouse_id: number | null;
    location: string | null;
    manager_user_id: number | null;
    created_at?: string;
    updated_at?: string;
}

export interface BranchInventory {
    id: number;
    branch_id: number;
    product_variant_id: number;
    quantity_on_hand: number;
    quantity_reserved: number;
    reorder_level: number;
    created_at?: string;
    updated_at?: string;
    // Computed
    available_quantity?: number; // quantity_on_hand - quantity_reserved
}

export interface Warehouse {
    id: number;
    name: string;
    location: string;
    created_at?: string;
    updated_at?: string;
}

export interface Inventory {
    id: number;
    product_variant_id: number;
    warehouse_id: number;
    quantity_on_hand: number;
    quantity_reserved: number;
    reorder_level: number;
    created_at?: string;
    updated_at?: string;
}

// ========== PRODUCT REVIEW ==========

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ProductReview {
    user_id: number;
    product_id: number;
    rating: number; // 1-5
    comment: string | null;
    is_approved: boolean;
    status: ReviewStatus;
    created_at?: string;
    updated_at?: string;
    // Populated
    user?: User;
    product?: Product;
}

export interface CreateReviewRequest {
    product_id: number;
    rating: number;
    comment?: string;
}

// ========== WISHLIST ==========

export interface WishlistItem {
    id: number;
    user_id: number;
    product_id: number;
    created_at?: string;
    // Populated
    product?: Product;
}

// Dùng cho localStorage khi chưa đăng nhập
export interface WishlistItemLocal {
    product_id: number;
    product: Product;
    added_at: string;
}

// ========== API RESPONSE TYPES ==========

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links?: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

// ========== FILTER & QUERY TYPES ==========

export interface ProductFilters {
    category_id?: number;
    category_slug?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: 'name' | 'price' | 'created_at' | 'rating';
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

export interface OrderFilters {
    status?: OrderStatus;
    page?: number;
    per_page?: number;
}
