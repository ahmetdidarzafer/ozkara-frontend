// filepath: /d:/Development/Web Development/Ozkara-Motor-Yaglari/frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { showToast } from '../utils/toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(formData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('userData', JSON.stringify({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          role: response.data.user.role
        }));
        
        // Kullanıcı rolüne göre yönlendirme
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
        // Sayfayı yenile
        window.location.reload();
        showToast('Giriş başarılı', 'success');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
      showToast(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-3xl text-luxury-900">GİRİŞ YAP</h2>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
              E-POSTA
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="luxury-input w-full"
            />
          </div>

          <div>
            <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
              ŞİFRE
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="luxury-input w-full"
            />
          </div>

          <div>
            <button type="submit" className="luxury-button w-full">
              GİRİŞ YAP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;