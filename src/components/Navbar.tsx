"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  UserCheck
} from "lucide-react";
import { useCart, useFavorites } from "@/lib/store";
import { useCatalog } from "@/components/CatalogProvider";
import { formatPrice, whatsappUrl } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { categories, settings } = useCatalog();
  const { items, open: openCart } = useCart();
  const { ids: favIds } = useFavorites();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = items.reduce(
    (sum, item) => sum + (item.unitPrice + (item.customization?.extraPrice ?? 0)) * item.quantity,
    0
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner Bar */}
      <div className="bg-[#060D1A] text-white text-xs py-2 px-4 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-hidden text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <Truck className="w-3.5 h-3.5" /> Envíos a todo Colombia
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Calidad 1:1 garantizada
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Personaliza con tu nombre y número
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <Link 
              href={whatsappUrl(settings.whatsapp || "573213831679", "¡Hola J&A Mundo Fútbol! 👋 Tengo una consulta sobre las camisetas.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-slate-300"
            >
              WhatsApp: <span className="text-white font-semibold">321 383 1679</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link 
              href="/admin" 
              className="text-cyan-400/80 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
            >
              <UserCheck className="w-3 h-3" /> Panel Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className={`w-full transition-all duration-300 ${
          scrolled 
            ? "bg-[#0B1528]/95 backdrop-blur-md shadow-xl py-2.5 border-b border-cyan-500/30" 
            : "bg-[#0B1528] py-3.5 border-b border-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-cyan-400 p-0.5 bg-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Image 
                src="/logo.jpg" 
                alt="J&A Mundo Fútbol Logo" 
                width={48} 
                height={48} 
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white uppercase group-hover:text-cyan-400 transition-colors">
                  J&A <span className="text-cyan-400">MUNDO FUTBOL</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-cyan-300 uppercase -mt-0.5">
                Tu pasión, tu camiseta
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-200">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === "/" ? "text-cyan-400 font-bold bg-white/5" : "hover:text-cyan-400 hover:bg-white/5"
              }`}
            >
              Inicio
            </Link>

            <Link 
              href="/catalogo" 
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === "/catalogo" ? "text-cyan-400 font-bold bg-white/5" : "hover:text-cyan-400 hover:bg-white/5"
              }`}
            >
              Catálogo Completo
            </Link>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCatDropdownOpen(true)}
              onMouseLeave={() => setCatDropdownOpen(false)}
            >
              <button 
                type="button"
                className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                  pathname.startsWith("/categoria") ? "text-cyan-400 font-bold bg-white/5" : "hover:text-cyan-400 hover:bg-white/5"
                }`}
              >
                Categorías <ChevronDown className={`w-4 h-4 transition-transform ${catDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {catDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-[#0F1E36] border border-cyan-500/30 rounded-xl shadow-2xl py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400/80 border-b border-slate-700/60 mb-1">
                    Colecciones
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categoria/${cat.slug}`}
                      className="flex items-center justify-between px-3 py-2 text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
                      onClick={() => setCatDropdownOpen(false)}
                    >
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                  <div className="border-t border-slate-700/60 my-1"></div>
                  <Link
                    href="/catalogo?mujer=true"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-pink-400 hover:bg-pink-500/10 transition-colors font-medium"
                    onClick={() => setCatDropdownOpen(false)}
                  >
                    <span>⚽ Colección Para Mujer</span>
                  </Link>
                </div>
              )}
            </div>

            <Link 
              href="/categoria/retro" 
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === "/categoria/retro" ? "text-cyan-400 font-bold bg-white/5" : "hover:text-cyan-400 hover:bg-white/5"
              }`}
            >
              Retros
            </Link>

            <Link 
              href="/guia-de-tallas" 
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === "/guia-de-tallas" ? "text-cyan-400 font-bold bg-white/5" : "hover:text-cyan-400 hover:bg-white/5"
              }`}
            >
              Guía de Tallas
            </Link>

            <Link 
              href="/envios-y-pagos" 
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === "/envios-y-pagos" ? "text-cyan-400 font-bold bg-white/5" : "hover:text-cyan-400 hover:bg-white/5"
              }`}
            >
              Envíos & Pagos
            </Link>
          </div>

          {/* Action Icons (Search, Favorites, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-full transition-colors"
              title="Buscar camiseta"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Button */}
            <Link
              href="/favoritos"
              className="relative p-2 text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-full transition-colors"
              title="Mis Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {favIds.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-navy-950 font-bold rounded-xl shadow-md shadow-cyan-500/20 active:scale-95 transition-all text-sm"
              aria-label="Ver carrito"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-950" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-slate-900 text-cyan-300 border border-cyan-400 rounded-full w-5 h-5 text-[11px] font-black flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-extrabold text-slate-950">
                {totalCartPrice > 0 ? formatPrice(totalCartPrice) : "Carrito"}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-200 hover:text-cyan-400 rounded-lg hover:bg-white/5"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Drawer/Dropdown */}
        {searchOpen && (
          <div className="border-t border-slate-700/60 bg-[#0B1528] px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por equipo, liga, país, jugador (ej: Real Madrid, Millonarios, Retro)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-[#162447] text-white placeholder-slate-400 text-sm pl-11 pr-24 py-2.5 rounded-xl border border-cyan-500/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0B1528] px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto animate-in fade-in duration-200">
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className="px-3 py-2.5 rounded-lg text-slate-200 hover:text-cyan-400 hover:bg-white/5 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/catalogo"
                className="px-3 py-2.5 rounded-lg text-slate-200 hover:text-cyan-400 hover:bg-white/5 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catálogo Completo
              </Link>

              <div className="pt-2 pb-1 text-xs font-bold text-cyan-400 uppercase tracking-wider px-3">
                Categorías
              </div>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categoria/${c.slug}`}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-cyan-300 hover:bg-white/5 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {c.name}
                </Link>
              ))}

              <Link
                href="/catalogo?mujer=true"
                className="px-4 py-2 text-sm text-pink-400 font-semibold hover:bg-white/5 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                ⚽ Para Mujer
              </Link>

              <div className="border-t border-slate-800 my-2 pt-2"></div>

              <Link
                href="/guia-de-tallas"
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Guía de Tallas
              </Link>
              <Link
                href="/envios-y-pagos"
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Envíos & Métodos de Pago
              </Link>
              <Link
                href="/nosotros"
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quiénes Somos
              </Link>
              <Link
                href="/preguntas-frecuentes"
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preguntas Frecuentes
              </Link>

              <div className="pt-4">
                <Link
                  href="/admin"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-center rounded-xl font-medium text-sm flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserCheck className="w-4 h-4" /> Administrar Tienda
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
