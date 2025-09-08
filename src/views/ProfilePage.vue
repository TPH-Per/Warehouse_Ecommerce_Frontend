<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg border p-6 sticky top-20">
            <!-- Profile Picture -->
            <div class="text-center mb-6">
              <div class="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white text-2xl font-bold">
                  {{ currentUser?.firstName?.charAt(0) }}{{ currentUser?.lastName?.charAt(0) }}
                </span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900">
                {{ currentUser?.firstName }} {{ currentUser?.lastName }}
              </h2>
              <p class="text-gray-600">{{ currentUser?.email }}</p>
            </div>

            <!-- Navigation -->
            <nav class="space-y-2">
              <button
                @click="activeTab = 'personal'"
                :class="activeTab === 'personal' ? 'bg-pink-50 text-pink-600 border-pink-200' : 'text-gray-700 hover:bg-gray-50'"
                class="w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center"
              >
                <User class="h-5 w-5 mr-3" />
                Personal Information
              </button>
              
              <button
                @click="activeTab = 'addresses'"
                :class="activeTab === 'addresses' ? 'bg-pink-50 text-pink-600 border-pink-200' : 'text-gray-700 hover:bg-gray-50'"
                class="w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center"
              >
                <MapPin class="h-5 w-5 mr-3" />
                Addresses
              </button>
              
              <button
                @click="activeTab = 'preferences'"
                :class="activeTab === 'preferences' ? 'bg-pink-50 text-pink-600 border-pink-200' : 'text-gray-700 hover:bg-gray-50'"
                class="w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center"
              >
                <Settings class="h-5 w-5 mr-3" />
                Preferences
              </button>
              
              <button
                @click="activeTab = 'reviews'"
                :class="activeTab === 'reviews' ? 'bg-pink-50 text-pink-600 border-pink-200' : 'text-gray-700 hover:bg-gray-50'"
                class="w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center"
              >
                <Star class="h-5 w-5 mr-3" />
                My Reviews
              </button>
            </nav>
          </div>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-2">
          <!-- Personal Information -->
          <div v-if="activeTab === 'personal'" class="bg-white rounded-lg border p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-gray-900">Personal Information</h3>
              <button @click="editMode = !editMode" class="btn btn-outline">
                <Edit class="h-4 w-4 mr-2" />
                {{ editMode ? 'Cancel' : 'Edit' }}
              </button>
            </div>

            <form @submit.prevent="savePersonalInfo" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    v-model="personalInfo.firstName"
                    type="text"
                    :disabled="!editMode"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    v-model="personalInfo.lastName"
                    type="text"
                    :disabled="!editMode"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  v-model="personalInfo.email"
                  type="email"
                  :disabled="!editMode"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  v-model="personalInfo.phone"
                  type="tel"
                  :disabled="!editMode"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50"
                />
              </div>

              <div v-if="editMode">
                <button type="submit" class="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <!-- Addresses -->
          <div v-if="activeTab === 'addresses'" class="bg-white rounded-lg border p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-gray-900">Shipping Addresses</h3>
              <button @click="showAddAddressForm = true" class="btn btn-primary">
                <Plus class="h-4 w-4 mr-2" />
                Add Address
              </button>
            </div>

            <!-- Add Address Form -->
            <div v-if="showAddAddressForm" class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-4">Add New Address</h4>
              <form @submit.prevent="addAddress" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input v-model="newAddress.firstName" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input v-model="newAddress.lastName" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input v-model="newAddress.street" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input v-model="newAddress.city" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input v-model="newAddress.state" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input v-model="newAddress.zipCode" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                  </div>
                </div>
                
                <div class="flex items-center space-x-4">
                  <button type="submit" class="btn btn-primary">Save Address</button>
                  <button type="button" @click="cancelAddAddress" class="btn btn-outline">Cancel</button>
                </div>
              </form>
            </div>

            <!-- Address List -->
            <div class="space-y-4">
              <div v-for="address in addresses" :key="address.id" class="border rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center space-x-2 mb-2">
                      <h4 class="font-semibold text-gray-900">{{ address.firstName }} {{ address.lastName }}</h4>
                      <span v-if="address.isDefault" class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Default</span>
                    </div>
                    <p class="text-gray-600">{{ address.street }}</p>
                    <p class="text-gray-600">{{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
                    <p class="text-gray-600">{{ address.phone }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="editAddress(address)" class="text-gray-400 hover:text-gray-600">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="deleteAddress(address.id)" class="text-gray-400 hover:text-red-600">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div v-if="activeTab === 'preferences'" class="bg-white rounded-lg border p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Preferences</h3>
            
            <div class="space-y-6">
              <!-- Content Preferences -->
              <div>
                <h4 class="font-semibold text-gray-900 mb-4">Tùy chọn hiển thị</h4>
                <div class="space-y-4">
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tiền tệ ưa thích</label>
                    <select
                      v-model="preferences.currency"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="JPY">Yên Nhật (¥)</option>
                      <option value="USD">Dollar Mỹ ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                    <select
                      v-model="preferences.language"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="en">Tiếng Anh</option>
                      <option value="ja">Tiếng Nhật</option>
                      <option value="ko">Tiếng Hàn</option>
                      <option value="vi">Tiếng Việt</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Notification Preferences -->
              <div>
                <h4 class="font-semibold text-gray-900 mb-4">Notifications</h4>
                <div class="space-y-4">
                  <label class="flex items-center">
                    <input
                      v-model="preferences.emailNotifications"
                      type="checkbox"
                      class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span class="ml-3 text-gray-700">Email notifications for orders</span>
                  </label>
                  
                  <label class="flex items-center">
                    <input
                      v-model="preferences.priceDropAlerts"
                      type="checkbox"
                      class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span class="ml-3 text-gray-700">Price drop alerts for wishlist items</span>
                  </label>
                  
                  <label class="flex items-center">
                    <input
                      v-model="preferences.newReleaseAlerts"
                      type="checkbox"
                      class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span class="ml-3 text-gray-700">New release notifications</span>
                  </label>
                </div>
              </div>

              <button @click="savePreferences" class="btn btn-primary">
                Save Preferences
              </button>
            </div>
          </div>

          <!-- Reviews -->
          <div v-if="activeTab === 'reviews'" class="bg-white rounded-lg border p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">My Reviews</h3>
            
            <div v-if="userReviews.length === 0" class="text-center py-8">
              <MessageSquare class="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-600">You haven't written any reviews yet.</p>
            </div>
            
            <div v-else class="space-y-6">
              <div v-for="review in userReviews" :key="review.id" class="border-b border-gray-200 pb-6 last:border-b-0">
                <div class="flex items-start space-x-4">
                  <img :src="review.productImage" :alt="review.productName" class="w-16 h-16 object-cover rounded-lg" />
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ review.productName }}</h4>
                    <div class="flex items-center mt-1 mb-2">
                      <div class="flex items-center">
                        <Star v-for="i in 5" :key="i" 
                             :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                             class="h-4 w-4" />
                      </div>
                      <span class="text-sm text-gray-600 ml-2">{{ formatDate(review.createdAt) }}</span>
                    </div>
                    <p class="text-gray-700">{{ review.comment }}</p>
                  </div>
                  <button @click="editReview(review)" class="text-gray-400 hover:text-gray-600">
                    <Edit class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  User, MapPin, Settings, Star, Edit, Plus, Trash2, MessageSquare 
} from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import type { Address } from '@/types';

