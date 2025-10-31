<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header Admin -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Panel de Administración NOVA</h1>
          <div class="flex items-center gap-4">
            <router-link 
              to="/admin/products"
              class="text-purple-600 hover:text-purple-700 font-medium"
            >
              Gestionar Productos
            </router-link>
            <span class="text-sm text-gray-600">Admin: {{ authStore.user?.name }}</span>
            <router-link 
              to="/"
              class="text-purple-600 hover:text-purple-700 font-medium"
            >
              Ver Tienda
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Pedidos -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Pedidos</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Pendientes -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Pendientes</p>
              <p class="text-3xl font-bold text-yellow-600">{{ stats.pendingOrders }}</p>
            </div>
            <div class="bg-yellow-100 p-3 rounded-lg">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- En Proceso -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">En Proceso</p>
              <p class="text-3xl font-bold text-purple-600">{{ stats.processingOrders }}</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Ingresos -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Ingresos Totales</p>
              <p class="text-2xl font-bold text-green-600">${{ formatPrice(stats.totalRevenue) }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs de navegación -->
      <div class="bg-white rounded-lg shadow mb-8">
        <nav class="flex border-b">
          <button
            @click="activeTab = 'all'"
            :class="[
              'px-6 py-4 font-medium border-b-2 transition',
              activeTab === 'all' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            ]"
          >
            Todos los Pedidos
          </button>
          <button
            @click="activeTab = 'pending'"
            :class="[
              'px-6 py-4 font-medium border-b-2 transition',
              activeTab === 'pending' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            ]"
          >
            Pendientes
            <span v-if="stats.pendingOrders > 0" class="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              {{ stats.pendingOrders }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Lista de pedidos -->
      <OrdersList :status="activeTab === 'pending' ? 'pending' : null" @updated="loadStats" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../store/auth'; // 🔥 AGREGADO
import api from '../../services/api';
import OrdersList from './OrdersList.vue';

const authStore = useAuthStore(); // 🔥 AGREGADO
const activeTab = ref('all');

const stats = ref({
  totalOrders: 0,
  pendingOrders: 0,
  processingOrders: 0,
  deliveredOrders: 0,
  totalRevenue: 0
});

const loadStats = async () => {
  try {
    const { data } = await api.getOrderStats();
    stats.value = data.stats;
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO').format(price);
};

onMounted(() => {
  loadStats();
});
</script>