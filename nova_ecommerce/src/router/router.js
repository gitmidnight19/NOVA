import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue')
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: () => import('../views/SearchResult.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'MyOrders',
    component: () => import('../views/MyOrders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('../views/OrderDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',  // 🔥 RUTA NUEVA
    name: 'AdminProducts',
    component: () => import('../views/admin/ProductsManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guards de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  console.log('🛣️ Navegando a:', to.path);
  console.log('🔐 Autenticado:', authStore.isAuthenticated);
  console.log('👨‍💼 Es admin:', authStore.isAdmin);

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('❌ Requiere auth, redirigiendo a login');
    next('/login');
  } else if (to.meta.guest && authStore.isAuthenticated) {
    console.log('❌ Ya autenticado, redirigiendo a home');
    next('/');
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.log('❌ Requiere admin, redirigiendo a home');
    alert('No tienes permisos de administrador');
    next('/');
  } else {
    console.log('✅ Acceso permitido');
    next();
  }
});

export default router;