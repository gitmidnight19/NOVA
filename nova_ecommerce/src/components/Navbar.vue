<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-purple-600">NOVA</span>
        </router-link>

        <!-- Barra de búsqueda - Desktop -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        <!-- Menu Desktop -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="text-gray-700 hover:text-purple-600 transition">
            Inicio
          </router-link>
          <router-link to="/" class="text-gray-700 hover:text-purple-600 transition">
            Productos
          </router-link>

          <!-- Si es admin -->
          <router-link 
            v-if="authStore.isAdmin" 
            to="/admin" 
            class="text-gray-700 hover:text-purple-600 transition"
          >
            Admin
          </router-link>
        </div>

        <!-- 🔥 ACCIONES (Carrito y Usuario) -->
        <div class="flex items-center space-x-4">
          <!-- Carrito -->
          <router-link to="/cart" class="relative p-2 text-gray-700 hover:text-purple-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span 
              v-if="cartStore.itemCount > 0" 
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            >
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- Usuario autenticado -->
          <div v-if="authStore.isAuthenticated" class="relative" ref="userMenu">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
            >
              <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">
                  {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="hidden md:block">{{ authStore.userName }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div 
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200"
            >
              <router-link 
                to="/profile" 
                @click="showUserMenu = false"
                class="block px-4 py-2 text-gray-800 hover:bg-purple-50 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi Perfil
              </router-link>
              <router-link 
                to="/orders" 
                @click="showUserMenu = false"
                class="block px-4 py-2 text-gray-800 hover:bg-purple-50 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Mis Pedidos
              </router-link>
              <router-link 
                v-if="authStore.isAdmin"
                to="/admin" 
                @click="showUserMenu = false"
                class="block px-4 py-2 text-gray-800 hover:bg-purple-50 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Panel Admin
              </router-link>
              <hr class="my-2">
              <button 
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>

          <!-- Usuario no autenticado -->
          <router-link 
            v-else 
            to="/login"
            class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Ingresar
          </router-link>

          <!-- Botón menú mobile -->
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Barra de búsqueda - Mobile -->
      <div class="md:hidden pb-4">
        <SearchBar />
      </div>

      <!-- Menú Mobile -->
      <div v-if="showMobileMenu" class="md:hidden border-t py-4 space-y-2">
        <router-link 
          to="/" 
          @click="showMobileMenu = false"
          class="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
        >
          Inicio
        </router-link>
        <router-link 
          to="/" 
          @click="showMobileMenu = false"
          class="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
        >
          Productos
        </router-link>
        <router-link 
          v-if="authStore.isAdmin"
          to="/admin" 
          @click="showMobileMenu = false"
          class="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
        >
          Admin
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';
import SearchBar from './SearchBar.vue';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const showUserMenu = ref(false);
const showMobileMenu = ref(false);
const userMenu = ref(null);

const handleLogout = () => {
  authStore.logout();
  showUserMenu.value = false;
  router.push('/');
};

const handleClickOutside = (event) => {
  if (userMenu.value && !userMenu.value.contains(event.target)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>