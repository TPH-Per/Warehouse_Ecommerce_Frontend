<template>
  <v-main class="login-page">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          
          <!-- Login Card -->
          <v-card class="login-card rounded-xl pa-8" elevation="0">
            
            <!-- Logo & Title -->
            <div class="text-center mb-8">
              <div class="logo-wrapper mb-4">
                <v-icon size="48" class="logo-icon">mdi-store</v-icon>
              </div>
              <h1 class="text-h4 font-weight-bold gradient-text">Wibu Shop</h1>
              <p class="text-body-2 text-grey mt-2">Đăng nhập để tiếp tục mua sắm</p>
            </div>

            <!-- Login Form -->
            <v-form @submit.prevent="handleLogin" ref="loginForm">
              
              <!-- Email Field -->
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-email-outline"
                :rules="emailRules"
                :error-messages="errors.email"
                class="mb-4"
                required
              ></v-text-field>

              <!-- Password Field -->
              <v-text-field
                v-model="password"
                label="Mật khẩu"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                :rules="passwordRules"
                :error-messages="errors.password"
                class="mb-2"
                required
              ></v-text-field>

              <!-- Remember Me & Forgot Password -->
              <div class="d-flex justify-space-between align-center mb-6 remember-row pa-3 rounded-lg">
                <v-checkbox
                  v-model="rememberMe"
                  label="Ghi nhớ đăng nhập"
                  color="primary"
                  density="compact"
                  hide-details
                  class="remember-checkbox"
                ></v-checkbox>
                <a href="#" class="text-primary text-decoration-none text-body-2 font-weight-medium">
                  Quên mật khẩu?
                </a>
              </div>

              <!-- Error Message -->
              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                rounded="lg"
                class="mb-4"
                closable
                @click:close="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>

              <!-- Login Button -->
              <v-btn
                type="submit"
                block
                size="x-large"
                rounded="lg"
                :loading="isLoading"
                :disabled="isLoading"
                class="login-btn mb-6"
              >
                <v-icon start>mdi-login</v-icon>
                Đăng nhập
              </v-btn>

            </v-form>

            <!-- Divider -->
            <div class="divider-wrapper mb-6">
              <v-divider></v-divider>
              <span class="divider-text text-grey text-body-2 px-3">hoặc</span>
              <v-divider></v-divider>
            </div>

            <!-- Social Login (Optional) -->
            <div class="d-flex ga-3 mb-6">
              <v-btn
                variant="outlined"
                rounded="lg"
                size="large"
                class="flex-grow-1 social-btn"
              >
                <v-icon start color="red">mdi-google</v-icon>
                Google
              </v-btn>
              <v-btn
                variant="outlined"
                rounded="lg"
                size="large"
                class="flex-grow-1 social-btn"
              >
                <v-icon start color="blue">mdi-facebook</v-icon>
                Facebook
              </v-btn>
            </div>

            <!-- Register Link -->
            <p class="text-center text-body-2">
              Chưa có tài khoản?
              <router-link to="/register" class="text-primary font-weight-bold text-decoration-none">
                Đăng ký ngay
              </router-link>
            </p>

          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import apiClient from '@/api';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Form data
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

// State
const isLoading = ref(false);
const errorMessage = ref('');
const errors = reactive({
  email: '',
  password: '',
});

// Validation rules
const emailRules = [
  (v: string) => !!v || 'Vui lòng nhập email',
  (v: string) => /.+@.+\..+/.test(v) || 'Email không hợp lệ',
];

const passwordRules = [
  (v: string) => !!v || 'Vui lòng nhập mật khẩu',
  (v: string) => v.length >= 6 || 'Mật khẩu phải có ít nhất 6 ký tự',
];

