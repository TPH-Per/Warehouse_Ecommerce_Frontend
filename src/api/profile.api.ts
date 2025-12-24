import axios from './index'
import type { AxiosResponse } from 'axios'

// ========== TYPES ==========
export interface UserProfile {
    id: number
    name: string
    full_name: string
    email: string
    phone_number: string | null
    status: string
    role_id: number
    role_name: string
    email_verified_at?: string | null
    created_at: string
    updated_at: string
}

export interface UpdateProfileRequest {
    name?: string
    full_name?: string
    email?: string
    phone_number?: string
}

export interface ChangePasswordRequest {
    current_password: string
    new_password: string
    confirm_password: string
}

// Backend returns PascalCase, but we also support camelCase
export interface ApiResponse<T> {
    // camelCase (for frontend)
    success?: boolean
    message?: string
    data?: T
    // PascalCase (from backend)
    Success?: boolean
    Message?: string
    Data?: T
    IsAuthenticated?: boolean
}

// ========== API CALLS ==========

/**
 * Lấy thông tin profile của user hiện tại
 */
export const getProfile = (): Promise<AxiosResponse<ApiResponse<UserProfile>>> => {
    return axios.get('/profile/profile')
}

/**
 * Cập nhật thông tin profile
 */
export const updateProfile = (data: UpdateProfileRequest): Promise<AxiosResponse<ApiResponse<UserProfile>>> => {
    return axios.put('/profile/profile', data)
}

/**
 * Đổi mật khẩu
 */
export const changePassword = (data: ChangePasswordRequest): Promise<AxiosResponse<ApiResponse<null>>> => {
    return axios.post('/profile/change-password', data)
}

/**
 * Xác thực mật khẩu hiện tại (trước khi đổi mật khẩu)
 */
export const verifyPassword = (password: string): Promise<AxiosResponse<ApiResponse<boolean>>> => {
    return axios.post('/profile/verify-password', { password })
}

export default {
    getProfile,
    updateProfile,
    changePassword,
    verifyPassword
}
