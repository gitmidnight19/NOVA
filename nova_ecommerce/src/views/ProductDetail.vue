<template>
  <div class="min-h-screen bg-white">
    <!-- Breadcrumb minimalista -->
    <div class="border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/" class="hover:text-gray-900">Inicio</router-link>
          <span>/</span>
          <span class="text-gray-900">{{ product?.category }}</span>
        </nav>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando producto...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <h3 class="text-xl font-medium text-gray-900">Producto no encontrado</h3>
        <p class="mt-2 text-gray-500">{{ error }}</p>
        <router-link 
          to="/"
          class="mt-6 inline-block bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition"
        >
          Volver a la tienda
        </router-link>
      </div>
    </div>

    <!-- Producto -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Galería de imágenes -->
        <div class="space-y-4">
          <!-- Imagen principal -->
          <div class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
            <img 
              :src="selectedImage" 
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              @error="onImageError"
            />
            
            <!-- Badge de stock -->
            <div class="absolute top-4 left-4">
              <span 
                v-if="product.stock === 0" 
                class="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full"
              >
                Agotado
              </span>
              <span 
                v-else-if="product.stock < 5" 
                class="bg-orange-500 text-white text-xs font-medium px-3 py-1.5 rounded-full"
              >
                Solo {{ product.stock }} disponibles
              </span>
            </div>

            <!-- Botón de zoom -->
            <button 
              @click="openImageModal"
              class="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>
          </div>

          <!-- Miniaturas -->
          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="(img, index) in images"
              :key="index"
              @click="selectImage(img)"
              :class="[
                'aspect-square rounded-lg overflow-hidden border-2 transition',
                selectedImage === img ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
              ]"
            >
              <img :src="img" :alt="`${product.name} ${index + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Información del producto -->
        <div class="space-y-6">
          <!-- Categoría -->
          <div>
            <router-link 
              to="/" 
              class="text-sm text-gray-500 hover:text-gray-900 uppercase tracking-wider"
            >
              {{ product.category }}
            </router-link>
          </div>

          <!-- Título -->
          <div>
            <h1 class="text-3xl lg:text-4xl font-light text-gray-900 mb-3">
              {{ product.name }}
            </h1>
            <p class="text-gray-600 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Precio -->
          <div class="py-4 border-y">
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-light text-gray-900">
                ${{ formatPrice(product.price) }}
              </span>
              <span class="text-sm text-gray-500">COP</span>
            </div>
          </div>

          <!-- Estado de stock -->
          <div class="flex items-center gap-2">
            <div :class="product.stock > 0 ? 'bg-green-500' : 'bg-red-500'" class="w-2 h-2 rounded-full"></div>
            <span class="text-sm text-gray-600">
              {{ product.stock > 0 ? 'En stock' : 'Agotado' }}
              <span v-if="product.stock > 0 && product.stock < 5" class="text-orange-600 font-medium">
                - Solo {{ product.stock }} unidades
              </span>
            </span>
          </div>

          <!-- Selector de cantidad -->
          <div v-if="product.stock > 0" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Cantidad</label>
              <div class="inline-flex items-center border border-gray-300 rounded">
                <button 
                  @click="decreaseQuantity"
                  class="px-4 py-3 hover:bg-gray-50 transition border-r"
                  :disabled="quantity <= 1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <input 
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="product.stock"
                  class="w-20 text-center border-0 focus:outline-none focus:ring-0 py-3"
                />
                <button 
                  @click="increaseQuantity"
                  class="px-4 py-3 hover:bg-gray-50 transition border-l"
                  :disabled="quantity >= product.stock"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Botón de compra -->
          <div class="pt-2">
            <button
              @click="addToCart"
              :disabled="product.stock === 0 || adding"
              class="w-full bg-gray-900 text-white py-4 rounded hover:bg-gray-800 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span v-if="adding">Agregando...</span>
              <span v-else-if="product.stock === 0">Agotado</span>
              <span v-else>Agregar al carrito - ${{ formatPrice(product.price * quantity) }}</span>
            </button>
          </div>

          <!-- Información adicional -->
          <div class="border-t pt-6 space-y-4">
            <!-- Detalles colapsables -->
            <details class="group" open>
              <summary class="flex justify-between items-center cursor-pointer list-none">
                <span class="font-medium">Detalles del producto</span>
                <svg class="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="mt-4 text-sm text-gray-600 space-y-2">
                <p>• Material de alta calidad</p>
                <p>• Diseño único y elegante</p>
                <p>• Perfecto para cualquier ocasión</p>
              </div>
            </details>

            <details class="group border-t pt-4">
              <summary class="flex justify-between items-center cursor-pointer list-none">
                <span class="font-medium">Envío y devoluciones</span>
                <svg class="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="mt-4 text-sm text-gray-600 space-y-2">
                <p>• Envío gratis en compras superiores a $100.000</p>
                <p>• Tiempo de entrega: 3-5 días hábiles</p>
                <p>• Devoluciones gratuitas dentro de 30 días</p>
              </div>
            </details>
          </div>

          <!-- Share -->
          <div class="border-t pt-6">
            <p class="text-sm font-medium mb-3">Compartir</p>
            <div class="flex gap-3">
              <button @click="shareProduct('facebook')" class="p-2 border rounded hover:bg-gray-50 transition">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button @click="shareProduct('twitter')" class="p-2 border rounded hover:bg-gray-50 transition">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button @click="shareProduct('whatsapp')" class="p-2 border rounded hover:bg-gray-50 transition">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos relacionados -->
      <div v-if="relatedProducts.length > 0" class="mt-24">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-light">También te puede gustar</h2>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct._id" 
            :product="relatedProduct"
          />
        </div>
      </div>
    </div>

    <!-- Modal de imagen ampliada -->
    <div 
      v-if="showImageModal"
      @click="closeImageModal"
      class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    >
      <button 
        @click="closeImageModal"
        class="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img 
        :src="selectedImage" 
        :alt="product?.name"
        class="max-w-full max-h-full object-contain"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../store/cart';
