import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-gold/30 rounded-2xl p-6 shadow-xl">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-16 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gold">لوحة التحكم</h1>
          <p className="text-white/50 text-sm">لمسة شبابية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">الإيميل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-gold-light disabled:opacity-60"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
