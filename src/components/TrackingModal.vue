<template>
  <div v-if="isOpen && shipment" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Theo dõi đơn hàng
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-mono">{{ shipment.trackingNumber }}</p>
        </div>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <X class="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <ul class="space-y-6">
          <li v-for="(event, index) in trackingHistory" :key="index" class="flex items-start">
            <div class="flex flex-col items-center mr-4">
              <div 
                class="w-4 h-4 rounded-full"
                :class="index === 0 ? 'bg-green-500 ring-4 ring-green-500/30' : 'bg-gray-300 dark:bg-gray-600'"
              ></div>
              <div v-if="index < trackingHistory.length - 1" class="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-800 dark:text-gray-200">{{ event.status }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ event.location }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatDate(event.date) }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import type { Shipment } from '@/types';
import { faker } from '@faker-js/faker';

const props = defineProps<{
  isOpen: boolean;
  shipment: Shipment | null;
}>();

defineEmits(['close']);

interface TrackingEvent {
  date: string;
  status: string;
  location: string;
}

const trackingHistory = ref<TrackingEvent[]>([]);

const generateMockHistory = (shipmentStatus: string) => {
  const history: TrackingEvent[] = [];
  const now = new Date();

  history.push({
    date: faker.date.recent({ days: 3 }).toISOString(),
    status: 'Đã tạo nhãn vận chuyển',
    location: 'Tokyo, Nhật Bản',
  });

  if (['in-transit', 'delivered'].includes(shipmentStatus)) {
    history.unshift({
      date: faker.date.recent({ days: 2 }).toISOString(),
      status: 'Đang vận chuyển tới đích',
      location: 'Sân bay quốc tế Narita, Nhật Bản',
    });
  }

  if (shipmentStatus === 'delivered') {
    history.unshift({
      date: faker.date.recent({ days: 1 }).toISOString(),
      status: 'Đang giao hàng',
      location: 'Trung tâm phân phối địa phương',
    });
    history.unshift({
      date: now.toISOString(),
      status: 'Đã giao hàng',
      location: 'Cửa nhà',
    });
  }
  
  return history;
};

watch(() => props.shipment, (newShipment) => {
  if (newShipment) {
    trackingHistory.value = generateMockHistory(newShipment.status);
  }
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
