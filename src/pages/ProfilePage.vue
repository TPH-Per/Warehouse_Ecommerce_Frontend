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
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-fade-transition>
                  <div v-if="editMode" class="d-flex ga-2 mt-4">
                    <v-btn color="primary" size="large" rounded="pill" prepend-icon="mdi-content-save" @click="saveProfile" :loading="loading.saving">
                      Lưu thay đổi
                    </v-btn>
                    <v-btn variant="outlined" size="large" rounded="pill" @click="editMode = false">
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
                  <v-btn color="primary" rounded="pill" prepend-icon="mdi-plus" @click="showAddressDialog = true">
                    Thêm địa chỉ
                  </v-btn>
                </div>

                <div v-if="addresses.length === 0" class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-map-marker-off</v-icon>
                  <p class="text-grey">Bạn chưa có địa chỉ giao hàng nào</p>
                </div>

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
                          {{ address.ward }}, {{ address.district }}, {{ address.city }}
                        </p>
                      </div>
                    </div>
                    <div class="d-flex flex-column ga-1">
                      <v-btn icon="mdi-pencil-outline" size="small" variant="text" color="grey" @click="handleEditAddress(address)"></v-btn>
                      <v-btn 
                        v-if="!address.is_default" 
                        icon="mdi-star-outline" 
                        size="small" 
                        variant="text" 
                        color="warning"
                        title="Đặt làm mặc định"
                        @click="handleSetDefault(address.id)"
                      ></v-btn>
                      <v-btn icon="mdi-trash-can-outline" size="small" variant="text" color="error" @click="handleDeleteAddress(address.id)"></v-btn>
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
                      type="password"
                      prepend-inner-icon="mdi-lock"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="passwordForm.new"
                      label="Mật khẩu mới"
                      variant="outlined"
                      rounded="lg"
                      type="password"
                      prepend-inner-icon="mdi-lock-outline"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="passwordForm.confirm"
                      label="Xác nhận mật khẩu mới"
                      variant="outlined"
                      rounded="lg"
                      type="password"
                      prepend-inner-icon="mdi-lock-check"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-btn color="primary" size="large" rounded="pill" class="mt-4" prepend-icon="mdi-shield-check" @click="handleChangePassword" :loading="loading.saving">
                  Đổi mật khẩu
                </v-btn>
              </v-card>
            </v-window-item>

          </v-window>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog: Thêm/Sửa địa chỉ -->
    <v-dialog v-model="showAddressDialog" max-width="600">
      <v-card class="rounded-xl pa-6">
        <h3 class="text-h5 font-weight-bold mb-6">{{ editingAddressId ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới' }}</h3>
        
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="addressForm.recipient_name"
              label="Tên người nhận"
              variant="outlined"
              rounded="lg"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="addressForm.recipient_phone"
              label="Số điện thoại"
              variant="outlined"
              rounded="lg"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="addressForm.street_address"
              label="Địa chỉ chi tiết"
              variant="outlined"
              rounded="lg"
              placeholder="Số nhà, tên đường..."
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
          <v-btn variant="outlined" rounded="pill" @click="showAddressDialog = false; resetAddressForm()">Hủy</v-btn>
          <v-btn color="primary" rounded="pill" @click="saveAddress" :loading="loading.saving">Lưu địa chỉ</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { getProfile, updateProfile, changePassword } from '@/api/profile.api';
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/api/address.api';
import { getMyReviews } from '@/api/reviews.api';
import type { UserProfile } from '@/api/profile.api';
import type { Address as AddressType } from '@/api/address.api';
import type { Review as ReviewType } from '@/api/reviews.api';

const router = useRouter();
const authStore = useAuthStore();

// ========== LOADING STATES ==========
const loading = reactive({
  profile: false,
  addresses: false,
  reviews: false,
  saving: false
});

// ========== SNACKBAR ==========
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
});

const showMessage = (message: string, color: string = 'success') => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};

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
  id?: number;
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
const editingAddressId = ref<number | null>(null);

const menuItems = [
  { title: 'Thông tin cá nhân', value: 'personal', icon: 'mdi-account-outline' },
  { title: 'Địa chỉ giao hàng', value: 'addresses', icon: 'mdi-map-marker-outline' },
  { title: 'Cài đặt ưu tiên', value: 'preferences', icon: 'mdi-cog-outline' },
  { title: 'Đánh giá của tôi', value: 'reviews', icon: 'mdi-star-outline' },
  { title: 'Bảo mật', value: 'security', icon: 'mdi-shield-lock-outline' },
];

