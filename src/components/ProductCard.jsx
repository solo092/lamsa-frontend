export default function ProductCard({ product, onOrder }) {
  const outOfStock = product.quantity <= 0;
  const image = product.image_urls?.[0] || '/logo.png';

  return (
    <div className="bg-card rounded-2xl border border-gold/20 overflow-hidden shadow-lg shadow-black/40 hover:border-gold/50 transition-all animate-fade-in">
      <div className="aspect-square bg-black/50 overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { e.target.src = '/logo.png'; }}
        />
      </div>
      <div className="p-4">
        {product.location && (
          <p className="text-gold/80 text-xs font-medium mb-1">
            ألف حبابك في ولاية {product.location} ❤️
          </p>
        )}
        <span className="text-gold font-bold text-xl block mb-1">
          {Number(product.price).toLocaleString()} ج.س
        </span>
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="text-white/60 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-end mb-3">
          <span className={`text-sm ${outOfStock ? 'text-red-400' : 'text-white/50'}`}>
            {outOfStock ? 'خلص حالياً' : `متوفر: ${product.quantity}`}
          </span>
        </div>
        <button
          onClick={onOrder}
          disabled={outOfStock}
          className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
            outOfStock
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-gold text-black hover:bg-gold-light active:scale-95 pulse-gold'
          }`}
        >
          {outOfStock ? 'خلص حالياً' : 'أطلب هسع'}
        </button>
      </div>
    </div>
  );
}
