<template>
  <v-container class="py-8">
    <div style="max-width: 900px; margin: 0 auto;">
      <!-- Header -->
      <div class="d-flex align-center mb-6">
        <v-btn icon variant="text" @click="router.back()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h1 class="text-h4 font-weight-bold ml-2">Thanh toán</h1>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-4 text-medium-emphasis">Đang xử lý...</p>
      </div>

      <!-- No Order Data -->
      <v-card v-else-if="!orderData" class="text-center py-16 rounded-xl" variant="outlined">
        <v-icon size="100" color="warning" class="mb-4">mdi-cart-off</v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">Không có đơn hàng</h2>
        <p class="text-medium-emphasis mb-6">Vui lòng chọn sản phẩm từ giỏ hàng</p>
        <v-btn :to="{ name: 'Cart' }" color="primary" size="large" rounded="xl">
          Quay lại giỏ hàng
        </v-btn>
      </v-card>

      <!-- Checkout Form -->
      <v-row v-else>
        <!-- Left Column: Shipping & Payment -->
        <v-col cols="12" lg="7">
          <!-- Branch Info -->
          <v-card class="checkout-card rounded-xl mb-4" variant="outlined">
            <v-card-item>
              <div class="d-flex align-center">
                <v-avatar color="primary" size="40" class="mr-3">
                  <v-icon>mdi-store</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">Chi nhánh giao hàng</div>
                  <div class="text-body-2 text-medium-emphasis">{{ orderData.branchName }}</div>
                </div>
              </div>
            </v-card-item>
          </v-card>

          <!-- Shipping Address -->
          <v-card class="checkout-card rounded-xl mb-4" variant="outlined">
            <v-card-title class="d-flex align-center pa-4 border-b">
              <v-icon start color="primary">mdi-truck-delivery</v-icon>
              Thông tin giao hàng
            </v-card-title>

            <v-card-text class="pa-4">
              <!-- Select from saved addresses -->
              <div v-if="addresses.length > 0" class="mb-4">
                <v-label class="mb-2">Địa chỉ đã lưu</v-label>
                <v-select
                  v-model="selectedAddressId"
                  :items="addressOptions"
                  item-title="label"
                  item-value="id"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Chọn địa chỉ"
                  rounded="lg"
                  @update:model-value="fillAddressFromSaved"
                />
              </div>

              <v-divider v-if="addresses.length > 0" class="my-4" />

              <v-text-field
                v-model="shippingForm.recipientName"
                label="Họ tên người nhận *"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                class="mb-3"
                :rules="[rules.required]"
              />

              <v-text-field
                v-model="shippingForm.recipientPhone"
                label="Số điện thoại *"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                class="mb-3"
                :rules="[rules.required, rules.phone]"
              />

              <v-textarea
                v-model="shippingForm.address"
                label="Địa chỉ giao hàng *"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                rows="3"
                :rules="[rules.required]"
              />
            </v-card-text>
          </v-card>

          <!-- Payment Method -->
          <v-card class="checkout-card rounded-xl mb-4" variant="outlined">
            <v-card-title class="d-flex align-center pa-4 border-b">
              <v-icon start color="primary">mdi-credit-card</v-icon>
              Phương thức thanh toán
            </v-card-title>

            <v-card-text class="pa-4">
              <v-radio-group v-model="selectedPaymentMethod" hide-details>
                <v-radio
                  v-for="method in paymentMethods"
                  :key="method.id"
                  :label="method.name"
                  :value="method.id"
                  class="pa-2 rounded-lg mb-2"
                  :class="{ 'bg-primary-lighten-5': selectedPaymentMethod === method.id }"
                />
              </v-radio-group>
            </v-card-text>
          </v-card>

          <!-- Notes -->
          <v-card class="checkout-card rounded-xl" variant="outlined">
            <v-card-title class="d-flex align-center pa-4 border-b">
              <v-icon start color="primary">mdi-note-text</v-icon>
              Ghi chú đơn hàng
            </v-card-title>

            <v-card-text class="pa-4">
              <v-textarea
                v-model="orderNotes"
                placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                rows="2"
                hide-details
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column: Order Summary -->
        <v-col cols="12" lg="5">
          <v-card class="checkout-card summary-card rounded-xl sticky-summary" variant="outlined">
            <v-card-title class="d-flex align-center pa-4 border-b">
              <v-icon start color="primary">mdi-package-variant</v-icon>
              Đơn hàng ({{ orderData.items.length }} sản phẩm)
            </v-card-title>

            <!-- Items List -->
            <v-list class="pa-0" bg-color="transparent" max-height="300" style="overflow-y: auto;">
              <template v-for="(item, index) in orderData.items" :key="index">
                <v-divider v-if="index > 0" />
                <v-list-item class="pa-3">
                  <template v-slot:prepend>
                    <v-img :src="item.image" width="50" height="50" cover class="rounded-lg" />
                  </template>
                  <v-list-item-title class="text-body-2">{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>x{{ item.quantity }}</v-list-item-subtitle>
                  <template v-slot:append>
                    <span class="font-weight-bold">{{ formatPrice(item.price * item.quantity) }}</span>
                  </template>
                </v-list-item>
              </template>
            </v-list>

            <v-divider />

            <!-- Price Summary -->
            <div class="pa-4">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Tạm tính</span>
                <span class="text-body-2 font-weight-bold">{{ formatPrice(orderData.subTotal) }}</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Phí vận chuyển</span>
                <span class="text-body-2 font-weight-bold">{{ formatPrice(orderData.shippingFee) }}</span>
              </div>
              <div v-if="orderData.discountAmount > 0" class="d-flex justify-space-between mb-2 text-success">
                <span class="text-body-2">Giảm giá</span>
                <span class="text-body-2 font-weight-bold">-{{ formatPrice(orderData.discountAmount) }}</span>
              </div>

              <v-divider class="my-3" />

              <div class="d-flex justify-space-between total-row pa-3 rounded-lg">
                <span class="text-subtitle-1 font-weight-bold">Tổng cộng</span>
                <span class="text-h6 font-weight-bold neon-text-secondary">
                  {{ formatPrice(orderData.total) }}
                </span>
              </div>

              <!-- Submit Button -->
              <v-btn
                block
                color="secondary"
                size="large"
                rounded="xl"
                class="checkout-btn mt-4 font-weight-bold"
                :loading="isSubmitting"
                :disabled="!isFormValid"
                @click="submitOrder"
              >
                <v-icon start>mdi-check-circle</v-icon>
                Đặt hàng
              </v-btn>

              <div class="mt-3 d-flex align-center justify-center text-caption text-medium-emphasis">
                <v-icon color="success" size="small" class="mr-1">mdi-shield-check</v-icon>
                Thanh toán an toàn với mã hóa SSL
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ordersApi, type CreateOrderRequest } from '@/api/orders.api';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import apiClient from '@/api';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

