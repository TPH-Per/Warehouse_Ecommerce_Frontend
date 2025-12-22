<template>
  <!-- Toast Container - Fixed position stacked toasts -->
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-slide">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="toast-item"
          :class="'toast-' + toast.type"
        >
          <div class="toast-content">
            <v-icon class="toast-icon" size="20">{{ getIcon(toast.type) }}</v-icon>
            <span class="toast-message">{{ toast.message }}</span>
            <v-btn 
              icon 
              variant="text" 
              size="x-small" 
              class="toast-close"
              @click="remove(toast.id)"
            >
              <v-icon size="16">mdi-close</v-icon>
            </v-btn>
          </div>
          <!-- Progress bar -->
          <div class="toast-progress" :style="{ animationDuration: toast.timeout + 'ms' }" />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts, remove } = useToast();

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return 'mdi-check-circle';
    case 'error': return 'mdi-alert-circle';
    case 'warning': return 'mdi-alert';
    case 'info': return 'mdi-information';
    default: return 'mdi-information';
  }
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  pointer-events: none;
}

.toast-item {
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.08);
  pointer-events: auto;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}

.toast-icon {
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  opacity: 0.6;
}

.toast-close:hover {
  opacity: 1;
}

/* Type-specific colors */
.toast-success {
  border-left: 4px solid #4caf50;
}
.toast-success .toast-icon {
  color: #4caf50;
}

.toast-error {
  border-left: 4px solid #f44336;
}
.toast-error .toast-icon {
  color: #f44336;
}

.toast-warning {
  border-left: 4px solid #ff9800;
}
.toast-warning .toast-icon {
  color: #ff9800;
}

.toast-info {
  border-left: 4px solid #2196f3;
}
.toast-info .toast-icon {
  color: #2196f3;
}

/* Progress bar */
.toast-progress {
  height: 3px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
  animation: progress linear forwards;
  transform-origin: left;
}

@keyframes progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

/* Transition animations */
.toast-slide-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-slide-leave-active {
  animation: slideOut 0.25s ease-in forwards;
}

.toast-slide-move {
  transition: transform 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
