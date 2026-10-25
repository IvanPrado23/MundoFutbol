"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Check, Heart, ShoppingBag, Sparkles, MessageCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice, effectivePrice, isOnSale, isSoldOut, discountPercent } from "@/lib/utils";
import { useCart, useFavorites } from "@/lib/store";
import { useCatalog } from "@/components/CatalogProvider";

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickView({ product, onClose }: QuickViewProps) {
  const { categories, teams, settings } = useCatalog();
  const { add: addToCart } = useCart();
  const { ids: favIds, toggle: toggleFav } = useFavorites();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [customEnabled, setCustomEnabled] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const isFav = favIds.includes(product.id);
  const category = categories.find((c) => c.slug === product.categorySlug);
  const team = teams.find((t) => t.slug === product.teamSlug);

  // default size is the first available size
  const activeSizes = product.sizes.filter((s) => !s.soldOut);
  const currentSize = selectedSize || (activeSizes.length > 0 ? activeSizes[0].label : "");
  const soldOut = isSoldOut(product);

  const basePrice = effectivePrice(product);
  const extraPrice = customEnabled ? (product.customization?.extraPrice || settings.customizationDefault || 25000) : 0;
  const totalPrice = (basePrice + extraPrice) * quantity;

  const handleAddToCart = () => {
    if (!currentSize) return;

    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0] || "/logo.jpg",
      size: currentSize,
      quantity,
      unitPrice: basePrice,
      customization: customEnabled
        ? {
            name: customName.trim().toUpperCase(),
            number: customNumber.trim(),
            extraPrice,
          }
        : null,
    });

    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media Column */}
        <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100">
          <div className="relative w-full aspect-[3/4] max-h-80 md:max-h-full">
            <Image
              src={product.images[selectedImage] || product.images[0] || "/logo.jpg"}
              alt={product.name}
              fill
              className="object-contain p-2 hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Multiple thumbnails if available */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 max-w-full">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 relative rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                    selectedImage === idx ? "border-cyan-500 scale-105 shadow-md" : "border-slate-200 opacity-70"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
            {isOnSale(product) && (
              <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-black rounded-lg shadow uppercase">
                Oferta -{discountPercent(product)}%
              </span>
            )}
            {product.isNew && (
              <span className="px-2.5 py-1 bg-cyan-500 text-slate-950 text-xs font-black rounded-lg shadow uppercase">
                Nuevo
              </span>
            )}
            {product.forWomen && (
              <span className="px-2.5 py-1 bg-pink-500 text-white text-xs font-bold rounded-lg shadow">
                Para Mujer
              </span>
            )}
          </div>
        </div>

        {/* Product Details Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Category / Team breadcrumb */}
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-600 mb-1 flex items-center gap-2">
              <span>{category?.name || "Camiseta"}</span>
              {team && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{team.name}</span>
                </>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
              {product.name}
            </h3>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-black text-[#0B1528]">
                {formatPrice(basePrice)}
              </span>
              {isOnSale(product) && (
                <span className="text-base text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Sizes selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Talla disponible:
                </label>
                <Link
                  href="/guia-de-tallas"
                  target="_blank"
                  className="text-xs text-cyan-600 hover:underline font-semibold"
                >
                  Ver Guía de Tallas
                </Link>
              </div>

              {product.sizes.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Talla única / Según disponibilidad</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = currentSize === s.label;
                    return (
                      <button
                        key={s.label}
                        type="button"
                        disabled={s.soldOut}
                        onClick={() => setSelectedSize(s.label)}
                        className={`min-w-11 h-10 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center ${
                          s.soldOut
                            ? "bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed"
                            : isSelected
                            ? "bg-[#0B1528] border-[#0B1528] text-white shadow-md scale-105"
                            : "bg-white border-slate-300 text-slate-700 hover:border-cyan-500"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Customization option */}
            {product.customization?.enabled && (
              <div className="mb-5 p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={customEnabled}
                    onChange={(e) => setCustomEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    Personalizar con Nombre y Número
                  </span>
                  <span className="text-xs font-extrabold text-cyan-700 ml-auto">
                    +{formatPrice(product.customization.extraPrice || settings.customizationDefault || 25000)}
                  </span>
                </label>

                {customEnabled && (
                  <div className="mt-3 grid grid-cols-2 gap-2 animate-in fade-in duration-150">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Nombre (Dorsal)
                      </span>
                      <input
                        type="text"
                        placeholder="Ej: RONALDO"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                        maxLength={14}
                        className="w-full bg-white px-3 py-1.5 text-xs font-bold rounded-lg border border-cyan-300 uppercase focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Número
                      </span>
                      <input
                        type="text"
                        placeholder="Ej: 9"
                        value={customNumber}
                        onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ""))}
                        maxLength={2}
                        className="w-full bg-white px-3 py-1.5 text-xs font-bold rounded-lg border border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold text-slate-700 uppercase">Cantidad:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 font-bold flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 font-bold flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Total:</span>
              <span className="text-xl font-black text-slate-900">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={soldOut || !currentSize}
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  soldOut
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : addedNotice
                    ? "bg-green-600 text-white shadow-green-500/30"
                    : "bg-[#0B1528] hover:bg-[#162447] text-white shadow-slate-900/20 active:scale-95"
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-5 h-5" /> ¡Agregado al Carrito!
                  </>
                ) : soldOut ? (
                  "Producto Agotado"
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-cyan-400" /> Agregar al Carrito
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleFav(product.id)}
                className={`p-3.5 rounded-2xl border transition-colors flex items-center justify-center ${
                  isFav
                    ? "bg-pink-50 border-pink-200 text-pink-500"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:text-pink-500"
                }`}
                title="Favorito"
              >
                <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="text-center">
              <Link
                href={`/producto/${product.slug}`}
                onClick={onClose}
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 underline"
              >
                Ver ficha completa del producto →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
