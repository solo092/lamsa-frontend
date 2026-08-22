import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../utils/api';
import OrderModal from '../components/OrderModal';
import { ArrowRight, Check, ShoppingBag } from 'lucide-react';

export default function Products() {
  const { location } = useParams();
  const navigate = useNavigate();
  const decodedLocation = decodeURIComponent(location || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]); // [{ product, imageUrl }]
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (!decodedLocation) {
      navigate('/');
      return;
    }
    setLoading(true);
    api
      .get(`/products/location/${encodeURIComponent(decodedLocation)}`)
      .then((res) => {
        if (res.data.success) setProducts(res.data.products);
        else setError(res.data.message || 'حصلت مشكلة');
      })
      .catch(() => setError('حصلت مشكلة مؤقتة، حاول بعد شوية.'))
      .finally(() => setLoading(false));
  }, [decodedLocation, navigate]);

  // تحويل كل منتجات الولاية إلى معرض صور واحد (كل صورة مرتبطة بمنتجها وسعره)
  const galleryItems = products.flatMap((product) => {
    const images = product.image_urls?.length > 0 ? product.image_urls : ['/logo.png'];
    return images.map((imageUrl, idx) => ({
      key: `${product.id}-${idx}`,
      product,
      imageUrl,
    }));
  });

  const isSelected = (item) =>
    selectedItems.some((s) => s.product.id === item.product.id && s.imageUrl === item.imageUrl);

  const toggleSelect = (item) => {
    if (item.product.quantity <= 0) return;
    setSelectedItems((prev) =>
      isSelected(item)
        ? prev.filter((s) => !(s.product.id === item.product.id && s.imageUrl === item.imageUrl))
        : [...prev, item]
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* شريط "اطلب هسع" ثابت فوق الصفحة، يظهر بس لو في صور متحددة */}
      {selectedItems.length > 0 && (
        <div className="sticky top-0 z-30 bg-gold text-black px-4 py-3 flex items-center justify-between shadow-lg">
          <span className="font-bold text-sm">
            {selectedItems.length} صورة مختارة
          </span>
          <button
            onClick={() => setShowOrderModal(true)}
            className="flex items-center gap-1.5 bg-black text-gold font-bold px-4 py-2 rounded-xl text-sm hover:bg-black/80"
          >
            <ShoppingBag className="w-4 h-4" />
            اطلب هسع
          </button>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gold/80 hover:text-gold text-sm mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          تغيير المنطقة
        </button>

        <h1 className="text-xl md:text-3xl font-bold text-center mb-2 animate-fade-in">
          مرحبتين حبابك الف في {decodedLocation} ❤️
        </h1>
        <p className="text-center text-white/50 text-sm mb-8">
          اضغط على أي صورة عجبتك (تقدر تختار أكتر من صورة)، وبعدين دوس "اطلب هسع" فوق
        </p>

        {loading && (
          <div className="text-center py-20 text-gold">جاري تحميل العروض...</div>
        )}

        {error && (
          <div className="text-center py-10 text-red-400 bg-red-900/20 rounded-xl p-4">
            {error}
          </div>
        )}

        {!loading && !error && galleryItems.length === 0 && (
          <div className="text-center py-16 text-white/60">
            <p className="text-lg mb-2">مافي عروض حالياً في {decodedLocation}</p>
            <p className="text-sm">جرب منطقة تانية أو ارجع بعد شوية</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {galleryItems.map((item) => {
            const outOfStock = item.product.quantity <= 0;
            const selected = isSelected(item);
            return (
              <div key={item.key} className="flex flex-col">
                <div
                  onClick={() => toggleSelect(item)}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all aspect-square ${
                    outOfStock
                      ? 'opacity-40 cursor-not-allowed border-white/10'
                      : selected
                      ? 'border-gold ring-2 ring-gold cursor-pointer'
                      : 'border-white/10 hover:border-gold/50 cursor-pointer'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { e.target.src = '/logo.png'; }}
                  />
                  {selected && (
                    <div className="absolute top-1.5 right-1.5 bg-gold text-black p-1 rounded-full shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                  {outOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-red-400 text-xs font-bold">خلص حالياً</span>
                    </div>
                  )}
                </div>
                <p className="text-white/80 text-xs mt-1.5 line-clamp-1">{item.product.name}</p>
                <p className="text-gold text-xs font-bold">
                  {Number(item.product.price).toLocaleString()} ج.س
                </p>
              </div>
            );
          })}
        </div>
      </main>

      {showOrderModal && (
        <OrderModal
          items={selectedItems}
          location={decodedLocation}
          onClose={() => setShowOrderModal(false)}
          onSuccess={() => setSelectedItems([])}
        />
      )}
    </div>
  );
}
