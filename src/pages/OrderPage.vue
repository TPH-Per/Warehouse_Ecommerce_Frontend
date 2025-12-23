<template>
  <v-main class="order-page pb-16">
    <v-container>
      <!-- Header -->
      <v-row align="center" class="mb-8 mt-4">
        <v-col cols="12" md="6">
          <h1 class="text-h4 font-weight-bold page-title">Đơn hàng của tôi</h1>
          <p class="text-medium-emphasis mt-1">Theo dõi và quản lý đơn hàng của bạn</p>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-md-end">
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            label="Trạng thái đơn hàng"
            variant="outlined"
            rounded="xl"
            density="comfortable"
            hide-details
            style="max-width: 300px;"
            class="filter-select"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-card v-if="isLoading" class="text-center py-16 glass-card rounded-xl" variant="outlined">
        <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
        <p class="text-medium-emphasis">Đang tải đơn hàng...</p>
      </v-card>

      <!-- Login Required State -->
      <v-card v-else-if="!isAuthenticated" class="text-center py-16 glass-card rounded-xl" variant="outlined">
        <v-icon size="80" color="warning" class="mb-4">mdi-account-lock-outline</v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">Vui lòng đăng nhập</h2>
        <p class="text-medium-emphasis mb-6">Đăng nhập để xem lịch sử đơn hàng của bạn</p>
        <v-btn :to="{ name: 'Login', query: { redirect: '/order' } }" color="primary" rounded="xl" size="large">
          <v-icon start>mdi-login</v-icon>
          Đăng nhập
        </v-btn>
      </v-card>

      <!-- Empty State -->
      <v-card v-else-if="filteredOrders.length === 0" class="text-center py-16 glass-card rounded-xl" variant="outlined">
        <v-icon size="100" color="grey-lighten-1" class="mb-4">mdi-package-variant-closed</v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">Chưa có đơn hàng nào</h2>
        <p class="text-medium-emphasis mb-6">Bắt đầu mua sắm để lấp đầy lịch sử đơn hàng của bạn!</p>
        <v-btn color="primary" rounded="xl" size="large" :to="{ name: 'ProductList' }">
          <v-icon start>mdi-store</v-icon>
          Mua sắm ngay
        </v-btn>
      </v-card>

      <!-- Orders List -->
      <div v-else class="orders-list">
        <v-card 
          v-for="order in filteredOrders" 
          :key="order.id" 
          class="order-card rounded-xl overflow-hidden mb-6" 
          variant="outlined"
        >
          <!-- Order Header -->
          <div class="order-header pa-6">
            <v-row align="center">
              <v-col cols="12" sm="7">
                <div class="d-flex align-center ga-3 mb-2">
                  <span class="text-h6 font-weight-bold order-code">{{ order.order_code }}</span>
                  <v-chip :color="getStatusColor(order.status)" size="small" variant="flat" class="font-weight-bold">
                    {{ formatStatus(order.status) }}
                  </v-chip>
                </div>
                <div class="text-body-2 text-medium-emphasis d-flex flex-wrap ga-x-4">
                  <span>
                    <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                    {{ formatDate(order.created_at) }}
                  </span>
                  <span>•</span>
                  <span>
                    <v-icon size="16" class="mr-1">mdi-store</v-icon>
                    {{ order.branch_name || 'Chi nhánh chính' }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" sm="5" class="d-flex justify-sm-end ga-2">
                <v-btn 
                  variant="outlined" 
                  rounded="pill" 
                  size="small"
                  @click="toggleDetails(order.id)"
                >
                  {{ isExpanded(order.id) ? 'Ẩn chi tiết' : 'Xem chi tiết' }}
                </v-btn>
                <v-btn 
                  v-if="order.status === 'delivered'" 
                  color="primary" 
                  variant="tonal" 
                  rounded="pill" 
                  size="small"
                >
                  Đánh giá
                </v-btn>
                <v-btn 
                  v-if="order.status === 'pending'" 
                  color="error" 
                  variant="tonal" 
                  rounded="pill" 
                  size="small"
                  @click="handleCancelOrder(order)"
                >
                  Hủy đơn
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <!-- Order Details Expanded -->
          <v-expand-transition>
            <div v-show="isExpanded(order.id)" class="order-details pa-6">
              <!-- Shipping Info -->
              <div class="mb-6">
                <h4 class="section-title mb-4">
                  <v-icon size="18" color="primary" class="mr-2">mdi-truck-delivery</v-icon>
                  Thông tin giao hàng
                </h4>
                <v-card variant="outlined" class="rounded-xl pa-4" flat>
                  <div class="d-flex flex-wrap ga-6">
                    <div class="shipping-info-item">
                      <div class="text-caption text-medium-emphasis mb-1">Người nhận</div>
                      <div class="font-weight-bold">{{ order.shipping_recipient_name }}</div>
                    </div>
                    <div class="shipping-info-item">
                      <div class="text-caption text-medium-emphasis mb-1">Số điện thoại</div>
                      <div class="font-weight-bold">{{ order.shipping_recipient_phone }}</div>
                    </div>
                    <div class="shipping-info-item flex-grow-1">
                      <div class="text-caption text-medium-emphasis mb-1">Địa chỉ</div>
                      <div class="font-weight-bold">{{ order.shipping_address }}</div>
                    </div>
                  </div>
                </v-card>
              </div>

              <!-- Order Items -->
              <div class="mb-6">
                <h4 class="section-title mb-4">
                  <v-icon size="18" color="primary" class="mr-2">mdi-package-variant</v-icon>
                  Sản phẩm ({{ order.items?.length || 0 }})
                </h4>
                <v-card variant="outlined" class="rounded-xl pa-4" flat>
                  <div v-for="(item, idx) in order.items" :key="idx" 
                       class="d-flex flex-column flex-md-row ga-4 align-md-center"
                       :class="{ 'mb-4 pb-4 border-b': idx < order.items.length - 1 }">
                    <div class="order-item-image flex-shrink-0">
                      <v-img 
                        :src="getImageUrl(item.image_url)" 
                        :aspect-ratio="1"
                        cover 
                        class="rounded-lg"
                      >
                        <template v-slot:placeholder>
                          <div class="d-flex align-center justify-center fill-height bg-grey-darken-4">
                            <v-progress-circular indeterminate color="primary" size="16" />
                          </div>
                        </template>
                        <template v-slot:error>
                          <div class="d-flex align-center justify-center fill-height bg-grey-darken-3 rounded-lg">
                            <v-icon size="20" color="grey">mdi-image-broken</v-icon>
                          </div>
                        </template>
                      </v-img>
                    </div>
                    <div class="flex-grow-1">
                      <div class="text-subtitle-2 font-weight-bold">{{ item.product_name }}</div>
                      <div class="text-caption text-medium-emphasis">Phân loại: {{ item.variant_name }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-body-2 font-weight-bold neon-text-primary">
                        {{ formatCurrency(item.price_at_purchase) }}
                      </div>
                      <div class="text-caption text-medium-emphasis">x{{ item.quantity }}</div>
                    </div>
                    <div class="text-right" style="min-width: 120px;">
                      <div class="text-subtitle-2 font-weight-bold">
                        {{ formatCurrency(item.subtotal) }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>

              <!-- Payment Info -->
              <div class="mb-6">
                <h4 class="section-title mb-4">
                  <v-icon size="18" color="primary" class="mr-2">mdi-credit-card</v-icon>
                  Thanh toán
                </h4>
                <v-card variant="outlined" class="rounded-xl pa-4" flat>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="d-flex justify-space-between mb-2">
                        <span class="text-medium-emphasis">Phương thức:</span>
                        <span class="font-weight-medium">{{ order.payment?.method_name || 'COD' }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-2">
                        <span class="text-medium-emphasis">Trạng thái:</span>
                        <v-chip 
                          :color="getPaymentStatusColor(order.payment?.status)" 
                          size="x-small" 
                          variant="flat"
                        >
                          {{ formatPaymentStatus(order.payment?.status) }}
                        </v-chip>
                      </div>
                      <div v-if="order.payment?.transaction_code" class="d-flex justify-space-between">
                        <span class="text-medium-emphasis">Mã giao dịch:</span>
                        <span class="font-weight-medium text-caption">{{ order.payment.transaction_code }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="summary-box pa-4 rounded-lg">
                        <div class="d-flex justify-space-between mb-2">
                          <span class="text-medium-emphasis">Tạm tính:</span>
                          <span>{{ formatCurrency(order.sub_total) }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-2">
                          <span class="text-medium-emphasis">Phí vận chuyển:</span>
                          <span>{{ formatCurrency(order.shipping_fee) }}</span>
                        </div>
                        <div v-if="order.discount_amount > 0" class="d-flex justify-space-between mb-2">
                          <span class="text-medium-emphasis">Giảm giá:</span>
                          <span class="text-success">-{{ formatCurrency(order.discount_amount) }}</span>
                        </div>
                        <v-divider class="my-2"></v-divider>
                        <div class="d-flex justify-space-between">
                          <span class="font-weight-bold">Tổng cộng:</span>
                          <span class="text-h6 font-weight-bold neon-text-secondary">{{ formatCurrency(order.total_amount) }}</span>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </div>

              <!-- Actions for delivered orders -->
              <div v-if="order.status === 'delivered'" class="mt-6 pt-6 border-t d-flex justify-end ga-2">
                <v-btn variant="text" color="error" prepend-icon="mdi-refresh">Yêu cầu hoàn tiền</v-btn>
                <v-btn variant="text" color="warning" prepend-icon="mdi-keyboard-return">Trả hàng</v-btn>
              </div>
            </div>
          </v-expand-transition>
        </v-card>
      </div>
    </v-container>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Đóng</v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useOrdersStore } from '@/stores/orders.store';
import { useAuthStore } from '@/stores/auth.store';

// Stores
const ordersStore = useOrdersStore();
const authStore = useAuthStore();

// State
const statusFilter = ref('all');
const expandedOrders = ref<number[]>([]);
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
});

// Status options
const statusOptions = [
  { title: 'Tất cả đơn hàng', value: 'all' },
  { title: 'Chờ xác nhận', value: 'pending' },
  { title: 'Đang xử lý', value: 'processing' },
  { title: 'Đang giao', value: 'shipped' },
  { title: 'Đã giao', value: 'delivered' },
  { title: 'Đã hủy', value: 'cancelled' }
];

// Computed
const isLoading = computed(() => ordersStore.isLoading);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') return ordersStore.orders;
  return ordersStore.orders.filter(o => o.status === statusFilter.value);
});

// API Base URL for images
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';

// Methods
const getImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) {
    return 'https://picsum.photos/100/100?random=' + Math.random();
  }
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${apiBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

const showSnackbar = (text: string, color: string = 'success') => {
  snackbar.value = { show: true, text, color };
};

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error'
  };
  return map[status] || 'grey';
};

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
  };
  return map[status] || status;
};

