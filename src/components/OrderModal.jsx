import { useState } from 'react';
import { X, CheckCircle, Minus, Plus } from 'lucide-react';
import api, { SIZES } from '../utils/api';

export default function OrderModal({ product, location, onClose }) {
  const [step, setStep] = useState(1); // 1=form, 2=summary, 3=success
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('L');
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    whatsapp: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  const maxQty = Math.min(product.quantity, 10);
  const unitPrice = Number(product.price);
  const deliveryFee = Number(product.delivery_fee || 0);
  const itemsTotal = unitPrice * quantity;
  const grandTotal = itemsTotal + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
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

  const goToSummary = () => {
    if (validate()) setStep(2);
  };

  const submitOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/orders', {
        ...form,
        product_id: product.id,
        size,
        quantity,
        location,
        delivery_fee: deliveryFee,
        total_price: grandTotal,
      });
      if (res.data.success) {
        setOrderResult(res.data.order);
        setStep(3);
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

  const image = product.image_urls?.[0] || '/logo.png';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4">
      <div className="bg-card w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-gold/30 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-gold/20 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gold">
            {step === 1 && 'أكتب بياناتك'}
            {step === 2 && 'ملخص الطلب'}
            {step === 3 && 'تم استلام طلبك'}
          </h2>
          {step !== 3 && (
            <button onClick={onClose} className="text-white/60 hover:text-white p-1">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-4 md:p-6">
          {/* Product info always visible on step 1-2 */}
          {step < 3 && (
            <div className="flex gap-3 mb-5 bg-black/40 rounded-xl p-3">
              <img src={image} alt="" className="w-20 h-20 rounded-lg object-cover" />
              <div>
                <p className="font-bold text-white">{product.name}</p>
                <p className="text-gold font-bold">{unitPrice.toLocaleString()} ج.س</p>
                <p className="text-white/50 text-sm">متوفر: {product.quantity}</p>
              </div>
            </div>
          )}

          {/* STEP 1: Form */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm text-white/70 mb-1">الكمية</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm text-white/70 mb-2">المقاس</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 rounded-xl border font-medium ${
                        size === s
                          ? 'bg-gold text-black border-gold'
                          : 'border-gold/40 text-white hover:border-gold'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fields */}
              <div>
                <label className="block text-sm text-white/70 mb-1">الاسم</label>
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  placeholder="أكتب اسمك"
                  className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">رقم المكالمات</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="أكتب رقم تلفونك"
                  type="tel"
                  className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">رقم الواتساب</label>
                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="أكتب رقم الواتساب"
                  type="tel"
                  className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">السكن / العنوان</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="أكتب مكان السكن أو العنوان بالتفصيل"
                  rows={3}
                  className="w-full bg-black/50 border border-gold/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold resize-none"
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                onClick={goToSummary}
                className="w-full bg-gold text-black font-bold py-3.5 rounded-xl hover:bg-gold-light active:scale-[0.98]"
              >
                متابعة
              </button>
            </div>
          )}

          {/* STEP 2: Summary */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="bg-black/40 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">الولاية</span>
                  <span className="font-medium">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">العرض</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">المقاس</span>
                  <span className="font-medium">{size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">الكمية</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">السعر</span>
                  <span className="font-medium">{itemsTotal.toLocaleString()} ج.س</span>
                </div>
                <div className="flex justify-between text-gold/90">
                  <span className="text-white/60">سعر التوصيل</span>
                  <span className="font-medium">{deliveryFee.toLocaleString()} ج.س</span>
                </div>
                <div className="border-t border-gold/20 pt-2 flex justify-between text-base">
                  <span className="text-gold font-bold">الإجمالي</span>
                  <span className="text-gold font-bold">{grandTotal.toLocaleString()} جنيه سوداني</span>
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-4 text-sm space-y-1">
                <p><span className="text-white/60">الاسم:</span> {form.customer_name}</p>
                <p><span className="text-white/60">المكالمات:</span> {form.phone}</p>
                <p><span className="text-white/60">واتساب:</span> {form.whatsapp}</p>
                <p><span className="text-white/60">العنوان:</span> {form.address}</p>
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gold/40 text-gold py-3 rounded-xl font-medium"
                >
                  رجوع
                </button>
                <button
                  onClick={submitOrder}
                  disabled={loading}
                  className="flex-1 bg-gold text-black font-bold py-3 rounded-xl hover:bg-gold-light disabled:opacity-60"
                >
                  {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">تم استلام طلبك بنجاح ❤️</h3>
              <p className="text-gold text-lg font-bold">
                الإجمالي: {grandTotal.toLocaleString()} جنيه سوداني
              </p>
              <p className="text-white/70">حنتواصل معاك في أقرب وقت ممكن.</p>
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