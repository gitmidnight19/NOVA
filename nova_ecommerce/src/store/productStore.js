import { defineStore } from 'pinia'
import { fetchAllProducts } from '../services/productsApi'

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  actions: {
    async loadProducts() {
      this.loading = true
      this.error = null
      try {
        const data = await fetchAllProducts()
        this.products = data
      } catch (err) {
        this.error = 'Error al obtener los productos.'
      } finally {
        this.loading = false
      }
    },
  },
})