const { currentUser } = useAuth();

const activeTab = ref('personal');
const editMode = ref(false);
const showAddAddressForm = ref(false);

// Personal Info
const personalInfo = ref({
  firstName: currentUser.value?.firstName || '',
  lastName: currentUser.value?.lastName || '',
  email: currentUser.value?.email || '',
  phone: currentUser.value?.phone || '',
});

// Addresses
const addresses = ref<Address[]>([
  {
    id: '1',
    userId: '1',
    type: 'home',
    firstName: 'Anime',
    lastName: 'Fan',
    street: '123 Otaku Street',
    city: 'Tokyo',
    state: 'Tokyo',
    zipCode: '100-0001',
    country: 'Japan',
    phone: '+81-3-1234-5678',
    isDefault: true,
  },
]);

const newAddress = ref({
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
});

// Preferences (NSFW settings removed)
const preferences = ref({
  currency: currentUser.value?.preferences.currency || 'JPY',
  language: currentUser.value?.preferences.language || 'en',
  emailNotifications: true,
  priceDropAlerts: true,
  newReleaseAlerts: false,
});

// Mock user reviews
const userReviews = ref([
  {
    id: '1',
    productId: '1',
    productName: 'Mikasa Ackerman Figure',
    productImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/100x100/ff69b4/ffffff?text=Mikasa',
    rating: 5,
    comment: 'Amazing quality figure! The details are incredible and it looks exactly like the promotional photos.',
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    productId: '2',
    productName: 'Nezuko Plushie',
    productImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/100x100/8b5cf6/ffffff?text=Nezuko',
    rating: 4,
    comment: 'Very soft and cute! Perfect for hugging. Only minor issue is the bamboo muzzle could be more detailed.',
    createdAt: '2024-11-15',
  },
]);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const savePersonalInfo = () => {
  // In a real app, this would make an API call
  if (currentUser.value) {
    currentUser.value.firstName = personalInfo.value.firstName;
    currentUser.value.lastName = personalInfo.value.lastName;
    currentUser.value.email = personalInfo.value.email;
    currentUser.value.phone = personalInfo.value.phone;
  }
  editMode.value = false;
  alert('Personal information updated successfully!');
};

const addAddress = () => {
  const address: Address = {
    id: Date.now().toString(),
    userId: currentUser.value?.id || '1',
    type: 'home',
    ...newAddress.value,
    country: 'Japan',
    isDefault: addresses.value.length === 0,
  };
  
  addresses.value.push(address);
  cancelAddAddress();
  alert('Address added successfully!');
};

const cancelAddAddress = () => {
  showAddAddressForm.value = false;
  newAddress.value = {
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  };
};

const editAddress = (address: Address) => {
  // In a real app, this would open an edit form
  alert('Edit address functionality would be implemented here.');
};

const deleteAddress = (addressId: string) => {
  if (confirm('Are you sure you want to delete this address?')) {
    const index = addresses.value.findIndex(a => a.id === addressId);
    if (index > -1) {
      addresses.value.splice(index, 1);
    }
  }
};

const savePreferences = () => {
  // In a real app, this would make an API call
  if (currentUser.value) {
    currentUser.value.preferences = {
      ...currentUser.value.preferences,
      currency: preferences.value.currency,
      language: preferences.value.language,
    };
  }
  alert('Preferences saved successfully!');
};

const editReview = (review: any) => {
  // In a real app, this would open an edit review modal
  alert('Edit review functionality would be implemented here.');
};
</script>
