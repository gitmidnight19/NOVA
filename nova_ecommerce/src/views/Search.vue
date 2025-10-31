<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      <!-- Header con barra de búsqueda -->
      <div class="mb-8">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Buscar Productos
          </h1>
          <p class="mt-2 text-lg text-gray-600">
            Encuentra tu magia
          </p>
        </div>

        <!-- Barra de búsqueda principal -->
        <div class="max-w-2xl mx-auto mb-8">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              @input="handleSearchInput"
              type="text"
              placeholder="Buscar productos..."
              class="block w-full pl-12 pr-20 py-4 text-lg border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-200"
            />
            
            <!-- Botón de búsqueda -->
            <div class="absolute inset-y-0 right-0 flex items-center">
              <button
                @click="performSearch"
                :disabled="!searchQuery.trim() || loading"
                class="mr-2 inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-200 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Buscando...' : 'Buscar' }}
              </button>
            </div>

            <!-- Botón para limpiar búsqueda -->
            <button 
              v-if="searchQuery && !loading"
              @click="clearSearch"
              class="absolute inset-y-0 right-24 flex items-center pr-3"
            >
              <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Filtros adicionales -->
        <div class="flex flex-wrap justify-center gap-4 mb-6">
          <!-- Categorías -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Categoría:</label>
            <select 
              v-model="selectedCategory" 
              @change="applyFilters"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="">Todas</option>
              <option v-for="category in categories" :key="category" :value="category" class="capitalize">
                {{ category.replace('-', ' ') }}
              </option>
            </select>
          </div>

          <!-- Ordenar por -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Ordenar:</label>
            <select 
              v-model="sortBy" 
              @change="sortResults"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="">Por relevancia</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="title-asc">Nombre: A-Z</option>
              <option value="title-desc">Nombre: Z-A</option>
              <option value="rating-desc">Mejor valorados</option>
            </select>
          </div>

          
        </div>

        <!-- Filtros activos -->
        <div v-if="hasActiveFilters" class="flex flex-wrap justify-center gap-2 mb-6">
          <span v-if="currentSearchTerm" class="inline-flex items-center px-3 py-1 rounded-full text-sm shadow-sm bg-pink-200 text-black">
            Búsqueda: "{{ currentSearchTerm }}"
            <button @click="clearSearch" class="ml-2 text-pink-600 hover:text-red-800 cursor-pointer">×</button>
          </span>
          <button @click="clearAllFilters" class="inline-flex items-center px-3 py-1 rounded-full text-sm shadow-sm bg-white text-black cursor-pointer">
            Limpiar todos
          </button>
        </div>
      </div>

      <!-- Resultados -->
      <div class="mb-4">
        <div v-if="hasSearched && !loading" class="flex items-center justify-between">
          <p class="text-sm text-gray-500">
            {{ filteredProducts.length }} resultados
            {{ currentSearchTerm ? `para "${currentSearchTerm}"` : '' }}
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
          <p class="text-gray-500">Buscando productos...</p>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="text-center py-20">
        <svg class="mx-auto h-24 w-24 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Error en la búsqueda</h3>
        <p class="mt-2 text-red-500">{{ error }}</p>
        <button 
          @click="performSearch" 
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>

      <!-- Sin resultados -->
      <div v-if="hasSearched && !loading && !error && filteredProducts.length === 0" class="text-center py-20">
        <svg class="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6M9 8h6M9 16h.01M15 16h.01" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Sin resultados</h3>
        <p class="mt-2 text-gray-500">
          No encontramos productos para "{{ currentSearchTerm }}"
        </p>
        <div class="mt-4">
          <p class="text-sm text-gray-400">Sugerencias:</p>
          <ul class="mt-2 text-sm text-gray-500 space-y-1">
            <li>• Revisa la ortografía</li>
            <li>• Usa términos más generales</li>
            <li>• Prueba con sinónimos</li>
          </ul>
        </div>
      </div>

      <!-- Grid de productos -->
      <div 
        v-if="!loading && !error && filteredProducts.length > 0" 
        class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8"
      >
        <div v-for="product in paginatedProducts" :key="product.id" class="group relative">
          <!-- Imagen del producto -->
          <div class="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
            <img 
              :src="product.images[0] || product.image" 
              :alt="product.title"
              class="h-full w-full object-cover object-center lg:h-full lg:w-full"
              loading="lazy"
              @error="handleImageError"
            />
          </div>
          
          <!-- Información del producto -->
          <div class="mt-4 flex justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate">
                <router-link :to="`/product/${product.id}`">
                  {{ product.title }}
                </router-link>
              </h3>
              <p class="mt-1 text-sm text-gray-500 capitalize">{{ product.category }}</p>
              
            </div>
            <div class="ml-4 text-right">
              <p class="text-lg font-medium text-gray-900">${{ product.price }}</p>
            </div>
          </div>

          <!-- Botón de acción rápida -->
          <div class="mt-3">
            <button class="w-full bg-pink-200 hover:bg-pink-400 text-white text-sm py-2 px-4 rounded-md transition-colors cursor-pointer">
              Ver detalles
            </button>
          </div>
          <div class="mt-3">
                  <button class="w-full bg-pink-200 hover:bg-pink-400 text-white text-sm py-2 px-4 rounded-md transition-colors cursor-pointer">
              Añadir a carrito
            </button>
            </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="filteredProducts.length > productsPerPage" class="mt-12 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            @click="currentPage > 1 && (currentPage--)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <div class="flex space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-2 text-sm rounded-md',
                currentPage === page 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="currentPage < totalPages && (currentPage++)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, } from 'vue'