// ========== USER DATA ==========
const user = ref<User>({
  id: 0,
  name: '',
  full_name: 'Đang tải...',
  email: '',
  email_verified_at: null,
  phone_number: null,
  status: 'inactive',
  role_id: 0,
  role_name: 'Guest',
  created_at: '',
  updated_at: ''
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
}, { immediate: true, deep: true });

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
});

// ========== ADDRESSES DATA ==========
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

const resetAddressForm = () => {
  addressForm.recipient_name = '';
  addressForm.recipient_phone = '';
  addressForm.street_address = '';
  addressForm.ward = '';
  addressForm.district = '';
  addressForm.city = '';
  addressForm.is_default = false;
  editingAddressId.value = null;
};

// ========== REVIEWS DATA ==========
const reviews = ref<Review[]>([]);

const notifications = reactive({
  orderEmail: true,
  wishlistSale: true,
  newRelease: false
});

// ========== API CALLS ==========
const fetchProfile = async () => {
  loading.profile = true;
  
  // First, use authStore data immediately if available
  const storeUser = authStore.user;
  if (storeUser) {
    user.value = {
      id: storeUser.id,
      name: storeUser.name,
      full_name: storeUser.full_name,
      email: storeUser.email,
      email_verified_at: null,
      phone_number: storeUser.phone_number || null,
      status: 'active',
      role_id: storeUser.role_id || 0,
      role_name: storeUser.role_name || 'Khách hàng',
      created_at: '',
      updated_at: ''
    };
  }
  
  // Then try to get fresh data from API
  try {
    const response = await getProfile();
    console.log('getProfile response:', response.data);
    
    if (response.data.Success && response.data.Data) {
      const data = response.data.Data as any;
      user.value = {
        id: data.Id || data.id,
        name: data.Name || data.name,
        full_name: data.FullName || data.full_name,
        email: data.Email || data.email,
        email_verified_at: null,
        phone_number: data.PhoneNumber || data.phone_number,
        status: data.Status || data.status || 'active',
        role_id: data.RoleId || data.role_id,
        role_name: data.RoleName || data.role_name || 'Khách hàng',
        created_at: data.CreatedAt || data.created_at || '',
        updated_at: data.UpdatedAt || data.updated_at || ''
      };
    } else if (response.data.success && response.data.data) {
      // Also check lowercase keys
      const data = response.data.data as any;
      user.value = {
        id: data.Id || data.id,
        name: data.Name || data.name,
        full_name: data.FullName || data.full_name,
        email: data.Email || data.email,
        email_verified_at: null,
        phone_number: data.PhoneNumber || data.phone_number,
        status: data.Status || data.status || 'active',
        role_id: data.RoleId || data.role_id,
        role_name: data.RoleName || data.role_name || 'Khách hàng',
        created_at: data.CreatedAt || data.created_at || '',
        updated_at: data.UpdatedAt || data.updated_at || ''
      };
    }
  } catch (error: any) {
    console.error('fetchProfile error:', error);
    // Already have authStore data, so just log the error
  } finally {
    loading.profile = false;
  }
};

const saveProfile = async () => {
  loading.saving = true;
  try {
    const response = await updateProfile({
      name: userForm.name,
      full_name: userForm.full_name,
      email: userForm.email,
      phone_number: userForm.phone_number
    });
    const isSuccess = response.data.Success || response.data.success;
    if (isSuccess) {
      showMessage('Cập nhật thông tin thành công!', 'success');
      // Update authStore with new data
      authStore.updateUser({
        name: userForm.name,
        full_name: userForm.full_name,
        email: userForm.email,
        phone_number: userForm.phone_number
      });
      await fetchProfile();
      editMode.value = false;
    } else {
      showMessage(response.data.Message || response.data.message || 'Có lỗi xảy ra', 'error');
    }
  } catch (error: any) {
    showMessage(error.response?.data?.Message || error.response?.data?.message || 'Có lỗi xảy ra', 'error');
  } finally {
    loading.saving = false;
  }
};

const fetchAddresses = async () => {
  loading.addresses = true;
  try {
    const response = await getAddresses();
    console.log('getAddresses response:', response.data);
    
    // Check for PascalCase first (from backend), then camelCase
    const responseData = response.data.Data || response.data.data;
    const isSuccess = response.data.Success || response.data.success;
    
    if (isSuccess && responseData && Array.isArray(responseData)) {
      addresses.value = responseData.map((a: any) => ({
        id: a.Id || a.id,
        user_id: a.UserId || a.user_id,
        recipient_name: a.RecipientName || a.recipient_name,
        recipient_phone: a.RecipientPhone || a.recipient_phone,
        street_address: a.StreetAddress || a.street_address,
        ward: a.Ward || a.ward,
        district: a.District || a.district,
        city: a.City || a.city,
        is_default: a.IsDefault || a.is_default || false
      }));
      console.log('Parsed addresses:', addresses.value);
    } else {
      console.log('No addresses found or not authenticated');
      addresses.value = [];
    }
  } catch (error: any) {
    console.error('fetchAddresses error:', error);
    addresses.value = [];
  } finally {
    loading.addresses = false;
  }
};

