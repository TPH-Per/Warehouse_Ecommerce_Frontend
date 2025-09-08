export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_INVENTORY: 'manage_inventory',
  MANAGE_ORDERS: 'manage_orders',
  MODERATE_REVIEWS: 'moderate_reviews',
  MANAGE_PROMOTIONS: 'manage_promotions',
  VIEW_REPORTS: 'view_reports',
  VIEW_IOT_DASHBOARD: 'view_iot_dashboard',
  MANAGE_USERS: 'manage_users',
  MANAGE_SECURITY: 'manage_security',
};

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

export const rolePermissions: Record<string, string[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.MODERATE_REVIEWS,
    PERMISSIONS.MANAGE_PROMOTIONS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_IOT_DASHBOARD,
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_ORDERS,
  ],
  [ROLES.CUSTOMER]: [],
};
