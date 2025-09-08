<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Backup Manager</h2>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Available Backups</h3>
        <button class="btn btn-primary">
          <Play class="h-4 w-4 mr-2" />
          Run Backup Now
        </button>
      </div>
      <p class="text-gray-600 dark:text-gray-400">
        This is a placeholder for the Backup Manager UI. Features would include listing backups, initiating new backups with real-time progress, and options to download, restore, or delete existing backups.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Play } from 'lucide-vue-next';
</script>
