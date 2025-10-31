<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Menú lateral -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-center mb-6">
            <div class="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-white text-2xl font-bold">
                {{ authStore.user?.name?.charAt(0).toUpperCase() }}
              </span>
            </div>
            <h2 class="font-bold text-lg">{{ authStore.user?.name }}</h2>
            <p class="text-gray-500 text-sm">{{ authStore.user?.email }}</p>
          </div>

          <nav class="space-y-2">
            <button
              @click="activeTab = 'info'"
              :class="[
                'w-full text-left px-4 py-2 rounded-lg transition',
                activeTab === 'info' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
              ]"
            >
              Información Personal
            </button>
            <button
              @click="activeTab = 'password'"
              :class="[
                'w-full text-left px-4 py-2 rounded-lg transition',
                activeTab === 'password' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
              ]"
            >
              Cambiar Contraseña
            </button>
            <router-link
              to="/orders"
              class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Mis Pedidos
            </router-link>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </div>

      <!-- Contenido -->
      <div class="lg:col-span-2">
        <!-- Información Personal -->
        <div v-if="activeTab === 'info'" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-6">Información Personal</h2>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              {{ successMessage }}
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {{ error }}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                v-model="profileForm.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                :value="authStore.user?.email"
                type="email"
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p class="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                v-model="profileForm.address.street"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Calle 123 # 45-67"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  v-model="profileForm.address.city"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <input
                  v-model="profileForm.address.state"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                <input
                  v-model="profileForm.address.zipCode"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">País</label>
                <input
                  v-model="profileForm.address.country"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              <span v-if="loading">Guardando...</span>
              <span v-else>Guardar Cambios</span>
            </button>
          </form>
        </div>

        <!-- Cambiar Contraseña -->
        <div v-if="activeTab === 'password'" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-6">Cambiar Contraseña</h2>

          <form @submit.prevent="changePassword" class="space-y-4">
            <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              {{ successMessage }}
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {{ error }}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              <span v-if="loading">Cambiando...</span>
              <span v-else>Cambiar Contraseña</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import api from '../services/api';

const router = useRouter();
const authStore = useAuthStore();

const activeTab = ref('info');
const loading = ref(false);
const error = ref(null);
const successMessage = ref(null);

const profileForm = ref({
  name: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia'
  }
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

onMounted(() => {
  if (authStore.user) {
    profileForm.value.name = authStore.user.name || '';
    profileForm.value.phone = authStore.user.phone || '';
    if (authStore.user.address) {
      profileForm.value.address = { ...authStore.user.address };
    }
  }
});

const updateProfile = async () => {
  try {
    loading.value = true;
    error.value = null;
    successMessage.value = null;

    await authStore.updateProfile(profileForm.value);
    successMessage.value = 'Perfil actualizado correctamente';

    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (err) {
    error.value = 'Error al actualizar el perfil';
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  try {
    loading.value = true;
    error.value = null;
    successMessage.value = null;

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      error.value = 'Las contraseñas no coinciden';
      loading.value = false;
      return;
    }

    await api.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });

    successMessage.value = 'Contraseña cambiada correctamente';
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al cambiar la contraseña';
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>