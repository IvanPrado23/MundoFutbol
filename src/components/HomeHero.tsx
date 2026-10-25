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
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[current] || activeBanners[0];

  return (
    <section className="relative bg-gradient-to-br from-[#060D1A] via-[#0B1528] to-[#162447] text-white overflow-hidden py-12 md:py-20 lg:py-24 border-b border-cyan-500/20">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00AEEF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      
      {/* Glowing curved sphere (matches logo curves) */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-700/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              Catálogo Oficial · Calidad 1:1 Premium
            </div>

            {/* Main Title with brand styling */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
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
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {banner.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href={banner.link || "/catalogo"}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>{banner.buttonText || "Explorar Colección"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/catalogo"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 border border-slate-700/80 transition-all backdrop-blur-sm"
              >
                <span>Ver Todo el Catálogo</span>
              </Link>
            </div>

            {/* Badges strip below */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300 border-t border-slate-800/80">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Escudos bordados
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Estampado oficial
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="text-cyan-400 font-bold">🇨🇴</span> Envíos a todo el país
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] flex items-center justify-center">
              
              {/* Decorative Circular Backdrop */}
              <div className="absolute inset-4 rounded-full border border-cyan-400/20 bg-gradient-to-b from-cyan-500/10 to-transparent"></div>
              <div className="absolute inset-10 rounded-full border border-dashed border-cyan-400/30 animate-[spin_60s_linear_infinite]"></div>

              {/* Floating Jersey Image */}
              <div className="relative w-full h-full p-6 flex items-center justify-center z-10">
                <Image
                  src={banner.image || "/logo.jpg"}
                  alt={banner.title}
                  fill
                  className="object-contain filter drop-shadow-[0_25px_35px_rgba(0,174,239,0.25)] hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Tag pill bottom right */}
              <div className="absolute bottom-6 right-2 sm:right-6 z-20 bg-slate-900/90 backdrop-blur-md border border-cyan-400/40 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-sm">
                  1:1
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Calidad Premium</div>
                  <div className="text-xs font-black text-white">Versión Jugador / Hincha</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel indicators if multiple banners */}
        {activeBanners.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
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
        )}
      </div>
    </section>
  );
}
