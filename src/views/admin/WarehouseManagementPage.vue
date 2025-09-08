<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">Warehouse Management</h2>
      <div class="flex items-center space-x-4 w-full md:w-auto">
        <div class="relative flex-1">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search warehouses..." 
            class="w-full pl-10 pr-4 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" 
          />
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <button @click="isModalOpen = true" class="btn btn-primary">
          <Plus class="h-4 w-4 mr-2" />
          Create Warehouse
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <WarehouseCard 
        v-for="warehouse in filteredWarehouses" 
        :key="warehouse.id" 
        :warehouse="warehouse"
        @edit="editWarehouse"
        @view-zones="viewZones"
      />
    </div>
    
    <WarehouseFormModal 
      :is-open="isModalOpen" 
      :warehouse="selectedWarehouse"
      @close="closeModal"
      @save="saveWarehouse"
    />
    
    <ZoneManagementDrawer
      :is-open="isDrawerOpen"
      :warehouse="selectedWarehouseForZones"
      @close="isDrawerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { Search, Plus } from 'lucide-vue-next';
import WarehouseCard from '@/components/admin/warehouse/WarehouseCard.vue';
import WarehouseFormModal from '@/components/admin/warehouse/WarehouseFormModal.vue';
import ZoneManagementDrawer from '@/components/admin/warehouse/ZoneManagementDrawer.vue';
import { generateMockWarehouses } from '@/data/warehouseMockData';
import type { Warehouse } from '@/types';

const warehouses = ref<Warehouse[]>(generateMockWarehouses(25));
const searchQuery = ref('');

const isModalOpen = ref(false);
const selectedWarehouse = ref<Warehouse | null>(null);

const isDrawerOpen = ref(false);
const selectedWarehouseForZones = ref<Warehouse | null>(null);

const debouncedSearch = useDebounceFn((query) => {
  // In a real app, you'd fetch from API here
}, 300);

const filteredWarehouses = computed(() => {
  if (!searchQuery.value) return warehouses.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return warehouses.value.filter(w => 
    w.name.toLowerCase().includes(lowerQuery) ||
    w.code.toLowerCase().includes(lowerQuery) ||
    w.city.toLowerCase().includes(lowerQuery)
  );
});

const closeModal = () => {
  isModalOpen.value = false;
  selectedWarehouse.value = null;
};

const editWarehouse = (warehouse: Warehouse) => {
  selectedWarehouse.value = warehouse;
  isModalOpen.value = true;
};

const saveWarehouse = (warehouseData: Warehouse) => {
  if (warehouseData.id) {
    const index = warehouses.value.findIndex(w => w.id === warehouseData.id);
    if (index !== -1) warehouses.value[index] = warehouseData;
  } else {
    warehouses.value.unshift({ ...warehouseData, id: `wh-${Date.now()}`});
  }
  closeModal();
};

const viewZones = (warehouse: Warehouse) => {
  selectedWarehouseForZones.value = warehouse;
  isDrawerOpen.value = true;
};
</script>
