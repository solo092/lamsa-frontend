import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  ShoppingBag,
  Package,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const links = [
  { to: '/admin', end: true, icon: Home, label: 'الرئيسية' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'الطلبات' },
  { to: '/admin/products', icon: Package, label: 'المنتجات' },
  { to: '/admin/products/add', icon: PlusCircle, label: 'إضافة منتج' },
];

export default function AdminLayout() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-card border-l border-gold/20 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-10" />
            <span className="font-bold text-gold text-sm">لمسة شبابية</span>
          </div>
          <button className="lg:hidden text-white/60" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {links.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gold/20 text-gold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gold/20">
          <p className="text-xs text-white/40 px-4 mb-2 truncate">{admin?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-black/95 border-b border-gold/10 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gold">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-gold">لوحة التحكم</span>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
