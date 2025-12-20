<template>
  <div class="app-layout">
    <AppHeader />

    <v-main class="main-content">
      <router-view />
    </v-main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: linear-gradient(180deg, 
    rgba(10, 10, 15, 1) 0%, 
    rgba(18, 18, 26, 1) 100%);
}
</style>