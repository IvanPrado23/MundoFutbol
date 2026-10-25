"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight, 
  Sparkles,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle2
} from "lucide-react";
import { useCart } from "@/lib/store";
import { useCatalog } from "@/components/CatalogProvider";
import { formatPrice, itemTotal, buildWhatsappMessage, whatsappUrl } from "@/lib/utils";
import { createOrder } from "@/lib/repo";

export function CartDrawer() {
  const { items, customer, isOpen, close, updateQty, remove, clear, setCustomer } = useCart();
  const { settings } = useCatalog();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState(false);

  if (!isOpen) return null;

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
      // 1. Save order into repository / Firestore for Admin analytics & history
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

      // 2. Build the WhatsApp message string
      const text = buildWhatsappMessage(items, customer);
      const url = whatsappUrl(settings.whatsapp || "573213831679", text);

      // 3. Mark submitted and redirect to WhatsApp
      setSubmitted(true);
      setTimeout(() => {
        window.open(url, "_blank");
        clear();
        setIsSubmitting(false);
        setSubmitted(false);
        close();
      }, 700);
    } catch (err) {
      console.error("Error creating order:", err);
      // Fallback: still open WhatsApp even if DB write had any issue
      const text = buildWhatsappMessage(items, customer);
      const url = whatsappUrl(settings.whatsapp || "573213831679", text);
      window.open(url, "_blank");
      setIsSubmitting(false);
      close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 bg-[#0B1528] text-white flex items-center justify-between border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Tu Carrito</h3>
                <p className="text-xs text-cyan-300 font-medium">
                  {totalCount} {totalCount === 1 ? "artículo" : "artículos"}
                </p>
              </div>
            </div>

            <button
              onClick={close}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Tu carrito está vacío</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Explora nuestras camisetas retro, mundialistas y 1:1 para agregar tus favoritas.
                  </p>
                </div>
                <Link
                  href="/catalogo"
                  onClick={close}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1528] text-white text-xs font-bold hover:bg-[#162447] transition-all shadow-md"
                >
                  Ver Catálogo de Camisetas <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3 divide-y divide-slate-100">
                  {items.map((it) => (
                    <div key={it.key} className="pt-3 first:pt-0 flex gap-3 items-center">
                      {/* Thumbnail */}
                      <div className="w-16 h-20 rounded-xl bg-white border border-slate-200 overflow-hidden relative flex-shrink-0">
                        <Image
                          src={it.image || "/logo.jpg"}
                          alt={it.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {it.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            Talla: {it.size}
                          </span>
                          <span>{formatPrice(it.unitPrice)} c/u</span>
                        </div>

                        {it.customization && (
                          <div className="text-[10px] text-cyan-800 bg-cyan-50 border border-cyan-200 rounded px-1.5 py-0.5 mt-1 inline-flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {it.customization.name} #{it.customization.number} (+{formatPrice(it.customization.extraPrice)})
                          </div>
                        )}

                        {/* Quantity and Subtotal */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                            <button
                              type="button"
                              onClick={() => updateQty(it.key, it.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:text-black"
                            >
                              -
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-slate-900">
                              {it.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(it.key, it.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:text-black"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-900">
                              {formatPrice(itemTotal(it))}
                            </span>
                            <button
                              type="button"
                              onClick={() => remove(it.key)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Checkout Form */}
                <form id="checkout-form" onSubmit={handleCheckout} className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Datos para el pedido
                    </span>
                    <span className="text-[11px] text-slate-400">
                      * Obligatorio
                    </span>
                  </div>

                  {/* Nombre (Obligatorio) */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-cyan-600" /> Tu Nombre Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Juan Camilo Pérez"
                      value={customer.name}
                      onChange={(e) => {
                        setCustomer({ name: e.target.value });
                        if (nameError) setNameError(false);
                      }}
                      className={`w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 ${
                        nameError
                          ? "border-red-500 focus:ring-red-500 bg-red-50/50"
                          : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-500"
                      }`}
                    />
                    {nameError && (
                      <p className="text-[10px] text-red-600 font-semibold mt-1">
                        Por favor escribe tu nombre para el pedido.
                      </p>
                    )}
                  </div>

                  {/* Teléfono (Opcional) */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-cyan-600" /> Teléfono / WhatsApp (Opcional)
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej: 300 123 4567"
                      value={customer.phone || ""}
                      onChange={(e) => setCustomer({ phone: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Ciudad / Dirección (Opcional) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-600" /> Ciudad (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Bogotá, Medellín"
                        value={customer.city || ""}
                        onChange={(e) => setCustomer({ city: e.target.value })}
                        className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Dirección (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Cra 15 # 85-30"
                        value={customer.address || ""}
                        onChange={(e) => setCustomer({ address: e.target.value })}
                        className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Observaciones (Opcional) */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-cyan-600" /> Notas u observaciones (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej: Entregar en portería, consultar disponibilidad de manga larga..."
                      value={customer.notes || ""}
                      onChange={(e) => setCustomer({ notes: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                    />
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer / Summary / WhatsApp Button */}
          {items.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Subtotal productos:</span>
                  <span className="font-semibold text-slate-700">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Envío:</span>
                  <span className="text-cyan-600 font-semibold">A coordinar por WhatsApp</span>
                </div>
                <div className="flex items-center justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>TOTAL ESTIMADO:</span>
                  <span className="text-xl text-[#0B1528]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Main Submit WhatsApp Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting || submitted}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 ${
                  submitted
                    ? "bg-green-600 text-white shadow-green-500/30"
                    : "bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white shadow-green-600/30"
                }`}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> ¡Abriendo WhatsApp con tu pedido!
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-current" /> Enviar Pedido por WhatsApp
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-400">
                🔒 Sin pagos en la web. Te respondemos directo en WhatsApp para confirmar stock y entrega.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
