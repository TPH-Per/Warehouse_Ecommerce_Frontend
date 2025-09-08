<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">System Settings</h2>
    
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="mt-6">
        <form @submit.prevent="saveSettings">
          <!-- Store Settings -->
          <div v-if="activeTab === 'store'">
            <div class="space-y-4 max-w-lg">
              <div>
                <label for="storeName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Store Name</label>
                <input type="text" id="storeName" v-model="settings.store.name" class="mt-1 block w-full input-field">
              </div>
              <div>
                <label for="storeEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                <input type="email" id="storeEmail" v-model="settings.store.email" class="mt-1 block w-full input-field">
              </div>
            </div>
          </div>

          <!-- Payment Settings -->
          <div v-if="activeTab === 'payment'">
            <div class="space-y-4 max-w-lg">
              <div>
                <label for="vnpayKey" class="block text-sm font-medium text-gray-700 dark:text-gray-300">VNPay API Key</label>
                <input type="password" id="vnpayKey" v-model="settings.payment.vnpayKey" class="mt-1 block w-full input-field">
              </div>
              <div>
                <label for="momoKey" class="block text-sm font-medium text-gray-700 dark:text-gray-300">MoMo API Key</label>
                <input type="password" id="momoKey" v-model="settings.payment.momoKey" class="mt-1 block w-full input-field">
              </div>
            </div>
          </div>

          <!-- IoT Settings -->
          <div v-if="activeTab === 'iot'">
            <div class="space-y-4 max-w-lg">
              <div>
                <label for="iotSecret" class="block text-sm font-medium text-gray-700 dark:text-gray-300">IoT Shared Secret</label>
                <div class="flex items-center space-x-2">
                  <input type="password" id="iotSecret" v-model="settings.iot.sharedSecret" class="mt-1 block w-full input-field">
                  <button type="button" @click="generateNewSecret" class="btn btn-secondary mt-1">Generate</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="mt-8 border-t dark:border-gray-700 pt-5">
            <button type="submit" class="btn btn-primary" :disabled="!isDirty">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const activeTab = ref('store');
const tabs = [
  { id: 'store', name: 'Store' },
  { id: 'payment', name: 'Payment' },
  { id: 'email', name: 'Email' },
  { id: 'shipping', name: 'Shipping' },
  { id: 'iot', name: 'IoT' },
  { id: 'backup', name: 'Backup' },
];

const settings = ref({
  store: { name: 'Otaku Paradise', email: 'contact@otaku-paradise.com' },
  payment: { vnpayKey: '**********', momoKey: '**********' },
  iot: { sharedSecret: '****************' },
});

const originalSettings = ref({});
const isDirty = ref(false);

onMounted(() => {
  // Deep copy for original state
  originalSettings.value = JSON.parse(JSON.stringify(settings.value));
});

watch(settings, (newValue) => {
  isDirty.value = JSON.stringify(newValue) !== JSON.stringify(originalSettings.value);
}, { deep: true });

const saveSettings = () => {
  // Mock save
  console.log('Saving settings:', settings.value);
  originalSettings.value = JSON.parse(JSON.stringify(settings.value));
  isDirty.value = false;
  alert('Settings saved successfully!');
};

const generateNewSecret = () => {
  const confirmation = prompt('This will generate a new secret and invalidate the old one. Type "GENERATE" to confirm.');
  if (confirmation === 'GENERATE') {
    const newSecret = [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    settings.value.iot.sharedSecret = newSecret;
    alert('New secret generated. Remember to save your settings.');
  }
};
</script>

<style scoped>
.input-field {
  @apply px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500
  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-pink-400 dark:focus:border-pink-400;
}
</style>
