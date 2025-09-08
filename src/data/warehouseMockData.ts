import { faker } from '@faker-js/faker';
import type { Warehouse, WarehouseZone, InventoryItem } from '@/types';

export const generateMockWarehouses = (count: number = 15): Warehouse[] => {
  const warehouses: Warehouse[] = [];
  for (let i = 0; i < count; i++) {
    const manager = faker.person.fullName();
    warehouses.push({
      id: faker.string.uuid(),
      code: `WH-${faker.string.alphanumeric(4).toUpperCase()}`,
      name: `Warehouse ${faker.location.city()}`,
      city: faker.location.city(),
      managerId: faker.string.uuid(),
      managerName: manager,
      isActive: faker.datatype.boolean(0.9),
      skuCount: faker.number.int({ min: 500, max: 5000 }),
    });
  }
  return warehouses;
};

export const generateMockZonesForWarehouse = (warehouseId: string): WarehouseZone[] => {
  const zones: WarehouseZone[] = [];
  const zoneCount = faker.number.int({ min: 2, max: 8 });
  for (let i = 0; i < zoneCount; i++) {
    zones.push({
      id: faker.string.uuid(),
      warehouseId,
      code: `Z-${faker.string.alphanumeric(3).toUpperCase()}`,
      name: `Zone ${faker.helpers.arrayElement(['A', 'B', 'C', 'D'])}-${i + 1}`,
      type: faker.helpers.arrayElement(['Standard', 'Cold', 'Restricted']),
      sensorCount: faker.number.int({ min: 1, max: 5 }),
      iotStatus: faker.helpers.arrayElement(['ok', 'warn', 'alert']),
    });
  }
  return zones;
};

export const generateMockInventory = (count: number = 200): InventoryItem[] => {
    const inventory: InventoryItem[] = [];
    for (let i = 0; i < count; i++) {
        const onHand = faker.number.int({ min: 0, max: 1000 });
        const reserved = faker.number.int({ min: 0, max: onHand });
        inventory.push({
            id: faker.string.uuid(),
            sku: `OP-${faker.string.alphanumeric(8).toUpperCase()}`,
            productName: faker.commerce.productName(),
            warehouse: `WH-${faker.string.alphanumeric(4).toUpperCase()}`,
            zone: `Z-${faker.string.alphanumeric(3).toUpperCase()}`,
            onHand,
            reserved,
            available: onHand - reserved,
            reorderPoint: faker.number.int({ min: 10, max: 50 }),
        });
    }
    return inventory;
};
