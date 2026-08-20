import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    api.get('/products/admin/all')
      .then((res) => {
        if (res.data.success) setProducts(res.data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'فشل الحذف');
    }
  };

  if (loading) return <div className="text-center py-20 text-gold">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gold">المنتجات</h1>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-1.5 bg-gold text-black font-bold px-4 py-2 rounded-xl text-sm"
        >
          <Plus className="w-4 h-4" /> إضافة منتج
        </Link>
      </div>

      {products.length === 0 && (
        <p className="text-white/50 text-center py-10">مافي منتجات لسة</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className={`bg-card border rounded-2xl overflow-hidden ${
              p.is_active ? 'border-gold/20' : 'border-red-500/30 opacity-60'
            }`}
          >
            <div className="aspect-video bg-black/50">
              <img
                src={p.image_urls?.[0] || '/logo.png'}
                alt={p.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white mb-1">{p.name}</h3>
              <p className="text-gold font-bold">{Number(p.price).toLocaleString()} ج.س</p>
              <div className="flex justify-between text-sm text-white/50 mt-1">
                <span>الكمية: {p.quantity}</span>
                <span>{p.location}</span>
              </div>
              {!p.is_active && (
                <span className="text-xs text-red-400 mt-1 block">محذوف</span>
              )}
              <div className="flex gap-2 mt-3">
                <Link
                  to={`/admin/products/edit/${p.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1 border border-gold/40 text-gold py-2 rounded-lg text-sm"
                >
                  <Pencil className="w-3.5 h-3.5" /> تعديل
                </Link>
                {p.is_active && (
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1 border border-red-500/40 text-red-400 py-2 rounded-lg text-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> حذف
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-card border border-gold/30 rounded-2xl p-6 max-w-sm w-full text-center">
            <p className="text-lg mb-6">متأكد داير تحذف المنتج؟</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gold/40 text-gold py-2.5 rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
