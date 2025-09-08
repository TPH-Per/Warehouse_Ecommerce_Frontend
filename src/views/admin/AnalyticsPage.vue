<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">Phân tích & Báo cáo</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="selectedPeriod" 
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="7d">7 ngày qua</option>
          <option value="30d">30 ngày qua</option>
          <option value="90d">90 ngày qua</option>
          <option value="1y">1 năm qua</option>
        </select>
        <button 
          @click="refreshData"
          class="btn btn-primary flex items-center"
        >
          <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': isRefreshing }" />
          Làm mới
        </button>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="metric in keyMetrics" 
        :key="metric.label"
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ metric.label }}</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ metric.value }}</p>
            <div class="flex items-center mt-2">
              <component 
                :is="metric.trend === 'up' ? 'TrendingUp' : metric.trend === 'down' ? 'TrendingDown' : 'Minus'"
                class="h-4 w-4 mr-1"
                :class="metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'"
              />
              <span 
                class="text-sm"
                :class="metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'"
              >
                {{ metric.change }}
              </span>
            </div>
          </div>
          <div 
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="metric.iconBg"
          >
            <component :is="metric.icon" class="h-6 w-6" :class="metric.iconColor" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Revenue Chart -->
      <div class="xl:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Doanh thu theo thời gian</h3>
          <div class="flex items-center space-x-2">
            <button 
              v-for="period in ['7d', '30d', '90d']"
              :key="period"
              @click="revenueChartPeriod = period"
              class="px-3 py-1 text-sm rounded-md transition-colors"
              :class="revenueChartPeriod === period 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <v-chart class="h-80" :option="revenueChartOption" autoresize />
      </div>

      <!-- Top Products -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Sản phẩm bán chạy</h3>
        <div class="space-y-4">
          <div 
            v-for="(product, index) in topProducts" 
            :key="product.id"
            class="flex items-center space-x-3"
          >
            <div class="flex-shrink-0">
              <span 
                class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
                :class="index < 3 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
              >
                {{ index + 1 }}
              </span>
            </div>
            <img :src="product.image" :alt="product.name" class="w-10 h-10 rounded-md object-cover" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ product.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ product.sold }} đã bán</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">¥{{ product.revenue.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- More Analytics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Customer Analytics -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Phân tích khách hàng</h3>
        <v-chart class="h-64" :option="customerChartOption" autoresize />
      </div>

      <!-- Order Status Distribution -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Phân bố trạng thái đơn hàng</h3>
        <v-chart class="h-64" :option="orderStatusChartOption" autoresize />
      </div>
    </div>

    <!-- Inventory Analytics -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Phân tích tồn kho</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ inventoryStats.totalProducts }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tổng sản phẩm</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{{ inventoryStats.lowStock }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Sắp hết hàng</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-red-600 dark:text-red-400">{{ inventoryStats.outOfStock }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Hết hàng</div>
        </div>
      </div>
    </div>

    <!-- Notification Analytics -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Thống kê thông báo</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ notificationStats.total }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tổng thông báo</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ notificationStats.read }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Đã đọc</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ notificationStats.unread }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Chưa đọc</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ notificationStats.priority }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Ưu tiên cao</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  ShoppingCart,
  Users,
  Package
} from 'lucide-vue-next';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  LineChart,
  BarChart,
  PieChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import { allProducts, allOrders } from '@/data/mockData';
import { useNotifications } from '@/composables/useNotifications';
import { isDark } from '@/composables/useTheme';

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

const { notifications } = useNotifications();

const selectedPeriod = ref('30d');
const revenueChartPeriod = ref('30d');
const isRefreshing = ref(false);

