import axios from 'axios';

// API instance oluştur
const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
  timeout: 30000, // 30 saniyeye çıkardık
  headers: {
    'Content-Type': 'application/json'
  }
});

// Cache kontrolü için interceptor
api.interceptors.request.use(
  (config) => {
    // Cache kontrolünü header yerine query param olarak ekleyelim
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Debug için
    console.log('API İsteği:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData gönderiliyorsa Content-Type header'ını kaldır
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Admin rotaları için özel kontrol
    if (config.url.includes('/products') && 
       (config.method === 'post' || config.method === 'delete' || 
        config.url === '/api/products/admin')) {
      if (!token) {
        throw new Error('Yetkilendirme gerekli');
      }
    }

    return config;
  },
  (error) => {
    console.error('API İstek Hatası:', error);
    return Promise.reject(error);
  }
);

// Retry fonksiyonu - daha kısa süreler
const retryRequest = async (fn, retries = 2, delay = 500) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay);
  }
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Yanıt Hatası:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Özel hata mesajları
    if (!error.response) {
      return Promise.reject(new Error('Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar deneyin.'));
    }

    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      window.location.href = '/login';
      return Promise.reject(new Error('Oturum süreniz doldu, lütfen tekrar giriş yapın'));
    }

    return Promise.reject(error.response.data?.message || error.message);
  }
);

// Cache için
const cache = new Map();

// Auth işlemleri için fonksiyonlar
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  deleteAccount: () => api.delete('/auth/delete-account')
};

// Ürün işlemleri için fonksiyonlar
export const productsAPI = {
  fetchProducts: async () => {
    const cacheKey = 'products';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const response = await api.get('/products');
    cache.set(cacheKey, response);
    
    // 5 dakika sonra cache'i temizle
    setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
    
    return response;
  },
  
  fetchAdminProducts: async () => {
    const cacheKey = 'adminProducts';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const response = await api.get('/products/admin');
    cache.set(cacheKey, response);
    
    // 1 dakika sonra cache'i temizle
    setTimeout(() => cache.delete(cacheKey), 60 * 1000);
    
    return response;
  },
  
  // Admin işlemleri
  addProduct: (formData) => api.post('/products', formData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
};

// Randevu işlemleri için fonksiyonlar
export const appointmentsAPI = {
  createAppointment: (data, endpoint = '/appointments') => api.post(endpoint, data),
  getAppointments: () => api.get('/appointments'),
  getUserAppointments: () => api.get('/appointments/user'),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  getBookedDates: () => api.get('/appointments/booked-dates'),
  getBookedTimes: (date) => api.get(`/appointments/booked-times?date=${date}`)
};

export default api; 