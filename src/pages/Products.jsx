import { useEffect, useState } from "react";
import { productsAPI } from "../services/api";
import { showToast } from "../utils/toast";
import LoadingSpinner from "../components/LoadingSpinner";

const BRANDS = [
  'Castrol',
  'Motul',
  'Liqui Moly',
  'Mobil',
  'Shell',
  'Petrol Ofisi',
  'Elf',
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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, filters, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.fetchProducts();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Ürün yükleme hatası:', error);
      showToast('Ürünler yüklenirken bir hata oluştu', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Marka filtresi
    if (filters.brand) {
      filtered = filtered.filter(product => product.name === filters.brand);
    }

    // Kategori filtresi
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Fiyat aralığı filtresi
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= Number(filters.maxPrice));
    }

    // Sıralama
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'brand-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'brand-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
    setSortBy('');
  };

  return (
    <div className="min-h-screen bg-luxury-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-playfair text-center mb-12">ÜRÜNLERİMİZ</h1>
        
        {/* Filtreler */}
        <div className="bg-white shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Marka Filtresi */}
            <div>
              <label className="block font-montserrat text-sm text-luxury-600 mb-2">
                MARKA
              </label>
              <select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="w-full p-2 border border-luxury-200 rounded-md"
              >
                <option value="">Tümü</option>
                {BRANDS.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Yağ Türü Filtresi */}
            <div>
              <label className="block font-montserrat text-sm text-luxury-600 mb-2">
                YAĞ TÜRÜ
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-luxury-200 rounded-md"
              >
                <option value="">Tümü</option>
                {OIL_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            
            {/* <div>
              <label className="block font-montserrat text-sm text-luxury-600 mb-2">
                MİNİMUM FİYAT
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full p-2 border border-luxury-200 rounded-md"
                min="0"
              />
            </div>

            
            // <div>
            //   <label className="block font-montserrat text-sm text-luxury-600 mb-2">
            //     MAKSİMUM FİYAT
            //   </label>
            //   <input
            //     type="number"
            //     name="maxPrice"
            //     value={filters.maxPrice}
            //     onChange={handleFilterChange}
            //     className="w-full p-2 border border-luxury-200 rounded-md"
            //     min="0"
            //   />
            // </div>  */}

            {/* Sıralama */}
            <div>
              <label className="block font-montserrat text-sm text-luxury-600 mb-2">
                SIRALAMA
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-luxury-200 rounded-md"
              >
                <option value="">Varsayılan</option>
                {/* <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option> */}
                <option value="brand-asc">Marka (A-Z)</option>
                <option value="brand-desc">Marka (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Filtreleri Temizle */}
          <div className="mt-4 text-right">
            <button
              onClick={clearFilters}
              className="font-montserrat text-sm text-luxury-600 hover:text-luxury-900"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="luxury-card group">
                  <div className="aspect-w-16 aspect-h-9 relative overflow-hidden bg-white">
                    <img
                      src={product.image?.data || "/default-product.jpg"}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-contain p-4 transform group-hover:scale-105 luxury-transition"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-product.jpg";
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-playfair text-xl mb-4">{product.name}</h3>
                    <p className="text-luxury-600 mb-4">{product.description}</p>
                    {/* <div className="flex justify-between items-center">
                      <span className="font-playfair text-xl text-gold-600">
                        {product.price} ₺
                      </span>
                      <span className="text-luxury-600">Stok: {product.stock}</span>
                    </div> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-luxury-600">
                {products.length === 0 ? 'Henüz ürün bulunmamaktadır.' : 'Filtrelere uygun ürün bulunamadı.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
