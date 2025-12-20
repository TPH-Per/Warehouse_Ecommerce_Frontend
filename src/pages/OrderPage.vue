<template>
  <v-main class="bg-slate-50 pb-16">
    <v-container>
      <v-row align="center" class="mb-8 mt-4">
        <v-col cols="12" md="6">
          <h1 class="text-h4 font-weight-bold">Đơn hàng của tôi</h1>
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
          ></v-select>
        </v-col>
      </v-row>

      <div v-if="filteredOrders.length === 0" class="text-center py-16 glass-card rounded-xl border-light">
        <v-icon size="100" color="grey-lighten-2" class="mb-4">mdi-package-variant-closed</v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">Chưa có đơn hàng nào</h2>
        <p class="text-grey mb-6">Bắt đầu mua sắm để lấp đầy lịch sử đơn hàng của bạn!</p>
        <v-btn color="primary" rounded="pill" size="large" to="/products">Mua sắm ngay</v-btn>
      </div>

      <div v-else class="ga-6 d-flex flex-column">
        <v-card 
          v-for="order in filteredOrders" 
          :key="order.id" 
          class="rounded-xl border-light overflow-hidden order-card" 
          flat
        >
          <!-- Order Header -->
          <div class="pa-6 border-b order-header">
            <v-row align="center">
              <v-col cols="12" sm="7">
                <div class="d-flex align-center ga-3 mb-2">
                  <span class="text-h6 font-weight-bold order-code">{{ order.order_code }}</span>
                  <v-chip :color="getStatusColor(order.status)" size="small" variant="flat" class="font-weight-bold">
                    {{ formatStatus(order.status) }}
                  </v-chip>
                </div>
                <div class="text-body-2 text-grey d-flex flex-wrap ga-x-4">
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
                >
                  Hủy đơn
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <!-- Order Details Expanded -->
          <v-expand-transition>
            <div v-show="isExpanded(order.id)" class="bg-slate-50 pa-6">
              <!-- Shipping Info -->
              <div class="mb-6">
                <h4 class="text-subtitle-2 font-weight-bold mb-4 text-uppercase tracking-wider d-flex align-center ga-2">
                  <v-icon size="18" color="primary">mdi-truck-delivery</v-icon>
                  Thông tin giao hàng
                </h4>
                <v-card variant="outlined" class="rounded-xl bg-white pa-4" flat>
                  <div class="d-flex flex-wrap ga-6">
                    <div class="shipping-info-item">
                      <div class="text-caption text-grey mb-1">Người nhận</div>
                      <div class="font-weight-bold">{{ order.shipping_recipient_name }}</div>
                    </div>
                    <div class="shipping-info-item">
                      <div class="text-caption text-grey mb-1">Số điện thoại</div>
                      <div class="font-weight-bold">{{ order.shipping_recipient_phone }}</div>
                    </div>
                    <div class="shipping-info-item flex-grow-1">
                      <div class="text-caption text-grey mb-1">Địa chỉ</div>
                      <div class="font-weight-bold">{{ order.shipping_address }}</div>
                    </div>
                  </div>
                </v-card>
              </div>

              <!-- Order Items -->
              <div class="mb-6">
                <h4 class="text-subtitle-2 font-weight-bold mb-4 text-uppercase tracking-wider d-flex align-center ga-2">
                  <v-icon size="18" color="primary">mdi-package-variant</v-icon>
                  Sản phẩm ({{ order.items?.length || 0 }})
                </h4>
                <v-card variant="outlined" class="rounded-xl bg-white pa-4" flat>
                  <div v-for="(item, idx) in order.items" :key="idx" 
                       class="d-flex flex-column flex-md-row ga-4 align-md-center"
                       :class="{ 'mb-4 pb-4 border-b': idx < order.items.length - 1 }">
                    <v-img 
                      :src="item.image_url || 'https://placehold.co/100x100?text=Product'" 
                      width="70" 
                      height="70" 
                      cover 
                      class="rounded-lg flex-shrink-0 product-image"
                    ></v-img>
                    <div class="flex-grow-1">
                      <div class="text-subtitle-2 font-weight-bold">{{ item.product_name }}</div>
                      <div class="text-caption text-grey">Phân loại: {{ item.variant_name }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-body-2 font-weight-bold text-primary">
                        {{ formatCurrency(item.price_at_purchase) }}
                      </div>
                      <div class="text-caption text-grey">x{{ item.quantity }}</div>
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
                <h4 class="text-subtitle-2 font-weight-bold mb-4 text-uppercase tracking-wider d-flex align-center ga-2">
                  <v-icon size="18" color="primary">mdi-credit-card</v-icon>
                  Thanh toán
                </h4>
                <v-card variant="outlined" class="rounded-xl bg-white pa-4" flat>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="d-flex justify-space-between mb-2">
                        <span class="text-grey">Phương thức:</span>
                        <span class="font-weight-medium">{{ order.payment?.method_name || 'N/A' }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-2">
                        <span class="text-grey">Trạng thái:</span>
                        <v-chip 
                          :color="getPaymentStatusColor(order.payment?.status)" 
                          size="x-small" 
                          variant="flat"
                        >
                          {{ formatPaymentStatus(order.payment?.status) }}
                        </v-chip>
                      </div>
                      <div v-if="order.payment?.transaction_code" class="d-flex justify-space-between">
                        <span class="text-grey">Mã giao dịch:</span>
                        <span class="font-weight-medium text-caption">{{ order.payment.transaction_code }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="summary-box pa-4 rounded-lg">
                        <div class="d-flex justify-space-between mb-2">
                          <span class="text-grey">Tạm tính:</span>
                          <span>{{ formatCurrency(order.sub_total) }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-2">
                          <span class="text-grey">Phí vận chuyển:</span>
                          <span>{{ formatCurrency(order.shipping_fee) }}</span>
                        </div>
                        <div v-if="order.discount_amount > 0" class="d-flex justify-space-between mb-2">
                          <span class="text-grey">Giảm giá:</span>
                          <span class="text-success">-{{ formatCurrency(order.discount_amount) }}</span>
                        </div>
                        <v-divider class="my-2"></v-divider>
                        <div class="d-flex justify-space-between">
                          <span class="font-weight-bold">Tổng cộng:</span>
                          <span class="text-h6 font-weight-bold text-primary">{{ formatCurrency(order.total_amount) }}</span>
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
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface OrderItem {
  product_variant_id: number;
  product_name: string;
  variant_name: string;
  quantity: number;
  price_at_purchase: number;
  subtotal: number;
  image_url?: string;
}

interface Payment {
  id: number;
  method_name: string;
  status: string;
  amount: number;
  transaction_code?: string;
}

interface Order {
  id: number;
  order_code: string;
  status: string;
  shipping_recipient_name: string;
  shipping_recipient_phone: string;
  shipping_address: string;
  sub_total: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  branch_id?: number;
  branch_name?: string;
  created_at: string;
  items: OrderItem[];
  payment?: Payment;
}

const statusFilter = ref('all');
const expandedOrders = ref<number[]>([]);

const statusOptions = [
  { title: 'Tất cả đơn hàng', value: 'all' },
  { title: 'Chờ xác nhận', value: 'pending' },
  { title: 'Đang xử lý', value: 'processing' },
  { title: 'Đang giao', value: 'shipped' },
  { title: 'Đã giao', value: 'delivered' },
  { title: 'Đã hủy', value: 'cancelled' }
];

// Mock Data theo cấu trúc database
const orders = ref<Order[]>([
  {
    id: 1,
    order_code: 'ORD-2024121501',
    status: 'processing',
    shipping_recipient_name: 'Nguyễn Văn A',
    shipping_recipient_phone: '0912345678',
    shipping_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    sub_total: 2450000,
    shipping_fee: 30000,
    discount_amount: 100000,
    total_amount: 2380000,
    branch_id: 1,
    branch_name: 'Chi nhánh Quận 1',
    created_at: '2024-12-15T10:30:00',
    items: [
      {
        product_variant_id: 1,
        product_name: 'Gojo Satoru Figure 1/7',
        variant_name: 'Phiên bản giới hạn',
        quantity: 1,
        price_at_purchase: 1950000,
        subtotal: 1950000,
        image_url: 'https://placehold.co/100x100?text=Gojo'
      },
      {
        product_variant_id: 2,
        product_name: 'Acrylic Stand Jujutsu Kaisen',
        variant_name: 'Set 5 nhân vật',
        quantity: 1,
        price_at_purchase: 500000,
        subtotal: 500000,
        image_url: 'https://placehold.co/100x100?text=Stand'
      }
    ],
    payment: {
      id: 1,
      method_name: 'VNPay',
      status: 'completed',
      amount: 2380000,
      transaction_code: 'VNP20241215103012'
    }
  },
  {
    id: 2,
    order_code: 'ORD-2024120101',
    status: 'delivered',
    shipping_recipient_name: 'Nguyễn Văn A',
    shipping_recipient_phone: '0912345678',
    shipping_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    sub_total: 1250000,
    shipping_fee: 0,
    discount_amount: 0,
    total_amount: 1250000,
    branch_id: 2,
    branch_name: 'Chi nhánh Quận 3',
    created_at: '2024-12-01T14:20:00',
    items: [
      {
        product_variant_id: 3,
        product_name: 'Nendoroid Power',
        variant_name: 'Standard Edition',
        quantity: 1,
        price_at_purchase: 1250000,
        subtotal: 1250000,
        image_url: 'https://placehold.co/100x100?text=Power'
      }
    ],
    payment: {
      id: 2,
      method_name: 'COD',
      status: 'completed',
      amount: 1250000
    }
  },
  {
    id: 3,
    order_code: 'ORD-2024121801',
    status: 'pending',
    shipping_recipient_name: 'Trần Thị B',
    shipping_recipient_phone: '0987654321',
    shipping_address: '456 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    sub_total: 3500000,
    shipping_fee: 50000,
    discount_amount: 200000,
    total_amount: 3350000,
    branch_id: 1,
    branch_name: 'Chi nhánh Quận 1',
    created_at: '2024-12-18T09:15:00',
    items: [
      {
        product_variant_id: 4,
        product_name: 'Rem Figure 1/4 Scale',
        variant_name: 'Wedding Dress Ver.',
        quantity: 1,
        price_at_purchase: 3500000,
        subtotal: 3500000,
        image_url: 'https://placehold.co/100x100?text=Rem'
      }
    ],
    payment: {
      id: 3,
      method_name: 'Momo',
      status: 'pending',
      amount: 3350000
    }
  }
]);

const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') return orders.value;
  return orders.value.filter(o => o.status === statusFilter.value);
});

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
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
}

.border-light {
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.ga-2 { gap: 8px; }
.ga-3 { gap: 12px; }
.ga-4 { gap: 16px; }
.ga-6 { gap: 24px; }
.ga-x-4 { column-gap: 16px; }

.order-card {
  transition: all 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.order-header {
  background: linear-gradient(to right, rgba(14, 165, 233, 0.02), rgba(217, 70, 239, 0.02));
}

.order-code {
  background: linear-gradient(135deg, #0ea5e9, #d946ef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-image {
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

.summary-box {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(217, 70, 239, 0.05));
}

.shipping-info-item {
  min-width: 150px;
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.text-primary {
  color: #0ea5e9 !important;
}

.text-success {
  color: #22c55e !important;
}
</style>