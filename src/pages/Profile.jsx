import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { showToast } from '../utils/toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    const token = localStorage.getItem('token');

    if (!userDataStr || !token) {
      navigate('/login');
      return;
    }

    setUserData(JSON.parse(userDataStr));
    setLoading(false);
  }, [navigate]);

  const handleDeleteAccount = async () => {
    const showConfirmation = () => {
      return new Promise((resolve) => {
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              message: 'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
              type: 'warning',
              duration: 0,
              actions: [
                {
                  text: 'EVET, SİL',
                  onClick: () => resolve(true)
                },
                {
                  text: 'VAZGEÇ',
                  onClick: () => resolve(false)
                }
              ]
            }
          })
        );
      });
    };

    try {
      const confirmed = await showConfirmation();
      if (confirmed) {
        const response = await authAPI.deleteAccount();
        if (response.data.success) {
          showToast('Hesabınız başarıyla silindi', 'success');
          // Kullanıcı verilerini temizle
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userData');
          // Ana sayfaya yönlendir
          navigate('/');
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Hesap silme hatası:", error);
      showToast(error.response?.data?.message || "Hesap silinirken bir hata oluştu", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white shadow-xl p-8">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-50 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow-xl">
          {/* Profil Başlığı */}
          <div className="bg-luxury-950 text-white py-8 px-6">
            <h2 className="font-playfair text-3xl text-center">PROFİL BİLGİLERİM</h2>
          </div>

          {/* Kullanıcı Bilgileri */}
          <div className="p-8">
            <div className="space-y-4">
              <div>
                <label className="block font-montserrat text-sm text-luxury-600">AD SOYAD</label>
                <p className="font-montserrat text-luxury-900">{userData?.name}</p>
              </div>
              <div>
                <label className="block font-montserrat text-sm text-luxury-600">E-POSTA</label>
                <p className="font-montserrat text-luxury-900">{userData?.email}</p>
              </div>
              <div>
                <label className="block font-montserrat text-sm text-luxury-600">TELEFON</label>
                <p className="font-montserrat text-luxury-900">{userData?.phone}</p>
              </div>
            </div>
          </div>

          {/* Hesap Silme Bölümü */}
          <div className="border-t border-luxury-200 mt-12 pt-8 px-8 pb-8">
            <h3 className="font-playfair text-2xl text-red-600 mb-4">Hesabı Sil</h3>
            <p className="font-montserrat text-sm text-luxury-600 mb-6">
              Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-6 py-3 font-montserrat text-sm tracking-wider hover:bg-red-700 transition-colors"
            >
              HESABI SİL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 