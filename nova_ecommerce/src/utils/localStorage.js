const CART_KEY = 'nova_cart';

export const cartStorage = {
  get() {
    try {
      const cart = localStorage.getItem(CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error al leer carrito:', error);
      return [];
    }
  },

  set(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar carrito:', error);
    }
  },

  clear() {
    localStorage.removeItem(CART_KEY);
  },

  addItem(product, quantity = 1) {
    const cart = this.get();
    const existingItem = cart.find(item => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
    }

    this.set(cart);
    return cart;
  },

  updateQuantity(productId, quantity) {
    let cart = this.get();
    
    if (quantity === 0) {
      cart = cart.filter(item => item.productId !== productId);
    } else {
      const item = cart.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    }

    this.set(cart);
    return cart;
  },

  removeItem(productId) {
    const cart = this.get().filter(item => item.productId !== productId);
    this.set(cart);
    return cart;
  }
};