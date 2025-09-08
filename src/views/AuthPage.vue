<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-2xl">OP</span>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
        Chào mừng đến với Otaku Paradise
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!authMode" class="space-y-4">
          <button @click="setAuthMode('customer')" class="w-full btn btn-primary py-3 text-lg border-2 border-pink-500 shadow-lg transform hover:scale-105 transition-all duration-200">
            Đăng nhập với tư cách Khách hàng
          </button>
          <button @click="setAuthMode('admin')" class="w-full py-3 text-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
            Đăng nhập với tư cách quản lý
          </button>
          <div class="text-center">
             <button @click="setAuthMode('register')" class="font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300">
                Chưa có tài khoản? Đăng ký
            </button>
          </div>
        </div>

        <div v-if="authMode">
          <button @click="authMode = null" class="text-sm text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300 mb-4 flex items-center">
            <ChevronLeft class="h-4 w-4 mr-1" />
            Trở lại
          </button>
          <h3 class="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-gray-100">
            {{ authMode === 'register' ? 'Tạo tài khoản của bạn' : `Đăng nhập với tư cách ${authMode === 'admin' ? 'Quản lý' : 'Khách hàng'}` }}
          </h3>

          <!-- Age Verification (for signup) -->
          <!-- Removed: Age verification is no longer required -->

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div v-if="authMode === 'register'" class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên</label>
                <input id="firstName" type="text" v-model="formData.firstName" required class="mt-1 block w-full input-field" />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Họ</label>
                <input id="lastName" type="text" v-model="formData.lastName" required class="mt-1 block w-full input-field" />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ email</label>
              <input id="email" type="email" v-model="formData.email" required class="mt-1 block w-full input-field" />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu</label>
              <div class="mt-1 relative">
                <input id="password" :type="showPassword ? 'text' : 'password'" v-model="formData.password" required class="block w-full pr-10 input-field" />
                <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                  <EyeOff v-else class="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div v-if="authMode !== 'register'" class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" type="checkbox" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded" />
                <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Ghi nhớ đăng nhập</label>
              </div>
              <button type="button" class="text-sm text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300">
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" :disabled="loading" class="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              <Loader v-if="loading" class="animate-spin h-5 w-5 mr-2" />
              {{ authMode === 'register' ? 'Tạo tài khoản' : 'Đăng nhập' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AlertTriangle, Eye, EyeOff, Loader, ChevronLeft } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { login, register } = useAuth();

type AuthMode = 'admin' | 'customer' | 'register' | null;
const authMode = ref<AuthMode>(null);

const loading = ref(false);
const showPassword = ref(false);
// Removed: ageVerified is no longer needed

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
});

const setAuthMode = (mode: AuthMode) => {
  authMode.value = mode;
  // Pre-fill for easier testing
  if (mode === 'admin') formData.value.email = 'manager@gmail.com';
  if (mode === 'customer') formData.value.email = 'customer@gmail.com';
  if (mode) formData.value.password = '123sinhtobO';
};

const handleSubmit = async () => {
  loading.value = true;
  
  try {
    if (authMode.value === 'register') {
      await register({
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        preferences: { currency: 'JPY', language: 'vi' },
      });
      router.push('/');
    } else {
      const { success, user } = await login(formData.value.email, formData.value.password);
      if (success) {
        if (user?.role === 'admin' || user?.role === 'manager') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        alert('Thông tin đăng nhập không hợp lệ hoặc vai trò không khớp.');
      }
    }
  } catch (error) {
    console.error('Auth error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input-field {
  @apply px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500
  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-pink-400 dark:focus:border-pink-400;
}
</style>
