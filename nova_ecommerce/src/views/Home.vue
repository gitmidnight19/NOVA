<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-bold mb-4">Bienvenido a NOVA</h1>
        <p class="text-xl mb-8">Descubre nuestra colección de accesorios exclusivos</p>
        <a 
          href="#productos"
          class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
        >
          Ver Productos
        </a>
      </div>
    </section>

    <!-- Productos Section -->
    <section id="productos" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Nuestros Productos</h2>
        
        <!-- Filtro por categoría -->
        <select 
          v-model="selectedCategory" 
          @change="loadProducts"
          class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todas las categorías</option>
          <option value="Anillos">Anillos</option>
          <option value="Aretas">Aretas</option>
          <option value="Cadenas">Cadenas</option>
          <option value="Pulseras">Pulseras</option>
          <option value="Bolsas">Bolsas</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando productos...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
        <button 
          @click="loadProducts"
          class="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          Reintentar
        </button>
      </div>

      <!-- Grid de Productos -->
      <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in products" 
          :key="product._id" 
          :product="product"
        />
      </div>

      <!-- Sin productos -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 text-lg">No hay productos disponibles en esta categoría</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import ProductCard from '../components/ProductCard.vue';

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedCategory = ref('');

const loadProducts = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const params = {};
    if (selectedCategory.value) {
      params.category = selectedCategory.value;
    }

    const { data } = await api.getProducts(params);
    products.value = data.products;
    
    console.log('Productos cargados:', data.products.length);
  } catch (err) {
    console.error('Error al cargar productos:', err);
    error.value = 'Error al cargar los productos. Por favor, intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});
</script>