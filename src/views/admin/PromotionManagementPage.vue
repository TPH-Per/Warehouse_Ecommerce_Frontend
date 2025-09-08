<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Quản lý Khuyến mãi</h2>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-500 dark:text-gray-400 text-sm">
              <th class="py-2 px-4">Mã</th>
              <th class="py-2 px-4">Loại</th>
              <th class="py-2 px-4">Giá trị</th>
              <th class="py-2 px-4">Sử dụng</th>
              <th class="py-2 px-4">Hết hạn</th>
              <th class="py-2 px-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="promotionStore.loading" class="border-b dark:border-gray-700">
              <td colspan="6" class="py-8 text-center text-gray-500 dark:text-gray-400">
                Đang tải dữ liệu...
              </td>
            </tr>
            <tr v-else-if="promotionStore.error" class="border-b dark:border-gray-700">
              <td colspan="6" class="py-8 text-center text-red-500">
                {{ promotionStore.error }}
              </td>
            </tr>
            <tr v-else-if="promotionStore.coupons.length === 0" class="border-b dark:border-gray-700">
              <td colspan="6" class="py-8 text-center text-gray-500 dark:text-gray-400">
                Không có khuyến mãi nào
              </td>
            </tr>
            <tr v-else v-for="coupon in promotionStore.coupons" :key="coupon.id" class="border-b dark:border-gray-700">
              <td class="py-3 px-4 font-mono text-sm text-gray-900 dark:text-gray-100">{{ coupon.code }}</td>
              <td class="py-3 px-4 capitalize text-gray-900 dark:text-gray-100">{{ translateCouponType(coupon.type) }}</td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">{{ coupon.type === 'percentage' ? `${coupon.value}%` : `¥${coupon.value}` }}</td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">{{ coupon.usageCount }} / {{ coupon.usageLimit || '∞' }}</td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">{{ new Date(coupon.expiresAt).toLocaleDateString('vi-VN') }}</td>
              <td class="py-3 px-4">
                <span :class="coupon.isActive ? 'text-green-500' : 'text-red-500'">●</span>
                <span class="text-gray-900 dark:text-gray-100">{{ coupon.isActive ? 'Hoạt động' : 'Không hoạt động' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePromotionStore } from '@/stores/promotion';

const promotionStore = usePromotionStore();

const translateCouponType = (type: string) => {
  const translations: Record<string, string> = {
    'percentage': 'Phần trăm',
    'fixed': 'Cố định'
  };
  return translations[type] || type;
};

// Fetch coupons when component mounts
onMounted(() => {
  promotionStore.fetchCoupons();
});
</script>
