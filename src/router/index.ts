/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'



// import { routes } from 'vue-router/auto-routes'

const routes = [
  // Route Login - Không dùng layout (full page)
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guest: true } // Chỉ cho guest truy cập
  },
  // Route Register
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: { guest: true }
  },
  // Routes chính với layout
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/layouts/home.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/HomePage.vue')
      },
      {
        path: '/productlist',
        name: 'ProductList',
        component: () => import('@/pages/ProductListPage.vue')
      },
      {
        path: '/products',
        name: 'Products',
        component: () => import('@/pages/ProductListPage.vue')
      },
      {
        path: '/product',
        name: 'ProductDetail',
        component: () => import('@/pages/ProductDetailPage.vue')
      },
      {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/pages/CartPage.vue')
      },
      {
        path: '/wishlist',
        name: 'WishList',
        component: () => import('@/pages/WishListPage.vue')
      },
      {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('@/pages/CheckoutPage.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/pages/ProfilePage.vue')
      },
      {
        path: '/order',
        name: 'Order',
        component: () => import('@/pages/OrderPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
