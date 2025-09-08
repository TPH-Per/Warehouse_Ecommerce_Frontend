import { ref, computed } from 'vue';

const wishlistItems = ref<string[]>([]);

export const useWishlist = () => {
  const addToWishlist = (productId: string) => {
    if (!wishlistItems.value.includes(productId)) {
      wishlistItems.value.push(productId);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const index = wishlistItems.value.indexOf(productId);
    if (index > -1) {
      wishlistItems.value.splice(index, 1);
    }
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.value.includes(productId);
  };

  const wishlistCount = computed(() => wishlistItems.value.length);

  return {
    wishlistItems: computed(() => wishlistItems.value),
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount,
  };
};
