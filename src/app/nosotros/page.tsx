"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";

export default function AboutUsPage() {
  const { settings } = useCatalog();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-cyan-400 p-1 bg-white shadow-xl shadow-cyan-500/20">
          <Image src="/logo.jpg" alt="J&A Mundo Fútbol" fill className="object-cover rounded-full" />
        </div>
        <span className="text-cyan-600 font-extrabold text-xs uppercase tracking-wider block">
          Nuestra Pasión
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Quiénes Somos en J&A Mundo Fútbol
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {settings.about || "Nacimos por el amor al buen fútbol y a esas camisetas que marcaron historia. Nuestro compromiso es que vistas los colores de tu club con la mejor calidad y al mejor precio."}
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black text-xl">
            ⚽
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">Amor por el Fútbol</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No somos simples vendedores, somos hinchas. Conocemos las temporadas icónicas, los dorsales históricos y los detalles que hacen única cada camiseta.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
            ⭐
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">Calidad 1:1 Garantizada</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Seleccionamos prendas con tecnología transpirable, escudos con relieve y bordado preciso, etiquetas exactas y los cortes originales.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-black text-xl">
            🤝
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">Atención Cercana</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Te atendemos directamente por WhatsApp para enviarte fotos reales, asesorarte con la talla y acompañarte hasta que tengas la camiseta en tus manos.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B1528] to-[#162447] text-white p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black">¿Listo para vestir tu pasión?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Explora nuestra colección o escríbenos si buscas alguna camiseta especial para tu colección.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/catalogo"
            className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md"
          >
            Ver Catálogo de Camisetas
          </Link>
          <Link
            href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Hablar por WhatsApp</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
