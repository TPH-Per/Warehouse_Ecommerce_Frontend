import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/HomePage.vue'),
      },
      {
        path: 'products',
        name: 'ProductListing',
        component: () => import('@/views/ProductListingPage.vue'),
      },
      {
        path: 'products/:id',
        name: 'ProductDetail',
        component: () => import('@/views/ProductDetailPage.vue'),
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/CartPage.vue'),
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/CheckoutPage.vue'),
      },
      {
        path: 'order-confirmation/:id',
        name: 'OrderConfirmation',
        component: () => import('@/views/OrderConfirmationPage.vue'),
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/OrdersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'wishlist',
        name: 'Wishlist',
        component: () => import('@/views/WishlistPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthPage.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    beforeEnter: (to, from, next) => {
      const { isAuthenticated, canAccessAdmin } = useAuth();
      if (isAuthenticated.value && canAccessAdmin.value) {
        next();
      } else {
        next('/auth');
      }
    },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/views/admin/DashboardPage.vue') },
      { path: 'products', name: 'AdminProducts', component: () => import('@/views/admin/ProductManagementPage.vue') },
      { path: 'warehouses', name: 'AdminWarehouses', component: () => import('@/views/admin/WarehouseManagementPage.vue') },
      { path: 'inventory', name: 'AdminInventory', component: () => import('@/views/admin/InventoryManagementPage.vue') },
      { path: 'goods-receipt', name: 'AdminGoodsReceipt', component: () => import('@/views/admin/GoodsReceiptPage.vue') },
      { path: 'picking/:orderId', name: 'AdminPicking', component: () => import('@/views/admin/PickingPage.vue') },
      { path: 'transfers', name: 'AdminTransfers', component: () => import('@/views/admin/TransferPage.vue') },
      { path: 'cycle-counts', name: 'AdminCycleCounts', component: () => import('@/views/admin/CycleCountPage.vue') },
      { path: 'orders', name: 'AdminOrders', component: () => import('@/views/admin/OrderManagementPage.vue') },
      { path: 'reviews', name: 'AdminReviews', component: () => import('@/views/admin/ReviewModerationPage.vue') },
      { path: 'promotions', name: 'AdminPromotions', component: () => import('@/views/admin/PromotionManagementPage.vue') },
      { path: 'analytics', name: 'AdminAnalytics', component: () => import('@/views/admin/AnalyticsPage.vue') },
      { path: 'iot', name: 'AdminIoT', component: () => import('@/views/admin/IotDashboardPage.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('@/views/admin/UserManagementPage.vue') },
      { path: 'settings', name: 'AdminSettings', component: () => import('@/views/admin/SettingsPage.vue') },
      { path: 'audit', name: 'AdminAuditLog', component: () => import('@/views/admin/AuditLogPage.vue') },
      { path: 'health', name: 'AdminHealth', component: () => import('@/views/admin/HealthMonitorPage.vue') },
      { path: 'backups', name: 'AdminBackups', component: () => import('@/views/admin/BackupManagerPage.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
