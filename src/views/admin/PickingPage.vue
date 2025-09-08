<template>
  <div class="bg-gray-900 min-h-screen text-white p-4">
    <div class="max-w-lg mx-auto">
      <h2 class="text-2xl font-semibold mb-2">Picking for Order #{{ $route.params.orderId }}</h2>
      <p class="text-gray-400 mb-6">This is a placeholder for the mobile-optimized picking UI.</p>
      
      <div class="space-y-4">
        <div class="bg-gray-800 p-4 rounded-lg">
          <p class="text-lg font-bold">Zone A-1, Bin 03</p>
          <div class="mt-2 p-4 bg-gray-700 rounded-lg">
            <p class="font-semibold">Mikasa Ackerman Figure</p>
            <p class="text-sm text-gray-400">SKU: OP-MIKASA01</p>
            <div class="flex justify-between items-center mt-2">
              <p class="text-2xl font-bold">Pick: 2</p>
              <button class="btn bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3">Scan</button>
            </div>
          </div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg opacity-50">
          <p class="text-lg font-bold">Zone B-2, Bin 11</p>
        </div>
      </div>

      <div class="mt-8 text-center">
        <button class="btn bg-pink-600 hover:bg-pink-700 text-white w-full py-4 text-xl">Complete Pick</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page would be part of the AdminLayout but styled differently for its purpose.
</script>
