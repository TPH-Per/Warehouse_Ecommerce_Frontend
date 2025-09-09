import { ref } from 'vue';

interface ShippingRate {
  zone: string;
  base_rate: number;
  rate_per_kg: number;
  express_multiplier: number;
}

interface CachedRates {
  zone: string;
  rates: ShippingRate;
}

let cache = ref<CachedRates | null>(null);

async function fetchRates(zone: string): Promise<ShippingRate> {
  if (cache.value && cache.value.zone === zone) {
    return cache.value.rates;
  }

  const res = await fetch(`/api/shipping-rates?zone=${encodeURIComponent(zone)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch shipping rates');
  }
  const data: ShippingRate = await res.json();
  cache.value = { zone, rates: data };
  return data;
}

export async function calculateShippingCost(zone: string, weightKg: number, express = false): Promise<number> {
  const rates = await fetchRates(zone);
  let cost = rates.base_rate + weightKg * rates.rate_per_kg;
  if (express) {
    cost *= rates.express_multiplier;
  }
  return Math.round(cost);
}

export function invalidateRates() {
  cache.value = null;
}
