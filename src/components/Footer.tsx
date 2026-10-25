"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ShieldCheck, Truck, RefreshCw, Lock } from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

// Custom TikTok icon since Lucide doesn't have an official TikTok icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

export function Footer() {
  const { categories, settings } = useCatalog();

  return (
    <footer className="bg-[#070D1A] text-slate-300 border-t border-cyan-500/20 relative overflow-hidden">
      {/* Decorative Cyan Curve Lines (inspired by the logo) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Feature Strip */}
      <div className="border-b border-slate-800/80 bg-[#0B1528]/50">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-white/5 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Envíos a Todo Colombia</h4>
              <p className="text-xs text-slate-400 mt-0.5">Despachos rápidos y seguros por transportadora aliada.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-white/5 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Calidad 1:1 Premium</h4>
              <p className="text-xs text-slate-400 mt-0.5">Telas técnicas, escudos bordados y detalles exactos.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-white/5 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Atención por WhatsApp</h4>
              <p className="text-xs text-slate-400 mt-0.5">Asesoría directa, confirmación de fotos y tallaje.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 bg-white p-0.5">
                <Image 
                  src="/logo.jpg" 
                  alt="J&A Mundo Fútbol" 
                  width={48} 
                  height={48} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-wider text-white">
                  J&A <span className="text-cyan-400">MUNDO FUTBOL</span>
                </span>
                <p className="text-xs font-semibold text-cyan-300 tracking-widest uppercase">
                  Tu pasión, tu camiseta
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Tienda virtual especializada en camisetas de fútbol retro, mundialistas,
              calidad 1:1 tipo jugador, liga colombiana y uniformes infantiles.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Síguenos en redes
              </span>
              <div className="flex items-center gap-3">
                {settings.socials.instagram && (
                  <Link
                    href={settings.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-pink-600/80 text-white flex items-center justify-center transition-all hover:scale-105 shadow"
                    title="Instagram @mundo_futbol6893"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </Link>
                )}

                {settings.socials.tiktok && (
                  <Link
                    href={settings.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center transition-all hover:scale-105 shadow"
                    title="TikTok @mundo.ftbol822"
                  >
                    <TikTokIcon className="w-5 h-5" />
                  </Link>
                )}

                <Link
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-all hover:scale-105 shadow"
                  title="WhatsApp 321 383 1679"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                </Link>
              </div>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Colecciones
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link 
                    href={`/categoria/${cat.slug}`} 
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/catalogo?mujer=true" 
                  className="text-pink-400 hover:text-pink-300 transition-colors font-medium"
                >
                  Colección Mujer
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Col */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Información
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guia-de-tallas" className="hover:text-cyan-400 transition-colors">
                  Guía de Tallas
                </Link>
              </li>
              <li>
                <Link href="/envios-y-pagos" className="hover:text-cyan-400 transition-colors">
                  Envíos y Métodos de Pago
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-cyan-400 transition-colors">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="hover:text-cyan-400 transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Contacto Directo
            </h4>
            <div className="space-y-3 text-sm">
              <p className="text-slate-400 text-xs">
                Pedidos, confirmación y dudas personalizadas:
              </p>
              
              <Link
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                WhatsApp: 321 383 1679
              </Link>

              <div className="text-xs text-slate-400 pt-1">
                Línea adicional: <span className="text-slate-300">305 712 4707</span>
              </div>
              <div className="text-xs text-slate-400">
                Bogotá & todo Colombia 🇨🇴
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 <strong className="text-slate-300">J&A Mundo Fútbol</strong>. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors">
              <Lock className="w-3.5 h-3.5" /> Acceso Administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
