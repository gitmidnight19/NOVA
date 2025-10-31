<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Filtros -->
    <div class="p-4 border-b flex justify-between items-center">
      <div class="flex gap-4">
        <select 
          v-model="filterStatus"
          @change="loadOrders"
          class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="processing">En proceso</option>
          <option value="shipped">Enviados</option>
          <option value="delivered">Entregados</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      <button 
        @click="loadOrders"
        class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Actualizar
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
    </div>

    <!-- Sin pedidos -->
    <div v-else-if="orders.length === 0" class="text-center py-12">
      <p class="text-gray-500">No hay pedidos con estos filtros</p>
    </div>

    <!-- Tabla de pedidos -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Pedido</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="order in orders" :key="order._id" class="hover:bg-gray-50">
            <!-- ID -->
            <td class="px-6 py-4">
              <span class="text-sm font-mono text-gray-900">#{{ order._id.slice(-8) }}</span>
            </td>

            <!-- Cliente -->
            <td class="px-6 py-4">
              <div class="text-sm">
                <p class="font-medium text-gray-900">{{ order.customerInfo?.name || 'N/A' }}</p>
                <p class="text-gray-500">{{ order.customerInfo?.email || 'N/A' }}</p>
                <p class="text-gray-500">{{ order.customerInfo?.phone || 'N/A' }}</p>
              </div>
            </td>

            <!-- Productos -->
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                <p v-for="item in order.items" :key="item._id" class="mb-1">
                  {{ item.name }} x{{ item.quantity }}
                </p>
              </div>
            </td>

            <!-- Total -->
            <td class="px-6 py-4">
              <span class="text-sm font-bold text-purple-600">
                ${{ formatPrice(order.total) }}
              </span>
            </td>

            <!-- Estado -->
            <td class="px-6 py-4">
              <select
                v-model="order.status"
                @change="updateOrderStatus(order._id, order.status)"
                :class="getStatusSelectClass(order.status)"
                class="text-sm font-medium rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="pending">Pendiente</option>
                <option value="processing">En proceso</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </td>

            <!-- Fecha -->
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(order.createdAt) }}
            </td>

            <!-- Acciones -->
            <td class="px-6 py-4">
              <button
                @click="viewOrderDetails(order)"
                class="text-purple-600 hover:text-purple-800 font-medium text-sm"
              >
                Ver detalles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="px-6 py-4 border-t flex justify-between items-center">
      <p class="text-sm text-gray-600">
        Página {{ currentPage }} de {{ totalPages }}
      </p>
      <div class="flex gap-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal de detalles -->
    <OrderDetailModal 
      v-if="selectedOrder"
      :order="selectedOrder"
      @close="selectedOrder = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../../services/api';
import OrderDetailModal from './OrderDetailModal.vue';

const props = defineProps({
  filter: {
    type: String,
    default: 'orders'
  }
});

const emit = defineEmits(['refresh']);

const orders = ref([]);
const loading = ref(true);
const filterStatus = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const selectedOrder = ref(null);

const loadOrders = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: 20
    };

    if (filterStatus.value) {
      params.status = filterStatus.value;
    }

    const { data } = await api.getAllOrders(params);
    orders.value = data.orders;
    totalPages.value = data.totalPages;
    currentPage.value = Number(data.currentPage);
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  } finally {
    loading.value = false;
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await api.updateOrderStatus(orderId, newStatus);
    emit('refresh');
    // Opcional: mostrar notificación de éxito
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    // Revertir el cambio en caso de error
    loadOrders();
  }
};

const viewOrderDetails = (order) => {
  selectedOrder.value = order;
};

const changePage = (page) => {
  currentPage.value = page;
  loadOrders();
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusSelectClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    processing: 'bg-blue-100 text-blue-800 border-blue-300',
    shipped: 'bg-purple-100 text-purple-800 border-purple-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300'
  };
  return classes[status] || 'bg-gray-100 text-gray-800 border-gray-300';
};

watch(() => props.filter, (newFilter) => {
  filterStatus.value = newFilter === 'pending' ? 'pending' : '';
  currentPage.value = 1;
  loadOrders();
});

onMounted(() => {
  if (props.filter === 'pending') {
    filterStatus.value = 'pending';
  }
  loadOrders();
});
</script>