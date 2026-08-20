import { useEffect, useState } from 'react';
import api from '../utils/api';
import { ShoppingBag, Package, AlertCircle, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/stats')
      .then((res) => {
        if (res.data.success) setStats(res.data.stats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gold">جاري التحميل...</div>;

  const cards = [
    {
      label: 'إجمالي الطلبات',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: 'text-blue-400',
    },
    {
      label: 'الطلبات الجديدة',
      value: stats?.newOrders ?? 0,
      icon: AlertCircle,
      color: 'text-red-400',
      highlight: stats?.newOrders > 0,
    },
    {
      label: 'عدد المنتجات',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'text-green-400',
    },
    {
      label: 'إجمالي المبيعات',
      value: `${Number(stats?.totalSales || 0).toLocaleString()} ج.س`,
      icon: DollarSign,
      color: 'text-gold',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">الرئيسية</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`bg-card border rounded-2xl p-5 ${
              c.highlight ? 'border-red-500/50 animate-pulse' : 'border-gold/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <c.icon className={`w-6 h-6 ${c.color}`} />
              {c.highlight && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                  جديد
                </span>
              )}
            </div>
            <p className="text-white/50 text-sm mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
