import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Products from './pages/Products';
import AdminLogin from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Orders from './admin/Orders';
import ProductsAdmin from './admin/Products';
import ProductForm from './admin/ProductForm';
import ProtectedRoute from './admin/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer */}
          <Route path="/" element={<Home />} />
          <Route path="/products/:location" element={<Products />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
