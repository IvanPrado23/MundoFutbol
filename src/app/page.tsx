"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Flame, 
  CheckCircle, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  Layers
} from "lucide-react";
import { useCatalog, useVisibleProducts } from "@/components/CatalogProvider";
import { HomeHero } from "@/components/HomeHero";
import { ProductCard } from "@/components/ProductCard";
import { whatsappUrl } from "@/lib/utils";

export default function HomePage() {
  const { categories, teams, settings, loading } = useCatalog();
  const products = useVisibleProducts();

  const [activeTab, setActiveTab] = useState<string>("todos");

  // Filter products for featured showcase
  const featuredProducts = products.filter((p) => p.isFeatured || p.isNew).slice(0, 8);
  const retroProducts = products.filter((p) => p.categorySlug === "retro").slice(0, 8);
  const internacionalesProducts = products.filter((p) => p.categorySlug === "internacionales").slice(0, 8);
  const colombiaProducts = products.filter((p) => p.categorySlug === "liga-colombiana").slice(0, 8);
  const womenProducts = products.filter((p) => p.forWomen).slice(0, 4);

  // Tab switcher
  const getTabProducts = () => {
    switch (activeTab) {
      case "retro":
        return retroProducts;
      case "internacionales":
        return internacionalesProducts;
      case "colombia":
        return colombiaProducts;
      default:
        return featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Showcase */}
      <HomeHero />

      {/* 2. Categorías Destacadas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 mb-6 sm:mb-8 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-cyan-600 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" /> Explora por colección
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Categorías de la Tienda
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 group"
          >
            Ver catálogo completo{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const count = products.filter((p) => p.categorySlug === cat.slug).length;
            return (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group relative rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between hover:shadow-xl hover:border-cyan-400 transition-all duration-300 overflow-hidden"
              >
                {/* Background image preview */}
                <div className="relative aspect-square w-full mb-3 flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden p-2">
                  <Image
                    src={cat.image || "/logo.jpg"}
                    alt={cat.name}
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-cyan-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {count} {count === 1 ? "camiseta" : "camisetas"}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-bold text-cyan-600">
                  <span>Ver colección</span>
                  <div className="w-6 h-6 rounded-full bg-cyan-50 group-hover:bg-cyan-500 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Colección Destacada con Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 mb-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-amber-500 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-amber-500" /> Selección Especial
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Camisetas Destacadas
            </h2>
          </div>

          {/* Filter Tabs - Centered on mobile */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 w-full md:w-auto">
            {[
              { id: "todos", label: "Destacadas" },
              { id: "retro", label: "Retros" },
              { id: "internacionales", label: "1:1 Internacionales" },
              { id: "colombia", label: "Liga Colombiana" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#0B1528] text-white shadow-md shadow-slate-900/10 scale-105"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Cargando camisetas...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {getTabProducts().map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0B1528] hover:bg-[#162447] text-white font-bold text-sm rounded-2xl shadow-lg shadow-slate-900/10 transition-all hover:scale-105"
          >
            <span>Ver Más Camisetas en el Catálogo ({products.length} disponibles)</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>
      </section>

      {/* 4. Banner Promo Calidad 1:1 y Personalización */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#060D1A] via-[#0F1E36] to-[#162A4D] text-white overflow-hidden p-8 sm:p-12 border border-cyan-500/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 text-center lg:text-left">
            <div className="lg:col-span-8 space-y-4 flex flex-col items-center lg:items-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-extrabold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Personalización Oficial
              </span>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                ¿Quieres tu nombre y tu número en la espalda?
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                En J&A Mundo Fútbol estampamos tu camiseta con la tipografía oficial del club o selección. 
                Elige tu camiseta favorita, activa el estampado al hacer tu pedido y nos encargamos de dejarla impecable.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
                <Link
                  href="/categoria/retro"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105"
                >
                  Ver Camisetas Personalizables
                </Link>
                <Link
                  href={whatsappUrl(
                    settings.whatsapp || "573213831679",
                    "⚽ ¡Hola J&A Mundo Fútbol! 👋 Quiero consultar por el estampado personalizado de una camiseta."
                  )}
                  target="_blank"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-slate-600 transition-all"
                >
                  Consultar por WhatsApp
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="relative w-48 sm:w-60 aspect-square">
                <Image
                  src="/seed/products/retro-real-madrid-08.webp"
                  alt="Camiseta estampada"
                  fill
                  className="object-contain filter drop-shadow-[0_20px_30px_rgba(0,174,239,0.3)] animate-pulse"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Colección Para Mujer Highlight */}
      {womenProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 mb-6 sm:mb-8 text-center sm:text-left">
            <div>
              <span className="text-pink-500 font-extrabold text-xs uppercase tracking-wider block mb-1">
                Ajuste Especial
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Colección Para Mujer
              </h2>
            </div>
            <Link
              href="/catalogo?mujer=true"
              className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 group"
            >
              Ver todas para mujer{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {womenProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Cómo Funciona el Pedido en 3 Pasos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-cyan-600 font-extrabold text-xs uppercase tracking-wider">
            Fácil, Rápido y Seguro
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            ¿Cómo Comprar en J&A Mundo Fútbol?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Paso 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="text-5xl font-black text-slate-100 absolute top-4 right-4 pointer-events-none group-hover:text-cyan-50 transition-colors">
              01
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 font-bold mb-4">
              👕
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-2">
              1. Elige tu camiseta
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explora las categorías, selecciona tu talla (o agrégale nombre y número si deseas estampado) y agrégala al carrito de la tienda.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="text-5xl font-black text-slate-100 absolute top-4 right-4 pointer-events-none group-hover:text-cyan-50 transition-colors">
              02
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600 font-bold mb-4">
              📲
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-2">
              2. Envía tu pedido a WhatsApp
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              En tu carrito pon tu nombre y presiona el botón. Se abrirá WhatsApp con el resumen exacto de tus camisetas y el total calculado.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="text-5xl font-black text-slate-100 absolute top-4 right-4 pointer-events-none group-hover:text-cyan-50 transition-colors">
              03
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold mb-4">
              📦
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-2">
              3. Confirmamos y Enviamos
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Te respondemos al instante, acordamos el pago (Nequi, Daviplata, Bancolombia o contraentrega) y despachamos tu pedido a tu casa.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Final WhatsApp */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B1528] to-[#162447] text-white p-8 sm:p-12 border border-slate-800 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-8 h-8 fill-current" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white">
              ¿No encuentras una camiseta específica?
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Si buscas una camiseta que no está en el catálogo, escríbenos directamente. 
              Tenemos acceso a más de 500 modelos de diferentes temporadas y ligas.
            </p>

            <div className="pt-2">
              <Link
                href={whatsappUrl(
                  settings.whatsapp || "573213831679",
                  "⚽ ¡Hola J&A Mundo Fútbol! 👋 Estoy buscando una camiseta que no vi en la página, ¿me pueden asesorar?"
                )}
                target="_blank"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-green-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Preguntar por WhatsApp (321 383 1679)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
