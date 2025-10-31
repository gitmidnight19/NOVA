<template>
  <div>
    <TopBanner />
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
    
    <!-- Cart Drawer - Se muestra cuando isCartOpen es true -->
    <CartDrawer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import TopBanner from './components/TopBanner.vue';
import CartDrawer from './components/CartDrawer.vue';
import { useRouter } from 'vue-router';
import { useCartStore } from './store/cartStore.js';
import { onMounted } from 'vue';

const router = useRouter();
const cartStore = useCartStore();

onMounted(() => {
  // Cargar carrito desde localStorage
  cartStore.loadFromLocalStorage();
  
  // Scroll to top on route change
  router.afterEach(() => {
    window.scrollTo(0, 0);
  });
});
</script>