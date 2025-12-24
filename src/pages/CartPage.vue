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
        <!-- Branch Selection Notice -->
        <v-alert 
          v-if="groupedCartItems.length > 1" 
          type="info" 
          variant="tonal" 
          class="mb-4 rounded-xl"
          icon="mdi-information"
        >
          <div class="font-weight-bold mb-1">Lưu ý khi thanh toán</div>
          <div class="text-body-2">
            Giỏ hàng của bạn có sản phẩm từ <strong>{{ groupedCartItems.length }} chi nhánh</strong> khác nhau. 
            Mỗi đơn hàng chỉ được thanh toán từ một chi nhánh. Vui lòng chọn chi nhánh để thanh toán.
          </div>
        </v-alert>

        <!-- Group by Branch -->
        <div v-for="group in groupedCartItems" :key="group.id" class="mb-4">
          <v-card class="cart-group-card rounded-xl overflow-hidden" variant="outlined">
            <!-- Branch Header with Selection -->
            <v-card-item class="branch-header py-3">
              <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center ga-3">
                  <!-- Checkbox to select this branch for checkout -->
                  <v-checkbox
                    v-if="groupedCartItems.length > 1"
                    v-model="selectedBranchId"
                    :value="group.id"
                    color="primary"
                    hide-details
                    density="compact"
                    @click.stop
                  />
                  <v-avatar color="primary" size="36">
                    <v-icon size="small">mdi-store</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-2 font-weight-bold">{{ group.name }}</div>
                    <div class="text-caption text-medium-emphasis">
                      <v-icon size="x-small" class="mr-1">mdi-map-marker</v-icon>
                      {{ group.location || 'Chi nhánh ' + group.id }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center ga-2">
                  <v-chip size="x-small" color="primary" variant="tonal">
                    {{ group.items.length }} sản phẩm
                  </v-chip>
                  <v-chip size="x-small" color="success" variant="tonal">
                    {{ formatPrice(getBranchSubtotal(group)) }}
                  </v-chip>
                </div>
              </div>
            </v-card-item>

            <!-- Cart Items List -->
            <v-list class="pa-0" bg-color="transparent">
              <template v-for="(item, index) in group.items" :key="item.id">
                <v-divider v-if="index > 0" />
                <v-list-item class="cart-item py-3 px-4">
                  <div class="d-flex align-center ga-3">
                    <!-- Product Image -->
                    <v-img 
                      :src="item.variant.image_url" 
                      cover 
                      class="rounded-lg flex-shrink-0" 
                      width="70" 
                      height="70" 
                    />

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

          <!-- Selected Branch Info -->
          <div v-if="groupedCartItems.length > 1" class="mb-3 pa-3 rounded-lg" style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.15);">
            <div class="text-caption text-medium-emphasis mb-1">Chi nhánh được chọn:</div>
            <div v-if="selectedBranchInfo" class="font-weight-bold text-body-2">
              <v-icon size="small" class="mr-1">mdi-store</v-icon>
              {{ selectedBranchInfo.name }}
            </div>
            <div v-else class="text-warning text-body-2">
              <v-icon size="small" class="mr-1" color="warning">mdi-alert</v-icon>
              Chưa chọn chi nhánh
            </div>
          </div>

          <div class="summary-row mb-2">
            <span class="text-body-2 text-medium-emphasis">Tạm tính ({{ selectedItemCount }} món)</span>
            <span class="text-body-2 font-weight-bold">{{ formatPrice(selectedSubTotal) }}</span>
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

          <!-- Total -->
          <div class="summary-row total-row pa-3 rounded-lg mb-4">
            <span class="text-subtitle-1 font-weight-bold">Tổng cộng</span>
            <span class="text-h6 font-weight-bold neon-text-secondary">
              {{ formatPrice(selectedTotal) }}
            </span>
          </div>

          <!-- Actions -->
          <v-btn
            block
            color="secondary"
            size="large"
            rounded="xl"
            class="checkout-btn mb-2 font-weight-bold"
            :disabled="!canCheckout"
            @click="proceedToCheckout"
          >
            <v-icon start>mdi-credit-card</v-icon>
            Tiến hành thanh toán
          </v-btn>

          <!-- Validation Message -->
          <v-alert 
            v-if="!canCheckout && groupedCartItems.length > 1" 
            type="warning" 
            variant="tonal" 
            density="compact" 
            class="mb-2"
          >
            Vui lòng chọn một chi nhánh để thanh toán
          </v-alert>

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

    <!-- Snackbar Notification -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Đóng
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

