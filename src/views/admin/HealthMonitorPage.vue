<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">System Health Monitor</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <div v-for="metric in healthMetrics" :key="metric.name" class="p-6 rounded-lg shadow-md" :class="metric.bgColor">
        <div class="flex justify-between items-start">
          <p class="text-sm font-medium uppercase" :class="metric.textColor">{{ metric.name }}</p>
          <component :is="metric.icon" class="h-6 w-6" :class="metric.textColor" />
        </div>
        <p class="text-3xl font-bold mt-2" :class="metric.textColor">{{ metric.value }}<span class="text-lg">{{ metric.unit }}</span></p>
        <p class="text-xs mt-1 opacity-80" :class="metric.textColor">Threshold: {{ metric.threshold }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Database, Cpu, HardDrive, Server, ShieldCheck, ListTodo } from 'lucide-vue-next';

const healthMetrics = ref([
  { name: 'DB Latency', value: 12, unit: 'ms', threshold: '< 50ms', icon: Database, status: 'ok' },
  { name: 'Queue Size', value: 5, unit: '', threshold: '< 100', icon: ListTodo, status: 'ok' },
  { name: 'CPU Usage', value: 25, unit: '%', threshold: '< 80%', icon: Cpu, status: 'ok' },
  { name: 'RAM Usage', value: 60, unit: '%', threshold: '< 90%', icon: Server, status: 'ok' },
  { name: 'Disk Free', value: 75, unit: '%', threshold: '> 10%', icon: HardDrive, status: 'ok' },
  { name: 'SSL Expiry', value: 85, unit: ' days', threshold: '> 30d', icon: ShieldCheck, status: 'ok' },
]);

// Add computed properties for colors
healthMetrics.value = healthMetrics.value.map(metric => ({
  ...metric,
  get bgColor() {
    if (this.status === 'error') return 'bg-red-500 text-white';
    if (this.status === 'warn') return 'bg-yellow-400 text-gray-900';
    return 'bg-white dark:bg-gray-800';
  },
  get textColor() {
    if (this.status === 'error' || this.status === 'warn') return 'inherit';
    return 'text-gray-500 dark:text-gray-400';
  }
}));

let intervalId: number;

onMounted(() => {
  intervalId = window.setInterval(() => {
    // Mock data polling
    healthMetrics.value[0].value = Math.floor(Math.random() * 40) + 5; // DB Latency
    healthMetrics.value[2].value = Math.floor(Math.random() * 70) + 10; // CPU
    
    // Mock a warning/error state
    const ramIndex = 3;
    healthMetrics.value[ramIndex].value = Math.floor(Math.random() * 100);
    if (healthMetrics.value[ramIndex].value > 95) {
      healthMetrics.value[ramIndex].status = 'error';
    } else if (healthMetrics.value[ramIndex].value > 85) {
      healthMetrics.value[ramIndex].status = 'warn';
    } else {
      healthMetrics.value[ramIndex].status = 'ok';
    }
  }, 5000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