import api from '../services/api';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref(null);
const relatedProducts = ref([]);
const loading = ref(true);
const error = ref(null);
const adding = ref(false);
const quantity = ref(1);
const selectedImage = ref('');
const showImageModal = ref(false);

const images = ref([]);

const loadProduct = async () => {
  try {
    loading.value = true;
    error.value = null;
    quantity.value = 1;

    const productId = route.params.id;
    const { data } = await api.getProduct(productId);
    product.value = data.product;

    images.value = [
      product.value.image,
      product.value.image,
      product.value.image,
      product.value.image
    ];
    selectedImage.value = product.value.image;

    if (product.value.category) {
      const { data: relatedData } = await api.getProducts({ 
        category: product.value.category,
        limit: 4
      });
      relatedProducts.value = relatedData.products.filter(p => p._id !== product.value._id);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Error al cargar producto:', err);
    error.value = 'No se pudo cargar el producto';
  } finally {
    loading.value = false;
  }
};

const selectImage = (img) => {
  selectedImage.value = img;
};

const openImageModal = () => {
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
};

const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = async () => {
  try {
    adding.value = true;
    await cartStore.addToCart(product.value, quantity.value);
    
    if (confirm(`✓ ${quantity.value} ${quantity.value === 1 ? 'producto agregado' : 'productos agregados'}\n\n¿Ir al carrito?`)) {
      router.push('/cart');
    } else {
      quantity.value = 1;
    }
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('Error al agregar el producto');
  } finally {
    adding.value = false;
  }
};

const shareProduct = (platform) => {
  const url = window.location.href;
  const text = `Mira este producto: ${product.value.name}`;
  
  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    whatsapp: `https://wa.me/?text=${text} ${url}`
  };
  
  window.open(urls[platform], '_blank', 'width=600,height=400');
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const onImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/800x800?text=Sin+Imagen';
};

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadProduct();
  }
});

onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

details summary::-webkit-details-marker {
  display: none;
}
</style>