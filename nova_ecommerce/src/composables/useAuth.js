// src/composables/useAuth.js
import { ref, computed, watch } from 'vue'

// ============================================
// ESTADO GLOBAL (compartido entre componentes)
// ============================================
const user = ref(null)
const token = ref(null)
const loading = ref(false)

// ============================================
// INICIALIZAR desde localStorage
// ============================================
function initAuth() {
  const savedToken = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')

  if (savedToken && savedUser) {
    try {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      console.log('✅ Usuario restaurado:', user.value)
    } catch (error) {
      console.error('❌ Error al restaurar usuario:', error)
      clearAuth()
    }
  }
}

// Inicializar al cargar el módulo
initAuth()

// ============================================
// LIMPIAR autenticación
// ============================================
function clearAuth() {
  user.value = null
  token.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// ============================================
// COMPOSABLE
// ============================================
export function useAuth() {
  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')

  // ============================================
  // LOGIN
  // ============================================
  function login(userData, userToken) {
    try {
      console.log('🔐 Iniciando sesión con:', userData)
      
      // Guardar en estado reactivo
      user.value = userData
      token.value = userToken

      // Guardar en localStorage
      localStorage.setItem('token', userToken)
      localStorage.setItem('user', JSON.stringify(userData))

      console.log('✅ Login exitoso, usuario:', user.value)
      console.log('✅ Token guardado:', !!token.value)
      console.log('✅ isAuthenticated:', isAuthenticated.value)
      
      return true
    } catch (error) {
      console.error('❌ Error en login:', error)
      return false
    }
  }

  // ============================================
  // LOGOUT
  // ============================================
  function logout() {
    console.log('👋 Cerrando sesión...')
    clearAuth()
    return true
  }

  // ============================================
  // VERIFICAR SI HAY SESIÓN ACTIVA
  // ============================================
  function checkAuth() {
    return isAuthenticated.value
  }

  // ============================================
  // RETURN
  // ============================================
  return {
    // Estado
    user,
    token,
    loading,
    
    // Computed
    isAuthenticated,
    isAdmin,
    userName,
    userEmail,
    
    // Métodos
    login,
    logout,
    checkAuth
  }
}