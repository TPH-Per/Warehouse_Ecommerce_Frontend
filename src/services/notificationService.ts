import { useNotifications } from '@/composables/useNotifications';
import { useAuth } from '@/composables/useAuth';
import type { Order, Product } from '@/types';

export class NotificationService {
  private static instance: NotificationService;
  private notifications = useNotifications();
  private auth = useAuth();

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Manager Role Notifications
  public notifyNewOrder(order: Order) {
    this.notifications.notifyManagerOrderUpdate(
      order.id,
      'mới',
      order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName
    );
  }

  public notifyOrderStatusChange(order: Order, newStatus: string) {
    // Notify manager
    this.notifications.notifyManagerOrderUpdate(order.id, newStatus);
    
    // Notify customer
    this.notifications.notifyCustomerOrderStatus(order.id, newStatus);
  }

  public notifyLowStock(product: Product, currentStock: number) {
    const threshold = 10; // Low stock threshold
    if (currentStock <= threshold) {
      this.notifications.notifyManagerLowStock(product.name, currentStock, threshold);
    }
  }

  public notifyNewReview(productName: string, rating: number, customerName: string) {
    this.notifications.notifyManagerNewReview(productName, rating, customerName);
  }

  // Customer Role Notifications
  public notifyOrderConfirmation(order: Order) {
    this.notifications.notifyCustomerOrderStatus(order.id, 'confirmed');
  }

  public notifyPriceDrop(productName: string, oldPrice: number, newPrice: number) {
    this.notifications.notifyCustomerPriceDrop(productName, oldPrice, newPrice);
  }

  public notifyWishlistBackInStock(productName: string) {
    const notification = this.notifications.createNotification(
      'Sản phẩm yêu thích đã có hàng!',
      `"${productName}" đã có hàng trở lại. Hãy đặt hàng ngay!`,
      'success',
      'product',
      'medium',
      'customer',
      {
        actionUrl: '/products',
        actionLabel: 'Xem sản phẩm'
      }
    );
    return notification;
  }

  public notifyPromotionExpiring(promotionName: string, expiryDate: string) {
    this.notifications.notifyPromotionExpiring(promotionName, expiryDate);
  }

  // System notifications
  public notifySystemMaintenance(message: string, scheduledTime: string) {
    return this.notifications.createNotification(
      'Bảo trì hệ thống',
      `${message} Thời gian: ${scheduledTime}`,
      'warning',
      'system',
      'high',
      'all',
      {
        expiresAt: scheduledTime
      }
    );
  }

  public notifyPaymentSuccess(orderId: string, amount: number) {
    return this.notifications.createNotification(
      'Thanh toán thành công',
      `Thanh toán ¥${amount.toLocaleString()} cho đơn hàng #${orderId} đã được xử lý thành công`,
      'success',
      'order',
      'medium',
      'customer',
      {
        actionUrl: `/orders/${orderId}`,
        actionLabel: 'Xem đơn hàng'
      }
    );
  }

  public notifyShippingUpdate(orderId: string, trackingNumber: string) {
    return this.notifications.createNotification(
      'Cập nhật vận chuyển',
      `Đơn hàng #${orderId} đã được gửi đi. Mã theo dõi: ${trackingNumber}`,
      'info',
      'order',
      'medium',
      'customer',
      {
        actionUrl: `/orders/${orderId}`,
        actionLabel: 'Theo dõi đơn hàng'
      }
    );
  }

  // Bulk notifications for managers
  public notifyDailyReport(stats: {
    newOrders: number;
    totalRevenue: number;
    lowStockItems: number;
    pendingReviews: number;
  }) {
    const message = `Hôm nay: ${stats.newOrders} đơn hàng mới, doanh thu ¥${stats.totalRevenue.toLocaleString()}. ${stats.lowStockItems} sản phẩm sắp hết hàng, ${stats.pendingReviews} đánh giá chờ duyệt.`;
    
    return this.notifications.createNotification(
      'Báo cáo hàng ngày',
      message,
      'info',
      'system',
      'medium',
      'manager',
      {
        actionUrl: '/admin/dashboard',
        actionLabel: 'Xem dashboard'
      }
    );
  }

  // Auto-trigger notifications based on events
  public setupAutoNotifications() {
    // This would typically be called during app initialization
    // and set up event listeners for various business events
    
    // Example: Check for low stock items periodically
    setInterval(() => {
      this.checkLowStockItems();
    }, 60000 * 30); // Check every 30 minutes

    // Example: Daily reports
    this.scheduleDailyReports();
  }

  private checkLowStockItems() {
    // This would fetch real inventory data
    // For demo purposes, we'll simulate some low stock notifications
    const lowStockProducts = [
      { name: 'Hatsune Miku Scale Figure', stock: 2 },
      { name: 'Nezuko Demon Slayer Nendoroid', stock: 1 },
    ];

    lowStockProducts.forEach(product => {
      this.notifications.notifyManagerLowStock(product.name, product.stock, 5);
    });
  }

  private scheduleDailyReports() {
    // Schedule daily reports at 9 AM
    const now = new Date();
    const scheduleTime = new Date();
    scheduleTime.setHours(9, 0, 0, 0);
    
    if (scheduleTime < now) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }

    const timeUntilReport = scheduleTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.notifyDailyReport({
        newOrders: Math.floor(Math.random() * 50) + 10,
        totalRevenue: Math.floor(Math.random() * 500000) + 100000,
        lowStockItems: Math.floor(Math.random() * 10) + 1,
        pendingReviews: Math.floor(Math.random() * 20) + 2
      });

      // Schedule next day's report
      setInterval(() => {
        this.notifyDailyReport({
          newOrders: Math.floor(Math.random() * 50) + 10,
          totalRevenue: Math.floor(Math.random() * 500000) + 100000,
          lowStockItems: Math.floor(Math.random() * 10) + 1,
          pendingReviews: Math.floor(Math.random() * 20) + 2
        });
      }, 24 * 60 * 60 * 1000); // Every 24 hours
    }, timeUntilReport);
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();