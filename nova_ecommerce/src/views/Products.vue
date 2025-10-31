<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Productos</h2>

      <p v-if="loading">Cargando productos...</p>
      <p v-if="error" class="text-red-500 font-bold">{{ error }}</p>

      <!-- 🛍️ Grid de productos -->
      <div 
        v-if="!loading && !error" 
        class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
      >
        <div 
          v-for="product in products" 
          :key="product._id" 
          class="group bg-white p-4 shadow rounded-lg"
        >
          <img 
            :src="product.images?.[0]" 
            :alt="product.name" 
            class="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8 cursor-pointer"  
            @click="goToProductDetail(product._id)" 
          />
          
          <h3 class="mt-4 text-sm text-gray-700">{{ product.name }}</h3>
          <p class="mt-1 text-lg font-medium text-gray-900">${{ product.price }}</p>

          <!-- Botón Ver detalles -->
          <div class="mt-3">
            <button 
              class="w-full bg-pink-400 hover:bg-pink-500 text-white text-sm py-2 px-4 rounded-md transition-colors cursor-pointer" 
              @click="goToProductDetail(product._id)"
            >
              Ver detalles
            </button>
          </div>

          <!-- Botón Añadir al carrito -->
          <div class="mt-3">
            <button 
              @click="addToCart(product)" 
              class="w-full bg-pink-300 hover:bg-pink-400 text-white text-sm py-2 px-4 rounded-md transition-colors cursor-pointer"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>

      <!-- 🛒 Notificación -->
      <transition name="fade">
        <div 
          v-if="showNotification" 
          class="fixed bottom-5 right-5 bg-pink-400 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
        >
          <i class="fas fa-check-circle"></i>
          <span>{{ notificationMessage }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAllProducts } from '../services/productsApi';
import { useCartStore } from '../store/cartStore.js';

const router = useRouter();
const cartStore = useCartStore();

const products = ref([]);
const loading = ref(true);
const error = ref(null);

// Notificación
const showNotification = ref(false);
const notificationMessage = ref('');

onMounted(async () => {
  try {
    const fetchedProducts = await fetchAllProducts();
    products.value = fetchedProducts;
  } catch (err) {
    error.value = 'Error al obtener los productos.';
  } finally {
    loading.value = false;
  }
});

// Navegar al detalle
const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`);
};

// Añadir producto al carrito
const addToCart = (product) => {
  const cartProduct = {
    id: product._id,
    title: product.name,
    price: product.price,
    quantity: 1,
    images: [product.images?.[0]]
  };

  cartStore.addToCart(cartProduct);

  notificationMessage.value = `${product.name} añadido al carrito 🛒`;
  showNotification.value = true;
  setTimeout(() => (showNotification.value = false), 3000);
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
