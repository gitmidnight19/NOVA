<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Finalizar compra</h1>

    <!-- Carrito vacío -->
    <div v-if="cartStore.cartItemsCount === 0" class="text-center py-12">
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
      <p class="text-xl text-gray-600 mb-6">Tu carrito está vacío</p>
      <button
        @click="router.push('/sale')"
        class="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
      >
        Ir a comprar
      </button>
    </div>

    <!-- Checkout form -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Formulario -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Información de contacto -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Información de contacto</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico *
              </label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="tu@email.com"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                v-model="formData.phone"
                type="tel"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="+57 300 123 4567"
                :class="{ 'border-red-500': errors.phone }"
              />
              <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
            </div>
          </div>
        </div>

        <!-- Información de envío -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Dirección de envío</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  v-model="formData.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Juan"
                  :class="{ 'border-red-500': errors.firstName }"
                />
                <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  v-model="formData.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Pérez"
                  :class="{ 'border-red-500': errors.lastName }"
                />
                <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dirección *
              </label>
              <input
                v-model="formData.address"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Calle 123 #45-67"
                :class="{ 'border-red-500': errors.address }"
              />
              <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  v-model="formData.city"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Medellín"
                  :class="{ 'border-red-500': errors.city }"
                />
                <p v-if="errors.city" class="text-red-500 text-sm mt-1">{{ errors.city }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Departamento *
                </label>
                <input
                  v-model="formData.state"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Antioquia"
                  :class="{ 'border-red-500': errors.state }"
                />
                <p v-if="errors.state" class="text-red-500 text-sm mt-1">{{ errors.state }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Código Postal
                </label>
                <input
                  v-model="formData.zipCode"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="050001"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notas adicionales (opcional)
              </label>
              <textarea
                v-model="formData.notes"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Instrucciones especiales de entrega..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Método de pago -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Método de pago</h2>
          <div class="space-y-3">
            <label
              class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="formData.paymentMethod === 'stripe' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'"
            >
              <input
                v-model="formData.paymentMethod"
                type="radio"
                value="stripe"
                class="w-4 h-4 text-pink-500 focus:ring-pink-500"
              />
              <div class="ml-3 flex-1">
                <span class="font-medium text-gray-700">Tarjeta de crédito/débito</span>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-500">Powered by</span>
                  <svg class="h-4" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" fill="#635BFF"/>
                  </svg>
                </div>
              </div>
            </label>

            <label
              class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="formData.paymentMethod === 'pse' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'"
            >
              <input
                v-model="formData.paymentMethod"
                type="radio"
                value="pse"
                class="w-4 h-4 text-pink-500 focus:ring-pink-500"
              />
              <span class="ml-3 font-medium text-gray-700">PSE</span>
            </label>

            <label
              class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="formData.paymentMethod === 'cash' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'"
            >
              <input
                v-model="formData.paymentMethod"
                type="radio"
                value="cash"
                class="w-4 h-4 text-pink-500 focus:ring-pink-500"
              />
              <span class="ml-3 font-medium text-gray-700">Pago contra entrega</span>
            </label>
          </div>
          <p v-if="errors.paymentMethod" class="text-red-500 text-sm mt-2">{{ errors.paymentMethod }}</p>

          <!-- Stripe Card Element -->
          <div v-if="formData.paymentMethod === 'stripe'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Información de la tarjeta
            </label>
            <div
              ref="cardElement"
              class="p-4 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-transparent"
            ></div>
            <p v-if="cardError" class="text-red-500 text-sm mt-2">{{ cardError }}</p>
            
            <!-- Tarjetas de prueba -->
            <div class="mt-3 p-3 bg-blue-50 rounded-md">
              <p class="text-xs font-semibold text-blue-800 mb-2">💳 Tarjetas de prueba Stripe:</p>
              <div class="space-y-1 text-xs text-blue-700">
                <p><strong>Éxito:</strong> 4242 4242 4242 4242</p>
                <p><strong>Requiere autenticación:</strong> 4000 0027 6000 3184</p>
                <p><strong>Declinada:</strong> 4000 0000 0000 0002</p>
                <p class="text-blue-600 mt-1">Fecha: cualquier futura | CVC: cualquier 3 dígitos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen del pedido -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>

          <!-- Items -->
          <div class="space-y-3 mb-4 max-h-60 overflow-y-auto">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex items-center gap-3 pb-3 border-b border-gray-200"
            >
              <img
                :src="item.image"
                :alt="item.title"
                class="w-16 h-16 object-cover rounded-md"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">{{ item.title }}</p>
                <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
              </div>
              <p class="text-sm font-bold text-pink-500">
                ${{ (item.price * item.quantity).toLocaleString('es-CO') }}
              </p>
            </div>
          </div>

          <!-- Totales -->
          <div class="space-y-2 pt-4 border-t border-gray-200">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${{ cartStore.cartSubtotal.toLocaleString('es-CO') }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Envío:</span>
              <span>${{ shippingCost.toLocaleString('es-CO') }}</span>
            </div>
            <div class="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span class="text-pink-500">${{ totalWithShipping.toLocaleString('es-CO') }}</span>
            </div>
          </div>

          <!-- Botón de compra -->
          <button
            @click="processOrder"
            :disabled="processing"
            class="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              v-if="processing"
              class="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{ processing ? 'Procesando...' : 'Confirmar pedido' }}</span>
          </button>

          <button
            @click="router.push('/sale')"
            class="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <Transition name="modal">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeSuccessModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-8 transform transition-all">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                class="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h3>
            <p class="text-gray-600 mb-2">
              Tu pedido #{{ orderNumber }} ha sido procesado exitosamente.
            </p>
            <p v-if="paymentIntentId" class="text-sm text-gray-500 mb-4">
              ID de pago: {{ paymentIntentId }}
            </p>
            <p class="text-gray-600 mb-6">
              Recibirás un correo de confirmación en breve.
            </p>
            <button
              @click="closeSuccessModal"
              class="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { useCartStore } from '../store/cartStore.js'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

export default {
  name: 'Checkout',

  setup() {
    const cartStore = useCartStore()
    const router = useRouter()
    const processing = ref(false)
    const showSuccessModal = ref(false)
    const orderNumber = ref('')
    const paymentIntentId = ref('')
    const cardElement = ref(null)
    const cardError = ref('')
    
    let stripe = null
    let elements = null
    let card = null

    const formData = ref({
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      notes: '',
      paymentMethod: 'stripe',
    })

    const errors = ref({})

    const shippingCost = computed(() => {
      return cartStore.cartSubtotal > 100000 ? 0 : 15000
    })

    const totalWithShipping = computed(() => {
      return cartStore.cartSubtotal + shippingCost.value
    })

    onMounted(async () => {
      // Inicializar Stripe con tu clave pública
      // IMPORTANTE: Reemplaza con tu clave pública de Stripe
      stripe = await loadStripe('pk_test_51SJMf199219uzpfwhUOWlRJR2FPAZ2MRYChmlFzPai0VsdTeUu1AQlwF16EBfpekijkrJ8SFALNIkUPcPg7ABq5w00a5fzUkqy')
      
      if (stripe && cardElement.value) {
        elements = stripe.elements()
        card = elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#ef4444',
            },
          },
        })
        card.mount(cardElement.value)
        
        card.on('change', (event) => {
          cardError.value = event.error ? event.error.message : ''
        })
      }
    })

    return {
      cartStore,
      router,
      processing,
      showSuccessModal,
      orderNumber,
      paymentIntentId,
      formData,
      errors,
      shippingCost,
      totalWithShipping,
      cardElement,
      cardError,
      stripe,
      card,
    }
  },

  methods: {
    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.formData.email) {
        this.errors.email = 'El correo electrónico es requerido'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
        this.errors.email = 'Ingresa un correo electrónico válido'
        isValid = false
      }

      if (!this.formData.phone) {
        this.errors.phone = 'El teléfono es requerido'
        isValid = false
      }

      if (!this.formData.firstName) {
        this.errors.firstName = 'El nombre es requerido'
        isValid = false
      }

      if (!this.formData.lastName) {
        this.errors.lastName = 'El apellido es requerido'
        isValid = false
      }

      if (!this.formData.address) {
        this.errors.address = 'La dirección es requerida'
        isValid = false
      }

      if (!this.formData.city) {
        this.errors.city = 'La ciudad es requerida'
        isValid = false
      }

      if (!this.formData.state) {
        this.errors.state = 'El departamento es requerido'
        isValid = false
      }

      if (!this.formData.paymentMethod) {
        this.errors.paymentMethod = 'Selecciona un método de pago'
        isValid = false
      }

      if (!isValid) {
        const errorElement = document.querySelector(`[class*="border-red-500"]`)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }

      return isValid
    },

    async processStripePayment() {
      if (!this.stripe || !this.card) {
        throw new Error('Stripe no está inicializado')
      }

      // Crear PaymentMethod
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          name: `${this.formData.firstName} ${this.formData.lastName}`,
          email: this.formData.email,
          phone: this.formData.phone,
          address: {
            line1: this.formData.address,
            city: this.formData.city,
            state: this.formData.state,
            postal_code: this.formData.zipCode,
            country: 'CO',
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      // Aquí normalmente enviarías el paymentMethod.id a tu backend
      // para crear un PaymentIntent y confirmar el pago
      // Para la simulación, solo retornamos el ID
      return {
        success: true,
        paymentMethodId: paymentMethod.id,
        // Simular un paymentIntent
        paymentIntentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
      }
    },

    async processOrder() {
      if (!this.validateForm()) {
        return
      }

      this.processing = true
      this.cardError = ''

      try {
        let paymentResult = null

        // Procesar pago según el método seleccionado
        if (this.formData.paymentMethod === 'stripe') {
          paymentResult = await this.processStripePayment()
          this.paymentIntentId = paymentResult.paymentIntentId
        }

        // Simular delay de procesamiento
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Generar número de orden
        this.orderNumber = 'ORD-' + Date.now()

        // Aquí iría la lógica para enviar el pedido al backend
        console.log('Pedido procesado:', {
          orderNumber: this.orderNumber,
          customer: this.formData,
          items: this.cartStore.items,
          subtotal: this.cartStore.cartSubtotal,
          shipping: this.shippingCost,
          total: this.totalWithShipping,
          paymentMethod: this.formData.paymentMethod,
          paymentResult,
        })

        // Limpiar carrito
        this.cartStore.clearCart()

        // Mostrar modal de éxito
        this.showSuccessModal = true
      } catch (error) {
        console.error('Error procesando el pago:', error)
        this.cardError = error.message || 'Error al procesar el pago. Por favor, intenta de nuevo.'
      } finally {
        this.processing = false
      }
    },

    closeSuccessModal() {
      this.showSuccessModal = false
      this.router.push('/sale')
    },
  },
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>