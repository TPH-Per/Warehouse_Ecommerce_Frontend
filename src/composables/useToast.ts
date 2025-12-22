/**
 * Toast Notification Composable
 * Sử dụng Vuetify Snackbar để hiển thị thông báo đẹp
 */
import { ref, reactive } from 'vue';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timeout: number;
}

// State chia sẻ giữa các component
const toasts = ref<Toast[]>([]);
let toastId = 0;

export function useToast() {
    /**
     * Hiển thị toast notification
     */
    const show = (message: string, type: Toast['type'] = 'info', timeout: number = 3000) => {
        const id = ++toastId;
        toasts.value.push({ id, message, type, timeout });

        // Tự động xóa sau timeout
        setTimeout(() => {
            remove(id);
        }, timeout);

        return id;
    };

    /**
     * Hiển thị thông báo success
     */
    const success = (message: string, timeout: number = 3000) => {
        return show(message, 'success', timeout);
    };

    /**
     * Hiển thị thông báo error
     */
    const error = (message: string, timeout: number = 4000) => {
        return show(message, 'error', timeout);
    };

    /**
     * Hiển thị thông báo warning
     */
    const warning = (message: string, timeout: number = 3500) => {
        return show(message, 'warning', timeout);
    };

    /**
     * Hiển thị thông báo info
     */
    const info = (message: string, timeout: number = 3000) => {
        return show(message, 'info', timeout);
    };

    /**
     * Xóa toast theo ID
     */
    const remove = (id: number) => {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index > -1) {
            toasts.value.splice(index, 1);
        }
    };

    /**
     * Xóa tất cả toasts
     */
    const clear = () => {
        toasts.value = [];
    };

    return {
        toasts,
        show,
        success,
        error,
        warning,
        info,
        remove,
        clear,
    };
}

// Export singleton
export const toast = {
    success: (message: string, timeout?: number) => useToast().success(message, timeout),
    error: (message: string, timeout?: number) => useToast().error(message, timeout),
    warning: (message: string, timeout?: number) => useToast().warning(message, timeout),
    info: (message: string, timeout?: number) => useToast().info(message, timeout),
};