const getPaymentStatusColor = (status?: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    completed: 'success',
    failed: 'error',
    refunded: 'info'
  };
  return map[status || ''] || 'grey';
};

const formatPaymentStatus = (status?: string) => {
  const map: Record<string, string> = {
    pending: 'Chờ thanh toán',
    completed: 'Đã thanh toán',
    failed: 'Thất bại',
    refunded: 'Đã hoàn tiền'
  };
  return map[status || ''] || 'N/A';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const toggleDetails = (id: number) => {
  const idx = expandedOrders.value.indexOf(id);
  if (idx > -1) expandedOrders.value.splice(idx, 1);
  else expandedOrders.value.push(id);
};

const isExpanded = (id: number) => expandedOrders.value.includes(id);

const handleCancelOrder = async (order: any) => {
  if (!confirm(`Bạn có chắc muốn hủy đơn hàng ${order.order_code}?`)) return;
  
  const result = await ordersStore.cancelOrder(order.id);
  if (result.success) {
    showSnackbar(result.message);
  } else {
    showSnackbar(result.message, 'error');
  }
};

// Lifecycle
onMounted(async () => {
  if (isAuthenticated.value) {
    await ordersStore.fetchOrders();
  }
});

// Watch auth state
watch(() => authStore.isAuthenticated, async (isAuth) => {
  if (isAuth) {
    await ordersStore.fetchOrders();
  } else {
    ordersStore.resetOrders();
  }
});
</script>

<style scoped>
.order-page {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.02) 0%, rgba(255, 0, 255, 0.02) 100%);
}

