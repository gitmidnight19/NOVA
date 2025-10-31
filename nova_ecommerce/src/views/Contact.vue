<template>
<div class="isolate bg-white-100 px-6 lg:px-8 py-12">
  <div class="mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-lg shadow-pink-200/50">
    <!-- Título -->
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-4xl font-semibold tracking-tight text-balance text-gray-800 sm:text-5xl">Contacto</h2>
      <p class="mt-2 text-lg/8 text-gray-600">¿Tienes alguna duda o comentario? Escríbenos y nuestro equipo te responderá lo antes posible.</p>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="mx-auto mt-16 max-w-xl sm:mt-20">
      <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        
        <!-- Nombre -->
        <div>
          <label for="first-name" class="block text-sm font-semibold text-gray-900">Nombre</label>
          <input v-model="form.firstName" id="first-name" type="text" name="first-name" placeholder="Nombre" required minlength="2"
            class="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-300"/>
          <p v-if="errors.firstName" class="text-sm text-red-500">{{ errors.firstName }}</p>
        </div>

        <!-- Apellido -->
        <div>
          <label for="last-name" class="block text-sm font-semibold text-gray-900">Apellido</label>
          <input v-model="form.lastName" id="last-name" type="text" name="last-name" placeholder="Apellido" required minlength="2"
            class="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-300"/>
          <p v-if="errors.lastName" class="text-sm text-red-500">{{ errors.lastName }}</p>
        </div>

        <!-- Correo -->
        <div class="sm:col-span-2">
          <label for="email" class="block text-sm font-semibold text-gray-900">Correo</label>
          <input v-model="form.email" id="email" type="email" name="email" placeholder="correo@ejemplo.com"required
            class="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-300"/>
          <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
        </div>

        <!-- Teléfono -->
        <div class="sm:col-span-2">
          <label for="phone-number" class="block text-sm font-semibold text-gray-900">Número de Teléfono</label>
          <input v-model="form.phone" id="phone-number"type="tel" name="phone-number" placeholder="+57 300 123 4567" required
            class="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-300"/>
          <p v-if="errors.phone" class="text-sm text-red-500">{{ errors.phone }}</p>
        </div>

        <!-- Mensaje -->
        <div class="sm:col-span-2">
          <label for="message" class="block text-sm font-semibold text-gray-900">Mensaje</label>
          <textarea v-model="form.message" id="message" name="message" rows="4" placeholder="Escribe tu mensaje aquí..."required minlength="10"
            class="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-300">
          </textarea>
          <p v-if="errors.message" class="text-sm text-red-500">{{ errors.message }}</p>
        </div>

        <!-- Políticas -->
        <div class="flex gap-x-4 sm:col-span-2">
          <input v-model="form.agree" id="agree-to-policies"type="checkbox" required
            class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
          <label for="agree-to-policies" class="text-sm text-gray-900">
            Acepto términos de 
            <a href="#" class="font-semibold text-pink-500">política y privacidad</a>.
          </label>
        </div>
      </div>

      <!-- Botón -->
      <div class="mt-10">
        <button type="submit" class="w-full rounded-md bg-pink-200 px-3.5 py-2.5 text-center text-sm font-semibold text-gray-700 shadow hover:bg-purple-200 focus:outline-purple-100">
          Enviar
        </button>
      </div>
    </form>
  </div>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'

// Datos del formulario
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  agree: false
})

// Estado para mensajes de error o éxito
const errors = reactive({})
const successMessage = ref('')
const errorMessage = ref('')

// Función de validación
const validateForm = () => {
  errors.firstName = form.firstName ? '' : 'El nombre es obligatorio'
  errors.lastName = form.lastName ? '' : 'El apellido es obligatorio'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Correo inválido'
  errors.phone = /^(\+57)?\s?\d{10}$/.test(form.phone) ? '' : 'Número inválido'
  errors.message = form.message ? '' : 'El mensaje es obligatorio'
  errors.agree = form.agree ? '' : 'Debes aceptar las políticas'

  // Devuelve true si no hay errores
  return !Object.values(errors).some(e => e !== '')
}

const handleSubmit = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!validateForm()) {
    errorMessage.value = 'Por favor corrige los datos antes de enviar.'
    return
  }

  // Construir payload correcto para dummyjson
  const payload = {
    body: form.message,    // texto del comentario
    postId: 1,             // por ejemplo, o dinámico si lo puedes determinar
    userId: 1              // idem
  }

  try {
    const response = await axios.post(
      'https://dummyjson.com/comments/add',
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.status < 200 || response.status >= 300) {
      throw new Error('Error en el servidor')
    }

    successMessage.value = 'Tu mensaje fue enviado con éxito'

    // limpiar formulario 
    form.firstName = ''
    form.lastName = ''
    form.email = ''
    form.phone = ''
    form.message = ''
    form.agree = false

  } catch (error) {
    // Opcional: mostrar lo que responde el servidor para depurar
    console.error('Error en la petición:', error.response ? error.response.data : error)
    errorMessage.value = 'Hubo un problema al enviar el formulario.'
  }
}

</script>



