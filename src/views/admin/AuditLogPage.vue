<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Audit Log</h2>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input type="date" class="input-field" placeholder="Start Date">
        <input type="date" class="input-field" placeholder="End Date">
        <select class="input-field">
          <option value="">All Tables</option>
          <option>products</option>
          <option>users</option>
          <option>orders</option>
        </select>
        <button class="btn btn-secondary">Export CSV</button>
      </div>
      
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-500 dark:text-gray-400 text-sm">
              <th class="py-2 px-4">Timestamp</th>
              <th class="py-2 px-4">User</th>
              <th class="py-2 px-4">Action</th>
              <th class="py-2 px-4">Table</th>
              <th class="py-2 px-4">Record ID</th>
              <th class="py-2 px-4">Changes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in auditLogs" :key="log.id" class="border-b dark:border-gray-700">
              <td class="py-3 px-4 text-gray-600 dark:text-gray-300">{{ new Date(log.timestamp).toLocaleString() }}</td>
              <td class="py-3 px-4 text-gray-800 dark:text-gray-200">{{ log.userName }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 text-xs rounded-full font-medium" :class="getActionColor(log.action)">
                  {{ log.action.split(' ')[0] }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-300">{{ log.targetType }}</td>
              <td class="py-3 px-4 font-mono text-xs text-gray-500 dark:text-gray-400">{{ log.targetId.substring(0, 8) }}...</td>
              <td class="py-3 px-4">
                <button @click="showDiff(log)" class="btn btn-sm btn-outline">View Diff</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Diff Modal -->
    <div v-if="isDiffModalOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-semibold">Changes for {{ selectedLog?.targetType }} #{{ selectedLog?.targetId.substring(0,8) }}</h3>
          <button @click="isDiffModalOpen = false" class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X /></button>
        </div>
        <div class="p-4 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          <div>
            <h4 class="font-semibold mb-2">Old Values</h4>
            <pre class="bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs text-red-800 dark:text-red-300"><code>{{ JSON.stringify(mockDiff.old, null, 2) }}</code></pre>
          </div>
          <div>
            <h4 class="font-semibold mb-2">New Values</h4>
            <pre class="bg-green-50 dark:bg-green-900/20 p-2 rounded text-xs text-green-800 dark:text-green-300"><code>{{ JSON.stringify(mockDiff.new, null, 2) }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import { generateMockAuditLogs } from '@/data/mockData';
import type { AuditLog } from '@/types';

const auditLogs = ref(generateMockAuditLogs(50));
const isDiffModalOpen = ref(false);
const selectedLog = ref<AuditLog | null>(null);

const mockDiff = {
  old: { status: 'pending', price: 15000 },
  new: { status: 'confirmed', price: 15500 }
};

const getActionColor = (action: string) => {
  if (action.startsWith('created')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  if (action.startsWith('updated')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  if (action.startsWith('deleted')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const showDiff = (log: AuditLog) => {
  selectedLog.value = log;
  isDiffModalOpen.value = true;
};
</script>

<style scoped>
.input-field {
  @apply px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500
  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-pink-400 dark:focus:border-pink-400;
}
</style>
