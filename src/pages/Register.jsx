// filepath: /d:/Development/Web Development/Ozkara-Motor-Yaglari/frontend/src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { showToast } from '../utils/toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      showToast('Şifreler eşleşmiyor', 'error');
      return;
    }

    try {
      const response = await authAPI.register(formData);
      if (response.data.success) {
        showToast('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
        navigate('/login');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;

      // Eğer hata mesajı "kayıtlı bir hesap" içeriyorsa
      if (errorMessage === 'Bu e-posta adresi ile kayıtlı bir hesap bulunmaktadır') {
        setError('Bu e-posta adresi ile kayıtlı bir hesap bulunmaktadır.');
        showToast(
          <div className="space-y-2">
            <p>Bu e-posta adresi ile kayıtlı bir hesap bulunmaktadır.</p>
            <Link 
              to="/login" 
              className="text-white underline hover:text-gold-400 block text-center"
            >
              Giriş yapmak için tıklayın
            </Link>
          </div>,
          'warning'
        );
      } else {
        setError(errorMessage || 'Kayıt olurken bir hata oluştu');
        showToast(errorMessage || 'Kayıt olurken bir hata oluştu', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-luxury-50 py-24">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white shadow-xl">
          <div className="bg-luxury-950 text-white py-8 px-6">
            <h2 className="font-playfair text-3xl text-center">KAYIT OL</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700">{error}</p>
                {error.includes('kayıtlı bir hesap') && (
                  <Link 
                    to="/login"
                    className="text-luxury-900 underline hover:text-luxury-600 block mt-2"
                  >
                    Giriş yapmak için tıklayın
                  </Link>
                )}
              </div>
            )}

            <div>
              <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                AD SOYAD
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="luxury-input w-full"
              />
            </div>

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
                TELEFON
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                ŞİFRE TEKRAR
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="luxury-input w-full"
              />
            </div>

            <div>
              <button type="submit" className="luxury-button w-full">
                KAYIT OL
              </button>
            </div>

            <div className="text-center text-sm text-luxury-600">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-luxury-900 hover:text-luxury-600 underline">
                Giriş yapın
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;