// Key metrics
const keyMetrics = computed(() => [
  {
    label: 'Tổng doanh thu',
    value: '¥2,450,000',
    change: '+12.5%',
    trend: 'up' as const,
    icon: DollarSign,
    iconBg: 'bg-green-100 dark:bg-green-900/50',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    label: 'Đơn hàng',
    value: '1,234',
    change: '+8.2%',
    trend: 'up' as const,
    icon: ShoppingCart,
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    label: 'Khách hàng mới',
    value: '89',
    change: '+15.3%',
    trend: 'up' as const,
    icon: Users,
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    label: 'Sản phẩm bán',
    value: '2,156',
    change: '-2.1%',
    trend: 'down' as const,
    icon: Package,
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
]);

// Top products
const topProducts = computed(() => {
  return allProducts.slice(0, 10).map((product, index) => ({
    id: product.id,
    name: product.name,
    image: product.images[0] || product.imageUrl,
    sold: Math.floor(Math.random() * 500) + 50,
    revenue: Math.floor(Math.random() * 500000) + 100000
  })).sort((a, b) => b.revenue - a.revenue);
});

// Inventory stats
const inventoryStats = computed(() => ({
  totalProducts: allProducts.length,
  lowStock: Math.floor(allProducts.length * 0.15),
  outOfStock: Math.floor(allProducts.length * 0.05)
}));

// Notification stats
const notificationStats = computed(() => {
  const total = notifications.value.length;
  const read = notifications.value.filter(n => n.isRead).length;
  const unread = total - read;
  const priority = notifications.value.filter(n => n.priority === 'high' || n.priority === 'urgent').length;
  
  return { total, read, unread, priority };
});

// Chart options
const revenueChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: isDark.value ? '#374151' : '#ffffff',
    borderColor: isDark.value ? '#4B5563' : '#E5E7EB',
    textStyle: {
      color: isDark.value ? '#F9FAFB' : '#111827'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: getLast30Days(),
    axisLine: {
      lineStyle: {
        color: isDark.value ? '#4B5563' : '#E5E7EB'
      }
    },
    axisLabel: {
      color: isDark.value ? '#9CA3AF' : '#6B7280'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: isDark.value ? '#4B5563' : '#E5E7EB'
      }
    },
    axisLabel: {
      color: isDark.value ? '#9CA3AF' : '#6B7280',
      formatter: (value: number) => `¥${value}K`
    },
    splitLine: {
      lineStyle: {
        color: isDark.value ? '#374151' : '#F3F4F6'
      }
    }
  },
  series: [
    {
      name: 'Doanh thu',
      type: 'line',
      smooth: true,
      data: generateRevenueData(),
      lineStyle: {
        color: '#6366F1'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
          ]
        }
      }
    }
  ]
}));

const customerChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: isDark.value ? '#374151' : '#ffffff',
    borderColor: isDark.value ? '#4B5563' : '#E5E7EB',
    textStyle: {
      color: isDark.value ? '#F9FAFB' : '#111827'
    }
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: isDark.value ? '#E5E7EB' : '#374151'
    }
  },
  series: [
    {
      name: 'Khách hàng',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Khách hàng mới' },
        { value: 735, name: 'Khách hàng quay lại' },
        { value: 580, name: 'VIP' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}));

const orderStatusChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    backgroundColor: isDark.value ? '#374151' : '#ffffff',
    borderColor: isDark.value ? '#4B5563' : '#E5E7EB',
    textStyle: {
      color: isDark.value ? '#F9FAFB' : '#111827'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['Chờ xử lý', 'Đã xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'],
    axisLine: {
      lineStyle: {
        color: isDark.value ? '#4B5563' : '#E5E7EB'
      }
    },
    axisLabel: {
      color: isDark.value ? '#9CA3AF' : '#6B7280'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: isDark.value ? '#4B5563' : '#E5E7EB'
      }
    },
    axisLabel: {
      color: isDark.value ? '#9CA3AF' : '#6B7280'
    },
    splitLine: {
      lineStyle: {
        color: isDark.value ? '#374151' : '#F3F4F6'
      }
    }
  },
  series: [
    {
      name: 'Số đơn hàng',
      type: 'bar',
      data: [65, 123, 87, 234, 12],
      itemStyle: {
        color: '#6366F1'
      }
    }
  ]
}));

// Helper functions
const getLast30Days = () => {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }));
  }
  return dates;
};

const generateRevenueData = () => {
  const data = [];
  for (let i = 0; i < 30; i++) {
    data.push(Math.floor(Math.random() * 100) + 50);
  }
  return data;
};

const refreshData = async () => {
  isRefreshing.value = true;
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  isRefreshing.value = false;
};

onMounted(() => {
  // Initialize any required data
});
</script>
