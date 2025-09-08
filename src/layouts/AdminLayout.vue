<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
    <AdminSidebar :is-open="sidebarOpen" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <AdminHeader @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <div class="container mx-auto px-6 py-8">
          <router-view />
        </div>
      </main>
    </div>
    
    <!-- Global Notification Components -->
    <NotificationPanel />
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import NotificationPanel from '@/components/NotificationPanel.vue';
import NotificationToast from '@/components/NotificationToast.vue';

const sidebarOpen = useLocalStorage('admin.sidebar.collapsed', true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>
