import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.reload();
  };

  return (
    <nav className="bg-luxury-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-playfair text-2xl tracking-wider">ÖZKARA MADENİ YAĞLAR</span>
            </Link>
            
            {/* Desktop Menü */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="font-montserrat text-sm tracking-wider hover:text-gold-400 luxury-transition">
                ANA SAYFA
              </Link>
              <Link to="/products" className="font-montserrat text-sm tracking-wider hover:text-gold-400 luxury-transition">
                ÜRÜNLER
              </Link>
              {userRole !== 'admin' && (
                <Link to="/appointment" className="font-montserrat text-sm tracking-wider hover:text-gold-400 luxury-transition">
                  RANDEVU
                </Link>
              )}
              {userRole === 'admin' && (
                <Link to="/admin" className="font-montserrat text-sm tracking-wider hover:text-gold-400 luxury-transition">
                  YÖNETİM PANELİ
                </Link>
              )}
            </div>
          </div>

          {/* Sağ Menü */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="font-montserrat text-sm tracking-wider hover:text-gold-400 luxury-transition">
                  GİRİŞ YAP
                </Link>
                <Link to="/register" className="font-montserrat text-sm tracking-wider bg-gold-500 text-luxury-950 px-4 py-2 hover:bg-gold-600 luxury-transition">
                  KAYIT OL
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-luxury-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {userRole !== 'admin' ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-luxury-900 hover:bg-luxury-50"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          PROFİL BİLGİLERİM
                        </Link>
                        <Link
                          to="/appointments"
                          className="block px-4 py-2 text-sm text-luxury-900 hover:bg-luxury-50"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          RANDEVULARIM
                        </Link>
                      </>
                    ) : null}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-luxury-900 hover:bg-luxury-50"
                    >
                      ÇIKIŞ YAP
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobil menü butonu */}
          <div className="md:hidden">
            <button 
              className="text-white focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-luxury-900`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            className="block px-3 py-2 text-sm font-montserrat tracking-wider hover:bg-luxury-800 luxury-transition"
            onClick={() => setIsOpen(false)}
          >
            ANA SAYFA
          </Link>
          <Link 
            to="/products" 
            className="block px-3 py-2 text-sm font-montserrat tracking-wider hover:bg-luxury-800 luxury-transition"
            onClick={() => setIsOpen(false)}
          >
            ÜRÜNLER
          </Link>
          {userRole !== 'admin' && (
            <Link 
              to="/appointment" 
              className="block px-3 py-2 text-sm font-montserrat tracking-wider hover:bg-luxury-800 luxury-transition"
              onClick={() => setIsOpen(false)}
            >
              RANDEVU
            </Link>
          )}
          {!isAuthenticated ? (
            <>
              <Link 
                to="/login" 
                className="block px-3 py-2 text-sm font-montserrat tracking-wider hover:bg-luxury-800 luxury-transition"
                onClick={() => setIsOpen(false)}
              >
                GİRİŞ YAP
              </Link>
              <Link 
                to="/register" 
                className="block px-3 py-2 text-sm font-montserrat tracking-wider hover:bg-luxury-800 luxury-transition"
                onClick={() => setIsOpen(false)}
              >
                KAYIT OL
              </Link>
            </>
          ) : (
            <>
              {isAuthenticated && userRole !== 'admin' && (
                <>
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 text-sm font-montserrat tracking-wider hover:bg-luxury-800 luxury-transition"
                    onClick={() => setIsOpen(false)}
                  >
                    PROFİL BİLGİLERİM
                  </Link>
                  <Link 
                    to="/appointments" 
                    className="block px-3 py-2 text-sm font-montserrat tracking-wider hover:bg-luxury-800 luxury-transition"
                    onClick={() => setIsOpen(false)}
                  >
                    RANDEVULARIM
                  </Link>
                </>
              )}
              {userRole === 'admin' && (
                <Link to="/admin" className="block px-3 py-2 text-sm font-montserrat tracking-wider hover:bg-luxury-800 luxury-transition">
                  YÖNETİM PANELİ
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-montserrat tracking-wider hover:bg-luxury-800 luxury-transition text-white"
                >
                  ÇIKIŞ YAP
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