// ========== INTERFACES ==========
interface OrderItem {
  cartItemId: number;
  productId: number;
  variantId: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderData {
  branchId: number;
  branchName: string;
  items: OrderItem[];
  subTotal: number;
  shippingFee: number;
  discountCode: string;
  discountAmount: number;
  total: number;
}

interface Address {
  // Support both PascalCase (API) and snake_case
  Id?: number;
  id?: number;
  RecipientName?: string;
  recipient_name?: string;
  RecipientPhone?: string;
  recipient_phone?: string;
  StreetAddress?: string;
  street_address?: string;
  Ward?: string;
  ward?: string;
  District?: string;
  district?: string;
  City?: string;
  city?: string;
  IsDefault?: boolean;
  is_default?: boolean;
}

// Helper to normalize address data
const normalizeAddress = (addr: Address) => ({
  id: addr.Id ?? addr.id ?? 0,
  recipientName: addr.RecipientName ?? addr.recipient_name ?? '',
  recipientPhone: addr.RecipientPhone ?? addr.recipient_phone ?? '',
  streetAddress: addr.StreetAddress ?? addr.street_address ?? '',
  ward: addr.Ward ?? addr.ward ?? '',
  district: addr.District ?? addr.district ?? '',
  city: addr.City ?? addr.city ?? '',
  isDefault: addr.IsDefault ?? addr.is_default ?? false,
});

// ========== STATE ==========
const isLoading = ref(true);
const isSubmitting = ref(false);
const orderData = ref<OrderData | null>(null);
const addresses = ref<Address[]>([]);
const selectedAddressId = ref<number | null>(null);

const shippingForm = ref({
  recipientName: '',
  recipientPhone: '',
  address: '',
});

const selectedPaymentMethod = ref(1);
const orderNotes = ref('');

const paymentMethods = ref([
  { id: 1, name: 'COD - Thanh toán khi nhận hàng' },
  { id: 2, name: 'Chuyển khoản ngân hàng' },
]);

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
});

// ========== VALIDATION ==========
const rules = {
  required: (v: string) => !!v || 'Trường này bắt buộc',
  phone: (v: string) => /^[0-9]{10,11}$/.test(v) || 'Số điện thoại không hợp lệ',
};

