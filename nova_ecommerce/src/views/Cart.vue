<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
    <!-- Header del Carrito -->
    <div class="flex items-center justify-center mb-6  pb-4">
      <h2 class="text-4xl font-bold text-center text-gray-800 py-2">Mi Carrito</h2>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Cargando carrito...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">
        <i class="fas fa-exclamation-triangle text-4xl"></i>
      </div>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button 
        @click="fetchCart" 
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Reintentar
      </button>
    </div>

    <!-- Carrito Vacío -->
    <div v-else-if="!cart || cart.products.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <i class="fas fa-shopping-cart text-6xl"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-600 mb-2">Tu carrito está vacío</h3>
      <p class="text-gray-500">Agrega algunos productos para comenzar</p>
    </div>

    <!-- Lista de Productos -->
    <div v-else>
      <div class="space-y-4 mb-6">
        <div 
          v-for="product in cart.products" 
          :key="product.id"
          class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <!-- Imagen del Producto -->
          <div class="flex-shrink-0">
            <img 
              :src="product.thumbnail || 'https://via.placeholder.com/80'" 
              :alt="product.title"
              class="w-20 h-20 object-cover rounded-lg"
              @error="handleImageError"
            >
          </div>

          <!-- Información del Producto -->
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-1">{{ product.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ product.brand || 'Sin marca' }}</p>
          </div>

          <!-- Controles de Cantidad -->
          <div class="flex items-center gap-3">
            <button 
              @click="updateQuantity(product.id, product.quantity - 1)"
              :disabled="product.quantity <= 1"
              class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
      </svg>
            </button>
            
            <span class="font-medium text-lg min-w-[2rem] text-center">
              {{ product.quantity }}
            </span>
            
            <button 
              @click="updateQuantity(product.id, product.quantity + 1)"
              class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
            >
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
            </button>
            
          </div>

          <!-- Total del Producto -->
          <div class="text-right">
            <div class="font-[sans-serif] text-lg">${{ product.total.toFixed(2) }}</div>
          </div>

          <!-- Botón Eliminar -->
          <button 
            @click="removeProduct(product.id)"
            class="text-red-500 hover:text-red-700 p-2"
            title="Eliminar producto"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <!-- Resumen del Carrito -->
      <div class="pt-6">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between items-center mb-3">
            <span class="text-gray-600">Subtotal:</span>
            <span class="font-[sans-serif]">${{ cart.total.toFixed(2) }}</span>
          </div>
          
          <div class="flex justify-between items-center mb-3">
            <span class="text-gray-600">Productos descontados:</span>
            <span class="font-[sans-serif]">${{ cart.discountedTotal.toFixed(2) }}</span>
          </div>
          
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-600">Total de productos:</span>
            <span class="font-[sans-serif]">{{ cart.totalProducts }}</span>
          </div>

          <div class="pt-3">
            <div class="flex justify-between items-center mb-6">
              <span class="text-xl font-bold">Total:</span>
              <span class="text-2xl font-[sans-serif] text-black">
                ${{ cart.discountedTotal.toFixed(2) }}
              </span>
            </div>

            <!-- Botones de Acción -->
            <div class="flex gap-3">
              <button 
                @click="clearCart"
                class="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
              
                Vaciar Carrito
              </button>

              <button 
                @click="updateCart"
                :disabled="updating"
                class="flex-1 bg-pink-200 text-white py-3 rounded-lg hover:bg-pink-400 disabled:opacity-50 transition-colors"
              >

                {{ updating ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de Éxito -->
    <div 
      v-if="showMessage" 
      class="fixed bottom-4 right-4 bg-pink-400 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      <i class="fas fa-check mr-2"></i>
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      cart: null,
      loading: true,
      error: null,
      updating: false,
      showMessage: false,
      message: '',
      cartId: 1 // ID del carrito a cargar (puedes hacer esto dinámico)
    }
  },
  
  mounted() {
    this.fetchCart()
  },
  
  methods: {
    // Obtener el carrito desde la API
    async fetchCart() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`https://dummyjson.com/carts/${this.cartId}`)
        
        if (!response.ok) {
          throw new Error('Error al cargar el carrito')
        }
        
        this.cart = await response.json()
      } catch (err) {
        this.error = err.message
        console.error('Error fetching cart:', err)
      } finally {
        this.loading = false
      }
    },

    // Actualizar cantidad de un producto
    updateQuantity(productId, newQuantity) {
      if (newQuantity < 1) return
      
      const product = this.cart.products.find(p => p.id === productId)
      if (product) {
        product.quantity = newQuantity
        product.total = product.price * newQuantity
        this.recalculateCart()
      }
    },

    // Eliminar producto del carrito
    removeProduct(productId) {
      this.cart.products = this.cart.products.filter(p => p.id !== productId)
      this.recalculateCart()
      this.showSuccessMessage('Producto eliminado del carrito')
    },

    // Recalcular totales del carrito
    recalculateCart() {
      if (!this.cart) return
      
      this.cart.totalProducts = this.cart.products.reduce((sum, p) => sum + p.quantity, 0)
      this.cart.total = this.cart.products.reduce((sum, p) => sum + p.total, 0)
      this.cart.discountedTotal = this.cart.products.reduce((sum, p) => {
        const discountedPrice = p.price * (1 - p.discountPercentage / 100)
        return sum + (discountedPrice * p.quantity)
      }, 0)
    },

    // Actualizar carrito en el servidor
    async updateCart() {
      if (!this.cart) return
      
      this.updating = true
      
      try {
        const cartData = {
          merge: false,
          products: this.cart.products.map(p => ({
            id: p.id,
            quantity: p.quantity
          }))
        }

        const response = await fetch(`https://dummyjson.com/carts/${this.cartId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartData)
        })

        if (!response.ok) {
          throw new Error('Error al actualizar el carrito')
        }

        await response.json()
        this.showSuccessMessage('Carrito actualizado exitosamente')
      } catch (err) {
        console.error('Error updating cart:', err)
        this.showSuccessMessage('Error al actualizar el carrito', 'error')
      } finally {
        this.updating = false
      }
    },

    // Vaciar carrito
    clearCart() {
      if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        this.cart.products = []
        this.recalculateCart()
        this.showSuccessMessage('Carrito vaciado')
      }
    },

    // Manejar error de imagen
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/80?text=No+Image'
    },

    // Mostrar mensaje de éxito
    showSuccessMessage(msg, type = 'success') {
      this.message = msg
      this.showMessage = true
      
      setTimeout(() => {
        this.showMessage = false
      }, 3000)
    }
  }
}
</script>
