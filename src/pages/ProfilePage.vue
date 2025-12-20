<template>
  <v-main class="bg-slate-50 pb-16">
    <v-container>
      <h1 class="text-h4 font-weight-bold mb-8 mt-4">Trang cá nhân</h1>

      <v-row>
        <v-col cols="12" lg="4">
          <v-card class="rounded-xl border-light pa-6 sticky-top" flat>
            <div class="text-center mb-8">
              <v-avatar
                size="100"
                class="mb-4 shadow-soft profile-gradient text-white text-h4 font-weight-bold"
              >
                {{ getInitials(user.full_name) }}
              </v-avatar>
              <h2 class="text-h5 font-weight-bold">{{ user.full_name }}</h2>
              <p class="text-body-2 text-grey">{{ user.email }}</p>
              <v-chip 
                :color="user.status === 'active' ? 'success' : 'error'" 
                size="small" 
                variant="flat" 
                class="mt-2"
              >
                {{ user.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động' }}
              </v-chip>
            </div>

            <v-list v-model:selected="activeTab" color="primary" class="bg-transparent" mandatory>
              <v-list-item
                v-for="item in menuItems"
                :key="item.value"
                :value="item.value"
                :prepend-icon="item.icon"
                :title="item.title"
                rounded="lg"
                class="mb-2"
                @click="tab = item.value"
              ></v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" lg="8">
          <v-window v-model="tab">
            
            <!-- Tab: Thông tin cá nhân -->
            <v-window-item value="personal">
              <v-card class="rounded-xl border-light pa-6" flat>
                <div class="d-flex justify-space-between align-center mb-6">
                  <h3 class="text-h5 font-weight-bold">Thông tin cá nhân</h3>
                  <v-btn
                    variant="tonal"
                    color="primary"
                    rounded="pill"
                    :prepend-icon="editMode ? 'mdi-close' : 'mdi-pencil'"
                    @click="editMode = !editMode"
                  >
                    {{ editMode ? 'Hủy' : 'Chỉnh sửa' }}
                  </v-btn>
                </div>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="userForm.name"
                      label="Tên đăng nhập"
                      variant="outlined"
                      rounded="lg"
                      :disabled="!editMode"
                      prepend-inner-icon="mdi-account"
                      :error-messages="formErrors.name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="userForm.full_name"
                      label="Họ và tên"
                      variant="outlined"
                      rounded="lg"
                      :disabled="!editMode"
                      prepend-inner-icon="mdi-account-outline"
                      :error-messages="formErrors.full_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userForm.email"
                      label="Email"
                      variant="outlined"
                      rounded="lg"
                      :disabled="!editMode"
                      prepend-inner-icon="mdi-email"
                      :error-messages="formErrors.email"
                      :append-inner-icon="user.email_verified_at ? 'mdi-check-circle' : 'mdi-alert-circle'"
                      :messages="user.email_verified_at ? 'Email đã xác thực' : 'Email chưa xác thực'"
                    >
                      <template v-slot:append-inner>
                        <v-icon :color="user.email_verified_at ? 'success' : 'warning'">
                          {{ user.email_verified_at ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                        </v-icon>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userForm.phone_number"
                      label="Số điện thoại"
                      variant="outlined"
                      rounded="lg"
                      :disabled="!editMode"
                      prepend-inner-icon="mdi-phone"
                      :error-messages="formErrors.phone_number"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- Success/Error Messages -->
                <v-alert
                  v-if="successMessage"
                  type="success"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                  closable
                  @click:close="successMessage = ''"
                >
                  {{ successMessage }}
                </v-alert>

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

                <v-fade-transition>
                  <div v-if="editMode" class="d-flex ga-2 mt-4">
                    <v-btn 
                      color="primary" 
                      size="large" 
                      rounded="pill" 
                      prepend-icon="mdi-content-save"
                      :loading="isSaving"
                      :disabled="isSaving"
                      @click="handleUpdateProfile"
                    >
                      Lưu thay đổi
                    </v-btn>
                    <v-btn variant="outlined" size="large" rounded="pill" @click="cancelEdit">
                      Hủy bỏ
                    </v-btn>
                  </div>
                </v-fade-transition>

                <!-- Account Info -->
                <v-divider class="my-6"></v-divider>
                <h4 class="text-subtitle-2 font-weight-bold mb-4 text-uppercase tracking-wider">Thông tin tài khoản</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="text-caption text-grey">Ngày tạo tài khoản</div>
                    <div class="font-weight-medium">{{ formatDate(user.created_at) }}</div>
                  </div>
                  <div class="info-item">
                    <div class="text-caption text-grey">Cập nhật lần cuối</div>
                    <div class="font-weight-medium">{{ formatDate(user.updated_at) }}</div>
                  </div>
                  <div class="info-item">
                    <div class="text-caption text-grey">Loại tài khoản</div>
                    <div class="font-weight-medium">{{ user.role_name }}</div>
                  </div>
                </div>
              </v-card>
            </v-window-item>

            <!-- Tab: Địa chỉ giao hàng -->
            <v-window-item value="addresses">
              <v-card class="rounded-xl border-light pa-6" flat>
                <div class="d-flex justify-space-between align-center mb-6">
                  <h3 class="text-h5 font-weight-bold">Địa chỉ giao hàng</h3>
                  <v-btn color="primary" rounded="pill" prepend-icon="mdi-plus" @click="openAddAddressDialog">
                    Thêm địa chỉ
                  </v-btn>
                </div>

                <!-- Loading -->
                <div v-if="isLoadingAddresses" class="text-center py-8">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  <p class="text-grey mt-2">Đang tải...</p>
                </div>

                <!-- Empty state -->
                <div v-else-if="addresses.length === 0" class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-map-marker-off</v-icon>
                  <p class="text-grey">Bạn chưa có địa chỉ giao hàng nào</p>
                </div>

                <!-- Success/Error Messages -->
                <v-alert
                  v-if="addressSuccessMessage"
                  type="success"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                  closable
                  @click:close="addressSuccessMessage = ''"
                >
                  {{ addressSuccessMessage }}
                </v-alert>

                <v-alert
                  v-if="addressErrorMessage"
                  type="error"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                  closable
                  @click:close="addressErrorMessage = ''"
                >
                  {{ addressErrorMessage }}
                </v-alert>

                <!-- Address list -->
                <v-card 
                  v-for="address in addresses" 
                  :key="address.id"
                  variant="outlined" 
                  class="rounded-xl border-light pa-4 mb-4 address-card" 
                  flat
                >
                  <div class="d-flex justify-space-between align-start">
                    <div class="flex-grow-1">
                      <div class="d-flex align-center ga-2 mb-2">
                        <span class="font-weight-bold text-subtitle-1">{{ address.recipient_name }}</span>
                        <v-chip v-if="address.is_default" size="x-small" color="success" variant="flat">Mặc định</v-chip>
                      </div>
                      <div class="text-body-2 text-grey">
                        <p class="mb-1">
                          <v-icon size="14" class="mr-1">mdi-phone</v-icon>
                          {{ address.recipient_phone }}
                        </p>
                        <p class="mb-1">
                          <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                          {{ address.street_address }}
                        </p>
                        <p>
                          {{ [address.ward, address.district, address.city].filter(Boolean).join(', ') }}
                        </p>
                      </div>
                    </div>
                    <div class="d-flex flex-column ga-1">
                      <v-btn 
                        icon="mdi-pencil-outline" 
                        size="small" 
                        variant="text" 
                        color="grey"
                        title="Chỉnh sửa"
                        @click="openEditAddressDialog(address)"
                      ></v-btn>
                      <v-btn 
                        v-if="!address.is_default" 
                        icon="mdi-star-outline" 
                        size="small" 
                        variant="text" 
                        color="warning"
                        title="Đặt làm mặc định"
                        :loading="settingDefaultAddressId === address.id"
                        @click="handleSetDefaultAddress(address.id)"
                      ></v-btn>
                      <v-btn 
                        icon="mdi-trash-can-outline" 
                        size="small" 
                        variant="text" 
                        color="error"
                        title="Xóa"
                        :loading="deletingAddressId === address.id"
                        @click="handleDeleteAddress(address.id)"
                      ></v-btn>
                    </div>
                  </div>
                </v-card>
              </v-card>
            </v-window-item>

            <!-- Tab: Cài đặt ưu tiên -->
            <v-window-item value="preferences">
              <v-card class="rounded-xl border-light pa-6" flat>
                <h3 class="text-h5 font-weight-bold mb-6">Cài đặt ưu tiên</h3>
                
                <p class="text-subtitle-2 font-weight-bold mb-4 text-uppercase">Hiển thị</p>
                <v-row class="mb-6">
                  <v-col cols="12" sm="6">
                    <v-select
                      label="Tiền tệ"
                      :items="['Yên Nhật (¥)', 'Việt Nam Đồng (₫)', 'Đô la Mỹ ($)']"
                      model-value="Việt Nam Đồng (₫)"
                      variant="outlined"
                      rounded="lg"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      label="Ngôn ngữ"
                      :items="['Tiếng Việt', 'Tiếng Nhật', 'Tiếng Anh']"
                      model-value="Tiếng Việt"
                      variant="outlined"
                      rounded="lg"
                    ></v-select>
                  </v-col>
                </v-row>

                <p class="text-subtitle-2 font-weight-bold mb-4 text-uppercase">Thông báo</p>
                <v-checkbox label="Thông báo đơn hàng qua Email" color="primary" hide-details v-model="notifications.orderEmail"></v-checkbox>
                <v-checkbox label="Thông báo khi sản phẩm Wishlist giảm giá" color="primary" hide-details v-model="notifications.wishlistSale"></v-checkbox>
                <v-checkbox label="Cập nhật lịch phát hành Figure mới" color="primary" v-model="notifications.newRelease"></v-checkbox>

                <v-btn color="primary" size="large" rounded="pill" class="mt-4" prepend-icon="mdi-content-save">
                  Lưu cài đặt
                </v-btn>
              </v-card>
            </v-window-item>

            <!-- Tab: Đánh giá của tôi -->
            <v-window-item value="reviews">
              <v-card class="rounded-xl border-light pa-6" flat>
                <h3 class="text-h5 font-weight-bold mb-6">Đánh giá của tôi</h3>
                
                <div v-if="reviews.length === 0" class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-star-off</v-icon>
                  <p class="text-grey">Bạn chưa có đánh giá nào</p>
                </div>

                <div v-for="review in reviews" :key="review.product_id" class="d-flex ga-4 mb-6 pb-6 border-b review-item">
                  <v-img
                    :src="review.product_image || 'https://placehold.co/100x100?text=Product'"
                    width="80"
                    height="80"
                    cover
                    class="rounded-lg flex-shrink-0"
                  ></v-img>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-space-between align-center">
                      <h4 class="text-subtitle-1 font-weight-bold">{{ review.product_name }}</h4>
                      <v-btn icon="mdi-pencil" size="x-small" variant="text" color="grey"></v-btn>
                    </div>
                    <v-rating
                      v-model="review.rating"
                      color="amber"
                      density="compact"
                      size="small"
                      readonly
                    ></v-rating>
                    <p class="text-body-2 text-medium-emphasis mt-2">
                      {{ review.comment }}
                    </p>
                    <div class="d-flex align-center ga-4 mt-2">
                      <span class="text-caption text-grey">
                        <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                        {{ formatDate(review.created_at) }}
                      </span>
                      <v-chip 
                        :color="getReviewStatusColor(review.status)" 
                        size="x-small" 
                        variant="flat"
                      >
                        {{ formatReviewStatus(review.status) }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-window-item>

            <!-- Tab: Đổi mật khẩu -->
            <v-window-item value="security">
              <v-card class="rounded-xl border-light pa-6" flat>
                <h3 class="text-h5 font-weight-bold mb-6">Bảo mật tài khoản</h3>
                
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="passwordForm.current"
                      label="Mật khẩu hiện tại"
                      variant="outlined"
                      rounded="lg"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="showCurrentPassword = !showCurrentPassword"
                      :error-messages="passwordErrors.current"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="passwordForm.new"
                      label="Mật khẩu mới"
                      variant="outlined"
                      rounded="lg"
                      :type="showNewPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock-outline"
                      :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="showNewPassword = !showNewPassword"
                      :error-messages="passwordErrors.new"
                      hint="Mật khẩu phải có ít nhất 6 ký tự"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="passwordForm.confirm"
                      label="Xác nhận mật khẩu mới"
                      variant="outlined"
                      rounded="lg"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock-check"
                      :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="showConfirmPassword = !showConfirmPassword"
                      :error-messages="passwordErrors.confirm"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- Success/Error Messages -->
                <v-alert
                  v-if="passwordSuccessMessage"
                  type="success"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                  closable
                  @click:close="passwordSuccessMessage = ''"
                >
                  {{ passwordSuccessMessage }}
                </v-alert>

                <v-alert
                  v-if="passwordErrorMessage"
                  type="error"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                  closable
                  @click:close="passwordErrorMessage = ''"
                >
                  {{ passwordErrorMessage }}
                </v-alert>

                <v-btn 
                  color="primary" 
                  size="large" 
                  rounded="pill" 
                  class="mt-4" 
                  prepend-icon="mdi-shield-check"
                  :loading="isChangingPassword"
                  :disabled="isChangingPassword"
                  @click="handleChangePassword"
                >
                  Đổi mật khẩu
                </v-btn>
              </v-card>
            </v-window-item>

          </v-window>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog: Thêm/Sửa địa chỉ -->
    <v-dialog v-model="showAddressDialog" max-width="600" persistent>
      <v-card class="rounded-xl pa-6">
        <h3 class="text-h5 font-weight-bold mb-6">
          {{ editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới' }}
        </h3>
        
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="addressForm.recipient_name"
              label="Tên người nhận"
              variant="outlined"
              rounded="lg"
              :error-messages="addressFormErrors.recipient_name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="addressForm.recipient_phone"
              label="Số điện thoại"
              variant="outlined"
              rounded="lg"
              :error-messages="addressFormErrors.recipient_phone"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="addressForm.street_address"
              label="Địa chỉ chi tiết"
              variant="outlined"
              rounded="lg"
              placeholder="Số nhà, tên đường..."
              :error-messages="addressFormErrors.street_address"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="addressForm.ward"
              label="Phường/Xã"
              variant="outlined"
              rounded="lg"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="addressForm.district"
              label="Quận/Huyện"
              variant="outlined"
              rounded="lg"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="addressForm.city"
              label="Tỉnh/Thành phố"
              variant="outlined"
              rounded="lg"
              :error-messages="addressFormErrors.city"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-checkbox
              v-model="addressForm.is_default"
              label="Đặt làm địa chỉ mặc định"
              color="primary"
              hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <div class="d-flex ga-2 mt-4 justify-end">
          <v-btn variant="outlined" rounded="pill" @click="closeAddressDialog">Hủy</v-btn>
          <v-btn 
            color="primary" 
            rounded="pill"
            :loading="isSavingAddress"
            :disabled="isSavingAddress"
            @click="handleSaveAddress"
          >
            {{ editingAddressId ? 'Cập nhật' : 'Lưu địa chỉ' }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import apiClient from '@/api';

const router = useRouter();
const authStore = useAuthStore();

interface User {
  id: number;
  name: string;
  full_name: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string | null;
  status: string;
  role_id: number;
  role_name: string;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: number;
  user_id: number;
  recipient_name: string;
  recipient_phone: string;
  street_address: string;
  ward: string;
  district: string;
  city: string;
  is_default: boolean;
}

interface Review {
  user_id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  status: string;
  created_at: string;
}

const tab = ref('personal');
const activeTab = ref(['personal']);
const editMode = ref(false);
const showAddressDialog = ref(false);

// ========== NEW: Form states ==========
const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const formErrors = reactive({
  name: '',
  full_name: '',
  email: '',
  phone_number: ''
});

// ========== Password Change States ==========
const isChangingPassword = ref(false);
const passwordSuccessMessage = ref('');
const passwordErrorMessage = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordErrors = reactive({
  current: '',
  new: '',
  confirm: ''
});

// ========== Address CRUD States ==========
const isLoadingAddresses = ref(false);
const isSavingAddress = ref(false);
const addressSuccessMessage = ref('');
const addressErrorMessage = ref('');
const editingAddressId = ref<number | null>(null);
const settingDefaultAddressId = ref<number | null>(null);
const deletingAddressId = ref<number | null>(null);
const addressFormErrors = reactive({
  recipient_name: '',
  recipient_phone: '',
  street_address: '',
  city: ''
});

const menuItems = [
  { title: 'Thông tin cá nhân', value: 'personal', icon: 'mdi-account-outline' },
  { title: 'Địa chỉ giao hàng', value: 'addresses', icon: 'mdi-map-marker-outline' },
  { title: 'Cài đặt ưu tiên', value: 'preferences', icon: 'mdi-cog-outline' },
  { title: 'Đánh giá của tôi', value: 'reviews', icon: 'mdi-star-outline' },
  { title: 'Bảo mật', value: 'security', icon: 'mdi-shield-lock-outline' },
];

// ========== USER DATA TỪ AUTH STORE ==========
// Computed để lấy user từ store và map sang format phù hợp
const user = computed<User>(() => {
  const storeUser = authStore.user;
  if (!storeUser) {
    // Redirect về login nếu chưa đăng nhập
    return {
      id: 0,
      name: '',
      full_name: 'Chưa đăng nhập',
      email: '',
      email_verified_at: null,
      phone_number: null,
      status: 'inactive',
      role_id: 0,
      role_name: 'Guest',
      created_at: '',
      updated_at: ''
    };
  }
  
  return {
    id: storeUser.id,
    name: storeUser.name,
    full_name: storeUser.full_name,
    email: storeUser.email,
    email_verified_at: null, // Không có trong response login
    phone_number: storeUser.phone_number || null,
    status: 'active', // Mặc định active vì đã login được
    role_id: storeUser.role_id || 0,
    role_name: (storeUser as any).role_name || 'Khách hàng',
    created_at: '',
    updated_at: ''
  };
});

// Form để edit user
const userForm = reactive({
  name: '',
  full_name: '',
  email: '',
  phone_number: ''
});

// Watch user để cập nhật form khi user thay đổi
watch(user, (newUser) => {
  userForm.name = newUser.name;
  userForm.full_name = newUser.full_name;
  userForm.email = newUser.email;
  userForm.phone_number = newUser.phone_number || '';
}, { immediate: true });

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
});

// Addresses Data - được load từ API
const addresses = ref<Address[]>([]);

const addressForm = reactive({
  recipient_name: '',
  recipient_phone: '',
  street_address: '',
  ward: '',
  district: '',
  city: '',
  is_default: false
});

// Mock Reviews Data theo cấu trúc database
const reviews = ref<Review[]>([
  {
    user_id: 1,
    product_id: 1,
    product_name: 'Mikasa Ackerman Figure 1/7',
    product_image: 'https://placehold.co/100x100?text=Mikasa',
    rating: 5,
    comment: 'Chất lượng tuyệt vời! Chi tiết sơn rất sắc nét, đóng gói cẩn thận 3 lớp chống sốc đúng như cam kết của PerW.',
    is_approved: true,
    status: 'approved',
    created_at: '2024-12-12T15:30:00'
  },
  {
    user_id: 1,
    product_id: 2,
    product_name: 'Gojo Satoru Figure 1/7',
    product_image: 'https://placehold.co/100x100?text=Gojo',
    rating: 4,
    comment: 'Sản phẩm đẹp, giao hàng nhanh. Trừ 1 sao vì hộp bị xước nhẹ.',
    is_approved: true,
    status: 'approved',
    created_at: '2024-12-10T09:00:00'
  },
  {
    user_id: 1,
    product_id: 3,
    product_name: 'Nendoroid Power',
    product_image: 'https://placehold.co/100x100?text=Power',
    rating: 5,
    comment: 'Sản phẩm chính hãng, rất hài lòng!',
    is_approved: false,
    status: 'pending',
    created_at: '2024-12-18T11:20:00'
  }
]);

const notifications = reactive({
  orderEmail: true,
  wishlistSale: true,
  newRelease: false
});

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getReviewStatusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error'
  };
  return map[status] || 'grey';
};

const formatReviewStatus = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Bị từ chối'
  };
  return map[status] || status;
};

// ========== NEW: Update Profile Functions ==========

// Clear form errors
const clearFormErrors = () => {
  formErrors.name = '';
  formErrors.full_name = '';
  formErrors.email = '';
  formErrors.phone_number = '';
  errorMessage.value = '';
  successMessage.value = '';
};

// Cancel edit and restore original values
const cancelEdit = () => {
  editMode.value = false;
  clearFormErrors();
  // Restore original values
  userForm.name = user.value.name;
  userForm.full_name = user.value.full_name;
  userForm.email = user.value.email;
  userForm.phone_number = user.value.phone_number || '';
};

// Handle Update Profile
const handleUpdateProfile = async () => {
  clearFormErrors();
  
  // Basic validation
  if (!userForm.name) {
    formErrors.name = 'Tên đăng nhập không được để trống';
    return;
  }
  if (!userForm.full_name) {
    formErrors.full_name = 'Họ và tên không được để trống';
    return;
  }
  if (!userForm.email) {
    formErrors.email = 'Email không được để trống';
    return;
  }

  isSaving.value = true;

  try {
    // Gọi API cập nhật profile
    const response = await apiClient.put('/auth/profile', {
      id: user.value.id,
      name: userForm.name,
      fullName: userForm.full_name,
      email: userForm.email,
      phoneNumber: userForm.phone_number
    });

    // Xử lý response (hỗ trợ cả PascalCase và camelCase)
    const data = response.data;
    const isSuccess = data.Success ?? data.success;
    const message = data.Message ?? data.message;
    const userData = data.Data ?? data.data;

    if (isSuccess) {
      successMessage.value = message || 'Cập nhật thông tin thành công!';
      
      // Cập nhật auth store với thông tin mới
      if (userData) {
        const updatedUser = {
          id: userData.Id ?? userData.id,
          name: userData.Name ?? userData.name,
          full_name: userData.FullName ?? userData.full_name,
          email: userData.Email ?? userData.email,
          phone_number: userData.PhoneNumber ?? userData.phone_number,
          role_id: userData.RoleId ?? userData.role_id,
          role_name: userData.RoleName ?? userData.role_name,
        };
        authStore.updateUser(updatedUser);
      }
      
      editMode.value = false;
    } else {
      errorMessage.value = message || 'Cập nhật thất bại';
    }
  } catch (error: any) {
    // Xử lý lỗi validation từ server (422)
    if (error.response?.status === 422) {
      const serverErrors = error.response.data?.Errors ?? error.response.data?.errors;
      if (serverErrors) {
        if (serverErrors.name) formErrors.name = serverErrors.name[0];
        if (serverErrors.full_name) formErrors.full_name = serverErrors.full_name[0];
        if (serverErrors.email) formErrors.email = serverErrors.email[0];
        if (serverErrors.phone_number) formErrors.phone_number = serverErrors.phone_number[0];
      }
      const msg = error.response.data?.Message ?? error.response.data?.message;
      errorMessage.value = msg || 'Dữ liệu không hợp lệ';
    } else {
      errorMessage.value = 'Có lỗi xảy ra, vui lòng thử lại sau';
    }
  } finally {
    isSaving.value = false;
  }
};

// ========== Handle Change Password ==========
const clearPasswordErrors = () => {
  passwordErrors.current = '';
  passwordErrors.new = '';
  passwordErrors.confirm = '';
  passwordErrorMessage.value = '';
  passwordSuccessMessage.value = '';
};

const handleChangePassword = async () => {
  clearPasswordErrors();
  
  // Client-side validation
  if (!passwordForm.current) {
    passwordErrors.current = 'Vui lòng nhập mật khẩu hiện tại';
    return;
  }
  if (!passwordForm.new) {
    passwordErrors.new = 'Vui lòng nhập mật khẩu mới';
    return;
  }
  if (passwordForm.new.length < 6) {
    passwordErrors.new = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    return;
  }
  if (!passwordForm.confirm) {
    passwordErrors.confirm = 'Vui lòng xác nhận mật khẩu mới';
    return;
  }
  if (passwordForm.new !== passwordForm.confirm) {
    passwordErrors.confirm = 'Mật khẩu xác nhận không khớp';
    return;
  }

  isChangingPassword.value = true;

  try {
    const response = await apiClient.put('/auth/change-password', {
      userId: user.value.id,
      currentPassword: passwordForm.current,
      newPassword: passwordForm.new,
      confirmPassword: passwordForm.confirm
    });

    const data = response.data;
    const isSuccess = data.Success ?? data.success;
    const message = data.Message ?? data.message;

    if (isSuccess) {
      passwordSuccessMessage.value = message || 'Đổi mật khẩu thành công!';
      // Clear form after success
      passwordForm.current = '';
      passwordForm.new = '';
      passwordForm.confirm = '';
    } else {
      passwordErrorMessage.value = message || 'Đổi mật khẩu thất bại';
    }
  } catch (error: any) {
    // Xử lý lỗi từ server
    if (error.response?.status === 400) {
      const msg = error.response.data?.Message ?? error.response.data?.message;
      passwordErrorMessage.value = msg || 'Mật khẩu hiện tại không chính xác';
    } else if (error.response?.status === 422) {
      const serverErrors = error.response.data?.Errors ?? error.response.data?.errors;
      if (serverErrors) {
        if (serverErrors.current) passwordErrors.current = serverErrors.current[0];
        if (serverErrors.new) passwordErrors.new = serverErrors.new[0];
        if (serverErrors.confirm) passwordErrors.confirm = serverErrors.confirm[0];
      }
      const msg = error.response.data?.Message ?? error.response.data?.message;
      passwordErrorMessage.value = msg || 'Dữ liệu không hợp lệ';
    } else {
      passwordErrorMessage.value = 'Có lỗi xảy ra, vui lòng thử lại sau';
    }
  } finally {
    isChangingPassword.value = false;
  }
};

// ========== Address CRUD Functions ==========

// Load addresses from API
const loadAddresses = async () => {
  if (!user.value.id) return;
  
  isLoadingAddresses.value = true;
  try {
    const response = await apiClient.get(`/addresses?userId=${user.value.id}`);
    const data = response.data;
    const isSuccess = data.Success ?? data.success;
    const addressData = data.Data ?? data.data;

    if (isSuccess && Array.isArray(addressData)) {
      addresses.value = addressData.map((a: any) => ({
        id: a.Id ?? a.id,
        user_id: a.UserId ?? a.user_id,
        recipient_name: a.RecipientName ?? a.recipient_name,
        recipient_phone: a.RecipientPhone ?? a.recipient_phone,
        street_address: a.StreetAddress ?? a.street_address,
        ward: a.Ward ?? a.ward,
        district: a.District ?? a.district,
        city: a.City ?? a.city,
        is_default: a.IsDefault ?? a.is_default
      }));
    }
  } catch (error) {
    console.error('Load addresses error:', error);
  } finally {
    isLoadingAddresses.value = false;
  }
};

// Watch for tab change to load addresses
watch(tab, (newTab) => {
  if (newTab === 'addresses' && addresses.value.length === 0) {
    loadAddresses();
  }
});

// Clear address form errors
const clearAddressFormErrors = () => {
  addressFormErrors.recipient_name = '';
  addressFormErrors.recipient_phone = '';
  addressFormErrors.street_address = '';
  addressFormErrors.city = '';
  addressErrorMessage.value = '';
};

// Reset address form
const resetAddressForm = () => {
  addressForm.recipient_name = '';
  addressForm.recipient_phone = '';
  addressForm.street_address = '';
  addressForm.ward = '';
  addressForm.district = '';
  addressForm.city = '';
  addressForm.is_default = false;
  editingAddressId.value = null;
  clearAddressFormErrors();
};

// Open add address dialog
const openAddAddressDialog = () => {
  resetAddressForm();
  showAddressDialog.value = true;
};

// Open edit address dialog
const openEditAddressDialog = (address: Address) => {
  resetAddressForm();
  editingAddressId.value = address.id;
  addressForm.recipient_name = address.recipient_name;
  addressForm.recipient_phone = address.recipient_phone;
  addressForm.street_address = address.street_address;
  addressForm.ward = address.ward || '';
  addressForm.district = address.district || '';
  addressForm.city = address.city;
  addressForm.is_default = address.is_default;
  showAddressDialog.value = true;
};

// Close address dialog
const closeAddressDialog = () => {
  showAddressDialog.value = false;
  resetAddressForm();
};

// Save address (create or update)
const handleSaveAddress = async () => {
  clearAddressFormErrors();

  // Validation
  if (!addressForm.recipient_name) {
    addressFormErrors.recipient_name = 'Tên người nhận không được để trống';
    return;
  }
  if (!addressForm.recipient_phone) {
    addressFormErrors.recipient_phone = 'Số điện thoại không được để trống';
    return;
  }
  if (!addressForm.street_address) {
    addressFormErrors.street_address = 'Địa chỉ không được để trống';
    return;
  }
  if (!addressForm.city) {
    addressFormErrors.city = 'Tỉnh/Thành phố không được để trống';
    return;
  }

  isSavingAddress.value = true;

  try {
    const payload = {
      userId: user.value.id,
      recipientName: addressForm.recipient_name,
      recipientPhone: addressForm.recipient_phone,
      streetAddress: addressForm.street_address,
      ward: addressForm.ward,
      district: addressForm.district,
      city: addressForm.city,
      isDefault: addressForm.is_default
    };

    let response;
    if (editingAddressId.value) {
      // Update
      response = await apiClient.put(`/addresses/${editingAddressId.value}`, payload);
    } else {
      // Create
      response = await apiClient.post('/addresses', payload);
    }

    const data = response.data;
    const isSuccess = data.Success ?? data.success;
    const message = data.Message ?? data.message;

    if (isSuccess) {
      addressSuccessMessage.value = message || (editingAddressId.value ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ thành công!');
      closeAddressDialog();
      await loadAddresses();
    } else {
      addressErrorMessage.value = message || 'Lưu địa chỉ thất bại';
    }
  } catch (error: any) {
    if (error.response?.status === 422) {
      const serverErrors = error.response.data?.Errors ?? error.response.data?.errors;
      if (serverErrors) {
        if (serverErrors.recipient_name) addressFormErrors.recipient_name = serverErrors.recipient_name[0];
        if (serverErrors.recipient_phone) addressFormErrors.recipient_phone = serverErrors.recipient_phone[0];
        if (serverErrors.street_address) addressFormErrors.street_address = serverErrors.street_address[0];
        if (serverErrors.city) addressFormErrors.city = serverErrors.city[0];
      }
    }
    addressErrorMessage.value = 'Có lỗi xảy ra, vui lòng thử lại';
  } finally {
    isSavingAddress.value = false;
  }
};

// Set default address
const handleSetDefaultAddress = async (addressId: number) => {
  settingDefaultAddressId.value = addressId;
  
  try {
    const response = await apiClient.put(`/addresses/${addressId}/set-default`);
    const data = response.data;
    const isSuccess = data.Success ?? data.success;
    const message = data.Message ?? data.message;

    if (isSuccess) {
      addressSuccessMessage.value = message || 'Đã đặt làm địa chỉ mặc định!';
      await loadAddresses();
    } else {
      addressErrorMessage.value = message || 'Thao tác thất bại';
    }
  } catch (error) {
    addressErrorMessage.value = 'Có lỗi xảy ra';
  } finally {
    settingDefaultAddressId.value = null;
  }
};

// Delete address
const handleDeleteAddress = async (addressId: number) => {
  if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
  
  deletingAddressId.value = addressId;
  
  try {
    const response = await apiClient.delete(`/addresses/${addressId}`);
    const data = response.data;
    const isSuccess = data.Success ?? data.success;
    const message = data.Message ?? data.message;

    if (isSuccess) {
      addressSuccessMessage.value = message || 'Xóa địa chỉ thành công!';
      await loadAddresses();
    } else {
      addressErrorMessage.value = message || 'Xóa thất bại';
    }
  } catch (error) {
    addressErrorMessage.value = 'Có lỗi xảy ra';
  } finally {
    deletingAddressId.value = null;
  }
};
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 100px;
}

.profile-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%);
}

.border-light {
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.shadow-soft {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.ga-1 { gap: 4px; }
.ga-2 { gap: 8px; }
.ga-4 { gap: 16px; }

.tracking-wider {
  letter-spacing: 0.1em;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.info-item {
  padding: 12px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(217, 70, 239, 0.05));
  border-radius: 12px;
}

.address-card {
  transition: all 0.3s ease;
}

.address-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.review-item:last-child {
  border-bottom: none !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

/* Custom cho Sidebar active state */
:deep(.v-list-item--selected) {
  background-color: rgba(14, 165, 233, 0.1) !important;
  color: #0ea5e9 !important;
}
</style>