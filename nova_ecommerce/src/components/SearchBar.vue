<template>
  <div class="relative w-full" ref="searchContainer">
    <!-- Input de búsqueda -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        @focus="showResults = true"
        type="text"
        placeholder="Buscar productos..."
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      <svg 
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
      <!-- Botón limpiar -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Dropdown de resultados -->
    <div 
      v-if="showResults && searchQuery.length > 0"
      class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50"
    >
      <!-- Loading -->
      <div v-if="searching" class="p-4 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p class="text-sm text-gray-500 mt-2">Buscando...</p>
      </div>

      <!-- Sin resultados -->
      <div v-else-if="results.length === 0" class="p-4 text-center">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-500">No se encontraron productos</p>
        <p class="text-sm text-gray-400">Intenta con otros términos</p>
      </div>

      <!-- Resultados -->
      <div v-else class="py-2">
        <div
          v-for="product in results.slice(0, 5)"
          :key="product._id"
          @click="goToProduct(product)"
          class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b last:border-b-0"
        >
          <img 
            :src="product.image" 
            :alt="product.name"
            class="w-12 h-12 object-cover rounded"
          />
          <div class="flex-1">
            <p class="font-medium text-gray-900 text-sm">{{ product.name }}</p>
            <p class="text-xs text-gray-500">{{ product.category }}</p>
          </div>
          <p class="font-bold text-purple-600">${{ formatPrice(product.price) }}</p>
        </div>

        <!-- Ver todos los resultados -->
        <button
          v-if="results.length > 5"
          @click="viewAllResults"
          class="w-full px-4 py-3 text-center text-purple-600 hover:bg-purple-50 font-medium border-t"
        >
          Ver todos los resultados ({{ results.length }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const searchQuery = ref('');
const results = ref([]);
const searching = ref(false);
const showResults = ref(false);
const searchContainer = ref(null);
let searchTimeout = null;

const handleSearch = () => {
  // Debounce - esperar 300ms después de que el usuario deje de escribir
  clearTimeout(searchTimeout);
  
  if (searchQuery.value.length < 2) {
    results.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    await performSearch();
  }, 300);
};

const performSearch = async () => {
  try {
    searching.value = true;
    const { data } = await api.getProducts({ 
      search: searchQuery.value,
      limit: 10
    });
    results.value = data.products;
  } catch (error) {
    console.error('Error al buscar:', error);
  } finally {
    searching.value = false;
  }
};

const goToProduct = (product) => {
  showResults.value = false;
  searchQuery.value = '';
  router.push(`/products/${product._id}`);
};

const viewAllResults = () => {
  showResults.value = false;
  router.push({
    path: '/search',
    query: { q: searchQuery.value }
  });
};

const clearSearch = () => {
  searchQuery.value = '';
  results.value = [];
};

const handleClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    showResults.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  clearTimeout(searchTimeout);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO').format(price);
};
</script>