import { ref, computed, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';

const wishlistItems = ref<string[]>([]);
const { currentUser, isAuthenticated } = useAuth();
const LOCAL_STORAGE_KEY = 'wishlist';

const loadWishlistFromLocal = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveWishlistToLocal = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlistItems.value));
};

const fetchWishlistFromServer = async (userId: string): Promise<string[]> => {
  try {
    const res = await fetch(`/api/users/${userId}/wishlist`);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch wishlist', error);
  }
  return [];
};

const saveWishlistToServer = async (userId: string, items: string[]) => {
  try {
    await fetch(`/api/users/${userId}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
  } catch (error) {
    console.error('Failed to save wishlist', error);
  }
};

const mergeServerWishlist = async () => {
  if (!currentUser.value) return;
  const serverList = await fetchWishlistFromServer(currentUser.value.id);
  const localList = loadWishlistFromLocal();
  const merged = Array.from(new Set([...localList, ...serverList]));
  wishlistItems.value = merged;
  await saveWishlistToServer(currentUser.value.id, merged);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};

if (isAuthenticated.value) {
  mergeServerWishlist();
} else {
  wishlistItems.value = loadWishlistFromLocal();
}

watch(
  wishlistItems,
  async () => {
    if (isAuthenticated.value && currentUser.value) {
      await saveWishlistToServer(currentUser.value.id, wishlistItems.value);
    } else {
      saveWishlistToLocal();
    }
  },
  { deep: true }
);

watch(isAuthenticated, async loggedIn => {
  if (loggedIn) {
    await mergeServerWishlist();
  } else {
    wishlistItems.value = loadWishlistFromLocal();
  }
});

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
