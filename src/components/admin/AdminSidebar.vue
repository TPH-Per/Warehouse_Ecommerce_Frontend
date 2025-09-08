<template>
  <aside 
    class="relative bg-gray-800 text-gray-100 w-64 flex-shrink-0 transition-all duration-300"
    :class="{ 'w-64': isOpen, 'w-20': !isOpen }"
  >
    <div class="flex items-center justify-center h-20 border-b border-gray-700">
      <router-link to="/admin" class="flex items-center space-x-2">
        <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">OP</span>
        </div>
        <span v-if="isOpen" class="text-xl font-bold">Admin</span>
      </router-link>
    </div>

    <nav class="mt-6 px-4 space-y-2">
      <div v-for="item in menuItems" :key="item.name">
        <router-link
          v-if="hasPermission(item.permission)"
          :to="item.path"
          class="flex items-center py-2.5 px-4 rounded-lg transition-colors duration-200"
          :class="[
            $route.path.startsWith(item.path) 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white',
            { 'justify-center': !isOpen }
          ]"
          :title="isOpen ? '' : item.name"
        >
          <component :is="item.icon" class="h-6 w-6" />
          <span v-if="isOpen" class="ml-4 font-medium">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { 
  LayoutDashboard, Package, Boxes, ShoppingCart, Star, Tag, BarChart2, Radio, Users, Warehouse
} from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import { PERMISSIONS } from '@/config/permissions';

defineProps<{
  isOpen: boolean;
}>();

const { hasPermission } = useAuth();

const menuItems = [
  { name: 'Bảng điều khiển', path: '/admin/dashboard', icon: LayoutDashboard, permission: PERMISSIONS.VIEW_DASHBOARD },
  { name: 'Sản phẩm', path: '/admin/products', icon: Package, permission: PERMISSIONS.MANAGE_PRODUCTS },
  { name: 'Kho hàng', path: '/admin/warehouses', icon: Warehouse, permission: PERMISSIONS.MANAGE_INVENTORY },
  { name: 'Tồn kho', path: '/admin/inventory', icon: Boxes, permission: PERMISSIONS.MANAGE_INVENTORY },
  { name: 'Đơn hàng', path: '/admin/orders', icon: ShoppingCart, permission: PERMISSIONS.MANAGE_ORDERS },
  { name: 'Đánh giá', path: '/admin/reviews', icon: Star, permission: PERMISSIONS.MODERATE_REVIEWS },
  { name: 'Khuyến mãi', path: '/admin/promotions', icon: Tag, permission: PERMISSIONS.MANAGE_PROMOTIONS },
  { name: 'Phân tích', path: '/admin/analytics', icon: BarChart2, permission: PERMISSIONS.VIEW_REPORTS },
  { name: 'Giám sát IoT', path: '/admin/iot', icon: Radio, permission: PERMISSIONS.VIEW_IOT_DASHBOARD },
  { name: 'Người dùng', path: '/admin/users', icon: Users, permission: PERMISSIONS.MANAGE_USERS },
];
</script>
