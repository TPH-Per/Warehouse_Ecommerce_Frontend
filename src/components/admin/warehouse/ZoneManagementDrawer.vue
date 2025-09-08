<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="$emit('close')"></div>
  
  <div 
    class="fixed top-0 right-0 h-full w-full md:w-3/4 lg:w-2/3 bg-gray-50 dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div v-if="warehouse" class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Zone Management</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ warehouse.name }} ({{ warehouse.code }})</p>
        </div>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <X class="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Zone List -->
        <div class="w-1/3 border-r dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto p-4 space-y-2">
          <button 
            v-for="zone in zones" 
            :key="zone.id"
            @click="selectedZone = zone"
            class="w-full text-left p-3 rounded-lg flex justify-between items-center"
            :class="selectedZone?.id === zone.id ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            <div>
              <p class="font-semibold">{{ zone.name }}</p>
              <p class="text-xs">{{ zone.code }}</p>
            </div>
            <div class="h-3 w-3 rounded-full" :class="getIotStatusColor(zone.iotStatus)"></div>
          </button>
          <button class="w-full text-left p-3 rounded-lg flex items-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <PlusCircle class="h-5 w-5 mr-2" /> Add Zone
          </button>
        </div>

        <!-- Zone Details -->
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="selectedZone" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Details for {{ selectedZone.name }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="form-label">Zone Code</label><input type="text" v-model="selectedZone.code" class="form-input"></div>
              <div><label class="form-label">Zone Name</label><input type="text" v-model="selectedZone.name" class="form-input"></div>
            </div>
            <div>
              <label class="form-label">Zone Type</label>
              <select v-model="selectedZone.type" class="form-input">
                <option>Standard</option><option>Cold</option><option>Restricted</option>
              </select>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">Linked Sensors: {{ selectedZone.sensorCount }}</span>
              <div class="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded">
                <p class="text-center text-xs pt-1.5 text-gray-500">24h Temp/Humidity Sparkline</p>
              </div>
            </div>
            <div class="flex justify-end space-x-2">
              <button class="btn btn-outline">Delete</button>
              <button class="btn btn-primary">Save Changes</button>
            </div>
          </div>
          <div v-else class="text-center pt-20 text-gray-500">
            <p>Select a zone to view its details.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { X, PlusCircle } from 'lucide-vue-next';
import type { Warehouse, WarehouseZone } from '@/types';
import { generateMockZonesForWarehouse } from '@/data/warehouseMockData';

const props = defineProps<{
  isOpen: boolean;
  warehouse: Warehouse | null;
}>();

defineEmits(['close']);

const zones = ref<WarehouseZone[]>([]);
const selectedZone = ref<WarehouseZone | null>(null);

watch(() => props.warehouse, (newWarehouse) => {
  if (newWarehouse) {
    zones.value = generateMockZonesForWarehouse(newWarehouse.id);
    selectedZone.value = zones.value[0] || null;
  } else {
    zones.value = [];
    selectedZone.value = null;
  }
});

const getIotStatusColor = (status: 'ok' | 'warn' | 'alert') => ({
  'ok': 'bg-green-500',
  'warn': 'bg-yellow-500',
  'alert': 'bg-red-500',
}[status]);
</script>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
.form-input { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-pink-400 dark:focus:border-pink-400; }
</style>