// ========== COMPUTED ==========
const addressOptions = computed(() => {
  return addresses.value.map(addr => {
    const normalized = normalizeAddress(addr);
    const fullAddress = [normalized.streetAddress, normalized.ward, normalized.district, normalized.city]
      .filter(Boolean)
      .join(', ');
    return {
      id: normalized.id,
      label: `${normalized.recipientName} - ${fullAddress}`,
    };
  });
});

const isFormValid = computed(() => {
  return (
    shippingForm.value.recipientName.trim() !== '' &&
    shippingForm.value.recipientPhone.trim() !== '' &&
    shippingForm.value.address.trim() !== ''
  );
});

// ========== METHODS ==========
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const showSnackbar = (text: string, color: string = 'success') => {
  snackbar.value = { show: true, text, color };
};

const fillAddressFromSaved = () => {
  const addr = addresses.value.find(a => (a.Id ?? a.id) === selectedAddressId.value);
  if (addr) {
    const normalized = normalizeAddress(addr);
    shippingForm.value.recipientName = normalized.recipientName;
    shippingForm.value.recipientPhone = normalized.recipientPhone;
    shippingForm.value.address = [normalized.streetAddress, normalized.ward, normalized.district, normalized.city]
      .filter(Boolean)
      .join(', ');
    console.log('✅ Filled address from saved:', shippingForm.value);
  }
};

const loadAddresses = async () => {
  try {
    const response = await apiClient.get('/address');
    if (response.data?.Success && response.data.Data) {
      addresses.value = response.data.Data;
      console.log('📍 Loaded addresses:', addresses.value);
      
      // Auto-select default address using normalized data
      const defaultAddr = addresses.value.find(a => {
        const normalized = normalizeAddress(a);
        return normalized.isDefault;
      });
      
      if (defaultAddr) {
        const normalized = normalizeAddress(defaultAddr);
        selectedAddressId.value = normalized.id;
        fillAddressFromSaved();
      }
    }
  } catch (error) {
    console.error('Failed to load addresses:', error);
  }
};

const submitOrder = async () => {
  if (!orderData.value) return;

  isSubmitting.value = true;

  try {
    const request: CreateOrderRequest = {
      BranchId: orderData.value.branchId,
      ShippingRecipientName: shippingForm.value.recipientName,
      ShippingRecipientPhone: shippingForm.value.recipientPhone,
      ShippingAddress: shippingForm.value.address,
      PaymentMethodId: selectedPaymentMethod.value,
      ShippingFee: orderData.value.shippingFee,
      DiscountAmount: orderData.value.discountAmount,
      Notes: orderNotes.value,
    };

    const response = await ordersApi.createOrder(request);

    if (response.data?.Success) {
      // Clear cart for this branch
      await cartStore.fetchCart();
      
      // Save order info for confirmation page
      localStorage.setItem('order_confirmation', JSON.stringify({
        orderCode: response.data.OrderCode,
        ...orderData.value,
        shippingInfo: shippingForm.value,
        paymentMethod: paymentMethods.value.find(p => p.id === selectedPaymentMethod.value)?.name,
      }));

      showSnackbar('Đặt hàng thành công!', 'success');
      
      // Redirect to order confirmation
      router.push('/order-success');
    } else {
      showSnackbar(response.data?.Message || 'Có lỗi xảy ra', 'error');
    }
  } catch (error: any) {
    console.error('Order error:', error);
    showSnackbar(error.response?.data?.Message || 'Có lỗi xảy ra khi đặt hàng', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// ========== LIFECYCLE ==========
onMounted(async () => {
  // Check authentication
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=/checkout');
    return;
  }

  // Load order data from localStorage
  const savedOrder = localStorage.getItem('checkout_order');
  if (savedOrder) {
    try {
      orderData.value = JSON.parse(savedOrder);
    } catch (e) {
      console.error('Failed to parse order data:', e);
    }
  }

  // Load saved addresses
  await loadAddresses();

  // Pre-fill user info if available
  if (authStore.user) {
    if (!shippingForm.value.recipientName) {
      shippingForm.value.recipientName = authStore.user.full_name || authStore.user.name || '';
    }
    if (!shippingForm.value.recipientPhone) {
      shippingForm.value.recipientPhone = authStore.user.phone_number || '';
    }
  }

  isLoading.value = false;
});
</script>

<style scoped>
.neon-text-secondary {
  color: #ff00ff;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.checkout-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.total-row {
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.15);
}

.checkout-btn {
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
}

.checkout-btn:hover {
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
}

.sticky-summary {
  position: sticky;
  top: 80px;
}

@media (max-width: 1280px) {
  .sticky-summary {
    position: static;
  }
}
</style>