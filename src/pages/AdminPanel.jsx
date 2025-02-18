import { useEffect, useState } from "react";
import { productsAPI, appointmentsAPI } from "../services/api";
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import LoadingSpinner from "../components/LoadingSpinner";

const BRANDS = [
  'Castrol',
  'Motul',
  'Liqui Moly',
  'Mobil',
  'Shell',
  'Petrol Ofisi',
  'Elf',
  'SNC Oil'
];

const OIL_CATEGORIES = [
  '0W-20',
  '0W-30',
  '0W-40',
  '5W-30',
  '5W-40',
  '10W-30',
  '10W-40',
  '10W-60',
  '15W-40',
  '20W-50'
];

const STATUS_OPTIONS = [
  { value: 'Beklemede', label: 'BEKLEMEDE' },
  { value: 'Onaylandı', label: 'ONAYLANDI' },
  { value: 'Tamamlandı', label: 'TAMAMLANDI' }
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [products, setProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
    imagePreview: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'appointments') {
        const response = await appointmentsAPI.getAppointments();
        if (response.data && response.data.data) {
          setAppointments(response.data.data);
        } else {
          setAppointments([]);
        }
      } else {
        const response = await productsAPI.fetchAdminProducts();
        if (response.data && response.data.data) {
          setProducts(response.data.data);
        } else {
          setProducts([]);
        }
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      let errorMessage = 'Veriler yüklenirken bir hata oluştu';
      if (error.message && typeof error.message === 'string' && error.message.includes('bağlanılamıyor')) {
        errorMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
      }
      showToast(errorMessage, 'error');
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach(key => {
        if (key !== 'image' && key !== 'imagePreview') {
          formData.append(key, newProduct[key]);
        }
      });
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      const response = await productsAPI.addProduct(formData);
      if (response.data.success) {
        showToast("Ürün başarıyla eklendi", "success");
        setNewProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          image: null,
          imagePreview: null
        });
        
        // Sayfayı yenile
        window.location.reload();
      }
    } catch (error) {
      console.error("Ürün ekleme hatası:", error);
      showToast(error.response?.data?.message || "Ürün eklenirken bir hata oluştu", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const showConfirmation = () => {
      return new Promise((resolve) => {
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              message: 'Bu ürünü silmek istediğinize emin misiniz?',
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
        const response = await productsAPI.deleteProduct(productId);
        if (response.data.success) {
          showToast('Ürün başarıyla silindi', 'success');
          
          // Sayfayı yenile
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Ürün silme hatası:", error);
      showToast(error.response?.data?.message || "Ürün silinirken bir hata oluştu", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({
        ...newProduct,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
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

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => reject();
    });
  };

  const ProductCard = ({ product }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
      price: product.price,
      stock: product.stock
    });
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async () => {
      try {
        setUpdating(true);
        const response = await productsAPI.updateProduct(product._id, editedProduct);
        
        if (response.data.success) {
          showToast('Ürün başarıyla güncellendi', 'success');
          setIsEditing(false);
          // Sayfayı yenile
          window.location.reload();
        }
      } catch (error) {
        console.error('Ürün güncelleme hatası:', error);
        showToast(error.response?.data?.message || 'Ürün güncellenirken bir hata oluştu', 'error');
      } finally {
        setUpdating(false);
      }
    };

    return (
      <div className="luxury-card group">
        <div className="aspect-w-16 aspect-h-9 relative overflow-hidden bg-white">
          <img
            src={product.image?.data || "/default-product.jpg"}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-product.jpg";
            }}
          />
        </div>
        <div className="p-6">
          <h3 className="font-playfair text-xl mb-4">{product.name}</h3>
          <p className="text-luxury-600 mb-4">{product.description}</p>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block font-montserrat text-sm text-luxury-600 mb-2">
                  FİYAT (₺)
                </label>
                <input
                  type="number"
                  value={editedProduct.price}
                  onChange={(e) => setEditedProduct(prev => ({
                    ...prev,
                    price: Number(e.target.value)
                  }))}
                  className="w-full p-2 border border-luxury-200 rounded-md"
                  min="0"
                />
              </div>
              <div>
                <label className="block font-montserrat text-sm text-luxury-600 mb-2">
                  STOK
                </label>
                <input
                  type="number"
                  value={editedProduct.stock}
                  onChange={(e) => setEditedProduct(prev => ({
                    ...prev,
                    stock: Number(e.target.value)
                  }))}
                  className="w-full p-2 border border-luxury-200 rounded-md"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-montserrat text-luxury-600 hover:text-luxury-900"
                  disabled={updating}
                >
                  İPTAL
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm font-montserrat bg-luxury-900 text-white hover:bg-luxury-800 rounded"
                  disabled={updating}
                >
                  {updating ? 'GÜNCELLENİYOR...' : 'GÜNCELLE'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <span className="font-playfair text-xl text-gold-600">
                  {product.price} ₺
                </span>
                <span className="text-luxury-600 ml-4">
                  Stok: {product.stock}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-luxury-600 hover:text-luxury-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
          // Sayfayı yenile
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Randevu silme hatası:", error);
      showToast(error.response?.data?.message || "Randevu silinirken bir hata oluştu", "error");
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Beklemede': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Onaylandı': 'bg-blue-100 text-blue-800 border-blue-200',
      'Tamamlandı': 'bg-green-100 text-green-800 border-green-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const AppointmentRow = ({ appointment, onRefresh }) => {
    const handleStatusChange = async (e) => {
      try {
        const response = await appointmentsAPI.updateAppointment(appointment._id, {
          status: e.target.value
        });
        
        if (response.data.success) {
          showToast('Randevu durumu güncellendi', 'success');
          onRefresh(); // Listeyi yenile
        }
      } catch (error) {
        console.error('Durum güncelleme hatası:', error);
        showToast('Durum güncellenirken bir hata oluştu', 'error');
      }
    };

    return (
      <tr key={appointment._id} className="hover:bg-luxury-50">
        <td className="px-6 py-4">
          <div className="font-montserrat text-luxury-900">
            {appointment.name}
            {appointment.isGuest && (
              <span className="ml-2 text-xs text-luxury-600">(Misafir)</span>
            )}
          </div>
          <div className="text-sm text-luxury-600">{appointment.email}</div>
          <div className="text-sm text-luxury-600">{appointment.phone}</div>
        </td>
        <td className="px-6 py-4 font-montserrat text-luxury-900">
          {new Date(appointment.date).toLocaleString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </td>
        <td className="px-6 py-4 font-montserrat text-luxury-900">
          {appointment.service}
        </td>
        <td className="px-6 py-4">
          <select
            value={appointment.status}
            onChange={handleStatusChange}
            className={`w-full px-3 py-2 rounded-md border ${getStatusStyle(appointment.status)} font-montserrat text-sm`}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
    );
  };

  return (
    <div className="min-h-screen bg-luxury-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow-xl">
          <div className="bg-luxury-950 text-white py-8 px-6">
            <h1 className="font-playfair text-3xl text-center">YÖNETİM PANELİ</h1>
          </div>

    <div className="p-6">
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => handleTabChange('appointments')}
                className={`px-8 py-3 font-montserrat tracking-wider ${
                  activeTab === 'appointments'
                    ? 'bg-luxury-900 text-white'
                    : 'bg-luxury-100 text-luxury-900'
                } luxury-transition`}
              >
                RANDEVULAR
              </button>
              <button
                onClick={() => handleTabChange('products')}
                className={`px-8 py-3 font-montserrat tracking-wider ${
                  activeTab === 'products'
                    ? 'bg-luxury-900 text-white'
                    : 'bg-luxury-100 text-luxury-900'
                } luxury-transition`}
              >
                ÜRÜNLER
              </button>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {activeTab === 'appointments' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-luxury-900 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-montserrat text-sm tracking-wider">MÜŞTERİ BİLGİLERİ</th>
                          <th className="px-6 py-4 text-left font-montserrat text-sm tracking-wider">RANDEVU TARİHİ</th>
                          <th className="px-6 py-4 text-left font-montserrat text-sm tracking-wider">HİZMET</th>
                          <th className="px-6 py-4 text-left font-montserrat text-sm tracking-wider">DURUM</th>
                          <th className="px-6 py-4 text-left font-montserrat text-sm tracking-wider">İŞLEMLER</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-luxury-200">
                        {appointments.map((appointment) => (
                          <AppointmentRow 
                            key={appointment._id} 
                            appointment={appointment} 
                            onRefresh={fetchData}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-luxury-50 p-6">
                      <h2 className="font-playfair text-2xl mb-6">YENİ ÜRÜN EKLE</h2>
                      <form onSubmit={handleAddProduct} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                              MARKA
                            </label>
                            <select
                              required
                              value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                              className="luxury-input w-full"
                            >
                              <option value="">Marka Seçiniz</option>
                              {BRANDS.map((brand) => (
                                <option key={brand} value={brand}>
                                  {brand}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                              YAĞ TÜRÜ
                            </label>
                            <select
                              required
                              value={newProduct.category}
                              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                              className="luxury-input w-full"
                            >
                              <option value="">Yağ Türü Seçiniz</option>
                              {OIL_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                              FİYAT
                            </label>
                            <input
                              type="number"
                              required
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                              className="luxury-input w-full"
                            />
                          </div>
                          <div>
                            <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                              STOK
                            </label>
                            <input
                              type="number"
                              required
                              value={newProduct.stock}
                              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                              className="luxury-input w-full"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                              AÇIKLAMA
                            </label>
                            <textarea
                              required
                              rows={3}
                              value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                              className="luxury-input w-full"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block font-montserrat text-sm font-medium text-luxury-800 mb-2">
                              ÜRÜN FOTOĞRAFI
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="luxury-input w-full"
                            />
                            {newProduct.imagePreview && (
                              <img
                                src={newProduct.imagePreview}
                                alt="Önizleme"
                                className="mt-2 h-32 w-32 object-cover rounded"
                              />
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <button 
                            type="submit" 
                            className="luxury-button"
                            disabled={submitting}
                          >
                            {submitting ? (
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                EKLENIYOR...
                              </div>
                            ) : (
                              'ÜRÜN EKLE'
                            )}
        </button>
                        </div>
      </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {Array.isArray(products) && products.length > 0 ? (
                        products.map((product) => (
                          <ProductCard key={product._id} product={product} />
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8 text-luxury-600">
                          Henüz ürün bulunmamaktadır.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
