<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm shadow-neutral-300">
      <img
        class="mx-auto h-40 w-auto"
        src="\logonova2.jpeg"
        alt="Your Company"
      />
      <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-black">
        Iniciar sesión
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <form class="space-y-6" @submit.prevent="handleLoginLocal">
        <div>
          <label for="email" class="block text-sm font-medium text-black">
            correo electrónico
          </label>
          <div class="mt-2">
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-pink-300 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium text-black">
              contraseña
            </label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-pink-400 hover:text-purple-300">
                ¿olvidaste la contraseña?
              </a>
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="password"
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-pink-300 sm:text-sm"
            />
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 justify-center rounded-md bg-pink-200 px-3 py-2.5 text-sm font-semibold text-black hover:bg-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Iniciando...' : 'Iniciar sesión' }}
          </button>

          <div id="g_id_signin" class="flex-1 justify-center rounded-md"></div>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-400">
        ¿No tienes cuenta?
        <router-link to="/register" class="font-semibold text-pink-400 hover:text-purple-300 ml-1">
          Regístrate aquí
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { loadGoogleScript } from '@/services/googleAuth.js'
import { useAuth } from '@/composables/useAuth.js'

// Variables reactivas
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

// Router y composable de autenticación
const router = useRouter()
const { login } = useAuth()

// ============================================
// CARGAR GOOGLE AL MONTAR EL COMPONENTE
// ============================================
onMounted(async () => {
  try {
    await loadGoogleScript()

    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: '251998030449-q2t7b3q90hhq9rc1kv11e4fsqek4a1ej.apps.googleusercontent.com',
        callback: handleCredentialResponse
      })
      window.google.accounts.id.renderButton(
        document.getElementById('g_id_signin'),
        { theme: 'outline', size: 'large', text: 'signin_with' }
      )
      window.google.accounts.id.prompt()
    }
  } catch (err) {
    console.error('❌ Error cargando Google:', err)
  }
})

// ============================================
// FUNCIÓN DE LOGIN LOCAL (EMAIL/PASSWORD)
// ============================================
async function handleLoginLocal() {
  // Limpiar mensajes previos
  errorMessage.value = ''
  loading.value = true

  try {
    // Llamar al backend
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()
    console.log('📦 Respuesta del backend:', data)

    if (response.ok) {
      // ✅ LOGIN EXITOSO
      console.log('✅ Login exitoso')
      console.log('Usuario:', data.user)
      console.log('Token:', data.token)
      console.log('Rol del usuario:', data.user.role)
      
      // 🔥 IMPORTANTE: Usar el composable login() para guardar el estado
      login(data.user, data.token)
      
      // Esperar un momento para que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redirigir según el rol del usuario
      if (data.user.role === 'admin') {
        console.log('🔐 Usuario es admin, redirigiendo a /admin')
        router.push({ name: 'Admin' })
      } else {
        console.log('👤 Usuario normal, redirigiendo a Home')
        router.push({ name: 'Home' })
      }
    } else {
      // ❌ ERROR EN LOGIN
      console.error('❌ Error en login:', data.error)
      errorMessage.value = data.error || 'Credenciales inválidas'
    }
  } catch (err) {
    // ❌ ERROR DE CONEXIÓN
    console.error('❌ Error de conexión:', err)
    errorMessage.value = 'Error de conexión. Verifica que el servidor esté corriendo en http://localhost:3000'
  } finally {
    loading.value = false
  }
}

// ============================================
// FUNCIÓN DE LOGIN CON GOOGLE
// ============================================
async function handleCredentialResponse(response) {
  try {
    // Decodificar el token de Google
    const decoded = jwtDecode(response.credential)
    console.log('📧 Datos de Google recibidos:', {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture
    })

    // Enviar al backend para crear/buscar usuario
    const backendResponse = await fetch('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
        avatar: decoded.picture
      })
    })

    const data = await backendResponse.json()
    console.log('📦 Respuesta del backend (Google):', data)

    if (backendResponse.ok) {
      // ✅ LOGIN CON GOOGLE EXITOSO
      console.log('✅ Login con Google exitoso')
      console.log('Usuario:', data.user)
      console.log('Rol del usuario:', data.user.role)
      
      // 🔥 IMPORTANTE: Usar el composable login()
      login(data.user, data.token)
      
      // Esperar un momento para que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redirigir según el rol
      if (data.user.role === 'admin') {
        console.log('🔐 Usuario es admin, redirigiendo a /admin')
        router.push({ name: 'Admin' })
      } else {
        console.log('👤 Usuario normal, redirigiendo a Home')
        router.push({ name: 'Home' })
      }
    } else {
      // ❌ ERROR EN LOGIN CON GOOGLE
      console.error('❌ Error en login con Google:', data.error)
      errorMessage.value = data.error || 'Error al iniciar sesión con Google'
    }
  } catch (err) {
    // ❌ ERROR DE CONEXIÓN O DECODIFICACIÓN
    console.error('❌ Error en login con Google:', err)
    errorMessage.value = 'Error al iniciar sesión con Google'
  }
}
</script>