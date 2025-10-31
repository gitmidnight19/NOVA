<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
          <button
            @click="openCreateModal"
            class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
        <input
          v-model="searchQuery"
          @input="loadProducts"
          type="text"
          placeholder="Buscar productos..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select 
          v-model="filterCategory"
          @change="loadProducts"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
      </div>

      <!-- Tabla de productos -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="product in products" :key="product._id" class="hover:bg-gray-50">
              <!-- Imagen -->
              <td class="px-6 py-4">
                <img :src="product.image" :alt="product.name" class="w-16 h-16 object-cover rounded" />
              </td>

              <!-- Nombre -->
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-sm text-gray-500 line-clamp-1">{{ product.description }}</p>
              </td>

              <!-- Categoría -->
              <td class="px-6 py-4">
                <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  {{ product.category }}
                </span>
              </td>

              <!-- Precio -->
              <td class="px-6 py-4 font-bold text-purple-600">
                ${{ formatPrice(product.price) }}
              </td>

              <!-- Stock -->
              <td class="px-6 py-4">
                <span :class="getStockClass(product.stock)">
                  {{ product.stock }}
                </span>
              </td>

              <!-- Estado -->
              <td class="px-6 py-4">
                <span :class="product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                      class="text-xs px-2 py-1 rounded-full">
                  {{ product.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <!-- Acciones -->
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button
                    @click="editProduct(product)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteProduct(product)"
                    class="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Sin productos -->
        <div v-if="products.length === 0" class="text-center py-12">
          <p class="text-gray-500">No hay productos</p>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar Producto -->
    <ProductFormModal
      v-if="showModal"
      :product="selectedProduct"
      @close="closeModal"
      @saved="handleProductSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import ProductFormModal from './ProductFormModal.vue';

const products = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const filterCategory = ref('');
const showModal = ref(false);
const selectedProduct = ref(null);

const loadProducts = async () => {
  try {
    loading.value = true;
    const params = {};
    
    if (searchQuery.value) params.search = searchQuery.value;
    if (filterCategory.value) params.category = filterCategory.value;
    params.limit = 100; // Mostrar todos

    const { data } = await api.getProducts(params);
    products.value = data.products;
  } catch (error) {
    console.error('Error al cargar productos:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  selectedProduct.value = null;
  showModal.value = true;
};

const editProduct = (product) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const deleteProduct = async (product) => {
  if (!confirm(`¿Estás seguro de eliminar "${product.name}"?`)) return;

  try {
    await api.deleteProduct(product._id);
    await loadProducts();
    alert('Producto eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    alert('Error al eliminar el producto');
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedProduct.value = null;
};

const handleProductSaved = () => {
  closeModal();
  loadProducts();
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const getStockClass = (stock) => {
  if (stock === 0) return 'text-red-600 font-bold';
  if (stock < 5) return 'text-orange-600 font-bold';
  return 'text-green-600 font-bold';
};

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>