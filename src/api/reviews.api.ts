// ==========================================
// Reviews API - Product Reviews
// File: src/api/reviews.api.ts
// ==========================================

import apiClient from './index';

// Interface cho Review từ API (PascalCase từ C#)
export interface ReviewApiResponse {
    UserId: number;
    ProductId: number;
    UserName: string;
    Rating: number;
    Comment: string;
    IsApproved: boolean;
    IsVerifiedPurchase: boolean;
    Status: string;
    CreatedAt: string;
    UpdatedAt?: string;
}

// Interface cho Review trong Frontend (camelCase)
export interface Review {
    user_id: number;
    product_id: number;
    user_name: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    is_verified_purchase: boolean;
    status: string;
    created_at: string;
    updated_at?: string;
}

// Interface cho request tạo review
export interface CreateReviewRequest {
    Rating: number;
    Comment: string;
}

// Interface cho API response
export interface ApiResponse<T> {
    Success: boolean;
    Data: T;
    Message?: string;
}

/**
 * Chuyển đổi Review từ API (PascalCase) sang Frontend (camelCase)
 */
const normalizeReview = (review: ReviewApiResponse): Review => ({
    user_id: review.UserId,
    product_id: review.ProductId,
    user_name: review.UserName,
    rating: review.Rating,
    comment: review.Comment,
    is_approved: review.IsApproved,
    is_verified_purchase: review.IsVerifiedPurchase,
    status: review.Status,
    created_at: review.CreatedAt,
    updated_at: review.UpdatedAt,
});

/**
 * Lấy danh sách reviews của sản phẩm
 */
export const getProductReviews = async (productId: number): Promise<Review[]> => {
    try {
        const response = await apiClient.get<ApiResponse<ReviewApiResponse[]>>(
            `/products/${productId}/reviews`
        );

        if (response.data.Success && response.data.Data) {
            return response.data.Data.map(normalizeReview);
        }

        return [];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
};

/**
 * Tạo review mới
 */
export const createReview = async (
    productId: number,
    data: CreateReviewRequest
): Promise<{ success: boolean; review?: Review; message?: string }> => {
    try {
        const response = await apiClient.post<ApiResponse<ReviewApiResponse>>(
            `/products/${productId}/reviews`,
            data
        );

        if (response.data.Success && response.data.Data) {
            return {
                success: true,
                review: normalizeReview(response.data.Data),
                message: response.data.Message || 'Đánh giá đã được gửi thành công!'
            };
        }

        return {
            success: false,
            message: response.data.Message || 'Không thể gửi đánh giá'
        };
    } catch (error: any) {
        console.error('Error creating review:', error);
        return {
            success: false,
            message: error.response?.data?.Message || 'Đã xảy ra lỗi khi gửi đánh giá'
        };
    }
};

/**
 * Lấy thống kê đánh giá của sản phẩm
 */
export const getReviewStats = async (productId: number) => {
    try {
        const response = await apiClient.get<ApiResponse<{
            TotalReviews: number;
            AverageRating: number;
            RatingBreakdown: Record<string, number>;
        }>>(`/products/${productId}/reviews/stats`);

        if (response.data.Success && response.data.Data) {
            return response.data.Data;
        }

        return null;
    } catch (error) {
        console.error('Error fetching review stats:', error);
        return null;
    }
};

export default {
    getProductReviews,
    createReview,
    getReviewStats,
};
