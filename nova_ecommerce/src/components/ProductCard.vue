<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
    <!-- Imagen -->
    <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 relative">
      <img 
        :src="product.image" 
        :alt="product.name"
        class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        @error="onImageError"
      />
      <!-- Badge de categoría -->
      <span class="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
        {{ product.category }}
      </span>
      <!-- Badge de sin stock -->
      <span 
        v-if="product.stock === 0" 
        class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
      >
        Sin stock
      </span>
      <!-- Badge de stock bajo -->
      <span 
        v-else-if="product.stock < 5" 
        class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded"
      >
        Últimas {{ product.stock }} unidades
      </span>
    </div>

    <!-- Contenido -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
        {{ product.name }}
      </h3>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between">
        <div>
          <span class="text-2xl font-bold text-purple-600">
            ${{ formatPrice(product.price) }}
          </span>
          <p v-if="product.stock > 0 && product.stock < 5" class="text-orange-500 text-xs mt-1">
            Solo {{ product.stock }} disponibles
          </p>
        </div>

        <button 
          @click="addToCart"
          :disabled="product.stock === 0 || adding"
          class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="!adding && product.stock > 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="adding" class="animate-spin">⏳</span>
          <span v-else-if="product.stock === 0">Agotado</span>
          <span v-else>Agregar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../store/cart';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();
const adding = ref(false);

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const addToCart = async () => {
  try {
    adding.value = true;
    await cartStore.addToCart(props.product);
    
    // Notificación visual (opcional)
    console.log('✅ Producto agregado:', props.product.name);
    
    // Aquí podrías agregar una notificación toast si tienes una librería
    // toast.success('Producto agregado al carrito')
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    alert('Error al agregar el producto al carrito');
  } finally {
    adding.value = false;
  }
};

const onImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-w-1 {
  position: relative;
  padding-bottom: 100%;
}

.aspect-w-1 > img {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>