import axios from './index'
import type { AxiosResponse } from 'axios'

// ========== TYPES ==========
export interface Review {
    id: number
    user_id: number
    product_id: number
    product_name?: string
    product_image?: string
    rating: number
    comment: string
    is_approved: boolean
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at?: string
}

export interface CreateReviewRequest {
    ProductId: number
    Rating: number
    Comment: string
}

export interface UpdateReviewRequest {
    Rating?: number
    Comment?: string
}


// Backend returns PascalCase, but we also support camelCase
export interface ApiResponse<T> {
    // camelCase (for frontend)
    success?: boolean
    message?: string
    data?: T
    total?: number
    // PascalCase (from backend)
    Success?: boolean
    Message?: string
    Data?: T
    Total?: number
    IsAuthenticated?: boolean
}

// ========== API CALLS ==========

/**
 * Lấy danh sách đánh giá của user hiện tại
 */
export const getMyReviews = (): Promise<AxiosResponse<ApiResponse<Review[]>>> => {
    return axios.get('/reviews/my')
}

/**
 * Lấy đánh giá của sản phẩm
 */
export const getProductReviews = (productId: number): Promise<AxiosResponse<ApiResponse<Review[]>>> => {
    return axios.get(`/reviews/product/${productId}`)
}

/**
 * Tạo đánh giá mới
 */
export const createReview = (data: CreateReviewRequest): Promise<AxiosResponse<ApiResponse<Review>>> => {
    return axios.post('/reviews', data)
}

/**
 * Cập nhật đánh giá
 */
export const updateReview = (id: number, data: UpdateReviewRequest): Promise<AxiosResponse<ApiResponse<Review>>> => {
    return axios.put(`/reviews/${id}`, data)
}

/**
 * Xóa đánh giá
 */
export const deleteReview = (id: number): Promise<AxiosResponse<ApiResponse<null>>> => {
    return axios.delete(`/reviews/${id}`)
}

export default {
    getMyReviews,
    getProductReviews,
    createReview,
    updateReview,
    deleteReview
}
