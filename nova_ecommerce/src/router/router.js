import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../views/Home.vue'
import ProductsView from '../views/Products.vue'
import CollectionsView from '../views/Collections.vue'
import SaleView from '../views/Sale.vue'
import LoginView from '../views/Login.vue'
import CartView from '../views/Cart.vue'
import SearchView from '../views/Search.vue'
import ContactView from '../views/Contact.vue'
import ProductDetail from '../views/ProductDetail.vue'
import CheckoutView from '../views/Checkout.vue'
import RegisterView from '../views/register.vue'
import ProfileView from '../views/Profile.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: HomeView 
  },
  { 
    path: '/productos', 
    name: 'Products', 
    component: ProductsView 
  },
  { 
    path: '/categoria/:name', 
    name: 'Category',
    component: () => import('../views/ProductsCategory.vue'), 
    props: true 
  },
  { 
    path: '/colecciones', 
    name: 'Collections', 
    component: CollectionsView 
  },
  { 
    path: '/sale', 
    name: 'Sale', 
    component: SaleView 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginView 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: RegisterView 
  },
  { 
    path: '/carrito', 
    name: 'Cart', 
    component: CartView 
  },
  { 
    path: '/buscar', 
    name: 'Search', 
    component: SearchView 
  },
  { 
    path: '/contacto', 
    name: 'Contact', 
    component: ContactView 
  },
  { 
    path: '/product/:id', 
    name: 'ProductDetail', 
    component: ProductDetail, 
    props: true 
  },
  { 
    path: '/checkout', 
    name: 'Checkout',
    component: CheckoutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navegación - protege rutas
router.beforeEach((to, from, next) => {
  console.log('🛣️ Navegando a:', to.path);
  
  // Obtener datos de autenticación del localStorage
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('❌ Error parseando user:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  console.log('🔐 Estado de autenticación:');
  console.log('  - Token existe:', !!token);
  console.log('  - User existe:', !!user);
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - isAdmin:', isAdmin);
  console.log('  - User data:', user);

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('⛔ Ruta requiere autenticación, redirigiendo a /login');
    next('/login')
  } 
  // Verificar si la ruta requiere rol de admin
  else if (to.meta.requiresAdmin && !isAdmin) {
    console.log('⛔ Ruta requiere admin, pero usuario no es admin');
    alert('⛔ Acceso denegado. Solo administradores.')
    next('/')
  } 
  // Permitir acceso
  else {
    console.log('✅ Acceso permitido a:', to.path);
    next()
  }
})

export default router