.page-title {
  background: linear-gradient(135deg, #00d4ff 0%, #ff00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: rgba(255, 255, 255, 0.02) !important;
  backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.filter-select :deep(.v-field) {
  background: rgba(255, 255, 255, 0.03) !important;
  border-color: rgba(255, 255, 255, 0.1);
}

.order-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s ease;
}

.order-card:hover {
  border-color: rgba(0, 212, 255, 0.3) !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.order-header {
  background: linear-gradient(to right, rgba(0, 212, 255, 0.03), rgba(255, 0, 255, 0.03));
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.order-code {
  background: linear-gradient(135deg, #00d4ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.order-details {
  background: rgba(0, 0, 0, 0.2);
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
}

.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.border-t {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.product-image {
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.2s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

/* Order item image container */
.order-item-image {
  width: 56px;
  min-width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.summary-box {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(255, 0, 255, 0.05));
  border: 1px solid rgba(0, 212, 255, 0.15);
}

.shipping-info-item {
  min-width: 150px;
}

.neon-text-primary {
  color: #00d4ff;
}

.neon-text-secondary {
  color: #ff00ff;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.4);
}

.text-success {
  color: #22c55e !important;
}

.ga-2 { gap: 8px; }
.ga-3 { gap: 12px; }
.ga-4 { gap: 16px; }
.ga-6 { gap: 24px; }
.ga-x-4 { column-gap: 16px; }
</style>