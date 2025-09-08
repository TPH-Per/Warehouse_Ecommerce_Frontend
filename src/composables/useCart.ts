import { ref, computed } from 'vue';
import type { CartItem, Product } from '@/types';

const cartItems = ref<CartItem[]>([]);

export const useCart = () => {
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.value.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.value.push({
        productId: product.id,
        quantity,
        price: product.price,
      });
    }
  };

  const removeFromCart = (productId: string) => {
    const index = cartItems.value.findIndex(item => item.productId === productId);
    if (index > -1) {
      cartItems.value.splice(index, 1);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cartItems.value.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
  };

  const clearCart = () => {
    cartItems.value = [];
  };

  const cartCount = computed(() => 
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const cartTotal = computed(() => 
    cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  return {
    cartItems: computed(() => cartItems.value),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };
};
