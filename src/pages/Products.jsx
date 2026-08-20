import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import OrderModal from '../components/OrderModal';
import { ArrowRight } from 'lucide-react';

export default function Products() {
  const { location } = useParams();
  const navigate = useNavigate();
  const decodedLocation = decodeURIComponent(location || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gold/80 hover:text-gold text-sm mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          تغيير المنطقة
        </button>

        <h1 className="text-xl md:text-3xl font-bold text-center mb-8 animate-fade-in">
          مرحبتين حبابك الف في {decodedLocation} ❤️
        </h1>

        {loading && (
          <div className="text-center py-20 text-gold">جاري تحميل العروض...</div>
        )}

        {error && (
          <div className="text-center py-10 text-red-400 bg-red-900/20 rounded-xl p-4">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 text-white/60">
            <p className="text-lg mb-2">مافي عروض حالياً في {decodedLocation}</p>
            <p className="text-sm">جرب منطقة تانية أو ارجع بعد شوية</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOrder={() => setSelectedProduct(p)}
            />
          ))}
        </div>
      </main>

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          location={decodedLocation}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
