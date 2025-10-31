<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Resultados de búsqueda
      </h1>
      <p class="text-gray-600">
        {{ results.length }} resultado(s) para "<span class="font-semibold">{{ searchQuery }}</span>"
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="results.length === 0" class="text-center py-12">
      <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="mt-4 text-xl font-medium text-gray-900">No se encontraron productos</h3>
      <p class="mt-2 text-gray-500">Intenta con otros términos de búsqueda</p>
      <router-link 
        to="/"
        class="mt-6 inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
      >
        Ver todos los productos
      </router-link>
    </div>

    <!-- Grid de resultados -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in results" 
        :key="product._id" 
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();

const searchQuery = ref('');
const results = ref([]);
const loading = ref(true);

const loadResults = async () => {
  try {
    loading.value = true;
    searchQuery.value = route.query.q || '';
    
    if (!searchQuery.value) {
      results.value = [];
      return;
    }

    const { data } = await api.getProducts({ 
      search: searchQuery.value 
    });
    results.value = data.products;
  } catch (error) {
    console.error('Error al buscar productos:', error);
  } finally {
    loading.value = false;
  }
};

watch(() => route.query.q, () => {
  loadResults();
});

onMounted(() => {
  loadResults();
});
</script>