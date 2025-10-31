<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold">
          {{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}
        </h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre del producto *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej: Anillo dorado con piedras"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            v-model="form.description"
            required
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Descripción del producto..."
          ></textarea>
        </div>

        <!-- Precio y Stock -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Precio (COP) *
            </label>
            <input
              v-model.number="form.price"
              type="number"
              required
              min="0"
              step="100"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="15000"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              v-model.number="form.stock"
              type="number"
              required
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="10"
            />
          </div>
        </div>

        <!-- Categoría -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Categoría *
          </label>
          <select
            v-model="form.category"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecciona una categoría</option>
            <option value="Anillos">Anillos</option>
            <option value="Aretas">Aretas</option>
            <option value="Cadenas">Cadenas</option>
            <option value="Pulseras">Pulseras</option>
            <option value="Bolsas">Bolsas</option>
            <option value="Collares">Collares</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <!-- URL de la imagen -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            URL de la imagen *
          </label>
          <input
            v-model="form.image"
            type="url"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          
          <!-- Preview de la imagen -->
          <div v-if="form.image" class="mt-3">
            <p class="text-sm text-gray-600 mb-2">Vista previa:</p>
            <img 
              :src="form.image" 
              alt="Preview"
              class="w-32 h-32 object-cover rounded border"
              @error="imageError = true"
            />
            <p v-if="imageError" class="text-red-500 text-sm mt-1">
              Error al cargar la imagen. Verifica la URL.
            </p>
          </div>
        </div>

        <!-- Estado -->
        <div class="flex items-center">
          <input
            v-model="form.active"
            type="checkbox"
            id="active"
            class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <label for="active" class="ml-2 text-sm text-gray-700">
            Producto activo (visible en la tienda)
          </label>
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <!-- Botones -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Producto') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '../../services/api';

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);

const isEditing = computed(() => !!props.product);

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  image: '',
  active: true
});

const saving = ref(false);
const error = ref(null);
const imageError = ref(false);

// Cargar datos del producto si estamos editando
if (props.product) {
  form.value = {
    name: props.product.name,
    description: props.product.description,
    price: props.product.price,
    stock: props.product.stock,
    category: props.product.category,
    image: props.product.image,
    active: props.product.active ?? true
  };
}

// Watch para reset image error
watch(() => form.value.image, () => {
  imageError.value = false;
});

const handleSubmit = async () => {
  try {
    saving.value = true;
    error.value = null;

    if (isEditing.value) {
      // Actualizar producto existente
      await api.updateProduct(props.product._id, form.value);
    } else {
      // Crear nuevo producto
      await api.createProduct(form.value);
    }

    emit('saved');
  } catch (err) {
    console.error('Error al guardar producto:', err);
    error.value = err.response?.data?.error || 'Error al guardar el producto';
  } finally {
    saving.value = false;
  }
};
</script>