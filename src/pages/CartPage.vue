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

    <!-- Empty State -->
    <v-card v-if="cartItems.length === 0" class="empty-cart text-center py-16 rounded-xl" variant="outlined">
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

          <div class="summary-row mb-2">
            <span class="text-body-2 text-medium-emphasis">Tạm tính ({{ cartCount }} món)</span>
            <span class="text-body-2 font-weight-bold">{{ formatPrice(subTotal) }}</span>
          </div>

          <div class="summary-row mb-2">
            <span class="text-body-2 text-medium-emphasis">Phí vận chuyển</span>
            <span class="text-body-2 font-weight-bold">{{ formatPrice(shippingFee) }}</span>
          </div>

          <v-divider class="my-3" />

          <!-- Discount Code -->
          <div class="d-flex ga-2 mb-3">
            <v-text-field
              v-model="discountCode"
              placeholder="Mã giảm giá"
              variant="outlined"
              density="compact"
              hide-details
              rounded="lg"
              class="coupon-input"
            />
            <v-btn color="primary" variant="tonal" rounded="lg" size="small" @click="applyDiscount">
              Áp dụng
            </v-btn>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Types matching database structure
interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  original_price?: number;
  image_url: string;
}

interface CartItem {
  id: number;           // carts.id
  user_id: number;
  product_variant_id: number;
  product_id: number;   // for navigation
  product_name: string;
  branch_id: number;    // Branch that will fulfill the order
  quantity: number;
  price: number;        // carts.price
  variant: ProductVariant;
}

interface Branch {
  id: number;
  name: string;
  location: string;
}

// Mock data matching database structure
const branches = ref<Branch[]>([
  { id: 1, name: 'Chi nhánh Hà Nội', location: '77 Nguyễn Trãi, Thanh Xuân' },
  { id: 2, name: 'Chi nhánh Hồ Chí Minh', location: '123 Lê Lợi, Quận 1' },
]);

const cartItems = ref<CartItem[]>([
  {
    id: 1,
    user_id: 1,
    product_variant_id: 1,
    product_id: 1,
    product_name: 'Gojo Satoru: Shibuya Incident Ver.',
    branch_id: 1,
    quantity: 1,
    price: 4250000,
    variant: {
      id: 1,
      name: 'Standard Edition',
      sku: 'GSC-GOJO-001',
      price: 4250000,
      original_price: 5100000,
      image_url: 'https://picsum.photos/200/200?random=1',
    },
  },
  {
    id: 2,
    user_id: 1,
    product_variant_id: 2,
    product_id: 2,
    product_name: 'Nezuko Kamado - Blood Demon Art',
    branch_id: 1,
    quantity: 2,
    price: 1250000,
    variant: {
      id: 2,
      name: 'Normal Version',
      sku: 'ANP-NZK-001',
      price: 1250000,
      image_url: 'https://picsum.photos/200/200?random=2',
    },
  },
  {
    id: 3,
    user_id: 1,
    product_variant_id: 3,
    product_id: 3,
    product_name: 'Hatsune Miku - 15th Anniversary Ver.',
    branch_id: 2,
    quantity: 1,
    price: 5800000,
    variant: {
      id: 3,
      name: 'Premium Edition',
      sku: 'GSC-MIKU-015',
      price: 5800000,
      original_price: 6500000,
      image_url: 'https://picsum.photos/200/200?random=3',
    },
  },
]);

const discountCode = ref('');
const discountAmount = ref(0);
const shippingFee = ref(50000);

// Computed
const groupedCartItems = computed(() => {
  return branches.value.map(branch => ({
    ...branch,
    items: cartItems.value.filter(item => item.branch_id === branch.id)
  })).filter(g => g.items.length > 0);
});

const subTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const cartCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

const totalAmount = computed(() => {
  return subTotal.value + shippingFee.value - discountAmount.value;
});

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const updateQuantity = (item: CartItem, delta: number) => {
  item.quantity = Math.max(1, item.quantity + delta);
};

const removeItem = (item: CartItem) => {
  const index = cartItems.value.findIndex(i => i.id === item.id);
  if (index > -1) {
    cartItems.value.splice(index, 1);
  }
};

const clearCart = () => {
  if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
    cartItems.value = [];
  }
};

const applyDiscount = () => {
  // Mock discount logic
  if (discountCode.value.toUpperCase() === 'WIBU10') {
    discountAmount.value = Math.round(subTotal.value * 0.1);
    alert('Áp dụng mã giảm giá thành công! Giảm 10%');
  } else if (discountCode.value) {
    alert('Mã giảm giá không hợp lệ!');
  }
};

const proceedToCheckout = () => {
  // Save order summary to localStorage for checkout page
  const orderSummary = {
    items: cartItems.value.map(item => ({
      productId: item.product_id,
      variantId: item.product_variant_id,
      name: `${item.product_name} - ${item.variant.name}`,
      image: item.variant.image_url,
      quantity: item.quantity,
      price: item.price,
    })),
    subTotal: subTotal.value,
    shippingFee: shippingFee.value,
    discountAmount: discountAmount.value,
    total: totalAmount.value,
    branches: groupedCartItems.value.map(g => ({ id: g.id, name: g.name })),
  };
  localStorage.setItem('checkout_order', JSON.stringify(orderSummary));
  router.push({ name: 'Checkout', query: { id: Date.now() } });
};
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
</style>