export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  price: number;
  costPrice: number | null;
  weight_kg: number;
  dimensions_json: string | null; // JSON string: { length: number, width: number, height: number }
  imageUrl: string | null;
  isActive: boolean;
  isDeleted: boolean; // For soft deletes
  
  // These fields are from the old type, can be derived or deprecated
  // Keeping them for now to avoid breaking other components, but they should be reviewed.
  series: string;
  character: string;
  manufacturer: string;
  scale: string;
  originalPrice?: number;
  images: string[];
  category: 'figure' | 'plushie' | 'nendoroid' | 'figma';
  condition: 'new' | 'used' | 'damaged-box';
  availability: 'in-stock' | 'pre-order' | 'out-of-stock';
  eta?: string;
  // Age verification and NSFW content features removed
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
}

export type UserRole = 'admin' | 'manager' | 'staff' | 'customer';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  isAgeVerified: boolean;
  preferences: {
    currency: string;
    language: string;
  };
  lastLogin: string;
}

export interface Address {
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shipments: Shipment[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'partially-shipped';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: 'VNPost' | 'GHN' | 'DHL';
  items: OrderItem[];
  status: 'processing' | 'in-transit' | 'delivered';
  shippedAt: string;
}


export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  userId: string;
  userName:string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  parent_category_id?: string | null;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  usageCount: number;
  usageLimit?: number;
  expiresAt: string;
  isActive: boolean;
}

// Notification System Types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationCategory = 'order' | 'product' | 'system' | 'promotion' | 'review' | 'inventory' | 'user';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  targetRole: UserRole | 'all';
  targetUserId?: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  categories: {
    order: boolean;
    product: boolean;
    system: boolean;
    promotion: boolean;
    review: boolean;
    inventory: boolean;
    user: boolean;
  };
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  };
}

export interface AnalyticsData {
  id: string;
  metric: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: string;
  createdAt: string;
}

export interface Sensor {
  id: string;
  zoneId: string;
  type: 'temperature' | 'humidity';
  status: 'online' | 'offline' | 'alert';
  lastReading: number;
  lastReadingTimestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetId: string;
  targetType: string;
  timestamp: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  city: string;
  managerId: string;
  managerName: string;
  isActive: boolean;
  skuCount: number;
}

export interface WarehouseZone {
  id: string;
  warehouseId: string;
  code: string;
  name: string;
  type: 'Standard' | 'Cold' | 'Restricted';
  sensorCount: number;
  iotStatus: 'ok' | 'warn' | 'alert';
}

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  warehouse: string;
zone: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderPoint: number;
}
