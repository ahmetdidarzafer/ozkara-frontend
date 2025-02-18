import { useState, useEffect } from "react";
import { appointmentsAPI } from "../services/api";
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import LoadingSpinner from "../components/LoadingSpinner";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from 'date-fns/locale/tr';
// react-hot-toast yerine alert kullanacağız şimdilik
// import { toast } from "react-hot-toast";

// Türkçe lokalizasyonu kaydet
registerLocale('tr', tr);

const TimePickerPopup = ({ isOpen, onClose, onSelect, selectedTime, bookedTimes }) => {
  const availableTimes = [];
  for (let hour = 9; hour <= 18; hour++) {
    availableTimes.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-none shadow-xl max-w-md w-full">
        <h3 className="font-playfair text-xl mb-4 text-luxury-900">RANDEVU SAATİ SEÇİN</h3>
        <div className="grid grid-cols-3 gap-3">
          {availableTimes.map((time) => {
            const isBooked = bookedTimes.includes(time);
            return (
              <button
                key={time}
                onClick={() => {
                  if (!isBooked) {
                    onSelect(time);
                    onClose();
                  }
                }}
                disabled={isBooked}
                className={`p-3 text-sm font-montserrat tracking-wider
                  ${isBooked 
                    ? 'bg-gold-100 text-luxury-400 cursor-not-allowed'
                    : time === selectedTime 
                      ? 'bg-gold-500 text-white' 
                      : 'bg-luxury-50 text-luxury-900 hover:bg-luxury-100'
                  }
                  transition-colors duration-200`}
              >
                {time}
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-luxury-900 text-white py-2 px-4 font-montserrat text-sm tracking-wider hover:bg-luxury-800 transition-colors"
        >
          KAPAT
        </button>
      </div>
    </div>
  ) : null;
};

const Appointment = () => {
  const [formData, setFormData] = useState({
    date: null,
    time: '',
    service: '',
    notes: '',
    // Misafir kullanıcı bilgileri
    guestInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Dolu randevuları getir
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await appointmentsAPI.getBookedDates();
        setFormData(prev => ({
          ...prev,
          date: response.data.dates.map(date => new Date(date))[0]
        }));
      } catch (error) {
        console.error('Dolu tarihler yüklenemedi:', error);
      }
    };
    fetchBookedDates();
  }, []);

  // Tarih filtreleme fonksiyonu
  const filterDate = (date) => {
    // Pazar günlerini filtrele
    if (date.getDay() === 0) return false;
    
    // Dolu günleri filtrele
    const isBooked = formData.date && formData.date.toDateString() === date.toDateString();
    
    return !isBooked;
  };

  // Özel takvim stilleri
  const calendarClassName = "luxury-calendar";
  const customStyles = `
    .luxury-calendar {
      font-family: 'Montserrat', sans-serif;
      border: none;
      border-radius: 0;
    }
    .luxury-calendar .react-datepicker__header {
      background-color: #1a1a1a;
      border: none;
      color: white;
    }
    .luxury-calendar .react-datepicker__current-month {
      color: white;
      font-family: 'Playfair Display', serif;
    }
    .luxury-calendar .react-datepicker__day-name {
      color: white;
    }
    .luxury-calendar .react-datepicker__day--selected {
      background-color: #ffad1a;
      color: #1a1a1a;
    }
    .luxury-calendar .react-datepicker__day--disabled {
      color: #ffad1a;
      text-decoration: line-through;
    }
    .luxury-calendar .react-datepicker__day:hover {
      background-color: #f7f7f7;
    }
  `;

  // Seçilen tarihteki dolu saatleri getir
  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (formData.date) {
        try {
          const response = await appointmentsAPI.getBookedTimes(formData.date.toISOString());
          if (response.data.success) {
            console.log('Dolu saatler:', response.data.times); // Debug için
            setBookedTimes(response.data.times || []);
          }
        } catch (error) {
          console.error('Dolu saatler yüklenemedi:', error);
          setBookedTimes([]);
        }
      }
    };
    fetchBookedTimes();
  }, [formData.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let appointmentData = {
        date: formData.date,
        time: formData.time,
        service: formData.service,
        notes: formData.notes
      };

      // API endpoint'i kullanıcının durumuna göre seç
      const endpoint = isAuthenticated ? '/appointments' : '/appointments/guest';

      // Eğer misafir kullanıcı ise bilgileri ekle
      if (!isAuthenticated) {
        appointmentData = {
          ...appointmentData,
          isGuest: true,
          guestInfo: formData.guestInfo
        };
      }

      const response = await appointmentsAPI.createAppointment(appointmentData, endpoint);

      if (response.data.success) {
        showToast('Randevunuz başarıyla oluşturuldu', 'success');
        // Formu sıfırla
        setFormData({
          date: null,
          time: '',
          service: '',
          notes: '',
          guestInfo: {
            name: '',
            email: '',
            phone: ''
          }
        });
      }
    } catch (error) {
      console.error('Randevu oluşturma hatası:', error);
      showToast(error.response?.data?.message || 'Randevu oluşturulurken bir hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-50 py-24">
      <style>{customStyles}</style>
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white shadow-xl">
          <div className="bg-luxury-950 text-white py-8 px-6">
            <h2 className="font-playfair text-3xl text-center">RANDEVU AL</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Misafir Kullanıcı Bilgileri - Sadece giriş yapmamış kullanıcılar için */}
            {!isAuthenticated && (
              <div className="space-y-4">
                <h3 className="font-playfair text-xl text-luxury-900">İLETİŞİM BİLGİLERİ</h3>
                <div>
                  <label className="block font-montserrat text-sm text-luxury-600 mb-2">
                    AD SOYAD
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestInfo.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      guestInfo: { ...formData.guestInfo, name: e.target.value }
                    })}
                    className="luxury-input w-full"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-sm text-luxury-600 mb-2">
                    E-POSTA
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.guestInfo.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      guestInfo: { ...formData.guestInfo, email: e.target.value }
                    })}
                    className="luxury-input w-full"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-sm text-luxury-600 mb-2">
                    TELEFON
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.guestInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      guestInfo: { ...formData.guestInfo, phone: e.target.value }
                    })}
                    className="luxury-input w-full"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                  HİZMET
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="luxury-input w-full"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Motor Bakımı">Motor Bakımı</option>
                  <option value="Performans Ayarları">Performans Ayarları</option>
                  <option value="Detaylı Bakım">Detaylı Bakım</option>
                  <option value="Yağ Değişimi">Yağ Değişimi</option>
                </select>
              </div>

              <div>
                <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                  TARİH
                </label>
                <DatePicker
                  selected={formData.date}
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, date: date }));
                  }}
                  filterDate={filterDate}
                  minDate={new Date()}
                  locale="tr"
                  dateFormat="dd MMMM yyyy"
                  calendarClassName={calendarClassName}
                  placeholderText="Tarih Seçiniz"
                  className="luxury-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                  SAAT
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.time}
                    onClick={() => setIsTimePickerOpen(true)}
                    readOnly
                    placeholder="Saat Seçiniz"
                    className="luxury-input w-full cursor-pointer"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                NOTLAR
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="luxury-input w-full h-32 resize-none"
                placeholder="Araç bilgileri ve özel isteklerinizi belirtebilirsiniz."
              ></textarea>
            </div>

            <div className="text-center pt-6">
              <button 
                type="submit" 
                className="luxury-button w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    GÖNDERİLİYOR...
                  </div>
                ) : (
                  'RANDEVU AL'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <TimePickerPopup
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        onSelect={(time) => setFormData({ ...formData, time })}
        selectedTime={formData.time}
        bookedTimes={bookedTimes}
      />
    </div>
  );
};

export default Appointment;
