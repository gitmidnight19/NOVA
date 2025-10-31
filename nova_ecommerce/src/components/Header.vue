<template>
  <header class="sticky top-0 z-50 flex items-center justify-between bg-white shadow-md shadow-pink-100/50 px-8 py-2">
    <!-- Logo -->
    <div class="w-3/12">
      <router-link to="/">
        <img 
          :src="logo" 
          alt="Logo Nova" 
          class="h-12 w-auto object-contain"
        />
      </router-link>
    </div>

    <!-- Navegación -->
    <nav class="nav font-semibold text-lg">
      <ul class="flex space-x-6">
        <li>
          <router-link 
            to="/" 
            class="hover:text-primary-hover transition"
            active-class="text-pink-500"
          >
            Inicio
          </router-link>
        </li>
        <li>
          <router-link 
            to="/productos" 
            class="hover:text-primary-hover transition"
            active-class="text-pink-500"
          >
            Productos
          </router-link>
        </li>
        <li>
          <router-link 
            to="/colecciones" 
            class="hover:text-primary-hover transition"
            active-class="text-pink-500"
          >
            Colecciones
          </router-link>
        </li>
        <li>
          <router-link 
            to="/sale" 
            class="hover:text-primary-hover transition"
            active-class="text-pink-500"
          >
            Sale
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Iconos -->
    <div class="w-3/12 flex justify-end items-center space-x-4">
      
      <!-- Login -->
      <button 
        @click="login" 
        class="hover:text-primary-hover transition-colors relative group" 
        title="Iniciar sesión"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor" 
          class="size-6"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" 
          />
        </svg>
      </button>

      <!-- Buscar -->
      <button 
        @click="buscar" 
        class="hover:text-primary-hover transition-colors relative group cursor-pointer"
        aria-label="Buscar"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor" 
          class="size-6"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" 
          />
        </svg>
      </button>

      <!-- Carrito con Badge -->
      <button 
        @click="toggleCart" 
        class="hover:text-primary-hover transition-colors relative group cursor-pointer"
        aria-label="Abrir carrito"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor" 
          class="size-6"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
          />
        </svg>
        
        <!-- Badge con cantidad de items -->
        <span
          v-if="cartStore.cartItemsCount > 0"
          class="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
        >
          {{ cartStore.cartItemsCount }}
        </span>
      </button>

      <!-- Contacto -->
      <button 
        @click="info" 
        class="hover:text-primary-hover transition-colors relative group cursor-pointer"
        aria-label="Contacto"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor" 
          class="size-6"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" 
          />
        </svg>
      </button>

    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '../store/cartStore.js'
import logo from '../assets/logo_nova.png'

const router = useRouter()
const cartStore = useCartStore()

const login = () => {
  router.push('/login')
}

const buscar = () => {
  router.push('/buscar')
}

const toggleCart = () => {
  // Abrir el drawer del carrito en lugar de navegar
  cartStore.toggleCart()
}

const info = () => {
  router.push('/contacto')
}
</script>

<style scoped>
/* Animación del badge */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>