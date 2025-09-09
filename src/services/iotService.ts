import type { Sensor } from '@/types';

export async function fetchSensors(): Promise<Sensor[]> {
  const response = await fetch('/api/iot/sensors');
  if (!response.ok) {
    throw new Error('Failed to fetch sensors');
  }
  return await response.json();
}

export function startSensorPolling(
  callback: (sensors: Sensor[]) => void,
  interval = 5000
) {
  let active = true;

  const poll = async () => {
    if (!active) return;
    try {
      const sensors = await fetchSensors();
      callback(sensors);
    } catch (err) {
      console.error(err);
    }
    if (active) {
      setTimeout(poll, interval);
    }
  };

  poll();

  return () => {
    active = false;
  };
}
