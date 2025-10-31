<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
    </div>

    <!-- Sin pedidos -->
    <div v-else-if="orders.length === 0" class="text-center py-12">
      <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-xl font-medium text-gray-900">No tienes pedidos aún</h3>
      <p class="mt-2 text-gray-500">Cuando realices una compra, aparecerá aquí</p>
      <router-link 
        to="/"
        class="mt-6 inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
      >
        Ver Productos
      </router-link>
    </div>

    <!-- Lista de pedidos -->
    <div v-else class="space-y-4">
      <div 
        v-for="order in orders" 
        :key="order._id"
        class="bg-white rounded-lg shadow p-6"
      >
        <!-- Header del pedido -->
        <div class="flex justify-between items-start mb-4 pb-4 border-b">
          <div>
            <p class="text-sm text-gray-500">Pedido #{{ order._id.slice(-8) }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
          </div>
          <span :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </span>
        </div>

        <!-- Productos -->
        <div class="space-y-3 mb-4">
          <div 
            v-for="item in order.items" 
            :key="item._id"
            class="flex gap-4"
          >
            <img 
              v-if="item.product?.image"
              :src="item.product.image" 
              :alt="item.name"
              class="w-16 h-16 object-cover rounded"
            />
            <div class="flex-1">
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
            </div>
            <p class="font-semibold">${{ formatPrice(item.price * item.quantity) }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center pt-4 border-t">
          <div>
            <p class="text-sm text-gray-500">Dirección de envío:</p>
            <p class="text-sm">{{ formatAddress(order.shippingAddress) }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Total</p>
            <p class="text-2xl font-bold text-purple-600">${{ formatPrice(order.total) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const orders = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.getMyOrders();
    orders.value = data.orders;
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  } finally {
    loading.value = false;
  }
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatAddress = (address) => {
  return `${address.street}, ${address.city}, ${address.state}`;
};

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Pendiente',
    processing: 'En proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  };
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const baseClass = 'px-3 py-1 rounded-full text-sm font-medium ';
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return baseClass + (statusClasses[status] || 'bg-gray-100 text-gray-800');
};
</script>