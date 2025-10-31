<template>
  <div class="isolate bg-white-100 px-6 lg:px-8 py-12">
    <div class="mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-lg shadow-pink-200/50">
      <img
        class="mx-auto h-40 w-auto"
        src="\logonova2.jpeg"
        alt="Your Company"
      />
      <!-- Título -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-4xl font-semibold tracking-tight text-balance text-black sm:text-4xl">Crear cuenta</h2>
        <p class="mt-2 text-lg/8 text-gray-600">Únete a nuestra comunidad y disfruta de una experiencia de compra única.</p>
      </div>

      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <!-- Mensaje de éxito -->
      <div v-if="successMessage" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="mt-8 space-y-4">
        <input
          v-model="name"
          type="text"
          placeholder="Nombre"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        
        <input
          v-model="lastName"
          type="text"
          placeholder="Apellido"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <input
          v-model="email"
          type="email"
          placeholder="Correo electrónico"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          required
          minlength="6"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <input
          v-model="phone"
          type="tel"
          placeholder="Número de teléfono"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <input
          v-model="address"
          type="text"
          placeholder="Dirección"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <div class="flex items-center">
          <input
            v-model="agree"
            type="checkbox"
            id="agree"
            required
            class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label for="agree" class="ml-2 block text-sm text-gray-900">
            Acepto los
            <a href="#" class="text-pink-500 hover:underline">términos y condiciones</a>
          </label>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-pink-300 hover:bg-pink-400 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>
      <br>

      <p class="text-sm text-gray-600 text-center">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-pink-500 hover:underline">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      agree: false,
      loading: false,
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async handleRegister() {
      this.errorMessage = '';
      this.successMessage = '';
      this.loading = true;

      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${this.name} ${this.lastName}`,
            email: this.email,
            password: this.password,
            phone: this.phone,
            address: this.address
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Guardar token y usuario en localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          this.successMessage = '¡Cuenta creada con éxito! Redirigiendo...';
          
          // Redirigir a home después de 1.5 segundos
          setTimeout(() => {
            this.$router.push('/');
          }, 1500);
        } else {
          this.errorMessage = data.error || 'Error al crear cuenta.';
        }
      } catch (error) {
        console.error('Error en registro:', error);
        this.errorMessage = 'Error de conexión. Verifica que el servidor esté corriendo.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>