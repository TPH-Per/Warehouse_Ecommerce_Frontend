import axios from './index'
import type { AxiosResponse } from 'axios'

// ========== TYPES ==========
export interface Address {
    id: number
    user_id: number
    recipient_name: string
    recipient_phone: string
    street_address: string
    ward: string
    district: string
    city: string
    postal_code?: string
    is_default: boolean
    created_at?: string
    updated_at?: string
}

export interface CreateAddressRequest {
    recipient_name: string
    recipient_phone: string
    street_address: string
    ward: string
    district: string
    city: string
    postal_code?: string
    is_default?: boolean
}

export interface UpdateAddressRequest {
    recipient_name?: string
    recipient_phone?: string
    street_address?: string
    ward?: string
    district?: string
    city?: string
    postal_code?: string
    is_default?: boolean
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
 * Lấy danh sách địa chỉ của user
 */
export const getAddresses = (): Promise<AxiosResponse<ApiResponse<Address[]>>> => {
    return axios.get('/address')
}

/**
 * Lấy địa chỉ theo ID
 */
export const getAddress = (id: number): Promise<AxiosResponse<ApiResponse<Address>>> => {
    return axios.get(`/address/${id}`)
}

/**
 * Thêm địa chỉ mới
 */
export const createAddress = (data: CreateAddressRequest): Promise<AxiosResponse<ApiResponse<Address>>> => {
    return axios.post('/address', data)
}

/**
 * Cập nhật địa chỉ
 */
export const updateAddress = (id: number, data: UpdateAddressRequest): Promise<AxiosResponse<ApiResponse<Address>>> => {
    return axios.put(`/address/${id}`, data)
}

/**
 * Xóa địa chỉ
 */
export const deleteAddress = (id: number): Promise<AxiosResponse<ApiResponse<null>>> => {
    return axios.delete(`/address/${id}`)
}

/**
 * Đặt địa chỉ làm mặc định
 */
export const setDefaultAddress = (id: number): Promise<AxiosResponse<ApiResponse<Address>>> => {
    return axios.put(`/address/${id}/default`)
}

/**
 * Lấy địa chỉ mặc định
 */
export const getDefaultAddress = (): Promise<AxiosResponse<ApiResponse<Address | null>>> => {
    return axios.get('/address/default')
}

export default {
    getAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress
}
