<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Ofertas y descuentos</h1>
    
    <!-- Loading state -->
    <div v-if="productStore.loading" class="text-center text-xl text-gray-600 py-12">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mb-4"></div>
        <p>Cargando productos...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="productStore.error" class="text-center py-12">
      <p class="text-xl text-red-600 mb-4">{{ productStore.error }}</p>
      <button 
        @click="productStore.loadProducts()" 
        class="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>
    
    <!-- Products grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="product in productStore.products" 
        :key="product.id" 
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        
        <div class="relative cursor-pointer" @click="viewDetails(product)">
          <img 
            :src="product.thumbnail" 
            :alt="product.title" 
            class="w-full h-48 object-cover hover:opacity-90 transition-opacity"
          >
          <span 
            v-if="product.discountPercentage > 0" 
            class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
          >
            -{{ Math.round(product.discountPercentage) }}%
          </span>
        </div>
        
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-pink-500 cursor-pointer" @click="viewDetails(product)">
            {{ product.title }}
          </h3>
          
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="text-2xl font-bold text-pink-500">
                ${{ product.price.toLocaleString('es-CO') }}
              </span>
              
            </div>
          </div>
          
          <div class="space-y-2">
            <button 
              @click="viewDetails(product)" 
              class="w-full bg-pink-200 hover:bg-pink-300 text-gray-700 text-sm py-2 px-4 rounded-md transition-colors font-medium"
            >
              Ver detalles
            </button>
            
            <button 
              @click="addToCart(product)" 
              class="w-full bg-pink-500 hover:bg-pink-600 text-white text-sm py-2 px-4 rounded-md transition-colors font-medium flex items-center justify-center gap-2"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notificación de producto agregado -->
    <Transition name="notification">
      <div
        v-if="showNotification"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 max-w-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <div>
          <p class="font-semibold">¡Producto agregado!</p>
          <p class="text-sm">{{ notificationMessage }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { useProductStore } from '../store/productStore.js'
import { useCartStore } from '../store/cartStore.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  name: 'Sale',
  
  setup() {
    const productStore = useProductStore()
    const cartStore = useCartStore()
    const router = useRouter()
    const showNotification = ref(false)
    const notificationMessage = ref('')
    
    return {
      productStore,
      cartStore,
      router,
      showNotification,
      notificationMessage
    }
  },

  methods: {
    viewDetails(product) {
      this.router.push(`/product/${product.id}`)
    },

    addToCart(product) {
      // Adaptar el producto al formato del carrito
      const cartProduct = {
        id: product.id,
        title: product.title,
        price: product.price,
        images: [product.thumbnail],
      }

      this.cartStore.addToCart(cartProduct)
      
      // Mostrar notificación
      this.notificationMessage = `${product.title} añadido al carrito`
      this.showNotification = true
      
      setTimeout(() => {
        this.showNotification = false
      }, 3000)
    },

    calculateOriginalPrice(product) {
      if (product.discountPercentage > 0) {
        return Math.round(product.price / (1 - product.discountPercentage / 100))
      }
      return product.price
    }
  },

  mounted() {
    this.productStore.loadProducts()
  }
}
</script>

<style scoped>
/* Animación para la notificación */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Limitar líneas de texto */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>