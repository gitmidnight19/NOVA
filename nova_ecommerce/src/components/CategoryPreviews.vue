<template>
  <div class="bg-white shadow-md px-8 py-2">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-10">
        <h2
          class="text-4xl font-serif text-gray-900 mb-10 text-center duration-500 hover:scale-110"
        >
          Colecciones
        </h2>

        <!-- Grid de categorías -->
        <div
          class="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 h-[700px]"
        >
          <div
            v-for="(callout, idx) in callouts"
            :key="callout.name"
            @click="irACategoria(callout.apiCategory)"
            class="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
            :class="{
              'sm:row-span-2 sm:col-span-2': idx === 0,
            }"
          >
            <!-- Imagen -->
            <img
              :src="callout.imageSrc"
              :alt="callout.imageAlt"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <!-- Capa oscura -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition"
            ></div>

            <!-- Texto -->
            <div class="absolute bottom-6 left-6 z-10">
              <h3 class="text-white text-2xl font-bold drop-shadow-lg">
                {{ callout.name }}
              </h3>
              <a
                class="inline-block bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100"
              >
                Explorar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// 🖼️ Imágenes
import Anillos from '../assets/Categorys/Anillos.jpg'
import Collares from '../assets/Categorys/Collares.jpg'
import Earcuff from '../assets/Categorys/Earcuff.jpg'

const router = useRouter()

// 🧭 Navega a la ruta con la categoría seleccionada
const irACategoria = (categoria) => {
  router.push(`/categoria/${categoria}`)
}

// 📦 Lista de colecciones (usa los nombres reales de la API dummyjson)
const callouts = [
  {
    name: 'Anillos',
    imageSrc: Anillos,
    imageAlt: 'Foto de anillos elegantes',
    apiCategory: 'mens-watches', // categoría real de dummyjson
  },
  {
    name: 'Earcuffs',
    imageSrc: Earcuff,
    imageAlt: 'Colección moderna de earcuffs',
    apiCategory: 'womens-jewellery',
  },
  {
    name: 'Collares',
    imageSrc: Collares,
    imageAlt: 'Collares dorados sobre fondo beige',
    apiCategory: 'womens-dresses',
  },
]
</script>

<style scoped>
.group:hover img {
  filter: brightness(1.1);
}
</style>
