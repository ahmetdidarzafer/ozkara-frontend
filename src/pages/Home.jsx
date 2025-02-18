import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/luxury-car.jpg')" }}
        ></div>
        <div className="relative z-20 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6">
              ÖZKARA MADENİ YAĞLAR
            </h1>
            <p className="font-montserrat text-xl md:text-2xl mb-12 tracking-wide">
              Aracınız İçin En İyi Bakım ve Yağ Değişimi
            </p>
            <Link
              to="/appointment"
              className="inline-block bg-gold-500 text-luxury-950 px-12 py-4 text-lg font-montserrat tracking-wider hover:bg-gold-600 luxury-transition"
            >
              RANDEVU AL
            </Link>
          </div>
        </div>
      </section>

      {/* Hizmetler Section */}
      <section className="py-24 bg-luxury-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="luxury-heading text-4xl text-center mb-16">PREMİUM HİZMETLERİMİZ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="luxury-card p-8">
              <div className="text-gold-500 mb-6">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl mb-4">Motor Bakımı</h3>
              <p className="text-luxury-600">
                En son teknoloji ve uzman ekibimizle motorunuzun performansını maksimum seviyede tutuyoruz.
              </p>
            </div>
            <div className="luxury-card p-8">
              <div className="text-gold-500 mb-6">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl mb-4">Performans Ayarları</h3>
              <p className="text-luxury-600">
                Aracınızın performansını en üst seviyeye çıkarmak için özel ayarlamalar yapıyoruz.
              </p>
            </div>
            <div className="luxury-card p-8">
              <div className="text-gold-500 mb-6">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl mb-4">Detaylı Bakım</h3>
              <p className="text-luxury-600">
                Aracınızın her detayına özen göstererek kapsamlı bakım hizmeti sunuyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler Section */}
      <section className="py-24 bg-luxury-950 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="font-playfair text-5xl text-gold-500 mb-4">25+</div>
              <p className="font-montserrat tracking-wider">YILLIK DENEYİM</p>
            </div>
            <div className="text-center">
              <div className="font-playfair text-5xl text-gold-500 mb-4">1000+</div>
              <p className="font-montserrat tracking-wider">MUTLU MÜŞTERİ</p>
            </div>
            <div className="text-center">
              <div className="font-playfair text-5xl text-gold-500 mb-4">100%</div>
              <p className="font-montserrat tracking-wider">MÜŞTERİ MEMNUNİYETİ</p>
            </div>
            <div className="text-center">
              <div className="font-playfair text-5xl text-gold-500 mb-4">24/7</div>
              <p className="font-montserrat tracking-wider">TEKNİK DESTEK</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
