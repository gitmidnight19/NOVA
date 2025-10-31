<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

    <!-- Carrito vacío -->
    <div v-if="cartStore.isEmpty" class="text-center py-16">
      <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h3 class="mt-4 text-xl font-medium text-gray-900">Tu carrito está vacío</h3>
      <p class="mt-2 text-gray-500">Agrega productos para comenzar a comprar</p>
      <router-link 
        to="/"
        class="mt-6 inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
      >
        Ver Productos
      </router-link>
    </div>

    <!-- Carrito con productos -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Lista de productos -->
      <div class="lg:col-span-2 space-y-4">
        <div 
          v-for="item in cartStore.items" 
          :key="item.productId"
          class="bg-white rounded-lg shadow p-4 flex items-center gap-4"
        >
          <!-- Imagen -->
          <img 
            :src="item.image" 
            :alt="item.name"
            class="w-24 h-24 object-cover rounded"
          />

          <!-- Info -->
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
            <p class="text-purple-600 font-bold">${{ formatPrice(item.price) }}</p>
            <p v-if="item.stock < 5" class="text-orange-500 text-sm">
              Solo {{ item.stock }} disponibles
            </p>
          </div>

          <!-- Cantidad -->
          <div class="flex items-center gap-2">
            <button 
              @click="decreaseQuantity(item)"
              class="bg-gray-200 hover:bg-gray-300 rounded px-3 py-1"
            >
              -
            </button>
            <span class="w-12 text-center font-semibold">{{ item.quantity }}</span>
            <button 
              @click="increaseQuantity(item)"
              :disabled="item.quantity >= item.stock"
              class="bg-gray-200 hover:bg-gray-300 rounded px-3 py-1 disabled:opacity-50"
            >
              +
            </button>
          </div>

          <!-- Subtotal y eliminar -->
          <div class="text-right">
            <p class="font-bold text-lg">${{ formatPrice(item.price * item.quantity) }}</p>
            <button 
              @click="removeItem(item.productId)"
              class="text-red-500 hover:text-red-700 text-sm mt-2"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-6 sticky top-4">
          <h2 class="text-xl font-bold mb-4">Resumen del pedido</h2>
          
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal ({{ cartStore.itemCount }} items)</span>
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

          <router-link 
            v-if="authStore.isAuthenticated"
            to="/checkout"
            class="block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Proceder al pago
          </router-link>

          <router-link 
            v-else
            to="/login"
            class="block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Iniciar sesión para comprar
          </router-link>

          <router-link 
            to="/"
            class="block w-full text-center py-3 text-purple-600 hover:text-purple-700 mt-2"
          >
            Seguir comprando
          </router-link>

          <button 
            @click="clearCart"
            class="block w-full text-center py-3 text-red-500 hover:text-red-700 text-sm mt-4"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';

const cartStore = useCartStore();
const authStore = useAuthStore();

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const increaseQuantity = async (item) => {
  if (item.quantity < item.stock) {
    await cartStore.updateQuantity(item.productId, item.quantity + 1);
  }
};

const decreaseQuantity = async (item) => {
  if (item.quantity > 1) {
    await cartStore.updateQuantity(item.productId, item.quantity - 1);
  } else {
    await removeItem(item.productId);
  }
};

const removeItem = async (productId) => {
  if (confirm('¿Eliminar este producto del carrito?')) {
    await cartStore.removeItem(productId);
  }
};

const clearCart = async () => {
  if (confirm('¿Vaciar todo el carrito?')) {
    await cartStore.clearCart();
  }
};
</script>