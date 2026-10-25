"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";
import { whatsappUrl } from "@/lib/utils";

export default function FAQPage() {
  const { settings } = useCatalog();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-cyan-600" /> Respuestas Claras
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Preguntas Frecuentes
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Resolvemos las dudas más habituales sobre compras, envíos, tallas y personalización.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {settings.faq.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-cyan-600 transition-colors"
              >
                <span className="text-sm sm:text-base">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-cyan-600" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions */}
      <div className="bg-gradient-to-r from-[#0B1528] to-[#162447] text-white p-8 rounded-3xl border border-slate-800 text-center space-y-3">
        <h3 className="text-xl font-bold">¿Tienes otra pregunta?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Escríbenos directamente a WhatsApp y te respondemos en minutos.
        </p>
        <div className="pt-2">
          <Link
            href={whatsappUrl(settings.whatsapp || "573213831679", "⚽ ¡Hola J&A Mundo Fútbol! 👋 Tengo una pregunta que no vi en las preguntas frecuentes.")}
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chatear por WhatsApp (321 383 1679)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
