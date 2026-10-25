"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";

export function HomeHero() {
  const { banners } = useCatalog();
  const activeBanners = banners.filter((b) => b.active);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeBanners.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[current] || activeBanners[0];

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <section className="relative bg-gradient-to-br from-[#060D1A] via-[#0B1528] to-[#162447] text-white overflow-hidden py-10 sm:py-16 lg:py-24 border-b border-cyan-500/20">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00AEEF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      
      {/* Bounded glowing background spheres */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-blue-700/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Info Column - Centered on Mobile */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Top Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wide uppercase shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse flex-shrink-0" />
              <span>Catálogo Oficial · Calidad 1:1 Premium</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-xl mx-auto lg:mx-0">
              {banner.title.includes(" ") ? (
                <>
                  {banner.title.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-white">
                    {banner.title.split(" ").slice(-1)[0]}
                  </span>
                </>
              ) : (
                <span className="text-cyan-400">{banner.title}</span>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-lg mx-auto lg:mx-0 font-normal leading-relaxed text-center lg:text-left">
              {banner.subtitle}
            </p>

            {/* Action Buttons - Prominent & Full width on mobile */}
            <div className="w-full max-w-sm sm:max-w-none flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href={banner.link || "/catalogo"}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all active:scale-95 hover:scale-[1.02]"
              >
                <span>{banner.buttonText || "Explorar Colección"}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              <Link
                href="/catalogo"
                className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 border border-slate-700/80 transition-all backdrop-blur-sm active:scale-95"
              >
                <span>Ver Todo el Catálogo</span>
              </Link>
            </div>

            {/* Badges strip below - Centered and clean on mobile */}
            <div className="w-full pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-6 text-xs text-slate-300 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-slate-700/60 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Escudos bordados</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-slate-700/60 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Estampado oficial</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-slate-700/60 font-medium">
                <span className="text-cyan-400 font-bold">🇨🇴</span>
                <span>Envíos a todo el país</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Jersey Image - Centered on Mobile */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-xs sm:max-w-md aspect-square flex items-center justify-center mx-auto">
              
              {/* Decorative Circular Backdrop */}
              <div className="absolute inset-2 sm:inset-4 rounded-full border border-cyan-400/20 bg-gradient-to-b from-cyan-500/10 to-transparent"></div>
              <div className="absolute inset-6 sm:inset-10 rounded-full border border-dashed border-cyan-400/30 animate-[spin_60s_linear_infinite]"></div>

              {/* Floating Jersey Image */}
              <div className="relative w-full h-full p-4 sm:p-6 flex items-center justify-center z-10">
                <Image
                  src={banner.image || "/logo.jpg"}
                  alt={banner.title}
                  fill
                  className="object-contain filter drop-shadow-[0_20px_35px_rgba(0,174,239,0.35)] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 1024px) 80vw, 40vw"
                />
              </div>

              {/* Tag pill bottom right */}
              <div className="absolute bottom-2 right-2 sm:bottom-6 sm:right-6 z-20 bg-slate-900/95 backdrop-blur-md border border-cyan-400/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xl flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-xs sm:text-sm">
                  1:1
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold">Calidad Premium</div>
                  <div className="text-[11px] sm:text-xs font-black text-white">Versión Jugador / Hincha</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Navigation Arrows & Indicators */}
        {activeBanners.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-slate-700/60 active:scale-95"
              aria-label="Anterior banner"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all ${
                    current === idx ? "w-8 bg-cyan-400" : "w-2 bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`Banner ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-slate-700/60 active:scale-95"
              aria-label="Siguiente banner"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
