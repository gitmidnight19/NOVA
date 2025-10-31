// src/services/api.js
// Servicio centralizado para todas las llamadas API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ============================================
// HELPER: Manejo de errores
// ============================================
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error de conexión' }))
    throw new Error(error.error || `Error ${response.status}`)
  }
  return response.json()
}

// ============================================
// HELPER: Headers con autenticación
// ============================================
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  // Registro de usuario
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  // Login con email/password
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    return handleResponse(response)
  },

  // Login con Google
  googleLogin: async (googleData) => {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleData)
    })
    return handleResponse(response)
  },

  // Actualizar perfil
  updateProfile: async (userId, userData) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  // Cambiar contraseña
  changePassword: async (userId, passwordData) => {
    const response = await fetch(`${API_URL}/users/${userId}/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData)
    })
    return handleResponse(response)
  }
}

// ============================================
// PRODUCTS API
// ============================================
export const productsAPI = {
  // Obtener todos los productos
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/products${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url)
    return handleResponse(response)
  },

  // Obtener producto por ID
  getById: async (productId) => {
    const response = await fetch(`${API_URL}/products/${productId}`)
    return handleResponse(response)
  },

  // Crear producto (admin)
  create: async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    })
    return handleResponse(response)
  },

  // Actualizar producto (admin)
  update: async (productId, productData) => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    })
    return handleResponse(response)
  },

  // Eliminar producto (admin)
  delete: async (productId) => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Buscar productos
  search: async (query) => {
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`)
    return handleResponse(response)
  },

  // Filtrar por categoría
  getByCategory: async (category) => {
    const response = await fetch(`${API_URL}/products?category=${encodeURIComponent(category)}`)
    return handleResponse(response)
  }
}

// ============================================
// USERS API (Admin)
// ============================================
export const usersAPI = {
  // Obtener todos los usuarios (admin)
  getAll: async () => {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Obtener usuario por ID
  getById: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Actualizar usuario
  update: async (userId, userData) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  // Eliminar usuario
  delete: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

// ============================================
// ORDERS API
// ============================================
export const ordersAPI = {
  // Obtener pedidos del usuario
  getMyOrders: async () => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Crear pedido
  create: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    })
    return handleResponse(response)
  },

  // Obtener pedido por ID
  getById: async (orderId) => {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Actualizar estado de pedido (admin)
  updateStatus: async (orderId, status) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    })
    return handleResponse(response)
  },

  // Obtener todos los pedidos (admin)
  getAllOrders: async () => {
    const response = await fetch(`${API_URL}/admin/orders`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

// ============================================
// CART API (si usas backend para carrito)
// ============================================
export const cartAPI = {
  // Obtener carrito del usuario
  get: async () => {
    const response = await fetch(`${API_URL}/cart`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Agregar item al carrito
  addItem: async (productId, quantity = 1) => {
    const response = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity })
    })
    return handleResponse(response)
  },

  // Actualizar cantidad de item
  updateItem: async (itemId, quantity) => {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity })
    })
    return handleResponse(response)
  },

  // Eliminar item del carrito
  removeItem: async (itemId) => {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Limpiar carrito
  clear: async () => {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

// ============================================
// STATS API (Admin - Estadísticas)
// ============================================
export const statsAPI = {
  // Obtener estadísticas generales
  getOverview: async () => {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Obtener ventas por período
  getSales: async (period = 'month') => {
    const response = await fetch(`${API_URL}/admin/stats/sales?period=${period}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Obtener productos más vendidos
  getTopProducts: async (limit = 10) => {
    const response = await fetch(`${API_URL}/admin/stats/top-products?limit=${limit}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

// ============================================
// CATEGORIES API
// ============================================
export const categoriesAPI = {
  // Obtener todas las categorías
  getAll: async () => {
    const response = await fetch(`${API_URL}/categories`)
    return handleResponse(response)
  },

  // Crear categoría (admin)
  create: async (categoryData) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData)
    })
    return handleResponse(response)
  },

  // Eliminar categoría (admin)
  delete: async (categoryId) => {
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

// ============================================
// EXPORT DEFAULT (opcional)
// ============================================
export default {
  auth: authAPI,
  products: productsAPI,
  users: usersAPI,
  orders: ordersAPI,
  cart: cartAPI,
  stats: statsAPI,
  categories: categoriesAPI
}