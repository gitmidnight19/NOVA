<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-10">
        <!-- Título -->
        <h2 class="text-4xl font-serif text-gray-900 text-center">
          Nuestras colecciones
        </h2>

        <!-- Grid de categorías -->
        <div
          class="mt-10 space-y-12 lg:grid lg:grid-cols-4 lg:space-y-0 lg:gap-x-6"
        >
          <div
            v-for="callout in callouts"
            :key="callout.name"
            class="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
          >
            <!-- Imagen -->
            <img
              :src="callout.imageSrc"
              :alt="callout.imageAlt"
              class="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            />

            <!-- Capa de texto -->
            <div
              class="absolute inset-0 flex items-end justify-center text-center p-4
              bg-gradient-to-t from-black/60 via-transparent to-transparent"
            >
              <h3 class="text-xl font-bold text-white">
                <!-- Navegación dinámica -->
                <RouterLink :to="`/categoria/${callout.name}`">
                  <span class="absolute inset-0" />
                  {{ callout.name }}
                </RouterLink>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

// 🖼️ Importa las imágenes
import anillos from '../assets/Categorys/anillos.webp'
import earcuff from '../assets/Categorys/earcuff.webp'
import collares from '../assets/Categorys/collaresdorado.jpg'
import aretes from '../assets/Categorys/aretes2.webp'

// 📦 Lista de categorías (puedes agregar más si quieres)
const callouts = [
  {
    name: 'Anillos',
    imageSrc: anillos,
    imageAlt: 'Anillos elegantes dorados y plateados.',
  },
  {
    name: 'Earcuffs',
    imageSrc: earcuff,
    imageAlt: 'Colección moderna de earcuffs color pastel.',
  },
  {
    name: 'Collares',
    imageSrc: collares,
    imageAlt: 'Collares dorados sobre fondo beige.',
  },
  {
    name: 'Aretes',
    imageSrc: aretes,
    imageAlt: 'Aretes negros con diseño minimalista.',
  },
]
</script>

<style scoped>
/* Pequeña mejora visual */
.group:hover img {
  filter: brightness(1.1);
}
</style>
