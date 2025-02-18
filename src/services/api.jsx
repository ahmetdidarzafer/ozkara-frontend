import axios from "axios";

const API_URL = 'https://ozkara-backend.onrender.com/api'; // Backend URL

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Kullanıcı giriş fonksiyonu
export const loginUser = async (email, password) => {
  return api.post("/auth/login", { email, password });
};

// Kullanıcı kayıt fonksiyonu
export const registerUser = async (name, email, password) => {
  return api.post("/auth/register", { name, email, password });
};

// Tüm ürünleri getir
export const fetchProducts = async () => {
  return api.get("/products");
};

// Admin için randevuları getir
export const fetchAppointments = async (token) => {
  return api.get("/appointments", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
