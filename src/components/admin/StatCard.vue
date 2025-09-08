<template>
  <div class="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
    <div>
      <p class="text-sm font-medium text-gray-500 uppercase">{{ title }}</p>
      <p class="text-3xl font-bold text-gray-800">{{ value }}</p>
      <div v-if="change" class="flex items-center text-sm mt-1" :class="change.type === 'increase' ? 'text-green-500' : 'text-red-500'">
        <ArrowUp v-if="change.type === 'increase'" class="h-4 w-4" />
        <ArrowDown v-else class="h-4 w-4" />
        <span class="ml-1">{{ change.amount }}% vs last month</span>
      </div>
    </div>
    <div class="p-3 rounded-full" :class="iconBgColor">
      <component :is="icon" class="h-6 w-6" :class="iconColor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUp, ArrowDown } from 'lucide-vue-next';

defineProps<{
  title: string;
  value: string;
  icon: any;
  iconBgColor: string;
  iconColor: string;
  change?: {
    type: 'increase' | 'decrease';
    amount: number;
  };
}>();
</script>
