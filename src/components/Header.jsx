import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="لمسة شبابية"
            className="h-12 w-auto object-contain"
          />
          <span className="text-xl md:text-2xl font-bold text-gold tracking-wide">
            لمسة شبابية
          </span>
        </Link>
      </div>
    </header>
  );
}