// ========== LOCAL STATE ==========
const discountCodeInput = ref('');
const isApplying = ref(false);
const selectedBranchId = ref<number | null>(null);
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
});

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
        image_url: item.VariantImageUrl || 'https://picsum.photos/200/200?random=' + item.Id,
      }
    }))
  }));
});

// Auto-select branch if only one
watch(groupedCartItems, (groups) => {
  if (groups.length === 1 && groups[0]) {
    selectedBranchId.value = groups[0].id;
  } else if (!groups.find(g => g.id === selectedBranchId.value)) {
    selectedBranchId.value = null;
  }
}, { immediate: true });

// Selected branch info
const selectedBranchInfo = computed(() => {
  if (!selectedBranchId.value) return null;
  return groupedCartItems.value.find(g => g.id === selectedBranchId.value);
});

// Get items for selected branch only
const selectedBranchItems = computed(() => {
  if (!selectedBranchInfo.value) return [];
  return selectedBranchInfo.value.items;
});

// Selected item count
const selectedItemCount = computed(() => {
  return selectedBranchItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

// Selected subtotal
const selectedSubTotal = computed(() => {
  return selectedBranchItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

// Selected total (with shipping and discount)
const selectedTotal = computed(() => {
  return Math.max(0, selectedSubTotal.value - discountAmount.value + shippingFee.value);
});

// Can checkout?
const canCheckout = computed(() => {
  if (groupedCartItems.value.length === 0) return false;
  if (groupedCartItems.value.length === 1) return true;
  return selectedBranchId.value !== null;
});

// Get subtotal for a specific branch
const getBranchSubtotal = (group: any) => {
  return group.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
};

// ========== METHODS ==========
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const showSnackbar = (text: string, color: string = 'success') => {
  snackbar.value = { show: true, text, color };
};

const updateQuantity = async (item: any, delta: number) => {
  await cartStore.changeQuantity(item.id, delta);
};

const removeItem = async (item: any) => {
  const success = await cartStore.removeItem(item.id);
  if (success) {
    showSnackbar('Đã xóa sản phẩm khỏi giỏ hàng');
  } else {
    showSnackbar('Không thể xóa sản phẩm', 'error');
  }
};

const clearCart = async () => {
  if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
    const success = await cartStore.clearCart();
    if (success) {
      showSnackbar('Đã xóa tất cả sản phẩm');
    }
  }
};

const applyDiscount = async () => {
  if (!discountCodeInput.value.trim()) {
    showSnackbar('Vui lòng nhập mã giảm giá', 'warning');
    return;
  }
  
  isApplying.value = true;
  const result = await cartStore.applyDiscountCode(discountCodeInput.value);
  isApplying.value = false;
  
  if (result.success) {
    showSnackbar(result.message, 'success');
    discountCodeInput.value = ''; // Clear input after success
  } else {
    showSnackbar(result.message, 'error');
  }
};

const removeDiscountCode = () => {
  cartStore.removeDiscountCode();
  showSnackbar('Đã xóa mã giảm giá');
};

const proceedToCheckout = () => {
  if (!isAuthenticated.value) {
    showSnackbar('Vui lòng đăng nhập để tiếp tục thanh toán', 'warning');
    router.push('/login?redirect=/cart');
    return;
  }
  
  if (cartItems.value.length === 0) {
    showSnackbar('Giỏ hàng đang trống', 'warning');
    return;
  }

  // Validate branch selection if multiple branches
  if (groupedCartItems.value.length > 1 && !selectedBranchId.value) {
    showSnackbar('Vui lòng chọn một chi nhánh để thanh toán', 'warning');
    return;
  }

  // Get items to checkout (only from selected branch)
  const itemsToCheckout = selectedBranchItems.value;
  
  if (itemsToCheckout.length === 0) {
    showSnackbar('Không có sản phẩm nào được chọn', 'warning');
    return;
  }
  
  // Lưu thông tin đơn hàng vào localStorage cho checkout page
  const orderSummary = {
    branchId: selectedBranchId.value,
    branchName: selectedBranchInfo.value?.name || '',
    items: itemsToCheckout.map(item => ({
      cartItemId: item.id,
      productId: item.product_id,
      variantId: item.product_variant_id,
      name: `${item.product_name} - ${item.variant.name}`,
      image: item.variant.image_url,
      quantity: item.quantity,
      price: item.price,
    })),
    subTotal: selectedSubTotal.value,
    shippingFee: shippingFee.value,
    discountCode: appliedDiscountCode.value,
    discountAmount: discountAmount.value,
    total: selectedTotal.value,
  };
  localStorage.setItem('checkout_order', JSON.stringify(orderSummary));
  router.push('/checkout?id=' + Date.now());
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
</style>