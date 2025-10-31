<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 🧭 Breadcrumb -->
    <nav class="flex mb-8" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-pink-200 inline-flex items-center"
          >
            <i class="fas fa-home mr-2"></i>
            Inicio
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <i class="fas fa-chevron-right text-gray-400 mx-2"></i>
            <router-link 
              to="/productos" 
              class="text-gray-700 hover:text-pink-200"
            >
              Productos
            </router-link>
          </div>
        </li>
        <li v-if="product">
          <div class="flex items-center">
            <i class="fas fa-chevron-right text-gray-400 mx-2"></i>
            <span class="text-gray-500">{{ product.name }}</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- 🔄 Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-200 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando producto...</p>
      </div>
    </div>

    <!-- ⚠️ Error -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-red-500 mb-4">
        <i class="fas fa-exclamation-triangle text-6xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Error al cargar el producto</h2>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <button 
        @click="fetchProduct" 
        class="bg-pink-200 text-white px-6 py-3 rounded-lg hover:bg-pink-400"
      >
        Reintentar
      </button>
    </div>

    <!-- 🛍️ Detalle del producto -->
    <div v-else-if="product" class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="lg:flex">
        <!-- Imagen principal -->
        <div class="lg:w-1/2">
          <img 
            :src="selectedImage || product.images?.[0]" 
            :alt="product.name"
            class="w-full h-96 lg:h-[500px] object-cover"
            @error="handleImageError"
          >
        </div>

        <!-- Información -->
        <div class="lg:w-1/2 p-6 lg:p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
          <p class="text-gray-700 leading-relaxed mb-6">{{ product.description }}</p>

          <div class="my-6">
            <span class="text-3xl font-bold text-pink-200">${{ product.price.toFixed(2) }}</span>
          </div>

          <div class="mb-6">
            <span class="text-gray-600">Stock:</span>
            <span 
              class="ml-2 font-medium" 
              :class="product.availableQuantity > 10 ? 'text-green-600' : 'text-orange-600'"
            >
              {{ product.availableQuantity }} disponibles
            </span>
          </div>

          <!-- Cantidad -->
          <div class="flex items-center space-x-4 mb-4">
            <label class="text-sm font-medium text-gray-700">Cantidad:</label>
            <div class="flex items-center border border-gray-300 rounded-lg">
              <button 
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="px-3 py-2 text-gray-600 disabled:opacity-50"
              >
                <i class="fas fa-minus"></i>
              </button>
              <input 
                v-model.number="quantity" 
                type="number" 
                min="1" 
                :max="product.availableQuantity"
                class="w-16 text-center py-2 border-none focus:ring-0"
              >
              <button 
                @click="increaseQuantity"
                :disabled="quantity >= product.availableQuantity"
                class="px-3 py-2 text-gray-600 disabled:opacity-50"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <!-- Botón Agregar al carrito -->
          <button 
            @click="addToCart"
            :disabled="product.availableQuantity === 0 || loading"
            class="w-full bg-pink-200 text-white py-3 px-6 rounded-lg hover:bg-pink-400 disabled:bg-gray-400 flex items-center justify-center cursor-pointer"
          >
            <i class="fas fa-shopping-cart mr-2"></i>
            {{ product.availableQuantity === 0 ? 'Agotado' : 'Agregar al Carrito' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 🔗 Productos relacionados -->
    <div v-if="relatedProducts.length > 0" class="mt-12">
      <h2 class="text-2xl font-bold mb-6">Productos relacionados</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="related in relatedProducts" 
          :key="related._id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
          @click="loadProduct(related._id)"
        >
          <img :src="related.images?.[0]" :alt="related.name" class="h-48 w-full object-cover">
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 truncate">{{ related.name }}</h3>
            <p class="text-pink-200 font-bold">${{ related.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchProductById, fetchAllProducts } from "../services/productsApi";
import { useCartStore } from "../store/cartStore.js";
import { ref } from "vue";

export default {
  name: "ProductDetail",
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup() {
    const cartStore = useCartStore();
    const showNotification = ref(false);
    const notificationMessage = ref("");

    return {
      cartStore,
      showNotification,
      notificationMessage,
    };
  },
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      selectedImage: null,
      quantity: 1,
      relatedProducts: [],
    };
  },
  mounted() {
    this.fetchProduct();
  },
  watch: {
    id() {
      this.fetchProduct();
    },
  },
  methods: {
    async fetchProduct() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchProductById(this.id);
        this.product = data;
        this.selectedImage = this.product.images?.[0];
        this.loadRelatedProducts();
      } catch (err) {
        console.error(err);
        this.error = "Error al cargar el producto";
      } finally {
        this.loading = false;
      }
    },

    async loadRelatedProducts() {
      try {
        const data = await fetchAllProducts();
        this.relatedProducts = data
          .filter((p) => p._id !== this.product._id)
          .slice(0, 4);
      } catch (err) {
        console.error("Error cargando relacionados:", err);
      }
    },

    increaseQuantity() {
      if (this.quantity < this.product.availableQuantity) this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--;
    },

    addToCart() {
      if (!this.product) return;

      const cartProduct = {
        id: this.product._id,
        title: this.product.name,
        price: this.product.price,
        quantity: this.quantity,
        images: [this.product.images?.[0]],
      };

      this.cartStore.addToCart(cartProduct);

      this.notificationMessage = `${this.product.name} añadido al carrito 🛒`;
      this.showNotification = true;
      setTimeout(() => (this.showNotification = false), 3000);

      this.quantity = 1;
    },

    loadProduct(productId) {
      this.$router.push(`/product/${productId}`);
    },

    handleImageError(e) {
      e.target.src = "https://via.placeholder.com/400?text=Imagen+no+disponible";
    },
  },
};
</script>
