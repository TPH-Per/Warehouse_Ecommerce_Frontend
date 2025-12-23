<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Giỏ hàng</h1>
        <p class="text-medium-emphasis">{{ cartCount }} sản phẩm trong giỏ</p>
      </div>
      <v-btn v-if="cartItems.length > 0" variant="text" color="error" @click="clearCart">
        <v-icon start>mdi-delete-sweep</v-icon>
        Xóa tất cả
      </v-btn>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-medium-emphasis">Đang tải giỏ hàng...</p>
    </div>

    <!-- Not Authenticated State -->
    <v-card v-else-if="!isAuthenticated" class="empty-cart text-center py-16 rounded-xl" variant="outlined">
      <v-icon size="100" color="warning" class="mb-4">mdi-account-lock-outline</v-icon>
      <h2 class="text-h5 font-weight-bold mb-2">Vui lòng đăng nhập</h2>
      <p class="text-medium-emphasis mb-6">Đăng nhập để xem và quản lý giỏ hàng của bạn</p>
      <v-btn :to="{ name: 'Login', query: { redirect: '/cart' } }" color="primary" size="large" rounded="xl">
        <v-icon start>mdi-login</v-icon>
        Đăng nhập ngay
      </v-btn>
    </v-card>

    <!-- Empty State -->
    <v-card v-else-if="cartItems.length === 0" class="empty-cart text-center py-16 rounded-xl" variant="outlined">
      <v-icon size="100" color="primary" class="mb-4">mdi-shopping-outline</v-icon>
      <h2 class="text-h5 font-weight-bold mb-2">Giỏ hàng của bạn đang trống</h2>
      <p class="text-medium-emphasis mb-6">Thêm một số mô hình anime tuyệt vời để bắt đầu!</p>
      <v-btn :to="{ name: 'ProductList' }" color="primary" size="large" rounded="xl">
        <v-icon start>mdi-store</v-icon>
        Tiếp tục mua sắm
      </v-btn>
    </v-card>

    <!-- Cart Content -->
    <v-row v-else>
      <!-- Cart Items -->
      <v-col cols="12" lg="8">
        <!-- Group by Branch -->
        <div v-for="group in groupedCartItems" :key="group.id" class="mb-4">
          <v-card class="cart-group-card rounded-xl overflow-hidden" variant="outlined">
            <!-- Branch Header -->
            <v-card-item class="branch-header py-3">
              <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center ga-3">
                  <v-avatar color="primary" size="36">
                    <v-icon size="small">mdi-store</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-2 font-weight-bold">{{ group.name }}</div>
                    <div class="text-caption text-medium-emphasis">
                      <v-icon size="x-small" class="mr-1">mdi-map-marker</v-icon>
                      {{ group.location }}
                    </div>
                  </div>
                </div>
                <v-chip size="x-small" color="primary" variant="tonal">
                  {{ group.items.length }} sản phẩm
                </v-chip>
              </div>
            </v-card-item>

            <!-- Cart Items List -->
            <v-list class="pa-0" bg-color="transparent">
              <template v-for="(item, index) in group.items" :key="item.id">
                <v-divider v-if="index > 0" />
                <v-list-item class="cart-item py-3 px-4">
                  <div class="d-flex align-center ga-3">
                    <!-- Product Image -->
                    <div class="cart-item-image flex-shrink-0">
                      <v-img 
                        :src="getImageUrl(item.variant.image_url)" 
                        :aspect-ratio="1"
                        cover 
                        class="rounded-lg"
                      >
                        <template v-slot:placeholder>
                          <div class="d-flex align-center justify-center fill-height bg-grey-darken-4">
                            <v-progress-circular indeterminate color="primary" size="20" />
                          </div>
                        </template>
                        <template v-slot:error>
                          <div class="d-flex align-center justify-center fill-height bg-grey-darken-3 rounded-lg">
                            <v-icon size="24" color="grey">mdi-image-broken</v-icon>
                          </div>
                        </template>
                      </v-img>
                    </div>

                    <!-- Product Info -->
                    <div class="flex-grow-1 overflow-hidden">
                      <router-link
                        :to="`/product?id=${item.product_id}`"
                        class="product-link text-body-2 font-weight-bold d-block text-truncate"
                      >
                        {{ item.product_name }}
                      </router-link>
                      <div class="text-caption text-medium-emphasis">{{ item.variant.name }}</div>
                      <div class="text-caption text-medium-emphasis">SKU: {{ item.variant.sku }}</div>
                    </div>

                    <!-- Quantity Control -->
                    <div class="quantity-control d-flex align-center">
                      <v-btn
                        icon="mdi-minus"
                        variant="text"
                        size="x-small"
                        :disabled="item.quantity <= 1"
                        @click="updateQuantity(item, -1)"
                      />
                      <span class="quantity-display text-body-2 font-weight-bold">{{ item.quantity }}</span>
                      <v-btn
                        icon="mdi-plus"
                        variant="text"
                        size="x-small"
                        @click="updateQuantity(item, 1)"
                      />
                    </div>

                    <!-- Price -->
                    <div class="text-right" style="min-width: 120px;">
                      <div class="text-subtitle-2 font-weight-bold neon-text-secondary">
                        {{ formatPrice(item.price * item.quantity) }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatPrice(item.price) }}/sp
                      </div>
                    </div>

                    <!-- Remove Button -->
                    <v-btn
                      icon="mdi-close"
                      variant="text"
                      size="x-small"
                      color="error"
                      @click="removeItem(item)"
                    />
                  </div>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </div>
      </v-col>

      <!-- Order Summary -->
      <v-col cols="12" lg="4">
        <v-card class="summary-card rounded-xl pa-5 sticky-top" variant="outlined">
          <h2 class="text-subtitle-1 font-weight-bold mb-4">
            <v-icon start color="primary" size="small">mdi-receipt-text</v-icon>
            Tổng kết đơn hàng
          </h2>

          <div class="summary-row mb-2">
            <span class="text-body-2 text-medium-emphasis">Tạm tính ({{ cartCount }} món)</span>
            <span class="text-body-2 font-weight-bold">{{ formatPrice(subTotal) }}</span>
          </div>

          <div class="summary-row mb-2">
            <span class="text-body-2 text-medium-emphasis">Phí vận chuyển</span>
            <span class="text-body-2 font-weight-bold">{{ formatPrice(shippingFee) }}</span>
          </div>

          <v-divider class="my-3" />

          <!-- Discount Code Section -->
          <div class="discount-section mb-3">
            <!-- Applied Discount -->
            <div v-if="appliedDiscountCode" class="applied-discount d-flex align-center justify-space-between pa-3 rounded-lg mb-2">
              <div class="d-flex align-center">
                <v-icon color="success" size="small" class="mr-2">mdi-ticket-percent</v-icon>
                <div>
                  <span class="text-body-2 font-weight-bold">{{ appliedDiscountCode }}</span>
                  <span class="text-caption text-success ml-2">(-{{ formatPrice(discountAmount) }})</span>
                </div>
              </div>
              <v-btn icon size="x-small" variant="text" color="error" @click="removeDiscountCode">
                <v-icon size="16">mdi-close</v-icon>
              </v-btn>
            </div>
            
            <!-- Discount Input -->
            <div v-else class="d-flex ga-2">
              <v-text-field
                v-model="discountCodeInput"
                placeholder="Nhập mã giảm giá"
                variant="outlined"
                density="compact"
                hide-details
                rounded="lg"
                class="coupon-input"
                :disabled="isApplying"
                @keyup.enter="applyDiscount"
              />
              <v-btn 
                color="primary" 
                variant="tonal" 
                rounded="lg" 
                size="small" 
                :loading="isApplying"
                @click="applyDiscount"
              >
                Áp dụng
              </v-btn>
            </div>
          </div>

          <div v-if="discountAmount > 0" class="summary-row mb-2 text-success">
            <span class="text-body-2">Giảm giá</span>
            <span class="text-body-2 font-weight-bold">-{{ formatPrice(discountAmount) }}</span>
          </div>

          <v-divider class="my-3" />

          <!-- Payment Method Selection -->
          <div class="payment-method-section mb-4">
            <h3 class="text-subtitle-2 font-weight-bold mb-3">
              <v-icon start size="small" color="primary">mdi-credit-card-outline</v-icon>
              Phương thức thanh toán
            </h3>
            
            <v-radio-group v-model="selectedPaymentMethod" class="payment-radio-group" hide-details>
              <v-radio value="COD" class="payment-option mb-2">
                <template v-slot:label>
                  <div class="d-flex align-center ga-3 py-2">
                    <v-avatar size="36" color="success" variant="tonal">
                      <v-icon size="18">mdi-truck-delivery</v-icon>
                    </v-avatar>
                    <div>
                      <div class="font-weight-medium">Thanh toán khi nhận hàng (COD)</div>
                      <div class="text-caption text-medium-emphasis">Thanh toán bằng tiền mặt khi nhận hàng</div>
                    </div>
                  </div>
                </template>
              </v-radio>
              
              <v-radio value="BANK_TRANSFER" class="payment-option">
                <template v-slot:label>
                  <div class="d-flex align-center ga-3 py-2">
                    <v-avatar size="36" color="info" variant="tonal">
                      <v-icon size="18">mdi-bank-transfer</v-icon>
                    </v-avatar>
                    <div>
                      <div class="font-weight-medium">Chuyển khoản ngân hàng</div>
                      <div class="text-caption text-medium-emphasis">Thanh toán trước qua QR Code</div>
                    </div>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </div>

          <v-divider class="my-3" />

          <!-- Total -->
          <div class="summary-row total-row pa-3 rounded-lg mb-4">
            <span class="text-subtitle-1 font-weight-bold">Tổng cộng</span>
            <span class="text-h6 font-weight-bold neon-text-secondary">
              {{ formatPrice(totalAmount) }}
            </span>
          </div>

          <!-- Actions -->
          <v-btn
            block
            color="secondary"
            size="large"
            rounded="xl"
            class="checkout-btn mb-2 font-weight-bold"
            @click="proceedToCheckout"
          >
            <v-icon start>mdi-credit-card</v-icon>
            Tiến hành thanh toán
          </v-btn>

          <v-btn block variant="outlined" rounded="xl" size="small" :to="{ name: 'ProductList' }">
            Tiếp tục mua sắm
          </v-btn>

          <!-- Security Badge -->
          <div class="mt-4 d-flex align-center justify-center text-caption text-medium-emphasis">
            <v-icon color="success" size="small" class="mr-1">mdi-shield-check</v-icon>
            Thanh toán an toàn với mã hóa SSL
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const toast = useToast();

