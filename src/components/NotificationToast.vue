<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="notification in toastNotifications"
          :key="notification.id"
          class="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
          :class="getToastClasses(notification.type)"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component 
                  :is="getIcon(notification.type)" 
                  class="h-6 w-6"
                  :class="getIconClasses(notification.type)"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ notification.message }}
                </p>
                <div v-if="notification.actionUrl" class="mt-3 flex space-x-7">
                  <router-link
                    :to="notification.actionUrl"
                    @click="handleToastAction(notification.id)"
                    class="bg-white dark:bg-gray-800 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {{ notification.actionLabel || 'Xem chi tiết' }}
                  </router-link>
                </div>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="dismissToast(notification.id)"
                  class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Đóng</span>
                  <X class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <!-- Progress bar for auto-dismiss -->
          <div 
            v-if="notification.data?.autoDismiss"
            class="h-1 bg-gray-200 dark:bg-gray-700"
          >
            <div 
              class="h-full transition-all ease-linear"
              :class="getProgressBarClasses(notification.type)"
              :style="{ width: `${getProgressWidth(notification.id)}%` }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-vue-next';
import { useNotifications } from '@/composables/useNotifications';
import type { NotificationType, Notification } from '@/types';

const { notifications, deleteNotification, markAsRead } = useNotifications();

// Filter only system notifications that should appear as toasts
const toastNotifications = computed(() => 
  notifications.value.filter(n => 
    n.category === 'system' && 
    !n.isRead &&
    (!n.expiresAt || new Date(n.expiresAt) > new Date())
  ).slice(0, 5) // Limit to 5 toasts
);

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success': return CheckCircle;
    case 'error': return XCircle;
    case 'warning': return AlertTriangle;
    default: return Info;
  }
};

const getToastClasses = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'border-l-4 border-green-400';
    case 'error':
      return 'border-l-4 border-red-400';
    case 'warning':
      return 'border-l-4 border-yellow-400';
    default:
      return 'border-l-4 border-blue-400';
  }
};

const getIconClasses = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'text-green-400';
    case 'error':
      return 'text-red-400';
    case 'warning':
      return 'text-yellow-400';
    default:
      return 'text-blue-400';
  }
};

const getProgressBarClasses = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-400';
    case 'error':
      return 'bg-red-400';
    case 'warning':
      return 'bg-yellow-400';
    default:
      return 'bg-blue-400';
  }
};

const getProgressWidth = (notificationId: string) => {
  // This would be calculated based on remaining time
  // For now, return a placeholder
  return 100;
};

const dismissToast = (notificationId: string) => {
  deleteNotification(notificationId);
};

const handleToastAction = (notificationId: string) => {
  markAsRead(notificationId);
  dismissToast(notificationId);
};

// Auto-cleanup old toasts
let cleanupInterval: number;

onMounted(() => {
  cleanupInterval = setInterval(() => {
    const now = new Date();
    notifications.value.forEach(notification => {
      if (notification.expiresAt && new Date(notification.expiresAt) <= now) {
        deleteNotification(notification.id);
      }
    });
  }, 5000);
});

onUnmounted(() => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>