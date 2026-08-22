import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import api, { SIZES } from '../utils/api';

export default function OrderModal({ items, location: initialLocation, onClose, onSuccess }) {
  const [step, setStep] = useState(1);

  const [size, setSize] = useState('L');
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    whatsapp: '',
    address: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedImages = items.map((i) => i.imageUrl);
  const selectedState = items[0]?.product?.location || initialLocation || 'الخرطوم';

  const itemsTotal = items.reduce((sum, i) => sum + Number(i.product.price || 0), 0);
  const deliveryFee = items.reduce((max, i) => Math.max(max, Number(i.product.delivery_fee || 0)), 0);
  const grandTotal = itemsTotal + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!form.customer_name.trim() || form.customer_name.trim().length < 2) {
      setError('أكتب اسمك صح');
      return false;
    }
    if (!form.phone.trim() || form.phone.trim().length < 8) {
      setError('أكتب رقم المكالمات صح');
      return false;
    }
    if (!form.whatsapp.trim() || form.whatsapp.trim().length < 8) {
      setError('أكتب رقم الواتساب صح');
      return false;
    }
    if (!form.address.trim() || form.address.trim().length < 5) {
      setError('أكتب العنوان بالتفصيل');
      return false;
    }
    return true;
  };

  const submitOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/orders', {
        product_id: 1,
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        address: form.address.trim(),
        state: selectedState,
        location: selectedState,
        selected_images: selectedImages,
        color: form.notes ? form.notes.trim() : 'غير محدد',
        size: size,
        quantity: items.length,
        delivery_fee: deliveryFee,
        total_price: grandTotal,
      });

      if (res.data.success) {
        setStep(2);
        onSuccess?.();
      } else {
        setError(res.data.message || 'حصلت مشكلة في إرسال الطلب، حاول تاني.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'حصلت مشكلة في إرسال الطلب، حاول تاني.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4">
      <div className="bg-card w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-gold/30 shadow-2xl animate-fade-in">

        <div className="sticky top-0 bg-card border-b border-gold/20 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gold">
            {step === 1 && 'إكمال الطلب'}
            {step === 2 && 'تم استلام طلبك'}
          </h2>
          {step !== 2 && (
            <button onClick={onClose} className="text-white/60 hover:text-white p-1">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-4 md:p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/80 font-medium mb-2">الصور المختارة ({items.length}):</p>
                <div className="grid grid-cols-4 gap-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden aspect-square border border-gold/30">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1.5">المقاس</label>
                <div className="flex flex-wrap gap-1.5">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`px-4 py-1.5 rounded-lg border text-sm font-medium ${
                        size === s ? 'bg-gold text-black border-gold font-bold' : 'border-gold/40 text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  placeholder="الاسم بالكامل"
                  className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="رقم الهاتف (المكالمات)"
                  type="tel"
                  className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                />
                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="رقم الواتساب"
                  type="tel"
                  className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="العنوان السكني بالتفصيل"
                  rows={2}
                  className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold resize-none"
                />
                <input
                  type="text"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="ملاحظات إضافية (اختياري)"
                  className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="bg-black/60 p-3 rounded-xl border border-gold/20 text-sm space-y-1">
                <div className="flex justify-between text-white/70">
                  <span>الولاية:</span>
                  <span className="text-gold font-bold">{selectedState}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>سعر القطع ({items.length}):</span>
                  <span>{itemsTotal.toLocaleString()} ج.س</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>رسوم التوصيل:</span>
                  <span>{deliveryFee.toLocaleString()} ج.س</span>
                </div>
                <div className="flex justify-between text-base border-t border-white/10 pt-1 font-bold text-gold">
                  <span>الإجمالي الكلي:</span>
                  <span>{grandTotal.toLocaleString()} ج.س</span>
                </div>
              </div>

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}

              <button
                type="button"
                onClick={submitOrder}
                disabled={loading || items.length === 0}
                className="w-full bg-gold text-black font-bold py-3.5 rounded-xl hover:bg-gold-light disabled:opacity-60"
              >
                {loading ? 'جاري الإرسال...' : 'تأكيد وإرسال الطلب'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white">تم إرسال طلبك بنجاح! ❤️</h3>
              <p className="text-gold text-lg font-bold">
                الإجمالي: {grandTotal.toLocaleString()} جنيه سوداني
              </p>
              <p className="text-white/70 text-sm">حنتواصل معاك عبر الواتساب أو المكالمات لتأكيد التسليم.</p>
              <button
                onClick={onClose}
                className="mt-4 w-full bg-gold text-black font-bold py-3.5 rounded-xl"
              >
                الرجوع للعروض
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
