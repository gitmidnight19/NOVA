<template>
  <section class="bg-gray-50 py-12 px-6">
    <h2 class="text-4xl font-serif text-center text-gray-800 mb-10">Colección destacada</h2>
    
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-pulse flex flex-col items-center">
        <div class="rounded-full bg-gray-300 h-12 w-12 mb-4"></div>
        <p class="text-gray-500">Cargando productos...</p>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <div class="text-red-500 font-bold mb-4">{{ error }}</div>
      <button 
        @click="fetchProducts" 
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Reintentar
      </button>
    </div>

    <div v-else-if="products.length > 0" class="max-w-6xl mx-auto">
      <div class="relative" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
        <div class="overflow-hidden rounded-lg">
          <div 
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div 
              v-for="(slide, slideIndex) in slides" 
              :key="slideIndex"
              class="min-w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4"
            >
              <div 
                v-for="product in slide" 
                :key="product.id"
                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img 
                  :src="product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300x200'" 
                  :alt="product.title"
                  class="w-full h-48 object-cover cursor-pointer"
                  @error="handleImageError"
                  @click="goToProductDetail(product.id)"
                >
                <div class="p-4">
                  <h3 class="font-bold text-lg mb-3">{{ product.title }}</h3>
                  <div class="flex justify-between items-center">
                    <span class="text-lg font-medium text-gray-900">${{ product.price }}</span>
                    <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ product.category || 'Sin categoría' }}</span>
                  </div>
                  <div class="mt-3">
                    <button @click="goToProductDetail(product.id)" class="w-full bg-pink-200 hover:bg-pink-400 text-white text-sm py-2 px-4 rounded-md transition-colors cursor-pointer">
                      Ver detalles
                    </button>
                  </div>
                  <div class="mt-3">
                    <button @click="addToCart(product)" class="w-full bg-pink-200 hover:bg-pink-400 text-white text-sm py-2 px-4 rounded-md transition-colors cursor-pointer">
                      Añadir al carro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template v-if="slides.length > 1">
          <button
            @click="prevSlide"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 z-10 cursor-pointer"
          >
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button
            @click="nextSlide"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 z-10 cursor-pointer"
          >
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <div class="flex justify-center mt-8 space-x-2">
            <button
              v-for="(slide, index) in slides"
              :key="index"
              @click="goToSlide(index)"
              class="w-3 h-3 rounded-full transition-all duration-200 cursor-pointer"
              :class="currentSlide === index ? 'bg-gray-800' : 'bg-gray-400'"
            ></button>
          </div>
        </template>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-gray-500 text-lg mb-4">No hay productos disponibles.</p>
      <button 
        @click="fetchProducts" 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Cargar productos
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProductStore } from '../store/productStore'
import { useCartStore } from '../store/cartStore'  // ✅ importación del store del carrito
import { useRouter } from 'vue-router'

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore() // ✅ inicialización del store del carrito

// Props
const props = defineProps({
  productsPerSlide: { type: Number, default: 3 },
  autoplay: { type: Boolean, default: true },
  autoplayInterval: { type: Number, default: 4000 },
  limit: { type: Number, default: 12 },
  category: { type: String, default: null }
})

// Estados computados
const products = computed(() => productStore.products)
const loading = computed(() => productStore.loading)
const error = computed(() => productStore.error)

// Estados locales
const currentSlide = ref(0)
let autoplayTimer = null

// --- FUNCIONES PRINCIPALES ---

const fetchProducts = async () => {
  if (props.category) {
    await productStore.loadProductsByCategory(props.category, props.limit)
  } else {
    await productStore.loadProducts(props.limit)
  }
}

const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}


// ✅ Función real para añadir al carrito (usa Pinia)
const addToCart = (product) => {
  const cartProduct = {
    id: product.id,
    title: product.title,
    price: product.price,
    quantity: 1,
    images: [product.thumbnail || product.images?.[0]]
  }

  cartStore.addToCart(cartProduct)

  // Notificación visual opcional (puedes integrarla si tienes un sistema de alertas)
  console.log(`🛒 ${product.title} añadido al carrito`)
}

// Imagen fallback
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen'
}

// Slides automáticos
const slides = computed(() => {
  if (!products.value?.length) return []
  const chunks = []
  for (let i = 0; i < products.value.length; i += props.productsPerSlide) {
    chunks.push(products.value.slice(i, i + props.productsPerSlide))
  }
  return chunks
})

const nextSlide = () => {
  if (slides.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  if (slides.value.length === 0) return
  currentSlide.value = currentSlide.value === 0 
    ? slides.value.length - 1 
    : currentSlide.value - 1
}

const goToSlide = (index) => {
  if (index >= 0 && index < slides.value.length) {
    currentSlide.value = index
  }
}

const startAutoplay = () => {
  if (props.autoplay && slides.value.length > 1) {
    stopAutoplay()
    autoplayTimer = setInterval(nextSlide, props.autoplayInterval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const pauseAutoplay = () => stopAutoplay()
const resumeAutoplay = () => startAutoplay()

onMounted(async () => {
  await fetchProducts()
  startAutoplay()
})

onUnmounted(() => stopAutoplay())
</script>