const saveAddress = async () => {
  loading.saving = true;
  try {
    if (editingAddressId.value) {
      // Update existing
      const response = await updateAddress(editingAddressId.value, addressForm);
      const isSuccess = response.data.Success || response.data.success;
      if (isSuccess) {
        showMessage('Cập nhật địa chỉ thành công!', 'success');
      }
    } else {
      // Create new
      const response = await createAddress(addressForm);
      const isSuccess = response.data.Success || response.data.success;
      if (isSuccess) {
        showMessage('Thêm địa chỉ thành công!', 'success');
      }
    }
    await fetchAddresses();
    showAddressDialog.value = false;
    resetAddressForm();
  } catch (error: any) {
    showMessage(error.response?.data?.Message || error.response?.data?.message || 'Có lỗi xảy ra', 'error');
  } finally {
    loading.saving = false;
  }
};

const handleEditAddress = (address: Address) => {
  editingAddressId.value = address.id;
  addressForm.recipient_name = address.recipient_name;
  addressForm.recipient_phone = address.recipient_phone;
  addressForm.street_address = address.street_address;
  addressForm.ward = address.ward;
  addressForm.district = address.district;
  addressForm.city = address.city;
  addressForm.is_default = address.is_default;
  showAddressDialog.value = true;
};

const handleDeleteAddress = async (id: number) => {
  if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
  try {
    await deleteAddress(id);
    showMessage('Xóa địa chỉ thành công!', 'success');
    await fetchAddresses();
  } catch (error: any) {
    showMessage(error.response?.data?.Message || 'Có lỗi xảy ra', 'error');
  }
};

const handleSetDefault = async (id: number) => {
  try {
    await setDefaultAddress(id);
    showMessage('Đã đặt làm địa chỉ mặc định!', 'success');
    await fetchAddresses();
  } catch (error: any) {
    showMessage(error.response?.data?.Message || 'Có lỗi xảy ra', 'error');
  }
};

const fetchReviews = async () => {
  loading.reviews = true;
  try {
    const response = await getMyReviews();
    console.log('getMyReviews response:', response.data);
    
    const responseData = response.data.Data || response.data.data;
    const isSuccess = response.data.Success || response.data.success;
    
    if (isSuccess && responseData && Array.isArray(responseData)) {
      reviews.value = responseData.map((r: any) => ({
        id: r.Id || r.id,
        user_id: r.UserId || r.user_id,
        product_id: r.ProductId || r.product_id,
        product_name: r.ProductName || r.product_name || 'Sản phẩm',
        product_image: r.ProductImage || r.product_image,
        rating: r.Rating || r.rating,
        comment: r.Comment || r.comment,
        is_approved: r.IsApproved || r.is_approved,
        status: r.Status || r.status || 'pending',
        created_at: r.CreatedAt || r.created_at
      }));
    } else {
      reviews.value = [];
    }
  } catch (error: any) {
    console.error('fetchReviews error:', error);
    reviews.value = [];
  } finally {
    loading.reviews = false;
  }
};

const handleChangePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    showMessage('Mật khẩu xác nhận không khớp', 'error');
    return;
  }
  if (passwordForm.new.length < 6) {
    showMessage('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
    return;
  }
  
  loading.saving = true;
  try {
    const response = await changePassword({
      current_password: passwordForm.current,
      new_password: passwordForm.new,
      confirm_password: passwordForm.confirm
    });
    const isSuccess = response.data.Success || response.data.success;
    if (isSuccess) {
      showMessage('Đổi mật khẩu thành công!', 'success');
      passwordForm.current = '';
      passwordForm.new = '';
      passwordForm.confirm = '';
    } else {
      showMessage(response.data.Message || response.data.message || 'Có lỗi xảy ra', 'error');
    }
  } catch (error: any) {
    showMessage(error.response?.data?.Message || error.response?.data?.message || 'Có lỗi xảy ra', 'error');
  } finally {
    loading.saving = false;
  }
};

const getInitials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
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

// ========== ON MOUNTED ==========
onMounted(async () => {
  // Check if user is logged in
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  // Fetch all data
  await Promise.all([
    fetchProfile(),
    fetchAddresses(),
    fetchReviews()
  ]);
});
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