import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  Notification, 
  NotificationType, 
  NotificationCategory, 
  NotificationPriority, 
  NotificationPreferences,
  UserRole 
} from '@/types';
import { faker } from '@faker-js/faker';

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([]);
  const preferences = ref<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    categories: {
      order: true,
      product: true,
      system: true,
      promotion: true,
      review: true,
      inventory: true,
      user: true,
    },
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
  });
  const isNotificationPanelOpen = ref(false);

  // Getters
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.isRead).length
  );

  const unreadNotifications = computed(() =>
    notifications.value.filter(n => !n.isRead)
  );

  const notificationsByCategory = computed(() => {
    const grouped: Record<NotificationCategory, Notification[]> = {
      order: [],
      product: [],
      system: [],
      promotion: [],
      review: [],
      inventory: [],
      user: [],
    };
    
    notifications.value.forEach(notification => {
      grouped[notification.category].push(notification);
    });
    
    return grouped;
  });

  const priorityNotifications = computed(() =>
    notifications.value.filter(n => n.priority === 'urgent' || n.priority === 'high')
  );

  // Actions
  const createNotification = (
    title: string,
    message: string,
    type: NotificationType = 'info',
    category: NotificationCategory = 'system',
    priority: NotificationPriority = 'medium',
    targetRole: UserRole | 'all' = 'all',
    options?: {
      targetUserId?: string;
      actionUrl?: string;
      actionLabel?: string;
      data?: Record<string, any>;
      expiresAt?: string;
    }
  ): Notification => {
    const notification: Notification = {
      id: faker.string.uuid(),
      title,
      message,
      type,
      category,
      priority,
      targetRole,
      targetUserId: options?.targetUserId,
      isRead: false,
      actionUrl: options?.actionUrl,
      actionLabel: options?.actionLabel,
      data: options?.data,
      createdAt: new Date().toISOString(),
      expiresAt: options?.expiresAt,
    };

    notifications.value.unshift(notification);
    return notification;
  };

  const markAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();
    }
  };

  const markAllAsRead = () => {
    const now = new Date().toISOString();
    notifications.value.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        notification.readAt = now;
      }
    });
  };

  const deleteNotification = (notificationId: string) => {
    const index = notifications.value.findIndex(n => n.id === notificationId);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearAllNotifications = () => {
    notifications.value = [];
  };

  const filterNotificationsByRole = (userRole: UserRole) => {
    return notifications.value.filter(n => 
      n.targetRole === 'all' || n.targetRole === userRole
    );
  };

  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    preferences.value = { ...preferences.value, ...newPreferences };
  };

  const toggleNotificationPanel = () => {
    isNotificationPanelOpen.value = !isNotificationPanelOpen.value;
  };

  const closeNotificationPanel = () => {
    isNotificationPanelOpen.value = false;
  };

  // Notification generators for different scenarios
  const notifyOrderUpdate = (orderId: string, status: string, customerName?: string) => {
    const title = customerName 
      ? `Đơn hàng của ${customerName} đã được cập nhật`
      : 'Đơn hàng đã được cập nhật';
    
    return createNotification(
      title,
      `Đơn hàng #${orderId} đã thay đổi trạng thái thành: ${status}`,
      'info',
      'order',
      'medium',
      'manager',
      {
        actionUrl: `/admin/orders/${orderId}`,
        actionLabel: 'Xem đơn hàng',
        data: { orderId, status }
      }
    );
  };

  const notifyLowStock = (productName: string, currentStock: number, threshold: number) => {
    return createNotification(
      'Cảnh báo tồn kho thấp',
      `Sản phẩm "${productName}" chỉ còn ${currentStock} sản phẩm (ngưỡng: ${threshold})`,
      'warning',
      'inventory',
      'high',
      'manager',
      {
        actionUrl: '/admin/inventory',
        actionLabel: 'Quản lý tồn kho'
      }
    );
  };

  const notifyNewReview = (productName: string, rating: number, customerName: string) => {
    return createNotification(
      'Đánh giá mới cần duyệt',
      `${customerName} đã để lại đánh giá ${rating} sao cho "${productName}"`,
      'info',
      'review',
      'medium',
      'manager',
      {
        actionUrl: '/admin/reviews',
        actionLabel: 'Duyệt đánh giá'
      }
    );
  };

  const notifyPromotionExpiring = (promotionName: string, expiryDate: string) => {
    return createNotification(
      'Khuyến mãi sắp hết hạn',
      `Chương trình "${promotionName}" sẽ kết thúc vào ${expiryDate}`,
      'warning',
      'promotion',
      'medium',
      'manager',
      {
        actionUrl: '/admin/promotions',
        actionLabel: 'Quản lý khuyến mãi'
      }
    );
  };

  const notifyOrderStatusForCustomer = (orderId: string, status: string) => {
    const statusMessages: Record<string, string> = {
      'confirmed': 'Đơn hàng đã được xác nhận',
      'processing': 'Đơn hàng đang được chuẩn bị',
      'shipped': 'Đơn hàng đã được gửi đi',
      'delivered': 'Đơn hàng đã được giao thành công',
      'cancelled': 'Đơn hàng đã bị hủy'
    };

    return createNotification(
      statusMessages[status] || 'Cập nhật đơn hàng',
      `Đơn hàng #${orderId} của bạn đã được cập nhật`,
      status === 'delivered' ? 'success' : status === 'cancelled' ? 'error' : 'info',
      'order',
      'medium',
      'customer',
      {
        actionUrl: `/orders/${orderId}`,
        actionLabel: 'Xem đơn hàng',
        data: { orderId, status }
      }
    );
  };

  const notifyWishlistPriceDrop = (productName: string, oldPrice: number, newPrice: number) => {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    return createNotification(
      'Giá sản phẩm yêu thích giảm!',
      `"${productName}" đã giảm ${discount}% từ ¥${oldPrice.toLocaleString()} xuống ¥${newPrice.toLocaleString()}`,
      'success',
      'product',
      'medium',
      'customer',
      {
        actionUrl: `/products/${productName}`,
        actionLabel: 'Xem sản phẩm'
      }
    );
  };

  // Generate initial mock notifications
  const generateMockNotifications = () => {
    const mockNotifications: Notification[] = [];

    // Manager notifications
    for (let i = 0; i < 5; i++) {
      mockNotifications.push({
        id: faker.string.uuid(),
        title: 'Đơn hàng mới cần xử lý',
        message: `Đơn hàng #${faker.string.alphanumeric(8)} từ ${faker.person.fullName()} cần được xác nhận`,
        type: 'info',
        category: 'order',
        priority: 'medium',
        targetRole: 'manager',
        isRead: faker.datatype.boolean(0.3),
        actionUrl: '/admin/orders',
        actionLabel: 'Xem đơn hàng',
        createdAt: faker.date.recent({ days: 7 }).toISOString(),
      });
    }

    // Low stock warnings
    for (let i = 0; i < 3; i++) {
      mockNotifications.push({
        id: faker.string.uuid(),
        title: 'Cảnh báo tồn kho thấp',
        message: `Sản phẩm "${faker.commerce.productName()}" chỉ còn ${faker.number.int({ min: 1, max: 5 })} sản phẩm`,
        type: 'warning',
        category: 'inventory',
        priority: 'high',
        targetRole: 'manager',
        isRead: faker.datatype.boolean(0.2),
        actionUrl: '/admin/inventory',
        actionLabel: 'Quản lý kho',
        createdAt: faker.date.recent({ days: 3 }).toISOString(),
      });
    }

    // Customer notifications
    for (let i = 0; i < 4; i++) {
      mockNotifications.push({
        id: faker.string.uuid(),
        title: 'Cập nhật đơn hàng',
        message: `Đơn hàng #${faker.string.alphanumeric(8)} đã được ${faker.helpers.arrayElement(['xác nhận', 'gửi đi', 'giao thành công'])}`,
        type: 'success',
        category: 'order',
        priority: 'medium',
        targetRole: 'customer',
        isRead: faker.datatype.boolean(0.4),
        actionUrl: '/orders',
        actionLabel: 'Xem đơn hàng',
        createdAt: faker.date.recent({ days: 5 }).toISOString(),
      });
    }

    notifications.value = mockNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  // Initialize with mock data
  generateMockNotifications();

  return {
    // State
    notifications,
    preferences,
    isNotificationPanelOpen,
    
    // Getters
    unreadCount,
    unreadNotifications,
    notificationsByCategory,
    priorityNotifications,
    
    // Actions
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    filterNotificationsByRole,
    updatePreferences,
    toggleNotificationPanel,
    closeNotificationPanel,
    
    // Specific notification creators
    notifyOrderUpdate,
    notifyLowStock,
    notifyNewReview,
    notifyPromotionExpiring,
    notifyOrderStatusForCustomer,
    notifyWishlistPriceDrop,
    generateMockNotifications,
  };
});