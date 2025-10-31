<template>
  <div class="bg-white min-h-screen">
    <div
      class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
    >
      <!-- 🏷️ Título -->
      <h2
        class="text-4xl font-bold text-gray-900 text-center mb-10 capitalize"
      >
        {{ category }}
      </h2>

      <!-- 🔄 Estado de carga / error -->
      <p v-if="loading" class="text-center text-gray-500">Cargando productos...</p>
      <p v-if="error" class="text-red-500 font-bold text-center">
        {{ error }}
      </p>

      <!-- 🛍️ Grid de productos -->
      <div
        v-if="!loading && !error && products.length"
        class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="group bg-white rounded-lg shadow hover:shadow-lg p-2 transition"
        >
          <!-- Imagen del producto -->
          <img
            :src="product.thumbnail || product.images?.[0]"
            :alt="product.title"
            class="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-80 xl:aspect-7/8 cursor-pointer"
            @click="goToProductDetail(product.id)"
          />

          <!-- Info del producto -->
          <h3 class="mt-4 text-sm text-gray-700 truncate">
            {{ product.title }}
          </h3>
          <p class="text-gray-500 text-xs mb-2">
            {{ product.brand || 'Sin marca' }}
          </p>
          <p class="text-lg font-semibold text-gray-900">
            ${{ product.price }}
          </p>

          <!-- Botón Ver detalles -->
          <div class="mt-3">
            <button
              class="w-full bg-pink-300 hover:bg-pink-400 text-white text-sm py-2 px-4 rounded-md transition-colors cursor-pointer"
              @click="goToProductDetail(product.id)"
            >
              Ver detalles
            </button>
          </div>

          <!-- Botón Añadir al carrito -->
          <div class="mt-3">
            <button
              @click="addToCart(product)"
              class="w-full bg-pink-300 hover:bg-pink-400 text-white text-sm py-2 px-4 rounded-md transition-colors cursor-pointer"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>

      <!-- ❌ Si no hay productos -->
      <div
        v-else-if="!loading && !error && !products.length"
        class="text-center text-gray-500 text-lg mt-20"
      >
        No hay productos disponibles en esta categoría.
      </div>

      <!-- 🛒 Notificación -->
      <transition name="fade">
        <div
          v-if="showNotification"
          class="fixed bottom-5 right-5 bg-pink-300 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
        >
          <i class="fas fa-check-circle"></i>
          <span>{{ notificationMessage }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../store/cartStore.js'

const route = useRoute()
const router = useRouter()
const category = ref(route.params.name)
const products = ref([])
const cartStore = useCartStore()

// 🛒 Notificación
const showNotification = ref(false)
const notificationMessage = ref('')

/**
 * 🧩 Mapeo entre tus nombres visuales y las categorías reales de la API DummyJSON.
 * (https://dummyjson.com/docs/products)
 */
const categoryMap = {
  Anillos: 'mens-watches',
  Aretes: 'womens-jewellery',
  Collares: 'womens-dresses',
  Earcuffs: 'womens-jewellery',
}

const loadProducts = async () => {
  const apiCategory = categoryMap[category.value] || 'womens-jewellery'

  try {
    const response = await fetch(
      `https://dummyjson.com/products/category/${apiCategory}`
    )
    const data = await response.json()
    products.value = data.products || []
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

onMounted(loadProducts)

// 🔄 Si el usuario cambia de categoría sin recargar
watch(
  () => route.params.name,
  (newVal) => {
    category.value = newVal
    loadProducts()
  }
)

// 🧭 Ir al detalle del producto
const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`);
}

// 🛒 Añadir producto al carrito
const addToCart = (product) => {
  const cartProduct = {
    id: product.id,
    title: product.title,
    price: product.price,
    quantity: 1,
    images: [product.thumbnail || product.images?.[0]],
  }

  cartStore.addToCart(cartProduct)
  notificationMessage.value = `${product.title} añadido al carrito 🛒`
  showNotification.value = true
  setTimeout(() => (showNotification.value = false), 3000)
}
</script>

<style scoped>
/* Pequeña mejora visual */
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.05);
}
</style>
