import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notification';
import { useAuth } from '@/composables/useAuth';
import type { NotificationType, NotificationCategory, NotificationPriority } from '@/types';

export const useNotifications = () => {
  const notificationStore = useNotificationStore();
  const { currentUser } = useAuth();
  
  const {
    notifications,
    preferences,
    isNotificationPanelOpen,
    unreadCount,
    unreadNotifications,
    notificationsByCategory,
    priorityNotifications
  } = storeToRefs(notificationStore);

  // Filter notifications by current user role
  const userNotifications = computed(() => {
    if (!currentUser.value) return [];
    return notificationStore.filterNotificationsByRole(currentUser.value.role);
  });

  const userUnreadCount = computed(() => {
    return userNotifications.value.filter(n => !n.isRead).length;
  });

  // Toast notification function
  const showToast = (
    message: string,
    type: NotificationType = 'info',
    duration: number = 5000
  ) => {
    const notification = notificationStore.createNotification(
      type === 'success' ? 'Thành công' : 
      type === 'error' ? 'Lỗi' : 
      type === 'warning' ? 'Cảnh báo' : 'Thông báo',
      message,
      type,
      'system',
      'medium',
      currentUser.value?.role || 'customer'
    );

    // Auto-remove toast notifications after duration
    if (duration > 0) {
      setTimeout(() => {
        notificationStore.deleteNotification(notification.id);
      }, duration);
    }

    return notification;
  };

  // Specific toast helpers
  const showSuccess = (message: string, duration?: number) => 
    showToast(message, 'success', duration);
  
  const showError = (message: string, duration?: number) => 
    showToast(message, 'error', duration);
  
  const showWarning = (message: string, duration?: number) => 
    showToast(message, 'warning', duration);
  
  const showInfo = (message: string, duration?: number) => 
    showToast(message, 'info', duration);

  // Manager-specific notifications
  const notifyManagerOrderUpdate = (orderId: string, status: string, customerName?: string) => {
    if (currentUser.value?.role === 'manager' || currentUser.value?.role === 'admin') {
      return notificationStore.notifyOrderUpdate(orderId, status, customerName);
    }
  };

  const notifyManagerLowStock = (productName: string, currentStock: number, threshold: number) => {
    if (currentUser.value?.role === 'manager' || currentUser.value?.role === 'admin') {
      return notificationStore.notifyLowStock(productName, currentStock, threshold);
    }
  };

  const notifyManagerNewReview = (productName: string, rating: number, customerName: string) => {
    if (currentUser.value?.role === 'manager' || currentUser.value?.role === 'admin') {
      return notificationStore.notifyNewReview(productName, rating, customerName);
    }
  };

  // Customer-specific notifications
  const notifyCustomerOrderStatus = (orderId: string, status: string) => {
    if (currentUser.value?.role === 'customer') {
      return notificationStore.notifyOrderStatusForCustomer(orderId, status);
    }
  };

  const notifyCustomerPriceDrop = (productName: string, oldPrice: number, newPrice: number) => {
    if (currentUser.value?.role === 'customer') {
      return notificationStore.notifyWishlistPriceDrop(productName, oldPrice, newPrice);
    }
  };

  // Notification actions
  const markAsRead = (notificationId: string) => {
    notificationStore.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    notificationStore.markAllAsRead();
  };

  const deleteNotification = (notificationId: string) => {
    notificationStore.deleteNotification(notificationId);
  };

  const togglePanel = () => {
    notificationStore.toggleNotificationPanel();
  };

  const closePanel = () => {
    notificationStore.closeNotificationPanel();
  };

  // Preferences
  const updatePreferences = (newPreferences: Parameters<typeof notificationStore.updatePreferences>[0]) => {
    notificationStore.updatePreferences(newPreferences);
  };

  return {
    // State
    notifications,
    userNotifications,
    preferences,
    isNotificationPanelOpen,
    
    // Computed
    unreadCount,
    userUnreadCount,
    unreadNotifications,
    notificationsByCategory,
    priorityNotifications,
    
    // Toast functions
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Role-specific notifications
    notifyManagerOrderUpdate,
    notifyManagerLowStock,
    notifyManagerNewReview,
    notifyCustomerOrderStatus,
    notifyCustomerPriceDrop,
    
    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    togglePanel,
    closePanel,
    updatePreferences,
  };
};