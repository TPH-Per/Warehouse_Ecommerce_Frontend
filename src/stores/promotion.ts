import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Coupon } from '@/types';
import { generateMockCoupons } from '@/data/mockData';

export const usePromotionStore = defineStore('promotion', () => {
  // State
  const coupons = ref<Coupon[]>(generateMockCoupons(15));
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeCoupons = computed(() => 
    coupons.value.filter(coupon => coupon.isActive)
  );

  const expiredCoupons = computed(() => 
    coupons.value.filter(coupon => new Date(coupon.expiresAt) < new Date())
  );

  const totalCoupons = computed(() => coupons.value.length);

  const couponById = computed(() => (id: string) => 
    coupons.value.find(coupon => coupon.id === id)
  );

  const couponByCode = computed(() => (code: string) => 
    coupons.value.find(coupon => 
      coupon.code.toLowerCase() === code.toLowerCase() && coupon.isActive
    )
  );

  // Actions
  const fetchCoupons = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      coupons.value = generateMockCoupons(15);
    } catch (err) {
      error.value = 'Failed to fetch coupons';
      console.error('Error fetching coupons:', err);
    } finally {
      loading.value = false;
    }
  };

  const createCoupon = async (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    loading.value = true;
    error.value = null;
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCoupon: Coupon = {
        ...couponData,
        id: `coupon-${Date.now()}`,
        usageCount: 0,
      };
      
      coupons.value.unshift(newCoupon);
      return newCoupon;
    } catch (err) {
      error.value = 'Failed to create coupon';
      console.error('Error creating coupon:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    loading.value = true;
    error.value = null;
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = coupons.value.findIndex(coupon => coupon.id === id);
      if (index !== -1) {
        coupons.value[index] = { ...coupons.value[index], ...updates };
        return coupons.value[index];
      }
      throw new Error('Coupon not found');
    } catch (err) {
      error.value = 'Failed to update coupon';
      console.error('Error updating coupon:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCoupon = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = coupons.value.findIndex(coupon => coupon.id === id);
      if (index !== -1) {
        coupons.value.splice(index, 1);
        return true;
      }
      throw new Error('Coupon not found');
    } catch (err) {
      error.value = 'Failed to delete coupon';
      console.error('Error deleting coupon:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const validateCoupon = (code: string, orderAmount: number): { valid: boolean; message: string; coupon?: Coupon } => {
    const coupon = couponByCode.value(code);
    
    if (!coupon) {
      return { valid: false, message: 'Mã khuyến mãi không hợp lệ' };
    }

    if (!coupon.isActive) {
      return { valid: false, message: 'Mã khuyến mãi đã bị vô hiệu hóa' };
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, message: 'Mã khuyến mãi đã hết hạn' };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'Mã khuyến mãi đã hết lượt sử dụng' };
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return { 
        valid: false, 
        message: `Đơn hàng tối thiểu ¥${coupon.minOrderAmount.toLocaleString()} để sử dụng mã này` 
      };
    }

    return { valid: true, message: 'Mã khuyến mãi hợp lệ', coupon };
  };

  const applyCoupon = async (id: string) => {
    const coupon = couponById.value(id);
    if (coupon) {
      await updateCoupon(id, { usageCount: coupon.usageCount + 1 });
    }
  };

  const calculateDiscount = (coupon: Coupon, orderAmount: number): number => {
    if (coupon.type === 'percentage') {
      return Math.round(orderAmount * (coupon.value / 100));
    } else {
      return coupon.value;
    }
  };

  return {
    // State
    coupons,
    loading,
    error,
    
    // Getters
    activeCoupons,
    expiredCoupons,
    totalCoupons,
    couponById,
    couponByCode,
    
    // Actions
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    applyCoupon,
    calculateDiscount,
  };
});