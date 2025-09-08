<template>
  <div id="app-layout" class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
    
    <!-- Global Notification Components -->
    <NotificationPanel />
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import NotificationPanel from '@/components/NotificationPanel.vue';
import NotificationToast from '@/components/NotificationToast.vue';
</script>
