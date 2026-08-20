import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { LOCATIONS } from '../utils/api';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    delivery_fee: '', // تم أضافته هنا
    location: LOCATIONS[0],
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`)
        .then((res) => {
          if (res.data.success) {
            const p = res.data.product;
            setForm({
              name: p.name,
              description: p.description || '',
              price: p.price,
              quantity: p.quantity,
              delivery_fee: p.delivery_fee || '', // تم أضافته هنا عند التعديل
              location: p.location,
            });
            setExistingImages(p.image_urls || []);
          }
        })
        .catch(() => setError('المنتج غير موجود'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('quantity', form.quantity);
      formData.append('delivery_fee', form.delivery_fee); // تم إرساله للسيرفر
      formData.append('location', form.location);

      images.forEach((file) => formData.append('images', file));

      if (isEdit && images.length === 0 && existingImages.length > 0) {
        // keep existing
        existingImages.forEach((url) => formData.append('image_urls', url));
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (isEdit) {
        await api.put(`/products/${id}`, formData, config);
      } else {
        await api.post('/products', formData, config);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'حصلت مشكلة في الحفظ');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 text-gold">جاري التحميل...</div>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gold mb-6">
        {isEdit ? 'تعديل المنتج' : 'إضافة منتج'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-white/70 mb-1">اسم المنتج</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">وصف المنتج</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold resize-none"
          />
        </div>

        {/* تم تغيير التقسيم لـ 3 أعمدة ليشمل سعر التوصيل */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">السعر (ج.س)</label>
            <input
              name="price"
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full bg-black/50 border border-gold/30 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">عدد القطع</label>
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              required
              className="w-full bg-black/50 border border-gold/30 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">التوصيل (ج.س)</label>
            <input
              name="delivery_fee"
              type="number"
              min="0"
              placeholder="0"
              value={form.delivery_fee}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gold/30 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">الولاية</label>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">صور المنتج</label>
          {existingImages.length > 0 && images.length === 0 && (
            <div className="flex gap-2 mb-2 flex-wrap">
              {existingImages.map((url, i) => (
                <img key={i} src={url} alt="" className="w-16 h-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gold file:text-black file:font-bold"
          />
          {images.length > 0 && (
            <p className="text-xs text-white/40 mt-1">{images.length} صورة جديدة</p>
          )}
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-black font-bold py-3.5 rounded-xl hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
        </button>
      </form>
    </div>
  );
}
