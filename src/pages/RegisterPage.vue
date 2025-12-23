<template>
  <v-main class="register-page">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          
          <!-- Register Card -->
          <v-card class="register-card rounded-xl pa-8" elevation="0">
            
            <!-- Logo & Title -->
            <div class="text-center mb-6">
              <div class="logo-wrapper mb-4">
                <v-icon size="48" class="logo-icon">mdi-account-plus</v-icon>
              </div>
              <h1 class="text-h4 font-weight-bold gradient-text">Đăng ký tài khoản</h1>
              <p class="text-body-2 text-grey mt-2">Tạo tài khoản mới để mua sắm tại Wibu Shop</p>
            </div>

            <!-- Register Form -->
            <v-form @submit.prevent="handleRegister" ref="registerForm">
              
              <v-row>
                <!-- Tên đăng nhập -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.name"
                    label="Tên đăng nhập"
                    variant="outlined"
                    rounded="lg"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="nameRules"
                    :error-messages="errors.name"
                    required
                  ></v-text-field>
                </v-col>

                <!-- Họ và tên -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.full_name"
                    label="Họ và tên"
                    variant="outlined"
                    rounded="lg"
                    prepend-inner-icon="mdi-card-account-details-outline"
                    :rules="fullNameRules"
                    :error-messages="errors.full_name"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Email -->
              <v-text-field
                v-model="formData.email"
                label="Email"
                type="email"
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-email-outline"
                :rules="emailRules"
                :error-messages="errors.email"
                class="mb-1"
                required
              ></v-text-field>

              <!-- Số điện thoại -->
              <v-text-field
                v-model="formData.phone_number"
                label="Số điện thoại (không bắt buộc)"
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-phone-outline"
                :error-messages="errors.phone_number"
                class="mb-1"
              ></v-text-field>

              <v-row>
                <!-- Mật khẩu -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.password"
                    label="Mật khẩu"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    rounded="lg"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    :rules="passwordRules"
                    :error-messages="errors.password"
                    required
                  ></v-text-field>
                </v-col>

                <!-- Xác nhận mật khẩu -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.password_confirmation"
                    label="Xác nhận mật khẩu"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    variant="outlined"
                    rounded="lg"
                    prepend-inner-icon="mdi-lock-check-outline"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    :rules="confirmPasswordRules"
                    :error-messages="errors.password_confirmation"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Đồng ý điều khoản -->
              <div class="terms-checkbox pa-3 rounded-lg mb-4">
                <v-checkbox
                  v-model="agreeTerms"
                  color="primary"
                  density="compact"
                  hide-details
                >
                  <template #label>
                    <span class="text-body-2 terms-label">
                      Tôi đồng ý với 
                      <a href="#" class="text-primary">Điều khoản sử dụng</a>
                      và
                      <a href="#" class="text-primary">Chính sách bảo mật</a>
                    </span>
                  </template>
                </v-checkbox>
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

              <!-- Success Message -->
              <v-alert
                v-if="successMessage"
                type="success"
                variant="tonal"
                rounded="lg"
                class="mb-4"
              >
                {{ successMessage }}
              </v-alert>

              <!-- Register Button -->
              <v-btn
                type="submit"
                block
                size="x-large"
                rounded="lg"
                :loading="isLoading"
                :disabled="isLoading || !agreeTerms"
                class="register-btn mb-6"
              >
                <v-icon start>mdi-account-plus</v-icon>
                Đăng ký
              </v-btn>

            </v-form>

            <!-- Divider -->
            <div class="divider-wrapper mb-6">
              <v-divider></v-divider>
              <span class="divider-text text-grey text-body-2 px-3">hoặc</span>
              <v-divider></v-divider>
            </div>

            <!-- Social Register -->
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

            <!-- Login Link -->
            <p class="text-center text-body-2">
              Đã có tài khoản?
              <router-link to="/login" class="text-primary font-weight-bold text-decoration-none">
                Đăng nhập ngay
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
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import apiClient from '@/api';

const router = useRouter();
const toast = useToast();

// Form data
const formData = reactive({
  name: '',
  full_name: '',
  email: '',
  phone_number: '',
  password: '',
  password_confirmation: '',
});

const agreeTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// State
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const errors = reactive({
  name: '',
  full_name: '',
  email: '',
  phone_number: '',
  password: '',
  password_confirmation: '',
});

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Vui lòng nhập tên đăng nhập',
  (v: string) => v.length >= 3 || 'Tên đăng nhập phải có ít nhất 3 ký tự',
  (v: string) => /^[a-zA-Z0-9_]+$/.test(v) || 'Chỉ được dùng chữ cái, số và dấu gạch dưới',
];

const fullNameRules = [
  (v: string) => !!v || 'Vui lòng nhập họ và tên',
  (v: string) => v.length >= 2 || 'Họ và tên phải có ít nhất 2 ký tự',
];

const emailRules = [
  (v: string) => !!v || 'Vui lòng nhập email',
  (v: string) => /.+@.+\..+/.test(v) || 'Email không hợp lệ',
];

const passwordRules = [
  (v: string) => !!v || 'Vui lòng nhập mật khẩu',
  (v: string) => v.length >= 6 || 'Mật khẩu phải có ít nhất 6 ký tự',
];

