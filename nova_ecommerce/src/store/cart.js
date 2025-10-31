import { defineStore } from 'pinia';
import api from '../services/api';
import { cartStorage } from '../utils/localStorage';
import { useAuthStore } from './auth';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    synced: false
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    
    total: (state) => state.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0),

    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    // Inicializar carrito
    async initCart() {
      const authStore = useAuthStore();

      if (authStore.isAuthenticated && !this.synced) {
        await this.syncWithServer();
      } else {
        this.items = cartStorage.get();
      }
    },

    // Sincronizar con servidor
    async syncWithServer() {
      try {
        const localCart = cartStorage.get();

        if (localCart.length > 0) {
          await api.syncCart(localCart);
          cartStorage.clear();
        }

        const { data } = await api.getCart();
        this.items = this.formatCartItems(data.cart.items);
        this.synced = true;
      } catch (error) {
        console.error('Error al sincronizar carrito:', error);
        this.items = cartStorage.get();
      }
    },

    // Agregar producto
    async addToCart(product, quantity = 1) {
      const authStore = useAuthStore();

      if (authStore.isAuthenticated) {
        try {
          this.loading = true;
          const { data } = await api.addToCart({
            productId: product._id,
            quantity
          });
          this.items = this.formatCartItems(data.cart.items);
        } catch (error) {
          console.error('Error al agregar al carrito:', error);
          throw error;
        } finally {
          this.loading = false;
        }
      } else {
        this.items = cartStorage.addItem(product, quantity);
      }
    },

    // Actualizar cantidad
    async updateQuantity(productId, quantity) {
      const authStore = useAuthStore();

      if (authStore.isAuthenticated) {
        try {
          this.loading = true;
          const { data } = await api.updateCartItem({ productId, quantity });
          this.items = this.formatCartItems(data.cart.items);
        } catch (error) {
          console.error('Error al actualizar carrito:', error);
        } finally {
          this.loading = false;
        }
      } else {
        this.items = cartStorage.updateQuantity(productId, quantity);
      }
    },

    // Eliminar producto
    async removeItem(productId) {
      const authStore = useAuthStore();

      if (authStore.isAuthenticated) {
        try {
          const { data } = await api.removeFromCart(productId);
          this.items = this.formatCartItems(data.cart.items);
        } catch (error) {
          console.error('Error al eliminar del carrito:', error);
        }
      } else {
        this.items = cartStorage.removeItem(productId);
      }
    },

    // Vaciar carrito
    async clearCart() {
      const authStore = useAuthStore();

      if (authStore.isAuthenticated) {
        try {
          await api.clearCart();
          this.items = [];
        } catch (error) {
          console.error('Error al vaciar carrito:', error);
        }
      } else {
        cartStorage.clear();
        this.items = [];
      }
    },

    // Formatear items del servidor
    formatCartItems(items) {
      return items.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.price,
        image: item.product.image,
        quantity: item.quantity,
        stock: item.product.stock
      }));
    }
  }
});