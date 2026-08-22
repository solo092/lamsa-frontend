import { useState } from 'react';
import { X, CheckCircle, Minus, Plus, Check } from 'lucide-react';
import api, { SIZES } from '../utils/api';

export default function OrderModal({ product, location: initialLocation, onClose }) {
  const [step, setStep] = useState(1); // 1=Images, 2=Form, 3=Success

  // الولاية وسعر التوصيل محددين مسبقاً من الأدمن على مستوى المنتج نفسه
  const selectedState = product.location || initialLocation || 'الخرطوم';
  const [selectedImages, setSelectedImages] = useState([]);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    whatsapp: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. سعر التوصيل ثابت على مستوى المنتج، حدده الأدمن مسبقاً
  const deliveryFee = Number(product?.delivery_fee || 0);

  // 2. صور المنتج المتاحة
  const productImages = product.image_urls || (product.image_url ? [product.image_url] : []);

  // 3. حساب الإجمالي
  const unitPrice = Number(product.price);
  const itemsTotal = unitPrice * quantity;
  const grandTotal = itemsTotal + deliveryFee;

  const toggleImageSelection = (imgUrl) => {
    if (selectedImages.includes(imgUrl)) {
      setSelectedImages(selectedImages.filter((url) => url !== imgUrl));
    } else {
      setSelectedImages([...selectedImages, imgUrl]);
    }
  };

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
        ...form,
        product_id: product.id,
        state: selectedState,
        location: selectedState,
        selected_images: selectedImages.length > 0 ? selectedImages : productImages,
        color: color || 'حسب الصورة المختارة',
        size,
        quantity,
        delivery_fee: deliveryFee,
        total_price: grandTotal,
      });

      if (res.data.success) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4">
      <div className="bg-card w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-gold/30 shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-gold/20 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gold">
            {step === 1 && '1. اختر الصور المطلوبة'}
            {step === 2 && '2. التفاصيل وإكمال الطلب'}
            {step === 3 && 'تم استلام طلبك'}
          </h2>
          {step !== 3 && (
            <button onClick={onClose} className="text-white/60 hover:text-white p-1">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-4 md:p-6">

          {/* الخطوة 1: اختيار الصور المحددة */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-white/80 font-medium">اضغط على الصور التي تريد طلبها:</p>

              <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
                {productImages.length > 0 ? (
                  productImages.map((imgUrl, idx) => {
                    const isSelected = selectedImages.includes(imgUrl);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleImageSelection(imgUrl)}
                        className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-square ${
                          isSelected ? 'border-gold ring-2 ring-gold' : 'border-white/10 opacity-70'
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-gold text-black p-1 rounded-full shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="col-span-3 text-center text-white/40 py-6">لا توجد صور متعددة متوفرة لهذا المنتج</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-gold text-black font-bold py-3.5 rounded-xl hover:bg-gold-light mt-2"
              >
                تأكيد الصور والمتابعة
              </button>
            </div>
          )}

          {/* الخطوة 2: تحديد اللون والتفاصيل وإرسال الطلب */}
          {step === 2 && (
            <div className="space-y-4">
              
              {/* اختيار اللون والمقاس والكمية */}
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-3">
                
                {/* اللون */}
                <div>
                  <label className="block text-xs text-white/70 mb-1">اللون المطلوب (اختياري)</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="مثال: أسود، أبيض، أو نفس الصورة"
                    className="w-full bg-black/60 border border-gold/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
                  />
                </div>

                {/* المقاس */}
                <div>
                  <label className="block text-xs text-white/70 mb-1">المقاس</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`px-3 py-1 rounded-lg border text-xs font-medium ${
                          size === s ? 'bg-gold text-black border-gold font-bold' : 'border-gold/40 text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* الكمية */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-white/70">الكمية:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-full bg-gold/20 text-gold flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-base font-bold text-white px-2">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.quantity || 10, q + 1))}
                      className="w-7 h-7 rounded-full bg-gold/20 text-gold flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* بيانات العميل */}
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
              </div>

              {/* المجموع والسعر */}
              <div className="bg-black/60 p-3 rounded-xl border border-gold/20 text-sm space-y-1">
                <div className="flex justify-between text-white/70">
                  <span>الولاية المختارة:</span>
                  <span className="text-gold font-bold">{selectedState}</span>
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

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gold/40 text-gold py-3 rounded-xl font-medium"
                >
                  رجوع
                </button>
                <button
                  type="button"
                  onClick={submitOrder}
                  disabled={loading}
                  className="flex-2 bg-gold text-black font-bold py-3 px-6 rounded-xl hover:bg-gold-light disabled:opacity-60"
                >
                  {loading ? 'جاري الإرسال...' : 'تأكيد وإرسال الطلب'}
                </button>
              </div>
            </div>
          )}

          {/* الخطوة 3: النجاح */}
          {step === 3 && (
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
