<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold">Detalles del Pedido #{{ order._id.slice(-8) }}</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido -->
      <div class="p-6 space-y-6">
        <!-- Info del cliente -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-bold text-lg mb-3">Información del Cliente</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nombre:</p>
              <p class="font-medium">{{ order.customerInfo?.name || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Email:</p>
              <p class="font-medium">{{ order.customerInfo?.email || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Teléfono:</p>
              <p class="font-medium">{{ order.customerInfo?.phone || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Fecha del pedido:</p>
              <p class="font-medium">{{ formatDate(order.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Dirección de envío -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-bold text-lg mb-3">Dirección de Envío</h3>
          <p class="text-gray-700">
            {{ order.shippingAddress.street }}<br>
            {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }}<br>
            {{ order.shippingAddress.zipCode }}, {{ order.shippingAddress.country }}
          </p>
        </div>

        <!-- Productos -->
        <div>
          <h3 class="font-bold text-lg mb-3">Productos</h3>
          <div class="space-y-3">
            <div 
              v-for="item in order.items" 
              :key="item._id"
              class="flex gap-4 bg-gray-50 rounded-lg p-4"
            >
              <img 
                v-if="item.product?.image"
                :src="item.product.image" 
                :alt="item.name"
                class="w-20 h-20 object-cover rounded"
              />
              <div class="flex-1">
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm text-gray-600">Cantidad: {{ item.quantity }}</p>
                <p class="text-sm text-gray-600">Precio unitario: ${{ formatPrice(item.price) }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-lg">${{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="border-t pt-4">
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold">Total del Pedido:</span>
            <span class="text-3xl font-bold text-purple-600">${{ formatPrice(order.total) }}</span>
          </div>
        </div>

        <!-- Estado y método de pago -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-2">Estado:</p>
            <span :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </span>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-2">Método de pago:</p>
            <p class="font-medium capitalize">{{ order.paymentMethod || 'No especificado' }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
        <button 
          @click="$emit('close')"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Cerrar
        </button>
        <button 
          @click="printOrder"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Imprimir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

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
  const baseClass = 'px-3 py-1 rounded-full text-sm font-medium inline-block ';
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return baseClass + (statusClasses[status] || 'bg-gray-100 text-gray-800');
};

const printOrder = () => {
  window.print();
};
</script>