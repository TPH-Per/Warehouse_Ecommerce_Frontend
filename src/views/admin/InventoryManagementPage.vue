<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Inventory Dashboard</h2>
    
    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <StatCard title="Total SKUs" value="12,450" :icon="Package" iconBgColor="bg-blue-100" iconColor="text-blue-600" />
      <StatCard title="Total On Hand" value="1,234,567" :icon="Boxes" iconBgColor="bg-indigo-100" iconColor="text-indigo-600" />
      <StatCard title="Total Reserved" value="89,123" :icon="Archive" iconBgColor="bg-purple-100" iconColor="text-purple-600" />
      <StatCard title="Inventory Value" value="¥1.5B" :icon="DollarSign" iconBgColor="bg-green-100" iconColor="text-green-600" />
      <StatCard title="Low Stock Items" value="78" :icon="AlertTriangle" iconBgColor="bg-orange-100" iconColor="text-orange-600" />
    </div>

    <!-- Chart and Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Receipts vs. Shipments (Last 30 Days)</h3>
        <v-chart class="h-64" :option="chartOption" autoresize />
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-center space-y-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Quick Actions</h3>
        <router-link to="/admin/goods-receipt" class="btn btn-primary"><Download class="h-4 w-4 mr-2"/>Receive Goods</router-link>
        <router-link to="/admin/picking/ORD-123" class="btn btn-secondary"><ListChecks class="h-4 w-4 mr-2"/>Create Pick List</router-link>
        <router-link to="/admin/transfers" class="btn btn-secondary"><Truck class="h-4 w-4 mr-2"/>Transfer Stock</router-link>
        <router-link to="/admin/cycle-counts" class="btn btn-secondary"><Repeat class="h-4 w-4 mr-2"/>Schedule Cycle Count</router-link>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Live Inventory</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700">
              <th class="py-3 px-4 font-medium">SKU</th>
              <th class="py-3 px-4 font-medium">Product Name</th>
              <th class="py-3 px-4 font-medium">On Hand</th>
              <th class="py-3 px-4 font-medium">Reserved</th>
              <th class="py-3 px-4 font-medium">Available</th>
              <th class="py-3 px-4 font-medium">Reorder Point</th>
              <th class="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in inventory" :key="item.id" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="py-3 px-4 font-mono text-sm">{{ item.sku }}</td>
              <td class="py-3 px-4">{{ item.productName }}</td>
              <td class="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{{ item.onHand }}</td>
              <td class="py-3 px-4">{{ item.reserved }}</td>
              <td class="py-3 px-4 font-bold" :class="item.available < item.reorderPoint ? 'text-red-500' : 'text-green-600'">{{ item.available }}</td>
              <td class="py-3 px-4">{{ item.reorderPoint }}</td>
              <td class="py-3 px-4 text-right">
                <button class="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Edit class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="text-xs text-gray-400 mt-4">*This is a paginated view. A full implementation would use virtual scrolling for performance with large datasets.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { isDark } from '@/composables/useTheme';
import StatCard from '@/components/admin/StatCard.vue';
import { Package, Boxes, Archive, DollarSign, AlertTriangle, Download, ListChecks, Truck, Repeat, Edit } from 'lucide-vue-next';
import { generateMockInventory } from '@/data/warehouseMockData';

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const inventory = ref(generateMockInventory(15));

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['Receipts', 'Shipments'], textStyle: { color: isDark.value ? '#ccc' : '#333' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'value', boundaryGap: [0, 0.01], axisLine: { lineStyle: { color: isDark.value ? '#555' : '#ccc' } } },
  yAxis: { type: 'category', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], axisLine: { lineStyle: { color: isDark.value ? '#555' : '#ccc' } } },
  series: [
    { name: 'Receipts', type: 'bar', data: [18203, 23489, 29034, 104970] },
    { name: 'Shipments', type: 'bar', data: [19325, 23438, 31000, 121594] }
  ]
}));
</script>
