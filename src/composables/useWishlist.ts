import { ref, computed, watch } from 'vue';
import { useAuth } from './useAuth';

const wishlistItems = ref<string[]>([]);
const { currentUser } = useAuth();

const storageKey = computed(() =>
  currentUser.value ? `wishlist_${currentUser.value.id}` : 'wishlist_guest'
);

const loadWishlist = () => {
  try {
    const stored = localStorage.getItem(storageKey.value);
    wishlistItems.value = stored ? JSON.parse(stored) : [];
  } catch {
    wishlistItems.value = [];
  }
};

watch(storageKey, loadWishlist, { immediate: true });

watch(wishlistItems, items => {
  localStorage.setItem(storageKey.value, JSON.stringify(items));
}, { deep: true });

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
