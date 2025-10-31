<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center space-x-4">
          <img 
            v-if="user?.avatar" 
            :src="user.avatar" 
            alt="Avatar"
            class="w-24 h-24 rounded-full"
          />
          <div 
            v-else
            class="w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white text-4xl font-bold"
          >
            {{ user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">{{ user?.name }}</h1>
            <p class="text-gray-600">{{ user?.email }}</p>
            <span 
              class="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold"
              :class="user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'"
            >
              {{ user?.role === 'admin' ? '👑 Administrador' : '👤 Usuario' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="flex border-b">
          <button
            @click="activeTab = 'info'"
            :class="activeTab === 'info' ? 'bg-pink-100 text-pink-700 border-b-2 border-pink-500' : 'text-gray-600'"
            class="flex-1 py-4 px-6 font-semibold transition"
          >
            📋 Información Personal
          </button>
          <button
            @click="activeTab = 'security'"
            :class="activeTab === 'security' ? 'bg-pink-100 text-pink-700 border-b-2 border-pink-500' : 'text-gray-600'"
            class="flex-1 py-4 px-6 font-semibold transition"
          >
            🔒 Seguridad
          </button>
        </div>

        <div class="p-6">
          <!-- Información Personal -->
          <div v-if="activeTab === 'info'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input 
                v-model="editableUser.name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input 
                v-model="editableUser.email"
                type="email"
                disabled
                class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p class="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input 
                v-model="editableUser.phone"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <textarea 
                v-model="editableUser.address"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              ></textarea>
            </div>

            <button
              @click="updateProfile"
              :disabled="updating"
              class="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {{ updating ? 'Actualizando...' : '💾 Guardar Cambios' }}
            </button>

            <p v-if="updateMessage" class="text-center text-green-600 font-semibold">{{ updateMessage }}</p>
          </div>

          <!-- Seguridad -->
          <div v-if="activeTab === 'security'" class="space-y-4">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-yellow-800">
                <span class="font-semibold">⚠️ Nota:</span> 
                {{ user?.authProvider === 'google' 
                  ? 'Iniciaste sesión con Google. No necesitas contraseña.' 
                  : 'Puedes cambiar tu contraseña aquí.'
                }}
              </p>
            </div>

            <div v-if="user?.authProvider === 'local'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <input 
                v-model="passwordData.current"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
            </div>

            <div v-if="user?.authProvider === 'local'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input 
                v-model="passwordData.new"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
            </div>

            <div v-if="user?.authProvider === 'local'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <input 
                v-model="passwordData.confirm"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
            </div>

            <button
              v-if="user?.authProvider === 'local'"
              @click="changePassword"
              class="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              🔑 Cambiar Contraseña
            </button>

            <div class="mt-8 pt-8 border-t">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Zona Peligrosa</h3>
              <button
                @click="deleteAccount"
                class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                🗑️ Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { user, getAuthHeaders, logout } = useAuth()
const router = useRouter()

const activeTab = ref('info')
const updating = ref(false)
const updateMessage = ref('')

const editableUser = reactive({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const passwordData = reactive({
  current: '',
  new: '',
  confirm: ''
})

onMounted(async () => {
  if (user.value) {
    editableUser.name = user.value.name || ''
    editableUser.email = user.value.email || ''
    editableUser.phone = user.value.phone || ''
    editableUser.address = user.value.address || ''
  } else {
    await router.push('/login')
  }
})

const updateProfile = async () => {
  updating.value = true
  updateMessage.value = ''

  try {
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(editableUser)
    })

    const data = await response.json()

    if (response.ok) {
      Object.assign(user.value, editableUser)
      localStorage.setItem('user', JSON.stringify(user.value))
      updateMessage.value = '✅ Perfil actualizado correctamente'
      setTimeout(() => (updateMessage.value = ''), 3000)
    } else {
      alert(data.error || 'Error al actualizar perfil')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error de conexión')
  } finally {
    updating.value = false
  }
}

const changePassword = () => {
  if (passwordData.new !== passwordData.confirm) {
    alert('Las contraseñas no coinciden')
    return
  }
  if (passwordData.new.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres')
    return
  }
  alert('Funcionalidad de cambio de contraseña - implementar en backend')
}

const deleteAccount = () => {
  if (confirm('⚠️ ¿Estás seguro? Esta acción no se puede deshacer.')) {
    alert('Funcionalidad de eliminar cuenta - implementar en backend')
  }
}
</script>
