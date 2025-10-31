<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="pb-16">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import { useCartStore } from './store/cart';

const cartStore = useCartStore();

onMounted(() => {
  cartStore.initCart();
});
</script>