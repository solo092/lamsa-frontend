import { useEffect, useState } from 'react';
import api, { ORDER_STATUSES } from '../utils/api';
import { Phone, MessageCircle, Trash2, RotateCcw } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = () => {
    api.get('/orders')
      .then((res) => {
        if (res.data.success) setOrders(res.data.orders);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await api.put(`/orders/${id}/status`, { status });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'فشل التحديث');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      const res = await api.delete(`/orders/${id}`);
      if (res.data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'فشل حذف الطلب');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('تنبيه: هل أنت متأكد من تصفير كافة الطلبات والعدادات؟')) return;
    try {
      const res = await api.delete('/orders/clear-all');
      if (res.data.success) {
        setOrders([]);
        alert('تم تصفير جميع العدادات والطلبات بنجاح!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'فشل التصفير');
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('ar-SD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (d) => {
    return new Date(d).toLocaleTimeString('ar-SD', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <div className="text-center py-20 text-gold">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gold">الطلبات</h1>
        {orders.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-600/40 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <RotateCcw className="w-4 h-4" /> تصفير جميع العدادات والطلبات
          </button>
        )}
      </div>

      {orders.length === 0 && (
        <p className="text-white/50 text-center py-10">مافي طلبات لسة</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`bg-card border rounded-2xl p-4 md:p-5 ${
              order.status === 'جديد' ? 'border-red-500/50' : 'border-gold/20'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {order.status === 'جديد' && (
                  <span className="text-red-400 text-sm font-bold">🔴 طلب جديد</span>
                )}
                <span className="text-white/40 text-sm">#{order.id}</span>
              </div>
              <div className="text-white/40 text-xs">
                {formatDate(order.created_at)} — {formatTime(order.created_at)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-4">
              <p><span className="text-white/50">الاسم:</span> {order.customer_name}</p>
              <p><span className="text-white/50">المنطقة:</span> {order.location}</p>
              <p><span className="text-white/50">المنتج:</span> {order.product_name_snapshot}</p>
              <p><span className="text-white/50">المقاس:</span> {order.size}</p>
              <p><span className="text-white/50">الكمية:</span> {order.quantity}</p>
              <p><span className="text-white/50">السعر:</span> {Number(order.unit_price).toLocaleString()} ج.س</p>
              <p className="sm:col-span-2">
                <span className="text-white/50">الإجمالي:</span>{' '}
                <span className="text-gold font-bold">{Number(order.total_price).toLocaleString()} ج.س</span>
              </p>
              <p className="sm:col-span-2">
                <span className="text-white/50">العنوان:</span> {order.address}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <a
                href={`tel:${order.phone}`}
                className="inline-flex items-center gap-1.5 bg-green-600/20 text-green-400 border border-green-600/40 px-3 py-1.5 rounded-lg text-sm"
              >
                <Phone className="w-4 h-4" /> اتصال
              </a>
              <a
                href={`https://wa.me/${order.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 px-3 py-1.5 rounded-lg text-sm"
              >
                <MessageCircle className="w-4 h-4" /> واتساب
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gold/10">
              <div className="flex items-center gap-2">
                <span className="text-white/50 text-sm">الحالة:</span>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  disabled={updating === order.id}
                  className="bg-black border border-gold/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gold"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {updating === order.id && <span className="text-xs text-gold">جاري...</span>}
              </div>

              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="inline-flex items-center gap-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> حذف الطلب
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}