const confirmPasswordRules = [
  (v: string) => !!v || 'Vui lòng xác nhận mật khẩu',
  (v: string) => v === formData.password || 'Mật khẩu xác nhận không khớp',
];

// Clear errors
const clearErrors = () => {
  errorMessage.value = '';
  errors.name = '';
  errors.full_name = '';
  errors.email = '';
  errors.phone_number = '';
  errors.password = '';
  errors.password_confirmation = '';
};

// Handle Register
const handleRegister = async () => {
  clearErrors();
  successMessage.value = '';

  // Validate
  if (!formData.name) {
    errors.name = 'Vui lòng nhập tên đăng nhập';
    return;
  }
  if (!formData.full_name) {
    errors.full_name = 'Vui lòng nhập họ và tên';
    return;
  }
  if (!formData.email) {
    errors.email = 'Vui lòng nhập email';
    return;
  }
  if (!formData.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
    return;
  }
  if (formData.password !== formData.password_confirmation) {
    errors.password_confirmation = 'Mật khẩu xác nhận không khớp';
    return;
  }
  if (!agreeTerms.value) {
    errorMessage.value = 'Vui lòng đồng ý với điều khoản sử dụng';
    return;
  }

  isLoading.value = true;

  try {
    // Gọi API register - Tên thuộc tính phải khớp với C# (PascalCase hoặc camelCase)
    const response = await apiClient.post('/auth/register', {
      Name: formData.name,
      FullName: formData.full_name,
      Email: formData.email,
      PhoneNumber: formData.phone_number || null,
      Password: formData.password,
      PasswordConfirmation: formData.password_confirmation,
    });

    // Kiểm tra response - hỗ trợ cả PascalCase và camelCase
    const data = response.data;
    const isSuccess = data.Success ?? data.success;
    const message = data.Message ?? data.message;

    if (isSuccess) {
      successMessage.value = message || 'Đăng ký thành công! Đang chuyển hướng...';
      
      // Hiển thị toast thành công
      toast.success('Đăng ký tài khoản thành công!');
      
      // Chuyển về trang login sau 2 giây
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      errorMessage.value = message || 'Đăng ký thất bại';
    }
  } catch (error: any) {
    if (error.response?.status === 422) {
      // Validation errors từ server - hỗ trợ cả PascalCase và camelCase
      const serverErrors = error.response.data?.Errors ?? error.response.data?.errors;
      if (serverErrors?.name) errors.name = serverErrors.name[0];
      if (serverErrors?.full_name) errors.full_name = serverErrors.full_name[0];
      if (serverErrors?.email) errors.email = serverErrors.email[0];
      if (serverErrors?.phone_number) errors.phone_number = serverErrors.phone_number[0];
      if (serverErrors?.password) errors.password = serverErrors.password[0];
      if (serverErrors?.password_confirmation) errors.password_confirmation = serverErrors.password_confirmation[0];
      
      // Also show general error message if available
      const msg = error.response.data?.Message ?? error.response.data?.message;
      if (msg) errorMessage.value = msg;
    } else {
      const msg = error.response?.data?.Message ?? error.response?.data?.message;
      errorMessage.value = msg || 'Có lỗi xảy ra, vui lòng thử lại sau';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;
}

/* Background decoration */
.register-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(217, 70, 239, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%);
  animation: rotate 30s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.register-card {
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
  background: linear-gradient(135deg, #d946ef 0%, #0ea5e9 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(217, 70, 239, 0.3);
}

.logo-icon {
  color: white !important;
}

.gradient-text {
  background: linear-gradient(135deg, #d946ef 0%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-btn {
  background: linear-gradient(135deg, #d946ef 0%, #0ea5e9 100%) !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

.register-btn:hover {
  box-shadow: 0 8px 25px rgba(217, 70, 239, 0.4);
  transform: translateY(-2px);
}

.register-btn:disabled {
  opacity: 0.6;
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

/* ===== INPUT STYLES ===== */

:deep(.v-text-field .v-field) {
  background-color: #f8fafc !important;
  border-radius: 12px !important;
}

:deep(.v-text-field .v-field--variant-outlined .v-field__outline) {
  color: #94a3b8 !important;
}

:deep(.v-text-field .v-icon) {
  color: #64748b !important;
  opacity: 1 !important;
}

:deep(.v-text-field .v-label) {
  color: #475569 !important;
  opacity: 1 !important;
}

:deep(.v-text-field input) {
  color: #1e293b !important;
}

:deep(.v-text-field .v-field--focused .v-field__outline) {
  color: #d946ef !important;
}

:deep(.v-text-field .v-field--focused) {
  background-color: #fdf4ff !important;
}

/* Checkbox container */
.terms-checkbox {
  background-color: #f8fafc;
  border: 1.5px solid #cbd5e1;
}

.terms-checkbox:has(.v-checkbox--indeterminate),
.terms-checkbox:hover {
  border-color: #94a3b8;
  background-color: #f1f5f9;
}

.terms-label {
  color: #475569 !important;
}

:deep(.v-checkbox .v-selection-control__input) {
  color: #64748b !important;
}

:deep(.v-checkbox .v-label) {
  color: #475569 !important;
  opacity: 1 !important;
}

.social-btn {
  border: 1.5px solid #cbd5e1 !important;
  color: #334155 !important;
}

.social-btn:hover {
  background-color: #f1f5f9 !important;
  border-color: #94a3b8 !important;
}
</style>
