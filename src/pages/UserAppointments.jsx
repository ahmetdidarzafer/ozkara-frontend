import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../services/api';
import { showToast } from '../utils/toast';
import LoadingSpinner from '../components/LoadingSpinner';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAppointments();
  }, []);

  const fetchUserAppointments = async () => {
    try {
      const response = await appointmentsAPI.getUserAppointments();
      setAppointments(response.data.data);
    } catch (error) {
      setError('Randevular yüklenirken bir hata oluştu');
      console.error('Randevu yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    const showConfirmation = () => {
      return new Promise((resolve) => {
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              message: 'Bu randevuyu silmek istediğinize emin misiniz?',
              type: 'warning',
              duration: 0,
              actions: [
                {
                  text: 'EVET',
                  onClick: () => resolve(true)
                },
                {
                  text: 'HAYIR',
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
        const response = await appointmentsAPI.deleteAppointment(appointmentId);
        if (response.data.success) {
          showToast('Randevu başarıyla silindi', 'success');
          fetchUserAppointments();
        }
      }
    } catch (error) {
      console.error("Randevu silme hatası:", error);
      showToast(error.response?.data?.message || "Randevu silinirken bir hata oluştu", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Beklemede': 'bg-yellow-100 text-yellow-800',
      'Onaylandı': 'bg-blue-100 text-blue-800',
      'Tamamlandı': 'bg-green-100 text-green-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
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
          <div className="bg-luxury-950 text-white py-8 px-6">
            <h2 className="font-playfair text-3xl text-center">RANDEVULARIM</h2>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-luxury-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-montserrat text-sm tracking-wider">TARİH</th>
                    <th className="px-6 py-4 text-left font-montserrat text-sm tracking-wider">HİZMET</th>
                    <th className="px-6 py-4 text-left font-montserrat text-sm tracking-wider">DURUM</th>
                    <th className="px-6 py-4 text-left font-montserrat text-sm tracking-wider">NOTLAR</th>
                    <th className="px-6 py-4 text-left font-montserrat text-sm tracking-wider">İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-200">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-luxury-600">
                        Henüz randevunuz bulunmamaktadır.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-luxury-50">
                        <td className="px-6 py-4 font-montserrat text-luxury-900">
                          {formatDate(appointment.date)}
                        </td>
                        <td className="px-6 py-4 font-montserrat text-luxury-900">
                          {appointment.service}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-montserrat font-medium rounded-full ${getStatusStyle(appointment.status)}`}>
                            {appointment.status || 'Beklemede'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-montserrat text-luxury-600">
                          {appointment.notes || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteAppointment(appointment._id)}
                            className="text-red-600 hover:text-red-900 font-montserrat text-sm luxury-transition"
                          >
                            SİL
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAppointments; 