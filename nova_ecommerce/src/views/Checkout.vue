<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Formulario -->
      <div class="lg:col-span-2">
        <form @submit.prevent="handleCheckout" class="space-y-6">
          <!-- Información de envío -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">Información de Envío</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="3001234567"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  v-model="form.address.street"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Calle 123 # 45-67"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    v-model="form.address.city"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Bogotá"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Departamento *
                  </label>
                  <input
                    v-model="form.address.state"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Cundinamarca"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal *
                  </label>
                  <input
                    v-model="form.address.zipCode"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="110111"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    País *
                  </label>
                  <input
                    v-model="form.address.country"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Colombia"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Método de pago -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">Método de Pago</h2>
            
            <div class="space-y-3">
              <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="contraentrega"
                  class="mr-3"
                />
                <div>
                  <p class="font-medium">Pago contra entrega</p>
                  <p class="text-sm text-gray-500">Paga cuando recibas tu pedido</p>
                </div>
              </label>

              <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="transferencia"
                  class="mr-3"
                />
                <div>
                  <p class="font-medium">Transferencia bancaria</p>
                  <p class="text-sm text-gray-500">Te enviaremos los datos por email</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Resumen del pedido -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-6 sticky top-4">
          <h2 class="text-xl font-bold mb-4">Resumen del pedido</h2>

          <!-- Productos -->
          <div class="space-y-3 mb-4 max-h-64 overflow-y-auto">
            <div 
              v-for="item in cartStore.items" 
              :key="item.productId"
              class="flex gap-3"
            >
              <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded" />
              <div class="flex-1">
                <p class="text-sm font-medium line-clamp-2">{{ item.name }}</p>
                <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
              </div>
              <p class="font-semibold">${{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </div>

          <div class="border-t pt-4 space-y-2 mb-4">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${{ formatPrice(cartStore.total) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
          </div>

          <div class="border-t pt-4 mb-6">
            <div class="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span class="text-purple-600">${{ formatPrice(cartStore.total) }}</span>
            </div>
          </div>

          <button
            @click="handleCheckout"
            :disabled="loading || cartStore.isEmpty"
            class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Procesando...</span>
            <span v-else>Confirmar Pedido</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import api from '../services/api';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const form = ref({
  name: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia'
  },
  paymentMethod: 'contraentrega'
});

const loading = ref(false);
const error = ref(null);

onMounted(() => {
  // Pre-rellenar con datos del usuario si existen
  if (authStore.user) {
    form.value.name = authStore.user.name || '';
    form.value.phone = authStore.user.phone || '';
    if (authStore.user.address) {
      form.value.address = { ...authStore.user.address };
    }
  }
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const handleCheckout = async () => {
  try {
    loading.value = true;
    error.value = null;

    const orderData = {
      shippingAddress: form.value.address,
      paymentMethod: form.value.paymentMethod
    };

    const { data } = await api.createOrder(orderData);

    // Limpiar carrito
    await cartStore.clearCart();

    // Redirigir a confirmación
    router.push(`/orders/${data.order._id}`);
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al procesar el pedido';
    console.error('Error checkout:', err);
  } finally {
    loading.value = false;
  }
};
</script>