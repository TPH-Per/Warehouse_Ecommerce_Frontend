<template>
  <div 
    v-if="isNotificationPanelOpen" 
    class="fixed inset-0 z-50 overflow-hidden"
  >
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black bg-opacity-25" 
      @click="closePanel"
    ></div>
    
    <!-- Panel -->
    <div class="absolute right-0 top-0 h-full w-full max-w-md">
      <div class="flex h-full flex-col bg-white dark:bg-gray-900 shadow-xl">
        <!-- Header -->
        <div class="border-b border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Thông báo
            </h2>
            <div class="flex items-center space-x-2">
              <button
                v-if="userUnreadCount > 0"
                @click="markAllAsRead"
                class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Đánh dấu tất cả đã đọc
              </button>
              <button
                @click="closePanel"
                class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X class="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <!-- Filter tabs -->
          <div class="mt-4">
            <nav class="flex space-x-4">
              <button
                v-for="tab in filterTabs"
                :key="tab.key"
                @click="activeFilter = tab.key"
                class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="activeFilter === tab.key 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                {{ tab.label }}
                <span 
                  v-if="tab.count > 0" 
                  class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="activeFilter === tab.key 
                    ? 'bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                >
                  {{ tab.count }}
                </span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Notifications list -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="filteredNotifications.length === 0" class="p-8 text-center">
            <Bell class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Không có thông báo
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ activeFilter === 'unread' ? 'Bạn đã đọc tất cả thông báo' : 'Chưa có thông báo nào' }}
            </p>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="notification in filteredNotifications"
              :key="notification.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notification.isRead }"
            >
              <div class="flex items-start space-x-3">
                <!-- Icon -->
                <div class="flex-shrink-0">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="getNotificationIconBg(notification.type)"
                  >
                    <component 
                      :is="getNotificationIcon(notification.type, notification.category)"
                      class="h-4 w-4"
                      :class="getNotificationIconColor(notification.type)"
                    />
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ notification.title }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {{ notification.message }}
                      </p>
                      <div class="flex items-center mt-2 space-x-4">
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatRelativeTime(notification.createdAt) }}
                        </span>
                        <span 
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          :class="getPriorityClasses(notification.priority)"
                        >
                          {{ getPriorityLabel(notification.priority) }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex items-center space-x-2 ml-2">
                      <button
                        v-if="!notification.isRead"
                        @click="markAsRead(notification.id)"
                        class="text-xs text-indigo-600 hover:text-indigo-500"
                        title="Đánh dấu đã đọc"
                      >
                        <CheckCircle class="h-4 w-4" />
                      </button>
                      <button
                        @click="deleteNotification(notification.id)"
                        class="text-xs text-gray-400 hover:text-red-500"
                        title="Xóa thông báo"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <!-- Action button -->
                  <div v-if="notification.actionUrl" class="mt-3">
                    <router-link
                      :to="notification.actionUrl"
                      @click="handleNotificationAction(notification)"
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-400 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/70"
                    >
                      {{ notification.actionLabel || 'Xem chi tiết' }}
                      <ExternalLink class="ml-1 h-3 w-3" />
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            @click="openPreferences"
            class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <Settings class="h-4 w-4 mr-2" />
            Cài đặt thông báo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  X, 
  Bell, 
  CheckCircle, 
  Trash2, 
  ExternalLink, 
  Settings,
  ShoppingCart,
  Package,
  AlertTriangle,
  Star,
  Tag,
  Users,
  Info,
  XCircle
} from 'lucide-vue-next';
import { useNotifications } from '@/composables/useNotifications';
import type { Notification, NotificationType, NotificationCategory } from '@/types';

const {
  isNotificationPanelOpen,
  userNotifications,
  userUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  closePanel
} = useNotifications();

const activeFilter = ref<'all' | 'unread' | 'priority'>('all');

const filterTabs = computed(() => [
  { 
    key: 'all' as const, 
    label: 'Tất cả', 
    count: userNotifications.value.length 
  },
  { 
    key: 'unread' as const, 
    label: 'Chưa đọc', 
    count: userUnreadCount.value 
  },
  { 
    key: 'priority' as const, 
    label: 'Ưu tiên', 
    count: userNotifications.value.filter(n => n.priority === 'high' || n.priority === 'urgent').length 
  }
]);

const filteredNotifications = computed(() => {
  let notifications = userNotifications.value;
  
  switch (activeFilter.value) {
    case 'unread':
      notifications = notifications.filter(n => !n.isRead);
      break;
    case 'priority':
      notifications = notifications.filter(n => n.priority === 'high' || n.priority === 'urgent');
      break;
    default:
      // Show all notifications
      break;
  }
  
  return notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

const getNotificationIcon = (type: NotificationType, category: NotificationCategory) => {
  if (type === 'error') return XCircle;
  if (type === 'warning') return AlertTriangle;
  if (type === 'success') return CheckCircle;
  
  switch (category) {
    case 'order': return ShoppingCart;
    case 'product': return Package;
    case 'review': return Star;
    case 'promotion': return Tag;
    case 'user': return Users;
    case 'inventory': return Package;
    default: return Info;
  }
};

const getNotificationIconBg = (type: NotificationType) => {
  switch (type) {
    case 'success': return 'bg-green-100 dark:bg-green-900/50';
    case 'error': return 'bg-red-100 dark:bg-red-900/50';
    case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/50';
    default: return 'bg-blue-100 dark:bg-blue-900/50';
  }
};

const getNotificationIconColor = (type: NotificationType) => {
  switch (type) {
    case 'success': return 'text-green-600 dark:text-green-400';
    case 'error': return 'text-red-600 dark:text-red-400';
    case 'warning': return 'text-yellow-600 dark:text-yellow-400';
    default: return 'text-blue-600 dark:text-blue-400';
  }
};

const getPriorityClasses = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
    case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'Khẩn cấp';
    case 'high': return 'Cao';
    case 'medium': return 'Trung bình';
    default: return 'Thấp';
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};

const handleNotificationAction = (notification: Notification) => {
  if (!notification.isRead) {
    markAsRead(notification.id);
  }
  closePanel();
};

const openPreferences = () => {
  // Navigate to notification preferences
  closePanel();
  // This could open a modal or navigate to settings page
};
</script>