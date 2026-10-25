"use client";

import Link from "next/link";
import { Ruler, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";
import { whatsappUrl } from "@/lib/utils";

export default function SizeGuidePage() {
  const { settings } = useCatalog();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
          <Ruler className="w-4 h-4 text-cyan-600" /> Medidas Exactas
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Guía de Tallas
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Encuentra la talla ideal para tus camisetas de fútbol. Si tienes dudas entre dos tallas, te recomendamos elegir la más grande o consultarnos por WhatsApp.
        </p>
      </div>

      {/* How to measure banner */}
      <div className="bg-gradient-to-r from-[#0B1528] to-[#162447] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold text-cyan-400">¿Cómo medir una camiseta que ya tengas?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            • <strong>Ancho (Pecho):</strong> Mide de axila a axila de forma horizontal con la camiseta plana sobre una mesa.<br />
            • <strong>Largo:</strong> Mide desde la parte más alta del hombro (junto al cuello) hasta el borde inferior.
          </p>
        </div>
        <Link
          href={whatsappUrl(settings.whatsapp || "573213831679", "⚽ ¡Hola! 👋 Tengo una consulta con la guía de tallas de una camiseta.")}
          target="_blank"
          className="px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 flex-shrink-0 transition-all"
        >
          <MessageCircle className="w-4 h-4" /> Asesoría por WhatsApp
        </Link>
      </div>

      {/* 1. Camisetas Adulto (Versión Hincha) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
            Corte Estándar (Hincha / Fan)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Camisetas de Adulto
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">Talla</th>
                <th className="py-3 px-4">Ancho (Axila a Axila)</th>
                <th className="py-3 px-4">Largo Total</th>
                <th className="py-3 px-4">Estatura recomendada</th>
                <th className="py-3 px-4">Peso sugerido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">S</td>
                <td className="py-3 px-4">48 - 50 cm</td>
                <td className="py-3 px-4">69 - 71 cm</td>
                <td className="py-3 px-4">1.60 - 1.70 m</td>
                <td className="py-3 px-4">55 - 65 kg</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">M</td>
                <td className="py-3 px-4">51 - 53 cm</td>
                <td className="py-3 px-4">71 - 73 cm</td>
                <td className="py-3 px-4">1.70 - 1.78 m</td>
                <td className="py-3 px-4">65 - 75 kg</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">L</td>
                <td className="py-3 px-4">54 - 56 cm</td>
                <td className="py-3 px-4">73 - 75 cm</td>
                <td className="py-3 px-4">1.75 - 1.83 m</td>
                <td className="py-3 px-4">75 - 85 kg</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">XL</td>
                <td className="py-3 px-4">57 - 59 cm</td>
                <td className="py-3 px-4">75 - 78 cm</td>
                <td className="py-3 px-4">1.80 - 1.90 m</td>
                <td className="py-3 px-4">85 - 95 kg</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">XXL</td>
                <td className="py-3 px-4">60 - 62 cm</td>
                <td className="py-3 px-4">78 - 81 cm</td>
                <td className="py-3 px-4">1.85 m +</td>
                <td className="py-3 px-4">95 kg +</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400 italic">
          * Nota: Las camisetas <strong>Tipo Jugador 1:1</strong> tienen un ajuste más ceñido al cuerpo (Slim Fit). Si prefieres que te quede más suelta, te sugerimos pedir una talla más.
        </p>
      </div>

      {/* 2. Camisetas Para Mujer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
            Corte Silueta Femenina
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Camisetas de Mujer
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">Talla</th>
                <th className="py-3 px-4">Pecho (Ancho)</th>
                <th className="py-3 px-4">Cintura</th>
                <th className="py-3 px-4">Largo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-3 px-4 font-black text-pink-600">XS</td>
                <td className="py-3 px-4">40 - 42 cm</td>
                <td className="py-3 px-4">36 - 38 cm</td>
                <td className="py-3 px-4">62 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-pink-600">S</td>
                <td className="py-3 px-4">43 - 45 cm</td>
                <td className="py-3 px-4">39 - 41 cm</td>
                <td className="py-3 px-4">64 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-pink-600">M</td>
                <td className="py-3 px-4">46 - 48 cm</td>
                <td className="py-3 px-4">42 - 44 cm</td>
                <td className="py-3 px-4">66 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-pink-600">L</td>
                <td className="py-3 px-4">49 - 51 cm</td>
                <td className="py-3 px-4">45 - 47 cm</td>
                <td className="py-3 px-4">68 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-pink-600">XL</td>
                <td className="py-3 px-4">52 - 54 cm</td>
                <td className="py-3 px-4">48 - 50 cm</td>
                <td className="py-3 px-4">70 cm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Uniformes y Sudaderas Niños */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
            Infantil / Juvenil
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Uniformes y Sudaderas para Niños
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">Talla</th>
                <th className="py-3 px-4">Edad Aproximada</th>
                <th className="py-3 px-4">Estatura del Niño</th>
                <th className="py-3 px-4">Ancho Camiseta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">Talla 4</td>
                <td className="py-3 px-4">3 a 4 años</td>
                <td className="py-3 px-4">95 - 105 cm</td>
                <td className="py-3 px-4">33 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">Talla 6</td>
                <td className="py-3 px-4">5 a 6 años</td>
                <td className="py-3 px-4">105 - 115 cm</td>
                <td className="py-3 px-4">35 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">Talla 8</td>
                <td className="py-3 px-4">7 a 8 años</td>
                <td className="py-3 px-4">115 - 125 cm</td>
                <td className="py-3 px-4">37 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">Talla 10</td>
                <td className="py-3 px-4">9 a 10 años</td>
                <td className="py-3 px-4">125 - 135 cm</td>
                <td className="py-3 px-4">40 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">Talla 12</td>
                <td className="py-3 px-4">11 a 12 años</td>
                <td className="py-3 px-4">135 - 145 cm</td>
                <td className="py-3 px-4">42 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">Talla 14</td>
                <td className="py-3 px-4">13 a 14 años</td>
                <td className="py-3 px-4">145 - 155 cm</td>
                <td className="py-3 px-4">44 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-black text-[#0B1528]">Talla 16</td>
                <td className="py-3 px-4">15 a 16 años</td>
                <td className="py-3 px-4">155 - 165 cm</td>
                <td className="py-3 px-4">46 cm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
