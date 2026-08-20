import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { LOCATIONS } from '../utils/api';
import { MapPin } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const handleLocation = (loc) => {
    navigate(`/products/${encodeURIComponent(loc)}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10 md:py-16 animate-fade-in">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-relaxed">
            مرحبتين حبابك الف ❤️
          </h1>
          <p className="text-gold-light text-base md:text-lg">
            أختار منطقتك وشوف العروض المتوفرة ليك
          </p>
        </div>

        {/* Location Card */}
        <div className="bg-card rounded-2xl border border-gold/30 shadow-lg shadow-gold/5 p-6 md:p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="w-6 h-6 text-gold" />
            <h2 className="text-xl md:text-2xl font-bold text-gold">أختار منطقتك</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocation(loc)}
                className="bg-black/60 hover:bg-gold/20 border border-gold/40 hover:border-gold text-white hover:text-gold rounded-xl py-4 px-3 text-base md:text-lg font-medium active:scale-95 transition-all"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-8">
          أناقتك ... تميزك
        </p>
      </main>
    </div>
  );
}
