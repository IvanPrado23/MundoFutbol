"use client";

import Link from "next/link";
import { Truck, CreditCard, ShieldCheck, RefreshCw, MessageCircle, Clock, MapPin } from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";
import { whatsappUrl } from "@/lib/utils";

export default function ShippingAndPaymentsPage() {
  const { settings } = useCatalog();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
          <Truck className="w-4 h-4 text-cyan-600" /> Transparencia y Confianza
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Envíos y Métodos de Pago
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Todo lo que necesitas saber sobre despachos a nivel nacional, formas de pago y garantía de tus camisetas.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Shipping Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
            <Truck className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Envíos a Todo Colombia</h2>
            <p className="text-xs text-slate-500 mt-1">Cobertura en ciudades principales y municipios.</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Tiempos de entrega:</strong>
                De <strong>2 a 5 días hábiles</strong> dependiendo de la ciudad o municipio de destino.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Empresas transportadoras:</strong>
                Despachamos por Interrapidísimo, Servientrega y Envía.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Guía de seguimiento:</strong>
                Una vez despachado el paquete, te compartimos la foto de la guía por WhatsApp para que rastrees tu pedido en tiempo real.
              </div>
            </div>
          </div>
        </div>

        {/* Payments Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600">
            <CreditCard className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Formas de Pago</h2>
            <p className="text-xs text-slate-500 mt-1">Cómodas, directas y sin comisiones extras.</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-black">📱 Transferencia Directa / Billeteras Digitales</strong>
              <p className="text-xs text-slate-600">
                Aceptamos transferencias inmediatas por <strong>Nequi</strong>, <strong>Daviplata</strong> y <strong>Bancolombia</strong>. Los datos de la cuenta se envían por WhatsApp al confirmar las prendas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-black">💵 Pago Contraentrega</strong>
              <p className="text-xs text-slate-600">
                Disponible para ciudades principales con transportadoras habilitadas. Pagas en efectivo al momento de recibir en tu puerta.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-black">🔒 Seguridad Total</strong>
              <p className="text-xs text-slate-600">
                No solicitamos claves ni números de tarjeta en nuestra web. Toda la coordinación es persona a persona.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Guarantee & Exchanges Strip */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Política de Cambios y Garantía</h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          En <strong>J&A Mundo Fútbol</strong> queremos que quedes 100% satisfecho con tu camiseta. 
          Aceptamos cambios por talla dentro de los primeros <strong>5 días hábiles</strong> tras recibir tu pedido, siempre que la prenda conserve sus etiquetas originales, no haya sido usada ni lavada y no sea una prenda personalizada con nombre y número propio.
        </p>

        <div className="pt-2">
          <Link
            href={whatsappUrl(settings.whatsapp || "573213831679", "⚽ ¡Hola! 👋 Tengo una consulta sobre los envíos a mi ciudad.")}
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Consultar Cobertura a tu Ciudad por WhatsApp</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
