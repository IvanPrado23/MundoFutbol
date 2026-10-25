"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Trash2, 
  ShoppingBag, 
  MessageCircle, 
  ArrowLeft, 
  Sparkles,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Truck
} from "lucide-react";
import { useCart } from "@/lib/store";
import { useCatalog } from "@/components/CatalogProvider";
import { formatPrice, itemTotal, buildWhatsappMessage, whatsappUrl } from "@/lib/utils";
import { createOrder } from "@/lib/repo";

export default function CartPage() {
  const { items, customer, updateQty, remove, clear, setCustomer } = useCart();
  const { settings } = useCatalog();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState(false);

  const total = items.reduce((sum, item) => sum + itemTotal(item), 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    setIsSubmitting(true);
    try {
      await createOrder({
        items: items.map(({ key: _k, ...rest }) => rest),
        customer: {
          name: customer.name.trim(),
          phone: customer.phone?.trim() || "",
          city: customer.city?.trim() || "",
          address: customer.address?.trim() || "",
          notes: customer.notes?.trim() || "",
        },
        total,
      });

      const text = buildWhatsappMessage(items, customer);
      const url = whatsappUrl(settings.whatsapp || "573213831679", text);

      setSubmitted(true);
      setTimeout(() => {
        window.open(url, "_blank");
        clear();
        setIsSubmitting(false);
        setSubmitted(false);
      }, 700);
    } catch (err) {
      console.error(err);
      const text = buildWhatsappMessage(items, customer);
      const url = whatsappUrl(settings.whatsapp || "573213831679", text);
      window.open(url, "_blank");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-extrabold text-slate-900 text-2xl">Tu carrito está vacío</h1>
          <p className="text-xs text-slate-500">
            Aún no has agregado ninguna camiseta. Visita el catálogo para elegir tus prendas favoritas.
          </p>
          <div className="pt-2">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B1528] text-white text-xs font-bold hover:bg-[#162447] transition-all shadow-md"
            >
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
            Resumen de tu Carrito
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Revisa tus camisetas y envía los datos para coordinar el despacho por WhatsApp.
          </p>
        </div>

        <button
          onClick={clear}
          className="text-xs text-red-600 hover:text-red-700 font-bold self-start sm:self-auto underline"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Products List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
            Camisetas en el Pedido ({totalCount})
          </h2>

          <div className="space-y-4 divide-y divide-slate-100">
            {items.map((it) => (
              <div key={it.key} className="pt-4 first:pt-0 flex gap-4 items-center">
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-2xl bg-white border border-slate-200 overflow-hidden relative flex-shrink-0">
                  <Image src={it.image || "/logo.jpg"} alt={it.name} fill className="object-contain p-2" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{it.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      Talla {it.size}
                    </span>
                    <span>{formatPrice(it.unitPrice)} c/u</span>
                  </div>

                  {it.customization && (
                    <div className="text-xs text-cyan-800 bg-cyan-50 border border-cyan-200 rounded-md px-2 py-1 mt-1.5 inline-flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3 h-3 text-cyan-600" />
                      Estampado: {it.customization.name} #{it.customization.number} (+{formatPrice(it.customization.extraPrice)})
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => updateQty(it.key, it.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:text-black"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-slate-900">
                        {it.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(it.key, it.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:text-black"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-base font-black text-slate-900">
                        {formatPrice(itemTotal(it))}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(it.key)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Checkout Form & WhatsApp */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="font-extrabold text-base text-slate-900 mb-1">
              Datos para el Envío
            </h2>
            <p className="text-xs text-slate-500">
              Ingresa tus datos para generar el mensaje directo a nuestro WhatsApp.
            </p>
          </div>

          <form onSubmit={handleCheckout} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-600" /> Nombre Completo *
              </label>
              <input
                type="text"
                placeholder="Ej: Daniel Gómez"
                value={customer.name}
                onChange={(e) => {
                  setCustomer({ name: e.target.value });
                  if (nameError) setNameError(false);
                }}
                className={`w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 ${
                  nameError
                    ? "border-red-500 focus:ring-red-500 bg-red-50/50"
                    : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-500"
                }`}
              />
              {nameError && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  Tu nombre es necesario para poder atender tu pedido.
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cyan-600" /> Teléfono / WhatsApp (Opcional)
              </label>
              <input
                type="tel"
                placeholder="Ej: 310 123 4567"
                value={customer.phone || ""}
                onChange={(e) => setCustomer({ phone: e.target.value })}
                className="w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Ciudad y Dirección */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600" /> Ciudad (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Bogotá, Cali"
                  value={customer.city || ""}
                  onChange={(e) => setCustomer({ city: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Dirección (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Calle 100 # 15-20"
                  value={customer.address || ""}
                  onChange={(e) => setCustomer({ address: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-cyan-600" /> Observaciones o notas
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Horario de entrega preferido, consultar por mangas largas..."
                value={customer.notes || ""}
                onChange={(e) => setCustomer({ notes: e.target.value })}
                className="w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({totalCount} productos):</span>
                <span className="font-bold text-slate-700">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Costo de envío:</span>
                <span className="font-semibold text-cyan-600">A coordinar por WhatsApp</span>
              </div>
              <div className="flex justify-between text-slate-900 text-lg font-black pt-2 border-t border-slate-200">
                <span>TOTAL ESTIMADO:</span>
                <span className="text-2xl text-[#0B1528]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl transition-all duration-300 ${
                submitted
                  ? "bg-green-600 text-white"
                  : "bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white shadow-green-600/30"
              }`}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> ¡Abriendo WhatsApp con tu pedido!
                </>
              ) : (
                <>
                  <MessageCircle className="w-6 h-6 fill-current" /> Enviar Pedido a WhatsApp (321 383 1679)
                </>
              )}
            </button>
          </form>

          {/* Safe Purchase notice */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-600" /> Compra 100% Asesorada
            </div>
            <p>
              No necesitas ingresar tarjetas ni datos bancarios en la web. La confirmación, medios de pago (Nequi, Daviplata o contraentrega) y fotos reales se verifican por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
