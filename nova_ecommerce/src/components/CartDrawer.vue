<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="cartStore.isCartOpen"
      
      @click="cartStore.closeCart()"
    ></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div
      v-if="cartStore.isCartOpen"
      class="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4">
        <h2 class="text-xl font-bold text-gray-800">
          Carrito de Compras
          <span class="text-sm font-normal text-gray-500 ml-2">
            ({{ cartStore.cartItemsCount }} items)
          </span>
        </h2>
        <button
          @click="cartStore.closeCart()"
          class="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cartStore.items.length === 0" class="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-24 w-24 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p class="text-gray-500 text-lg">Tu carrito está vacío</p>
          <button
            @click="cartStore.closeCart()"
            class="mt-4 text-pink-500 hover:text-pink-600 font-medium cursor-pointer"
          >
            Continuar comprando
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex gap-4 pb-4"
          >
            <!-- Imagen -->
            <img
              :src="item.image"
              :alt="item.title"
              class="w-20 h-20 object-cover rounded-lg"
            />

            <!-- Info -->
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 text-sm">{{ item.title }}</h3>
              <p class="text-pink-500 font-bold mt-1">
                ${{ item.price.toLocaleString('es-CO') }}
              </p>

              <!-- Controles de cantidad -->
              <div class="flex items-center gap-2 mt-2">
                <button
                  @click="cartStore.decrementQuantity(item.id)"
                  class="w-7 h-7 rounded-full border border-gray-300 hover:border-pink-500 hover:text-pink-500 flex items-center justify-center transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                <span class="w-8 text-center font-medium">{{ item.quantity }}</span>

                <button
                  @click="cartStore.incrementQuantity(item.id)"
                  class="w-7 h-7 rounded-full border border-gray-300 hover:border-pink-500 hover:text-pink-500 flex items-center justify-center transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Botón eliminar -->
            <button
              @click="cartStore.removeFromCart(item.id)"
              class="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer con total y botones -->
      <div v-if="cartStore.items.length > 0" class=" p-4 space-y-4">
        <!-- Total -->
        <div class="flex items-center justify-between text-lg font-bold">
          <span class="text-gray-700">Total:</span>
          <span class="text-pink-500">{{ cartStore.cartTotal }}</span>
        </div>

        <!-- Botones -->
        <div class="space-y-2">
          <button @click="$router.push('/checkout')"
            class="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Proceder al Pago
          </button>
          <button
            @click="cartStore.clearCart()"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCartStore } from '../store/cartStore'

const cartStore = useCartStore()
</script>

<style scoped>
/* Animación fade para overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animación slide para drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>