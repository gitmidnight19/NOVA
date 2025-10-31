import axios from "axios";

const API_URL = "http://localhost:3000/api/products"; // 👈 Backend local

// 🔹 Obtener todos los productos
export async function fetchAllProducts() {
  try {
    const response = await axios.get(API_URL);
    // El backend devuelve un array de productos directamente
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
}

// 🔹 Obtener un solo producto por ID
export async function fetchProductById(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
}