// Handle Login
const handleLogin = async () => {
  // Clear previous errors
  errorMessage.value = '';
  errors.email = '';
  errors.password = '';

  // Basic validation
  if (!email.value) {
    errors.email = 'Vui lòng nhập email';
    return;
  }
  if (!password.value) {
    errors.password = 'Vui lòng nhập mật khẩu';
    return;
  }

  isLoading.value = true;

  try {
    // Gọi API login
    const response = await apiClient.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    // Kiểm tra response từ ASP.NET
    // C# có thể trả về PascalCase (Success) hoặc camelCase (success)
    const data = response.data;
    const isSuccess = data.Success ?? data.success;
    const userData = data.Data ?? data.data;
    const message = data.Message ?? data.message;

    if (isSuccess) {
      // Chuyển đổi PascalCase sang camelCase cho auth store
      const user = {
        id: userData.Id ?? userData.id,
        name: userData.Name ?? userData.name,
        full_name: userData.FullName ?? userData.full_name,
        email: userData.Email ?? userData.email,
        phone_number: userData.PhoneNumber ?? userData.phone_number,
        role_id: userData.RoleId ?? userData.role_id,
        role_name: userData.RoleName ?? userData.role_name,
      };

      // Lưu user vào store
      authStore.login(user);

      // Redirect về trang trước đó hoặc trang chủ
      const redirectTo = (route.query.redirect as string) || '/';
      router.push(redirectTo);
    } else {
      // Hiển thị lỗi từ server
      errorMessage.value = message || 'Đăng nhập thất bại';
    }
  } catch (error: any) {
    // Xử lý lỗi
    if (error.response?.status === 401) {
      // Lỗi 401 - lấy message từ response nếu có
      const msg = error.response.data?.Message ?? error.response.data?.message;
      errorMessage.value = msg || 'Email hoặc mật khẩu không đúng';
    } else if (error.response?.status === 403) {
      const msg = error.response.data?.Message ?? error.response.data?.message;
      errorMessage.value = msg || 'Tài khoản đã bị khóa';
    } else if (error.response?.status === 422) {
      // Validation errors từ server
      const serverErrors = error.response.data?.Errors ?? error.response.data?.errors;
      if (serverErrors?.email) errors.email = serverErrors.email[0];
      if (serverErrors?.password) errors.password = serverErrors.password[0];
    } else {
      errorMessage.value = 'Có lỗi xảy ra, vui lòng thử lại sau';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;
}

/* Background decoration */
.login-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(217, 70, 239, 0.1) 0%, transparent 50%);
  animation: rotate 30s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.logo-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(14, 165, 233, 0.3);
}

.logo-icon {
  color: white !important;
}

.gradient-text {
  background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%) !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

.login-btn:hover {
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
  transform: translateY(-2px);
}

.divider-wrapper {
  display: flex;
  align-items: center;
}

.divider-text {
  background: rgba(255, 255, 255, 0.98);
  white-space: nowrap;
}

.ga-3 {
  gap: 12px;
}

/* ===== INPUT STYLES - Đơn giản, ít xung đột ===== */

/* Background cho input */
:deep(.v-text-field .v-field) {
  background-color: #f8fafc !important;
  border-radius: 12px !important;
}

/* Tăng độ đậm cho viền */
:deep(.v-text-field .v-field--variant-outlined .v-field__outline) {
  color: #94a3b8 !important;
}

/* Icon màu đậm */
:deep(.v-text-field .v-icon) {
  color: #64748b !important;
  opacity: 1 !important;
}

/* Label màu đậm */
:deep(.v-text-field .v-label) {
  color: #475569 !important;
  opacity: 1 !important;
}

/* Text nhập vào màu đen */
:deep(.v-text-field input) {
  color: #1e293b !important;
}

/* Focus state */
:deep(.v-text-field .v-field--focused .v-field__outline) {
  color: #0ea5e9 !important;
}

:deep(.v-text-field .v-field--focused) {
  background-color: #f0f9ff !important;
}

/* Remember Me Row */
.remember-row {
  background-color: #f8fafc;
  border: 1.5px solid #e2e8f0;
}

.remember-row:hover {
  border-color: #cbd5e1;
  background-color: #f1f5f9;
}

/* Checkbox */
:deep(.v-checkbox .v-label) {
  color: #475569 !important;
  opacity: 1 !important;
}

:deep(.v-checkbox .v-selection-control__input) {
  color: #64748b !important;
}

/* Social buttons - viền rõ hơn */
.social-btn {
  border: 1.5px solid #cbd5e1 !important;
  color: #334155 !important;
}

.social-btn:hover {
  background-color: #f1f5f9 !important;
  border-color: #94a3b8 !important;
}
</style>
