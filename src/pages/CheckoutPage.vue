<template>
  <v-container class="py-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="40" />
      <p class="mt-4 text-medium-emphasis">Đang tải thông tin đơn hàng...</p>
    </div>

    <!-- No Order Data -->
    <v-card v-else-if="!orderData" class="text-center py-16 rounded-xl" variant="outlined">
      <v-icon size="64" color="warning" class="mb-4">mdi-alert-circle</v-icon>
      <h2 class="text-h6 font-weight-bold mb-2">Không tìm thấy đơn hàng</h2>
      <p class="text-medium-emphasis mb-4">Vui lòng quay lại giỏ hàng và đặt hàng lại.</p>
      <v-btn :to="{ name: 'Cart' }" color="primary" rounded="lg">
        <v-icon start>mdi-cart</v-icon>
        Quay lại giỏ hàng
      </v-btn>
    </v-card>

    <!-- Success Content -->
    <template v-else>
      <!-- Success Header (không in) -->
      <div class="text-center mb-8 no-print">
        <v-avatar size="80" color="success" class="mb-4 success-icon">
          <v-icon size="48">mdi-check</v-icon>
        </v-avatar>
        <h1 class="text-h4 font-weight-bold mb-2">Đặt hàng thành công!</h1>
        <p class="text-body-1 text-medium-emphasis">
          Cảm ơn bạn đã mua hàng tại <strong class="neon-text-primary">PerW Shop</strong>
        </p>
      </div>

      <!-- Invoice Container -->
      <v-card class="invoice-container rounded-xl pa-0 mb-6" variant="outlined" ref="invoiceRef">
        <!-- Invoice Header -->
        <div class="invoice-header pa-6">
          <v-row align="center">
            <v-col cols="6">
              <div class="d-flex align-center">
                <span class="text-h5 font-weight-bold neon-text-primary">PerW</span>
                <span class="text-h5 font-weight-black neon-text-secondary ml-1">Shop</span>
              </div>
              <div class="text-caption text-medium-emphasis mt-1">
                Anime Figure & Collectibles
              </div>
            </v-col>
            <v-col cols="6" class="text-right">
              <div class="text-h6 font-weight-bold">HÓA ĐƠN</div>
              <div class="text-body-2">#{{ orderData.orderCode }}</div>
              <div class="text-caption text-medium-emphasis">{{ formatDate(orderData.createdAt) }}</div>
            </v-col>
          </v-row>
        </div>

        <v-divider />

        <!-- Customer & Payment Info -->
        <div class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <h4 class="text-subtitle-2 font-weight-bold mb-3 text-primary">
                <v-icon size="16" class="mr-1">mdi-account</v-icon>
                THÔNG TIN KHÁCH HÀNG
              </h4>
              <div class="info-card pa-3 rounded-lg">
                <p class="font-weight-bold mb-1">{{ orderData.customer?.name || 'Khách hàng' }}</p>
                <p class="text-body-2 text-medium-emphasis mb-1">
                  <v-icon size="14" class="mr-1">mdi-phone</v-icon>
                  {{ orderData.customer?.phone || 'Chưa cập nhật' }}
                </p>
                <p class="text-body-2 text-medium-emphasis">
                  <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                  {{ orderData.customer?.address || 'Chưa cập nhật' }}
                </p>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <h4 class="text-subtitle-2 font-weight-bold mb-3 text-primary">
                <v-icon size="16" class="mr-1">mdi-credit-card</v-icon>
                THANH TOÁN
              </h4>
              <div class="info-card pa-3 rounded-lg">
                <p class="font-weight-bold mb-1">{{ orderData.paymentMethodName || 'COD' }}</p>
                <p class="text-body-2 text-medium-emphasis">
                  <v-chip 
                    :color="orderData.paymentMethod === 'COD' ? 'warning' : 'info'" 
                    size="x-small" 
                    variant="tonal"
                  >
                    {{ orderData.paymentMethod === 'COD' ? 'Chưa thanh toán' : 'Chờ xác nhận' }}
                  </v-chip>
                </p>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-divider />

        <!-- Order Items Table -->
        <div class="pa-6">
          <h4 class="text-subtitle-2 font-weight-bold mb-3 text-primary">
            <v-icon size="16" class="mr-1">mdi-package-variant</v-icon>
            CHI TIẾT ĐƠN HÀNG
          </h4>
          
          <v-table class="invoice-table" density="comfortable">
            <thead>
              <tr>
                <th class="text-left">Sản phẩm</th>
                <th class="text-center" style="width: 80px;">SL</th>
                <th class="text-right" style="width: 120px;">Đơn giá</th>
                <th class="text-right" style="width: 120px;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in orderData.items" :key="index">
                <td>
                  <div class="d-flex align-center ga-3">
                    <div class="item-image-small">
                      <v-img :src="getImageUrl(item.image)" :aspect-ratio="1" cover class="rounded" />
                    </div>
                    <span class="text-body-2">{{ item.name }}</span>
                  </div>
                </td>
                <td class="text-center">{{ item.quantity }}</td>
                <td class="text-right">{{ formatPrice(item.price) }}</td>
                <td class="text-right font-weight-medium">{{ formatPrice(item.price * item.quantity) }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <v-divider />

        <!-- Price Summary -->
        <div class="pa-6">
          <div class="summary-section">
            <div class="summary-row">
              <span class="text-body-2">Tạm tính ({{ orderData.items?.length || 0 }} sản phẩm)</span>
              <span class="text-body-2 font-weight-medium">{{ formatPrice(orderData.subTotal) }}</span>
            </div>
            <div class="summary-row">
              <span class="text-body-2">Phí vận chuyển</span>
              <span class="text-body-2 font-weight-medium">{{ formatPrice(orderData.shippingFee) }}</span>
            </div>
            <div v-if="orderData.discountAmount > 0" class="summary-row text-success">
              <span class="text-body-2">
                Giảm giá
                <v-chip v-if="orderData.discountCode" size="x-small" color="success" class="ml-1">
                  {{ orderData.discountCode }}
                </v-chip>
              </span>
              <span class="text-body-2 font-weight-medium">-{{ formatPrice(orderData.discountAmount) }}</span>
            </div>
            <v-divider class="my-3" />
            <div class="summary-row total-row">
              <span class="text-subtitle-1 font-weight-bold">TỔNG CỘNG</span>
              <span class="text-h5 font-weight-bold neon-text-secondary">
                {{ formatPrice(orderData.total) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Invoice Footer -->
        <div class="invoice-footer pa-4 text-center">
          <p class="text-caption text-medium-emphasis mb-1">
            Cảm ơn quý khách đã mua hàng tại PerW Shop!
          </p>
          <p class="text-caption text-medium-emphasis">
            Hotline: 1900 xxxx | Email: support@perwshop.vn
          </p>
        </div>
      </v-card>

      <!-- Action Buttons (không in) -->
      <div class="d-flex justify-center ga-4 no-print">
        <v-btn color="primary" variant="outlined" rounded="lg" size="large" @click="printInvoice">
          <v-icon start>mdi-printer</v-icon>
          In hóa đơn
        </v-btn>
        <v-btn :to="{ name: 'Order' }" color="secondary" rounded="lg" size="large">
          <v-icon start>mdi-clipboard-list</v-icon>
          Xem đơn hàng
        </v-btn>
        <v-btn :to="{ name: 'ProductList' }" variant="text" rounded="lg" size="large">
          Tiếp tục mua sắm
        </v-btn>
      </div>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderData {
  orderId: number;
  orderCode: string;
  items: OrderItem[];
  subTotal: number;
  shippingFee: number;
  discountCode?: string;
  discountAmount: number;
  total: number;
  createdAt: string;
  paymentMethod?: string;
  paymentMethodName?: string;
  customer?: {
    name: string;
    phone: string;
    address: string;
  };
}

const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();

const isLoading = ref(true);
const orderData = ref<OrderData | null>(null);
const invoiceRef = ref<HTMLElement | null>(null);

// Image URL helper
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://localhost:44377';

const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMxYTFhMmUiLz48cGF0aCBkPSJNMzAgMjBMMzggMzVIMjJMMzAgMjBaIiBmaWxsPSIjMGYzNDYwIi8+PC9zdmc+';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) return `${API_BASE_URL}${imageUrl}`;
  return `${API_BASE_URL}/wwwroot/uploads/products/${imageUrl}`;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const printInvoice = () => {
  window.print();
};

onMounted(async () => {
  try {
    // Lấy data từ localStorage
    const savedOrder = localStorage.getItem('checkout_order');
    if (savedOrder) {
      orderData.value = JSON.parse(savedOrder);
      // Clear cart sau khi checkout thành công
      await cartStore.clearCart();
    }
  } catch (error) {
    console.error('Error loading order data:', error);
  } finally {
    isLoading.value = false;
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
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.invoice-container {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  max-width: 800px;
  margin: 0 auto;
}

.invoice-header {
  background: rgba(0, 212, 255, 0.03);
}

.invoice-footer {
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.info-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.invoice-table {
  background: transparent !important;
}

.invoice-table thead th {
  background: rgba(0, 212, 255, 0.05) !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  font-size: 0.75rem !important;
  letter-spacing: 0.5px;
}

.invoice-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02) !important;
}

.item-image-small {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 6px;
  overflow: hidden;
}

.summary-section {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.total-row {
  padding-top: 12px;
}

/* Print Styles */
@media print {
  /* Ẩn các phần không cần in */
  .no-print,
  .v-app-bar,
  .v-navigation-drawer,
  .v-footer,
  header,
  nav,
  .app-header {
    display: none !important;
  }
  
  /* Reset container */
  .v-main,
  .v-container {
    padding: 0 !important;
    margin: 0 !important;
  }
  
  /* Đảm bảo chỉ in 1 trang */
  .invoice-container {
    page-break-inside: avoid;
    page-break-after: always;
    border: 1px solid #ddd !important;
    box-shadow: none !important;
    background: white !important;
    max-width: 100% !important;
    margin: 0 !important;
  }
  
  /* Reset colors cho in */
  .neon-text-primary,
  .neon-text-secondary {
    text-shadow: none !important;
    color: #333 !important;
  }
  
  .invoice-header {
    background: #f5f5f5 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .info-card {
    background: #f9f9f9 !important;
    border-color: #ddd !important;
  }
  
  .invoice-table thead th {
    background: #f0f0f0 !important;
    color: #333 !important;
  }
  
  .summary-section {
    background: #f9f9f9 !important;
    border-color: #ddd !important;
  }
  
  .invoice-footer {
    background: #f5f5f5 !important;
  }
  
  /* Page setup */
  @page {
    size: A4;
    margin: 10mm;
  }
  
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background: white !important;
  }
  
  /* Hide Vuetify overlays */
  .v-overlay-container {
    display: none !important;
  }
}
</style>