import axios from 'axios'

// Estado de la búsqueda
const searchQuery = ref('')
const currentSearchTerm = ref('')
const searchResults = ref([])
const loading = ref(false)
const error = ref(null)
const hasSearched = ref(false)
const searchTime = ref(null)

// Filtros
const selectedCategory = ref('')
const sortBy = ref('')
const priceRange = ref({ min: null, max: null })

// Paginación
const currentPage = ref(1)
const productsPerPage = 12

// Categorías disponibles
const categories = ref([
  'Anillos', 'Aretes', 'Collates', 'Earcuff', 'Pulseras'
])

// Sugerencias de búsqueda
const searchSuggestions = ref([
  'iPhone', 'laptop', 'perfume', 'shoes', 'watch', 'bag', 'sunglasses'
])

// Debounce timer
let debounceTimer = null

// Función principal de búsqueda
const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  error.value = null
  hasSearched.value = true
  currentSearchTerm.value = searchQuery.value
  currentPage.value = 1
  
  const startTime = Date.now()
  
  try {
    const response = await axios.get(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery.value)}`)
    searchResults.value = response.data.products || []
    searchTime.value = Date.now() - startTime
  } catch (err) {
    console.error('Error searching products:', err)
    error.value = 'Error al realizar la búsqueda. Inténtalo de nuevo.'
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// Función para búsqueda con debounce


// Productos filtrados
const filteredProducts = computed(() => {
  let products = [...searchResults.value]
  
  // Filtrar por categoría
  if (selectedCategory.value) {
    products = products.filter(product => 
      product.category === selectedCategory.value
    )
  }
  return products
})

// Productos ordenados
const sortedProducts = computed(() => {
  let products = [...filteredProducts.value]
  
  switch (sortBy.value) {
    case 'price-asc':
      return products.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return products.sort((a, b) => b.price - a.price)
    case 'title-asc':
      return products.sort((a, b) => a.title.localeCompare(b.title))
    case 'title-desc':
      return products.sort((a, b) => b.title.localeCompare(a.title))
    case 'rating-desc':
      return products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    default:
      return products
  }
})

// Productos paginados
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * productsPerPage
  const end = start + productsPerPage
  return sortedProducts.value.slice(start, end)
})

// Cálculos de paginación
const totalPages = computed(() => Math.ceil(sortedProducts.value.length / productsPerPage))

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  
  for (
    let i = Math.max(2, currentPage.value - delta);
    i <= Math.min(totalPages.value - 1, currentPage.value + delta);
    i++
  ) {
    range.push(i)
  }
  
  if (currentPage.value - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }
  
  rangeWithDots.push(...range)
  
  if (currentPage.value + delta < totalPages.value - 1) {
    rangeWithDots.push('...', totalPages.value)
  } else {
    rangeWithDots.push(totalPages.value)
  }
  
  return rangeWithDots.filter((item, index, array) => array.indexOf(item) === index)
})

// Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
  return currentSearchTerm.value || selectedCategory.value 
})

// Funciones de filtros
const applyFilters = () => {
  currentPage.value = 1
}

const sortResults = () => {
  currentPage.value = 1
}

const clearSearch = () => {
  searchQuery.value = ''
  currentSearchTerm.value = ''
  searchResults.value = []
  hasSearched.value = false
  currentPage.value = 1
}

const clearPriceFilter = () => {
  priceRange.value = { min: null, max: null }
  applyFilters()
}

const clearAllFilters = () => {
  selectedCategory.value = ''
  sortBy.value = ''
  priceRange.value = { min: null, max: null }
  clearSearch()
}

// Función para manejar errores de imagen
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x400?text=Imagen+no+disponible'
}

// Watch para resetear página cuando cambien los filtros

</script>