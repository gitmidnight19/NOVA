import { defineStore } from 'pinia'

export const useCartStore = defineStore('cartStore', {
  state: () => ({
    items: [],
    isCartOpen: false,
  }),

  getters: {
    // Total de items en el carrito
    cartItemsCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    // Subtotal del carrito
    cartSubtotal: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    // Total formateado
    cartTotal: (state) => {
      const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      return total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })
    },
  },

  actions: {
    // Agregar producto al carrito
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0],
          quantity: 1,
        })
      }

      this.saveToLocalStorage()
    },

    // Remover producto del carrito
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveToLocalStorage()
    },

    // Actualizar cantidad
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = quantity
          this.saveToLocalStorage()
        }
      }
    },

    // Incrementar cantidad
    incrementQuantity(productId) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity++
        this.saveToLocalStorage()
      }
    },

    // Decrementar cantidad
    decrementQuantity(productId) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        if (item.quantity > 1) {
          item.quantity--
        } else {
          this.removeFromCart(productId)
        }
        this.saveToLocalStorage()
      }
    },

    // Limpiar carrito
    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    // Abrir/cerrar carrito
    toggleCart() {
      this.isCartOpen = !this.isCartOpen
    },

    openCart() {
      this.isCartOpen = true
    },

    closeCart() {
      this.isCartOpen = false
    },

    // Guardar en localStorage
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    // Cargar desde localStorage
    loadFromLocalStorage() {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        this.items = JSON.parse(savedCart)
      }
    },
  },
})