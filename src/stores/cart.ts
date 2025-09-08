import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product } from '@/types';

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([]);
  
  // Getters
  const itemCount = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  );
  
  const totalValue = computed(() => {
    // Note: This would need to be calculated with actual product data
    // For now, this is a placeholder
    return 0;
  });
  
  const isEmpty = computed(() => items.value.length === 0);
  
  const itemById = computed(() => (productId: string) => 
    items.value.find(item => item.productId === productId)
  );
  
  // Actions
  const addItem = (productId: string, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }
  };
  
  const removeItem = (productId: string) => {
    const index = items.value.findIndex(item => item.productId === productId);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    const item = items.value.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
  };
  
  const clearCart = () => {
    items.value = [];
  };
  
  const getItemQuantity = (productId: string): number => {
    const item = items.value.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };
  
  return {
    // State
    items,
    
    // Getters
    itemCount,
    totalValue,
    isEmpty,
    itemById,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };
});