// ========== LOCAL STATE ==========
const discountCodeInput = ref('');
const isApplying = ref(false);
const selectedPaymentMethod = ref('COD'); // COD hoặc BANK_TRANSFER

// ========== COMPUTED ==========
const isAuthenticated = computed(() => authStore.isAuthenticated);
const cartItems = computed(() => cartStore.items);
const cartCount = computed(() => cartStore.totalQuantity);
const subTotal = computed(() => cartStore.subTotal);
const shippingFee = computed(() => cartStore.shippingFee);
const discountAmount = computed(() => cartStore.discountAmount);
const totalAmount = computed(() => cartStore.total);
const isLoading = computed(() => cartStore.isLoading);
const appliedDiscountCode = computed(() => cartStore.discountCode);

// Group items by branch
const groupedCartItems = computed(() => {
  return cartStore.groupedByBranch.map(group => ({
    id: group.branch.id,
    name: group.branch.name,
    location: (group.branch as any).location || '',
    items: group.items.map(item => ({
      id: item.Id,
      user_id: item.UserId,
      product_variant_id: item.ProductVariantId,
      product_id: item.ProductId,
      product_name: item.ProductName,
      branch_id: item.BranchId,
      quantity: item.Quantity,
      price: item.Price,
      variant: {
        id: item.ProductVariantId,
        name: item.VariantName || '',
        sku: item.VariantSku || '',
        price: item.Price,
        original_price: item.OriginalPrice,
        image_url: item.VariantImageUrl || '',
      }
    }))
  }));
});

