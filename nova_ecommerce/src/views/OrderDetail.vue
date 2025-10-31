<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <router-link 
        to="/orders"
        class="mt-4 inline-block text-purple-600 hover:text-purple-700"
      >
        Volver a mis pedidos
      </router-link>
    </div>

    <!-- Detalles del pedido -->
    <div v-else-if="order" class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Pedido #{{ order._id.slice(-8) }}</h1>
            <p class="text-gray-600 mt-2">Realizado el {{ formatDate(order.createdAt) }}</p>
          </div>
          <span :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </span>
        </div>

        <!-- Confirmación -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-semibold text-green-900">¡Pedido confirmado!</p>
              <p class="text-green-700 text-sm mt-1">
                Te hemos enviado un email de confirmación a {{ order.customerInfo?.email }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del cliente -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Información del Cliente</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Nombre:</p>
            <p class="font-medium">{{ order.customerInfo?.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Email:</p>
            <p class="font-medium">{{ order.customerInfo?.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Teléfono:</p>
            <p class="font-medium">{{ order.customerInfo?.phone || 'No proporcionado' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Método de pago:</p>
            <p class="font-medium capitalize">{{ order.paymentMethod || 'Contraentrega' }}</p>
          </div>
        </div>
      </div>

      <!-- Dirección de envío -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Dirección de Envío</h2>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-700">
            {{ order.shippingAddress.street }}<br>
            {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }}<br>
            <span v-if="order.shippingAddress.zipCode">{{ order.shippingAddress.zipCode }}, </span>
            {{ order.shippingAddress.country }}
          </p>
        </div>
      </div>

      <!-- Productos -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Productos</h2>
        <div class="space-y-4">
          <div 
            v-for="item in order.items" 
            :key="item._id"
            class="flex gap-4 pb-4 border-b last:border-b-0"
          >
            <img 
              v-if="item.product?.image"
              :src="item.product.image" 
              :alt="item.name"
              class="w-20 h-20 object-cover rounded"
              @error="onImageError"
            />
            <div class="w-20 h-20 bg-gray-200 rounded flex items-center justify-center" v-else>
              <span class="text-gray-400 text-xs">Sin imagen</span>
            </div>
            
            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ item.name }}</p>
              <p class="text-sm text-gray-600">Cantidad: {{ item.quantity }}</p>
              <p class="text-sm text-gray-600">Precio: ${{ formatPrice(item.price) }}</p>
            </div>
            
            <div class="text-right">
              <p class="font-bold text-lg text-purple-600">
                ${{ formatPrice(item.price * item.quantity) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="mt-6 pt-6 border-t">
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold">Total:</span>
            <span class="text-3xl font-bold text-purple-600">
              ${{ formatPrice(order.total) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex gap-4">
        <router-link 
          to="/orders"
          class="flex-1 bg-gray-200 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
        >
          Ver todos mis pedidos
        </router-link>
        <router-link 
          to="/"
          class="flex-1 bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          Seguir comprando
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

const route = useRoute();

const order = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const orderId = route.params.id;
    const { data } = await api.getOrder(orderId);
    order.value = data.order;
  } catch (err) {
    console.error('Error al cargar orden:', err);
    error.value = 'No se pudo cargar el pedido';
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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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
  const baseClass = 'px-4 py-2 rounded-full text-sm font-medium ';
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return baseClass + (statusClasses[status] || 'bg-gray-100 text-gray-800');
};

const onImageError = (e) => {
  e.target.style.display = 'none';
};
</script>