<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      <StatCard
        title="Gross Revenue"
        value="¥1,250,000"
        :icon="DollarSign"
        iconBgColor="bg-green-100 dark:bg-green-900"
        iconColor="text-green-600 dark:text-green-400"
        :change="{ type: 'increase', amount: 12.5 }"
      />
      <StatCard
        title="Net Revenue"
        value="¥1,150,000"
        :icon="TrendingUp"
        iconBgColor="bg-emerald-100 dark:bg-emerald-900"
        iconColor="text-emerald-600 dark:text-emerald-400"
        :change="{ type: 'increase', amount: 11.8 }"
      />
      <StatCard
        title="New Orders"
        value="345"
        :icon="ShoppingCart"
        iconBgColor="bg-blue-100 dark:bg-blue-900"
        iconColor="text-blue-600 dark:text-blue-400"
        :change="{ type: 'increase', amount: 8.2 }"
      />
       <StatCard
        title="Pending Reviews"
        :value="pendingReviewsCount.toString()"
        :icon="Star"
        iconBgColor="bg-yellow-100 dark:bg-yellow-900"
        iconColor="text-yellow-600 dark:text-yellow-400"
      />
       <StatCard
        title="Open IoT Alerts"
        value="3"
        :icon="AlertTriangle"
        iconBgColor="bg-red-100 dark:bg-red-900"
        iconColor="text-red-600 dark:text-red-400"
      />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      <div class="lg:col-span-3 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Sales vs. Returns</h3>
        <v-chart class="h-80" :option="salesReturnsChartOption" autoresize />
      </div>
      <div class="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Orders by Status</h3>
        <v-chart class="h-80" :option="orderStatusChartOption" autoresize />
      </div>
    </div>

    <!-- Recent Activity & Quick Links -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Orders</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-gray-500 dark:text-gray-400 text-sm">
                <th class="py-2">Order ID</th>
                <th class="py-2">Customer</th>
                <th class="py-2">Total</th>
                <th class="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" class="border-b border-gray-200 dark:border-gray-700">
                <td class="py-3 font-mono text-sm text-gray-600 dark:text-gray-300">{{ order.id }}</td>
                <td class="py-3 text-gray-800 dark:text-gray-200">{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</td>
                <td class="py-3 font-medium text-gray-800 dark:text-gray-200">¥{{ order.total.toLocaleString() }}</td>
                <td class="py-3">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getStatusColor(order.status)">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Links</h3>
        <div class="space-y-3">
          <router-link to="/admin/products" class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Package class="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
            <span class="text-gray-800 dark:text-gray-200">Manage Products</span>
          </router-link>
          <router-link to="/admin/orders" class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ShoppingCart class="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
            <span class="text-gray-800 dark:text-gray-200">Process Orders</span>
          </router-link>
          <router-link to="/admin/users" class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Users class="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
            <span class="text-gray-800 dark:text-gray-200">Manage Users</span>
          </router-link>
          <router-link to="/admin/promotions" class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Tag class="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
            <span class="text-gray-800 dark:text-gray-200">Create Promotion</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import StatCard from '@/components/admin/StatCard.vue';
import { isDark } from '@/composables/useTheme';
import { 
  DollarSign, ShoppingCart, AlertTriangle, Package, Users, Tag, TrendingUp, Star
} from 'lucide-vue-next';
import { generateMockOrders, allReviews } from '@/data/mockData';

use([CanvasRenderer, BarChart, LineChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const allOrders = generateMockOrders(50);
const recentOrders = allOrders.slice(0, 5);

const pendingReviewsCount = computed(() => allReviews.filter(r => r.status === 'pending').length);

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const salesReturnsChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['Sales', 'Returns'],
    textStyle: { color: isDark.value ? '#ccc' : '#333' }
  },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: { lineStyle: { color: isDark.value ? '#555' : '#ccc' } },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: isDark.value ? '#555' : '#ccc' } },
  },
  series: [
    {
      name: 'Sales',
      type: 'line',
      stack: 'Total',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210],
      areaStyle: {},
    },
    {
      name: 'Returns',
      type: 'line',
      stack: 'Total',
      smooth: true,
      data: [10, 12, 1, 3, 9, 20, 21],
      areaStyle: {},
    }
  ]
}));

const orderStatusData = computed(() => {
  const statusCounts = allOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(statusCounts).map(([name, value]) => ({
    value,
    name: name.charAt(0).toUpperCase() + name.slice(1)
  }));
});

const orderStatusChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'item' },
  legend: {
    top: '5%',
    left: 'center',
    textStyle: { color: isDark.value ? '#ccc' : '#333' }
  },
  series: [
    {
      name: 'Order Status',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: isDark.value ? '#1f2937' : '#fff',
        borderWidth: 2
      },
      label: { show: false, position: 'center' },
      emphasis: {
        label: { show: true, fontSize: '20', fontWeight: 'bold' }
      },
      labelLine: { show: false },
      data: orderStatusData.value
    }
  ]
}));
</script>