// API Base URL for images
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';

// ========== METHODS ==========
/**
 * Xử lý URL hình ảnh - thêm base URL nếu cần
 */
const getImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) {
    return 'https://picsum.photos/200/200?random=' + Math.random();
  }
  // Nếu đã là URL đầy đủ
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // Nếu là đường dẫn tương đối, thêm base URL
  return `${apiBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const updateQuantity = async (item: any, delta: number) => {
  await cartStore.changeQuantity(item.id, delta);
};

const removeItem = async (item: any) => {
  const success = await cartStore.removeItem(item.id);
  if (success) {
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  } else {
    toast.error('Không thể xóa sản phẩm');
  }
};

const clearCart = async () => {
  if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
    const success = await cartStore.clearCart();
    if (success) {
      toast.success('Đã xóa tất cả sản phẩm');
    }
  }
};

const applyDiscount = async () => {
  if (!discountCodeInput.value.trim()) {
    toast.warning('Vui lòng nhập mã giảm giá');
    return;
  }
  
  isApplying.value = true;
  const result = await cartStore.applyDiscountCode(discountCodeInput.value);
  isApplying.value = false;
  
  if (result.success) {
    toast.success(result.message);
    discountCodeInput.value = ''; // Clear input after success
  } else {
    toast.error(result.message);
  }
};

const removeDiscountCode = () => {
  cartStore.removeDiscountCode();
  toast.info('Đã xóa mã giảm giá');
};

const proceedToCheckout = async () => {
  if (!isAuthenticated.value) {
    toast.warning('Vui lòng đăng nhập để tiếp tục thanh toán');
    router.push({ name: 'Login', query: { redirect: '/cart' } });
    return;
  }
  
  if (cartItems.value.length === 0) {
    toast.warning('Giỏ hàng đang trống');
    return;
  }
  
  // Lấy thông tin giao hàng từ user profile
  const user = authStore.user;
  const shippingName = user?.fullName || user?.full_name || user?.name || 'Khách hàng';
  const shippingPhone = user?.phoneNumber || user?.phone_number || '';
  const shippingAddress = 'Địa chỉ mặc định'; // TODO: Cho phép user chọn địa chỉ
  
  try {
    toast.info('Đang xử lý đơn hàng...');
    
    // Gọi API tạo đơn hàng thực sự trong database
    const { ordersApi } = await import('@/api/orders.api');
    const response = await ordersApi.createOrder({
      ShippingRecipientName: shippingName,
      ShippingRecipientPhone: shippingPhone,
      ShippingAddress: shippingAddress,
      PaymentMethodId: selectedPaymentMethod.value === 'COD' ? 1 : 2,
      DiscountCode: appliedDiscountCode.value || undefined,
    });
    
    const result = response.data;
    const isSuccess = result.Success ?? result.success;
    const orderData = result.Data ?? result.data;
    const message = result.Message ?? result.message;
    
    if (isSuccess && orderData) {
      // Lưu thông tin đơn hàng để hiển thị trên trang Checkout
      const orderSummary = {
        orderId: orderData.Id ?? orderData.id,
        orderCode: orderData.OrderCode ?? orderData.order_code,
        items: cartItems.value.map(item => ({
          cartItemId: item.Id,
          productId: item.ProductId,
          variantId: item.ProductVariantId,
          name: `${item.ProductName} - ${item.VariantName}`,
          image: item.VariantImageUrl,
          quantity: item.Quantity,
          price: item.Price,
        })),
        subTotal: subTotal.value,
        shippingFee: shippingFee.value,
        discountCode: appliedDiscountCode.value,
        discountAmount: discountAmount.value,
        total: totalAmount.value,
        branches: groupedCartItems.value.map(g => ({ id: g.id, name: g.name })),
        createdAt: new Date().toISOString(),
        // Thông tin thanh toán
        paymentMethod: selectedPaymentMethod.value,
        paymentMethodName: selectedPaymentMethod.value === 'COD' 
          ? 'Thanh toán khi nhận hàng (COD)' 
          : 'Chuyển khoản ngân hàng',
        // Thông tin khách hàng
        customer: {
          name: shippingName,
          phone: shippingPhone,
          address: shippingAddress,
        },
      };
      localStorage.setItem('checkout_order', JSON.stringify(orderSummary));
      
      toast.success(message || 'Đặt hàng thành công!');
      
      // Redirect to checkout page
      router.push({ name: 'Checkout', query: { id: orderData.Id ?? orderData.id } });
    } else {
      toast.error(message || 'Không thể tạo đơn hàng');
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    const errorMessage = error.response?.data?.Message || error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng';
    toast.error(errorMessage);
  }
};

// ========== LIFECYCLE ==========
onMounted(async () => {
  // Fetch cart từ server
  await cartStore.fetchCart();
});

// Watch auth state
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (!isAuth) {
    // Redirect to login if not authenticated
    // Or just clear cart locally
  }
});
</script>

<style scoped>
.neon-text-secondary {
  color: #ff00ff;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.empty-cart {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.cart-group-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.branch-header {
  background: rgba(0, 212, 255, 0.05) !important;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}

.cart-item {
  transition: background 0.2s ease;
}

.cart-item:hover {
  background: rgba(255, 255, 255, 0.02);
}

.cart-item-image {
  width: 70px;
  min-width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
}

.product-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.product-link:hover {
  color: #00d4ff;
}

.quantity-control {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-width: 90px;
}

.quantity-display {
  min-width: 30px;
  text-align: center;
}

.summary-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(0, 212, 255, 0.2) !important;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-row {
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.15);
}

.coupon-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.03) !important;
}

.checkout-btn {
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
}

.checkout-btn:hover {
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
}

.sticky-top {
  position: sticky;
  top: 90px;
}

.applied-discount {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.discount-section {
  margin-top: 4px;
}

/* Payment Method Styles */
.payment-method-section {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.payment-radio-group {
  margin: 0;
}

.payment-option {
  margin: 0 !important;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.payment-option:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(0, 212, 255, 0.3);
}

.payment-option :deep(.v-selection-control) {
  min-height: auto !important;
}

.payment-option :deep(.v-label) {
  width: 100%;
}
</style>