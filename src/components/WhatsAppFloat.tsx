"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";
import { useState } from "react";

export function WhatsAppFloat() {
  const { settings } = useCatalog();
  const [hovered, setHovered] = useState(false);

  const phone = settings.whatsapp.replace(/\D/g, "");
  const defaultMessage = encodeURIComponent(
    "¡Hola J&A Mundo Fútbol! 👋 Vi su página web y quiero hacer una consulta sobre las camisetas."
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip on hover or screen */}
      {hovered && (
        <div className="hidden sm:block bg-slate-900 text-white text-xs py-2 px-3.5 rounded-xl shadow-xl border border-cyan-500/30 animate-in fade-in slide-in-from-right-2 duration-150 whitespace-nowrap">
          <p className="font-bold text-cyan-300">¿Tienes dudas o buscas una camiseta?</p>
          <p className="text-[11px] text-slate-300">¡Escríbenos directamente por WhatsApp!</p>
        </div>
      )}

      <Link
        href={`https://wa.me/${phone}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative group w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Contactar por WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-green-400/30 animate-ping opacity-75"></span>
        <MessageCircle className="w-7 h-7 fill-white text-white relative z-10" />
      </Link>
    </div>
  );
}
