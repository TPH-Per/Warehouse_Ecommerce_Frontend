<template>
  <button @click="toggleDark()" class="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
    <Sun class="h-6 w-6" v-if="isDark" />
    <Moon class="h-6 w-6" v-else />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next';
import { isDark, toggleDark } from '@/composables/useTheme';
</script>
