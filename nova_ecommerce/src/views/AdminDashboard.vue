<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Admin -->
    <div class="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-8 shadow-lg">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Panel de Administración</h1>
        <p class="text-pink-100 mt-1">Bienvenida, {{ user?.name }}</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Total Productos</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.totalProducts }}</p>
            </div>
            <div class="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-pink-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Usuarios Registrados</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.totalUsers }}</p>
            </div>
            <div class="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-purple-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Ventas Este Mes</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">${{ stats.salesThisMonth.toLocaleString() }}</p>
            </div>
            <div class="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-green-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="flex flex-wrap border-b border-gray-200">
          <button
            @click="activeTab = 'products'"
            :class="activeTab === 'products' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'text-gray-600 hover:bg-gray-50'"
            class="px-6 py-4 font-semibold transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            Productos
          </button>
          <button
            @click="activeTab = 'users'"
            :class="activeTab === 'users' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'text-gray-600 hover:bg-gray-50'"
            class="px-6 py-4 font-semibold transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Usuarios
          </button>
          <button
            @click="activeTab = 'stats'"
            :class="activeTab === 'stats' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'text-gray-600 hover:bg-gray-50'"
            class="px-6 py-4 font-semibold transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Estadísticas
          </button>
        </div>

        <div class="p-6">
          <!-- Tab: Productos -->
          <div v-if="activeTab === 'products'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
              <button
                @click="showAddProduct = true"
                class="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Agregar Producto
              </button>
            </div>

            <!-- Lista de productos -->
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Imagen</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Precio</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="product in products" :key="product._id" class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4">
                      <img :src="product.images[0] || '/placeholder.jpg'" alt="" class="w-20 h-20 object-cover rounded-lg">
                    </td>
                    <td class="px-6 py-4">
                      <p class="font-medium text-gray-800">{{ product.title }}</p>
                      <p class="text-sm text-gray-500">{{ product.category }}</p>
                    </td>
                    <td class="px-6 py-4 text-lg font-bold text-gray-800">${{ product.price }}</td>
                    <td class="px-6 py-4">
                      <span 
                        :class="product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                        class="px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ product.active ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-2">
                        <button @click="editProduct(product)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button @click="deleteProduct(product._id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab: Usuarios -->
          <div v-if="activeTab === 'users'">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Usuarios Registrados</h2>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rol</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Registro</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="u in users" :key="u._id" class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 font-medium text-gray-800">{{ u.name }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ u.email }}</td>
                    <td class="px-6 py-4">
                      <span 
                        :class="u.role === 'admin' ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'"
                        class="px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ u.role === 'admin' ? 'Administrador' : 'Usuario' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(u.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab: Estadísticas -->
          <div v-if="activeTab === 'stats'">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Estadísticas de Ventas</h2>
            
            <!-- Filtros -->
            <div class="bg-gray-50 p-4 rounded-xl mb-6">
              <div class="flex flex-wrap gap-4">
                <button
                  @click="statsFilter = 'week'"
                  :class="statsFilter === 'week' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
                  class="px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                  Esta Semana
                </button>
                <button
                  @click="statsFilter = 'month'"
                  :class="statsFilter === 'month' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
                  class="px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                  Este Mes
                </button>
                <button
                  @click="statsFilter = 'year'"
                  :class="statsFilter === 'year' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
                  class="px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                  Este Año
                </button>
                <button
                  @click="downloadStats"
                  class="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Descargar Reporte
                </button>
              </div>
            </div>

            <!-- Métricas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                <p class="text-blue-100 text-sm mb-2">Ventas Totales</p>
                <p class="text-4xl font-bold">${{ salesStats.total.toLocaleString() }}</p>
                <p class="text-blue-200 text-sm mt-2">{{ statsFilter === 'week' ? 'Esta semana' : statsFilter === 'month' ? 'Este mes' : 'Este año' }}</p>
              </div>

              <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <p class="text-green-100 text-sm mb-2">Productos Vendidos</p>
                <p class="text-4xl font-bold">{{ salesStats.productsSold }}</p>
                <p class="text-green-200 text-sm mt-2">Unidades</p>
              </div>

              <div class="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg">
                <p class="text-purple-100 text-sm mb-2">Pedidos Completados</p>
                <p class="text-4xl font-bold">{{ salesStats.orders }}</p>
                <p class="text-purple-200 text-sm mt-2">Transacciones</p>
              </div>
            </div>

            <!-- Gráfico Simulado -->
            <div class="bg-white border border-gray-200 rounded-xl p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Ventas por día</h3>
              <div class="h-64 flex items-end justify-around gap-2">
                <div v-for="(day, index) in chartData" :key="index" class="flex-1 flex flex-col items-center">
                  <div 
                    :style="{ height: (day.sales / 1000 * 100) + '%' }"
                    class="w-full bg-gradient-to-t from-pink-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                  ></div>
                  <span class="text-xs text-gray-600 mt-2 font-medium">{{ day.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Agregar Producto (SIN STOCK) -->
    <div v-if="showAddProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 flex justify-between items-center rounded-t-2xl">
          <h3 class="text-2xl font-bold">Agregar Nuevo Producto</h3>
          <button @click="showAddProduct = false" class="text-white hover:text-gray-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="createProduct" class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Título del producto</label>
            <input 
              v-model="newProduct.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Precio ($)</label>
            <input 
              v-model.number="newProduct.price"
              type="number"
              step="0.01"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <textarea 
              v-model="newProduct.description"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              placeholder="Describe el producto..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">URL de la imagen</label>
            <input 
              v-model="newProduct.imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
            <input 
              v-model="newProduct.category"
              type="text"
              placeholder="Ej: Accesorios, Joyería, Ropa"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>

          <div class="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
            <input 
              v-model="newProduct.active"
              type="checkbox"
              id="active"
              class="w-5 h-5 text-pink-500 focus:ring-pink-400 border-gray-300 rounded"
            />
            <label for="active" class="text-sm font-medium text-gray-700">Producto activo (visible en la tienda)</label>
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="button"
              @click="showAddProduct = false"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 shadow-lg"
            >
              {{ creating ? 'Creando...' : 'Crear Producto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
// ✅ IMPORTAR LOS SERVICIOS API
import { productsAPI, usersAPI } from '@/services/api';

const { user, isAdmin } = useAuth();
const router = useRouter();

const activeTab = ref('products');
const showAddProduct = ref(false);
const creating = ref(false);
const statsFilter = ref('month');

const stats = reactive({
  totalProducts: 0,
  totalUsers: 0,
  salesThisMonth: 0,
  pendingOrders: 0
});

const products = ref([]);
const users = ref([]);

const salesStats = reactive({
  total: 12450,
  productsSold: 234,
  orders: 89
});

const chartData = ref([
  { label: 'Lun', sales: 450 },
  { label: 'Mar', sales: 680 },
  { label: 'Mié', sales: 520 },
  { label: 'Jue', sales: 890 },
  { label: 'Vie', sales: 1200 },
  { label: 'Sáb', sales: 980 },
  { label: 'Dom', sales: 750 }
]);

const newProduct = reactive({
  title: '',
  price: 0,
  description: '',
  imageUrl: '',
  category: '',
  active: true
});

onMounted(async () => {
  if (!isAdmin.value) {
    alert('⛔ Acceso denegado. Solo administradores.');
    router.push('/');
    return;
  }

  await loadProducts();
  await loadUsers();
  await loadStats();
});

// ✅ USAR productsAPI.getAll() en lugar de fetch directo
const loadProducts = async () => {
  try {
    const data = await productsAPI.getAll();
    products.value = data;
    stats.totalProducts = data.length;
  } catch (error) {
    console.error('Error cargando productos:', error);
    alert('Error al cargar productos: ' + error.message);
  }
};

// ✅ USAR usersAPI.getAll() en lugar de fetch directo
const loadUsers = async () => {
  try {
    const data = await usersAPI.getAll();
    users.value = data;
    stats.totalUsers = data.length;
  } catch (error) {
    console.error('Error cargando usuarios:', error);
    alert('Error al cargar usuarios: ' + error.message);
  }
};

// ✅ USAR statsAPI para obtener estadísticas (cuando implementes el endpoint)
const loadStats = async () => {
  try {
    // Cuando implementes el endpoint en el backend:
    // const data = await statsAPI.getOverview();
    // stats.salesThisMonth = data.salesThisMonth;
    // stats.pendingOrders = data.pendingOrders;
    
    // Por ahora, valores fijos:
    stats.salesThisMonth = 12450;
    stats.pendingOrders = 15;
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
};

// ✅ USAR productsAPI.create() en lugar de fetch directo
const createProduct = async () => {
  creating.value = true;

  try {
    const productData = {
      title: newProduct.title,
      price: newProduct.price,
      description: newProduct.description,
      images: newProduct.imageUrl ? [newProduct.imageUrl] : [],
      category: newProduct.category,
      stock: 999, // Stock por defecto (no visible para el usuario)
      active: newProduct.active
    };

    await productsAPI.create(productData);
    
    alert('✅ Producto creado exitosamente');
    showAddProduct.value = false;
    await loadProducts();
    
    // Limpiar formulario
    Object.keys(newProduct).forEach(key => {
      newProduct[key] = key === 'active' ? true : (key === 'price' ? 0 : '');
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Error al crear producto: ' + error.message);
  } finally {
    creating.value = false;
  }
};

const editProduct = (product) => {
  alert(`Editar producto: ${product.title}\n(Próximamente)`);
  // TODO: Implementar modal de edición usando productsAPI.update()
};

// ✅ USAR productsAPI.delete() en lugar de fetch directo
const deleteProduct = async (productId) => {
  if (!confirm('¿Estás segura de eliminar este producto?')) return;

  try {
    await productsAPI.delete(productId);
    alert('✅ Producto eliminado');
    await loadProducts();
  } catch (error) {
    console.error('Error:', error);
    alert('Error al eliminar producto: ' + error.message);
  }
};

const downloadStats = () => {
  const csvContent = `Reporte de Ventas - ${statsFilter.value}\n\n` +
    `Ventas Totales: ${salesStats.total}\n` +
    `Productos Vendidos: ${salesStats.productsSold}\n` +
    `Pedidos: ${salesStats.orders}\n\n` +
    `Día,Ventas\n` +
    chartData.value.map(d => `${d.label},${d.sales}`).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reporte-ventas-${statsFilter.value}-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
</script>