<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Review Moderation</h2>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <!-- Filters -->
      <div class="flex items-center space-x-4 mb-6">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
        <div class="flex space-x-2">
          <button @click="statusFilter = 'pending'" :class="statusFilter === 'pending' ? 'btn-primary' : 'btn-secondary'" class="btn btn-sm">Pending ({{ pendingCount }})</button>
          <button @click="statusFilter = 'approved'" :class="statusFilter === 'approved' ? 'btn-primary' : 'btn-secondary'" class="btn btn-sm">Approved</button>
          <button @click="statusFilter = 'rejected'" :class="statusFilter === 'rejected' ? 'btn-primary' : 'btn-secondary'" class="btn btn-sm">Rejected</button>
          <button @click="statusFilter = ''" :class="!statusFilter ? 'btn-primary' : 'btn-secondary'" class="btn btn-sm">All</button>
        </div>
      </div>

      <div class="space-y-4">
        <div v-if="filteredReviews.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          No reviews match the current filter.
        </div>
        <div v-for="review in filteredReviews" :key="review.id" class="border dark:border-gray-700 p-4 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold text-gray-800 dark:text-gray-200">{{ review.productName }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">by {{ review.userName }} on {{ new Date(review.createdAt).toLocaleDateString() }}</p>
              <div class="flex items-center mt-1">
                <Star v-for="i in 5" :key="i" class="h-4 w-4" :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'" />
              </div>
            </div>
            <span class="px-2 py-1 text-xs rounded-full font-medium" :class="getStatusColor(review.status)">
              {{ review.status }}
            </span>
          </div>
          <p class="mt-2 text-gray-700 dark:text-gray-300">{{ review.comment }}</p>
          <div v-if="review.status === 'pending'" class="flex space-x-2 mt-3">
            <button @click="updateReviewStatus(review.id, 'approved')" class="btn btn-sm bg-green-500 text-white hover:bg-green-600">Approve</button>
            <button @click="updateReviewStatus(review.id, 'rejected')" class="btn btn-sm bg-red-500 text-white hover:bg-red-600">Reject</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Star } from 'lucide-vue-next';
import { allReviews } from '@/data/mockData';
import type { Review } from '@/types';

const reviews = ref<Review[]>(allReviews);
const statusFilter = ref<'pending' | 'approved' | 'rejected' | ''>('pending');

const filteredReviews = computed(() => {
  if (!statusFilter.value) return reviews.value;
  return reviews.value.filter(review => review.status === statusFilter.value);
});

const pendingCount = computed(() => reviews.value.filter(r => r.status === 'pending').length);

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const updateReviewStatus = (reviewId: string, newStatus: 'approved' | 'rejected') => {
  const review = reviews.value.find(r => r.id === reviewId);
  if (review) {
    review.status = newStatus;
  }
};
</script>
