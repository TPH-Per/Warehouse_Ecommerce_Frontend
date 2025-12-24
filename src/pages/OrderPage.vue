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

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-4 text-medium-emphasis">Đang tải đơn hàng...</p>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="text-center py-16 glass-card rounded-xl border-light">
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
                  @click="cancelOrder(order.id)"
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

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top">
      {{ snackbar.text }}
    </v-snackbar>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ordersApi, type Order } from '@/api/orders.api';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

// ========== STATE ==========
const isLoading = ref(true);
const orders = ref<Order[]>([]);
const statusFilter = ref('all');
const expandedOrders = ref<number[]>([]);
const snackbar = ref({ show: false, text: '', color: 'success' });

const statusOptions = [
  { title: 'Tất cả đơn hàng', value: 'all' },
  { title: 'Chờ xác nhận', value: 'pending' },
  { title: 'Đang xử lý', value: 'processing' },
  { title: 'Đang giao', value: 'shipped' },
  { title: 'Đã giao', value: 'delivered' },
  { title: 'Đã hủy', value: 'cancelled' }
];

// ========== COMPUTED ==========
const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') return orders.value;
  return orders.value.filter(o => o.status === statusFilter.value);
});

// ========== METHODS ==========
const fetchOrders = async () => {
  isLoading.value = true;
  try {
    const response = await ordersApi.getMyOrders();
    if (response.data?.Success && response.data.Data) {
      // Map API response to Order interface
      orders.value = response.data.Data.map((o: any) => ({
        id: o.Id,
        order_code: o.OrderCode,
        user_id: o.UserId,
        status: o.Status,
        shipping_recipient_name: o.ShippingRecipientName,
        shipping_recipient_phone: o.ShippingRecipientPhone,
        shipping_address: o.ShippingAddress,
        sub_total: o.SubTotal,
        shipping_fee: o.ShippingFee,
        discount_amount: o.DiscountAmount,
        total_amount: o.TotalAmount,
        branch_id: o.BranchId,
        branch_name: o.BranchName,
        created_at: o.CreatedAt,
        updated_at: o.UpdatedAt,
        items: (o.Items || []).map((i: any) => ({
          product_variant_id: i.ProductVariantId,
          product_id: i.ProductId,
          product_name: i.ProductName,
          variant_name: i.VariantName,
          quantity: i.Quantity,
          price_at_purchase: i.PriceAtPurchase,
          subtotal: i.Subtotal,
          image_url: i.ImageUrl
        })),
        payment: o.Payment ? {
          id: o.Payment.Id,
          payment_method_id: o.Payment.PaymentMethodId,
          method_name: o.Payment.MethodName,
          status: o.Payment.Status,
          amount: o.Payment.Amount,
          transaction_code: o.Payment.TransactionCode,
          created_at: o.Payment.CreatedAt
        } : undefined
      }));
    } else if (!response.data?.IsAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    showSnackbar('Không thể tải danh sách đơn hàng', 'error');
  } finally {
    isLoading.value = false;
  }
};

const cancelOrder = async (orderId: number) => {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
  
  try {
    const response = await ordersApi.cancelOrder(orderId);
    if (response.data?.Success) {
      showSnackbar('Đã hủy đơn hàng thành công', 'success');
      // Update local state
      const order = orders.value.find(o => o.id === orderId);
      if (order) order.status = 'cancelled';
    } else {
      showSnackbar(response.data?.Message || 'Không thể hủy đơn hàng', 'error');
    }
  } catch (error) {
    console.error('Failed to cancel order:', error);
    showSnackbar('Có lỗi xảy ra khi hủy đơn hàng', 'error');
  }
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
  if (!dateStr) return 'N/A';
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

// ========== LIFECYCLE ==========
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=/orders');
    return;
  }
  fetchOrders();
});
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