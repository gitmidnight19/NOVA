<template>
  <section 
    class="relative h-screen bg-no-repeat text-center py-16 px-4" 
    :style="{
      backgroundImage: `url(${inicioImage}), url(${inicio2Image}), url(${pauInitImage})`,
      backgroundSize: '33.33% 100%, 33.33% 100%, 33.33% 100%',
      backgroundPosition: 'left top, center top, right top'
    }"
  >
    <div class="absolute inset-0"></div>
    <div class="relative z-10 flex flex-col justify-center items-center h-full text-white">
      <h2 class="text-5xl font-serif">Nueva Colección 2025</h2>
      <p class="mt-4 text-lg font-sans">Joyas hechas a mano con elegancia y amor</p>
      <button class="mt-6 bg-pink-soft bg-pink-200 text-white font-sans px-6 py-2 rounded-md transition-all duration-300 shadow-sm">
        <a @click="irAProductos" href="">Explorar ahora</a>
      </button>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import inicioImage from '../assets/inicio.jpeg';
import inicio2Image from '../assets/inicio2.jpeg';
import pauInitImage from '../assets/pau_init.jpeg';

const router = useRouter()

const irAProductos = () => {
  router.push('/Productos')
};
</script>