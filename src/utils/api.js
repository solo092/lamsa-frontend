import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsa-backend-7c1lzhoe3-thamer7.vercel.app/api';
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export const LOCATIONS = [
  'بورتسودان',
  'القضارف',
  'عطبرة',
  'دنقلا',
  'الخرطوم',
  'أم درمان',
  'مدني',
  'المناقل',
];

export const SIZES = ['L', 'XL', 'XXL', 'XXXL'];

export const ORDER_STATUSES = [
  'جديد',
  'تم التواصل',
  'تم التأكيد',
  'تم التوصيل',
  'ملغي',
];
