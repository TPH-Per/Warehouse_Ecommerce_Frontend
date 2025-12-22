<template>
  <v-app>
    <router-view />
    <!-- Toast Notifications -->
    <ToastContainer />
  </v-app>
</template>

<script lang="ts" setup>
import ToastContainer from '@/components/ToastContainer.vue';
</script>
