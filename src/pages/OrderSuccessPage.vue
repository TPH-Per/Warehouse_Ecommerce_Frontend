<template>
  <v-container class="py-10">
    <div style="max-width: 800px; margin: 0 auto;">
      <!-- Success Header -->
      <div class="text-center mb-10">
        <v-avatar size="72" color="success" class="mb-5 success-icon">
          <v-icon size="40">mdi-check</v-icon>
        </v-avatar>
        <h1 class="text-h4 font-weight-bold mb-2">Cảm ơn bạn đã đặt hàng!</h1>
        <p class="text-body-1 text-medium-emphasis">
          Mã đơn hàng: 
          <span class="font-weight-bold neon-text-primary">{{ orderCode }}</span>
        </p>
        <p class="text-body-2 text-medium-emphasis">
          Chúng tôi đã ghi nhận đơn hàng và sẽ xử lý trong thời gian sớm nhất.
        </p>
      </div>

      <!-- Order Details -->
      <v-row v-if="orderData">
        <!-- Order Items -->
        <v-col cols="12">
          <v-card class="order-card rounded-xl" variant="outlined">
            <v-card-title class="d-flex align-center pa-4 border-b">
              <v-icon start color="primary">mdi-package-variant</v-icon>
              Chi tiết đơn hàng
            </v-card-title>

            <v-list lines="two" class="pa-0" bg-color="transparent">
              <template v-for="(item, index) in orderData.items" :key="index">
                <v-divider v-if="index > 0" />
                <v-list-item class="pa-4">
                  <template v-slot:prepend>
                    <v-img :src="item.image" width="60" height="60" cover class="rounded-lg" />
                  </template>
                  <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>Số lượng: {{ item.quantity }}</v-list-item-subtitle>
                  <template v-slot:append>
                    <span class="font-weight-bold">{{ formatPrice(item.price * item.quantity) }}</span>
                  </template>
                </v-list-item>
              </template>
            </v-list>

            <!-- Price Summary Table -->
            <v-table class="summary-table">
              <tbody>
                <tr>
                  <td>Tạm tính</td>
                  <td class="text-right">{{ formatPrice(orderData.subTotal) }}</td>
                </tr>
                <tr>
                  <td>Phí vận chuyển</td>
                  <td class="text-right">{{ formatPrice(orderData.shippingFee) }}</td>
                </tr>
                <tr v-if="orderData.discountAmount > 0">
                  <td class="text-success">Giảm giá</td>
                  <td class="text-right text-success">-{{ formatPrice(orderData.discountAmount) }}</td>
                </tr>
                <tr class="total-row">
                  <td class="font-weight-bold text-subtitle-1">Tổng cộng</td>
                  <td class="text-right font-weight-bold text-h6 neon-text-secondary">
                    {{ formatPrice(orderData.total) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>

        <!-- Shipping & Branch Info -->
        <v-col cols="12" md="6">
          <v-card class="order-card rounded-xl pa-5 h-100" variant="outlined">
            <h3 class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center">
              <v-icon start color="primary" size="small">mdi-truck-fast</v-icon>
              Thông tin giao hàng
            </h3>
            <div class="text-body-2">
              <p class="font-weight-bold mb-1">{{ orderData.shippingInfo?.recipientName }}</p>
              <p class="text-medium-emphasis mb-1">
                <v-icon size="small" class="mr-1">mdi-phone</v-icon>
                {{ orderData.shippingInfo?.recipientPhone }}
              </p>
              <p class="text-medium-emphasis">
                <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
                {{ orderData.shippingInfo?.address }}
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="order-card rounded-xl pa-5 h-100" variant="outlined">
            <h3 class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center">
              <v-icon start color="primary" size="small">mdi-store</v-icon>
              Chi nhánh xử lý
            </h3>
            <v-chip color="primary" variant="tonal" size="small">
              <v-icon start size="small">mdi-store-marker</v-icon>
              {{ orderData.branchName }}
            </v-chip>
            <p class="text-caption text-medium-emphasis mt-3">
              Đơn hàng sẽ được đóng gói và giao từ chi nhánh này.
            </p>
          </v-card>
        </v-col>

        <!-- Payment Info -->
        <v-col cols="12">
          <v-card class="order-card rounded-xl pa-5" variant="outlined">
            <h3 class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center">
              <v-icon start color="primary" size="small">mdi-credit-card</v-icon>
              Phương thức thanh toán
            </h3>
            <div class="d-flex align-center ga-2">
              <v-chip color="surface-variant" size="small">{{ orderData.paymentMethod }}</v-chip>
              <v-chip color="warning" variant="tonal" size="small">
                <v-icon start size="small">mdi-clock</v-icon>
                Chờ xác nhận
              </v-chip>
            </div>
          </v-card>
        </v-col>

        <!-- Order Timeline -->
        <v-col cols="12">
          <v-card class="order-card rounded-xl pa-5" variant="outlined">
            <h3 class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center">
              <v-icon start color="primary" size="small">mdi-timeline-clock</v-icon>
              Trạng thái đơn hàng
            </h3>
            <v-timeline side="end" density="compact" truncate-line="both">
              <v-timeline-item dot-color="success" size="x-small" fill-dot>
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Vừa xong</span>
                </template>
                <div class="text-body-2 font-weight-bold">Đặt hàng thành công</div>
              </v-timeline-item>
              <v-timeline-item dot-color="grey-lighten-1" size="x-small">
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Sắp tới</span>
                </template>
                <div class="text-body-2 text-medium-emphasis">Chi nhánh xác nhận</div>
              </v-timeline-item>
              <v-timeline-item dot-color="grey-lighten-1" size="x-small">
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Sắp tới</span>
                </template>
                <div class="text-body-2 text-medium-emphasis">Đang chuẩn bị hàng</div>
              </v-timeline-item>
              <v-timeline-item dot-color="grey-lighten-1" size="x-small">
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Sắp tới</span>
                </template>
                <div class="text-body-2 text-medium-emphasis">Đang vận chuyển</div>
              </v-timeline-item>
              <v-timeline-item dot-color="grey-lighten-1" size="x-small">
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Sắp tới</span>
                </template>
                <div class="text-body-2 text-medium-emphasis">Giao hàng thành công</div>
              </v-timeline-item>
            </v-timeline>
          </v-card>
        </v-col>

        <!-- Actions -->
        <v-col cols="12">
          <div class="d-flex flex-column flex-sm-row ga-3 justify-center">
            <v-btn
              :to="{ name: 'ProductList' }"
              color="secondary"
              size="large"
              rounded="xl"
              class="font-weight-bold continue-btn"
            >
              <v-icon start>mdi-store</v-icon>
              Tiếp tục mua sắm
            </v-btn>
            <v-btn variant="outlined" size="large" rounded="xl" :to="{ name: 'Orders' }">
              <v-icon start>mdi-clipboard-list</v-icon>
              Xem đơn hàng của tôi
            </v-btn>
            <v-btn variant="text" color="primary" size="large" rounded="xl" to="/">
              <v-icon start>mdi-home</v-icon>
              Về trang chủ
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-card v-else class="text-center py-10 rounded-xl" variant="outlined">
        <v-icon size="80" color="warning" class="mb-4">mdi-alert-circle-outline</v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">Không tìm thấy thông tin đơn hàng</h2>
        <p class="text-medium-emphasis mb-6">Vui lòng kiểm tra lại đơn hàng của bạn</p>
        <v-btn :to="{ name: 'Orders' }" color="primary" size="large" rounded="xl">
          Xem đơn hàng
        </v-btn>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderData {
  orderCode?: string;
  branchId: number;
  branchName: string;
  items: OrderItem[];
  subTotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  shippingInfo?: {
    recipientName: string;
    recipientPhone: string;
    address: string;
  };
  paymentMethod?: string;
}

const orderCode = ref('');
const orderData = ref<OrderData | null>(null);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

onMounted(() => {
  // Load order from localStorage
  const savedOrder = localStorage.getItem('order_confirmation');
  if (savedOrder) {
    try {
      const data = JSON.parse(savedOrder);
      orderCode.value = data.orderCode || 'ORD-' + Date.now();
      orderData.value = data;
      localStorage.removeItem('order_confirmation');
    } catch (e) {
      console.error('Failed to parse order data:', e);
    }
  }
});
</script>

<style scoped>
.neon-text-primary {
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.neon-text-secondary {
  color: #ff00ff;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.success-icon {
  box-shadow: 0 0 25px rgba(0, 255, 136, 0.4);
  animation: successPulse 2s ease-in-out infinite;
}

@keyframes successPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 136, 0.3); }
  50% { box-shadow: 0 0 35px rgba(0, 255, 136, 0.5); }
}

.order-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.summary-table {
  background: transparent !important;
}

.summary-table td {
  padding: 10px 16px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.total-row td {
  background: rgba(0, 212, 255, 0.05);
  border-top: 1px solid rgba(0, 212, 255, 0.15);
}

.continue-btn {
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
}

.continue-btn:hover {
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
}

@media print {
  .v-btn {
    display: none !important;
  }
}
</style>
