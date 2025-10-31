// src/composables/useAuth.js
import { ref, computed } from 'vue';

// Estado global compartido (fuera de la función para que persista)
const user = ref(null);
const token = ref(null);
const isAuthenticated = ref(false);

// Inicializar desde localStorage INMEDIATAMENTE
const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

if (savedToken && savedUser) {
  try {
    token.value = savedToken;
    user.value = JSON.parse(savedUser);
    isAuthenticated.value = true;
    console.log('✅ Usuario cargado desde localStorage:', user.value);
  } catch (error) {
    console.error('❌ Error parseando usuario:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export function useAuth() {
  // Login
  const login = (userData, authToken) => {
    console.log('🔐 Ejecutando login con:', userData);
    
    user.value = userData;
    token.value = authToken;
    isAuthenticated.value = true;
    
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('✅ Login completado. isAuthenticated:', isAuthenticated.value);
    console.log('✅ User role:', user.value?.role);
  };

  // Logout
  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('✅ Sesión cerrada');
  };

  // Verificar si es admin
  const isAdmin = computed(() => {
    const result = user.value?.role === 'admin';
    console.log('🔍 isAdmin computed:', result, 'User:', user.value);
    return result;
  });

  // Obtener headers con token
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    };
  };

  // Recargar usuario (útil después de actualizaciones)
  const loadUser = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken;
        user.value = JSON.parse(savedUser);
        isAuthenticated.value = true;
        console.log('✅ Usuario recargado:', user.value);
      } catch (error) {
        console.error('❌ Error recargando usuario:', error);
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    getAuthHeaders,
    loadUser
  };
}