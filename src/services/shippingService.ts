import type { ShippingRate } from '@/types';

let cachedRates: ShippingRate[] | null = null;

async function fetchRates(): Promise<ShippingRate[]> {
  if (cachedRates) return cachedRates;
  const response = await fetch('/api/shipping-rates');
  if (!response.ok) {
    throw new Error('Failed to fetch shipping rates');
  }
  cachedRates = await response.json();
  return cachedRates;
}

export interface ShippingDestination {
  zoneName: string;
  country?: string;
  city?: string;
}

export async function getShippingCost(
  destination: ShippingDestination,
  weightKg: number,
  express = false
): Promise<number> {
  const rates = await fetchRates();
  const rate =
    rates.find(
      r =>
        r.zoneName === destination.zoneName &&
        (!destination.country || r.country === destination.country) &&
        (!destination.city || r.city === destination.city)
    ) || rates[0];

  let cost = rate.base_cost + rate.per_kg_cost * weightKg;
  if (express) {
    cost *= rate.express_multiplier;
  }
  return Math.round(cost);
}

export function clearShippingCache() {
  cachedRates = null;
}
