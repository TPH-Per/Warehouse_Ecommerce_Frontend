<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">IoT Dashboard</h2>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="sensor in sensors" :key="sensor.id" class="border p-4 rounded-lg">
          <div class="flex justify-between items-center">
            <p class="font-semibold">
              {{ sensor.type === 'temperature' ? 'Temperature' : 'Humidity' }} -
              {{ sensor.zoneName || sensor.zoneId }}
            </p>
            <span
              class="px-2 py-1 text-xs rounded-full"
              :class="getStatusColor(isAlert(sensor) ? 'alert' : sensor.status)"
            >
              {{ isAlert(sensor) ? 'alert' : sensor.status }}
            </span>
          </div>
          <p class="text-3xl font-bold mt-2">
            {{ sensor.lastReading }}{{ sensor.type === 'temperature' ? '°C' : '%' }}
          </p>
          <p class="text-xs text-gray-500">
            Last updated: {{ new Date(sensor.lastReadingTimestamp).toLocaleTimeString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Sensor, SensorAlertRule } from '@/types';

const sensors = ref<Sensor[]>([]);
const alertRules = ref<SensorAlertRule[]>([]);

const fetchSensors = async () => {
  try {
    const res = await fetch('/api/iot/sensors');
    if (res.ok) {
      sensors.value = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch sensors', error);
  }
};

const fetchAlertRules = async () => {
  try {
    const res = await fetch('/api/iot/sensor-alert-rules');
    if (res.ok) {
      alertRules.value = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch alert rules', error);
  }
};

const refresh = async () => {
  await Promise.all([fetchSensors(), fetchAlertRules()]);
};

let intervalId: number | undefined;
onMounted(async () => {
  await refresh();
  intervalId = window.setInterval(fetchSensors, 5000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const isAlert = (sensor: Sensor) => {
  const rule = alertRules.value.find((r) => r.sensorId === sensor.id);
  if (!rule) return false;
  if (rule.min !== undefined && sensor.lastReading < rule.min) return true;
  if (rule.max !== undefined && sensor.lastReading > rule.max) return true;
  return false;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    online: 'bg-green-100 text-green-800',
    offline: 'bg-gray-100 text-gray-800',
    alert: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
</script>
