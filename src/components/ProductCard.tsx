"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice, effectivePrice, isOnSale, isSoldOut, discountPercent } from "@/lib/utils";
import { useFavorites } from "@/lib/store";
import { ProductQuickView } from "./ProductQuickView";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { ids: favIds, toggle: toggleFav } = useFavorites();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const isFav = favIds.includes(product.id);
  const onSale = isOnSale(product);
  const soldOut = isSoldOut(product);
  const price = effectivePrice(product);

  return (
    <>
      <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-between">
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start pointer-events-none">
          {soldOut ? (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-900/90 text-white text-[10px] sm:text-[11px] font-black rounded-lg uppercase tracking-wider backdrop-blur-sm shadow">
              Agotado
            </span>
          ) : (
            <>
              {onSale && (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-amber-500 text-slate-950 text-[10px] sm:text-[11px] font-black rounded-lg uppercase tracking-wider shadow">
                  -{discountPercent(product)}%
                </span>
              )}
              {product.isNew && (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-cyan-500 text-slate-950 text-[10px] sm:text-[11px] font-black rounded-lg uppercase tracking-wider shadow">
                  Nuevo
                </span>
              )}
              {product.forWomen && (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-pink-500 text-white text-[9px] sm:text-[10px] font-bold rounded-lg shadow">
                  Mujer
                </span>
              )}
            </>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFav(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 sm:p-2.5 rounded-full transition-all shadow-md ${
            isFav
              ? "bg-pink-500 text-white shadow-pink-500/30 scale-105"
              : "bg-white/95 text-slate-400 hover:text-pink-500 hover:bg-white backdrop-blur-sm"
          }`}
          title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? "fill-current" : ""}`} />
        </button>

        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden flex items-center justify-center p-3 sm:p-4">
          <Link href={`/producto/${product.slug}`} className="w-full h-full relative block">
            <Image
              src={product.images[0] || "/logo.jpg"}
              alt={product.name}
              fill
              className="object-contain p-2 group-hover:scale-108 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </Link>

          {/* Quick View Button on Desktop Hover */}
          <div className="absolute inset-x-3 bottom-2.5 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={() => setQuickViewOpen(true)}
              className="w-full py-2 px-3 bg-[#0B1528]/95 hover:bg-[#0B1528] text-white text-xs font-bold rounded-xl shadow-lg backdrop-blur-sm flex items-center justify-center gap-1.5 border border-cyan-400/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Vista Rápida
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between bg-white text-left">
          <div>
            {/* Sizes mini badges */}
            <div className="flex items-center gap-1 mb-1.5 overflow-hidden flex-wrap">
              {product.sizes.slice(0, 4).map((s) => (
                <span
                  key={s.label}
                  className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    s.soldOut
                      ? "text-slate-300 line-through bg-slate-50"
                      : "text-slate-600 bg-slate-100"
                  }`}
                >
                  {s.label}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[9px] sm:text-[10px] text-slate-400">+{product.sizes.length - 4}</span>
              )}
            </div>

            {/* Title */}
            <Link href={`/producto/${product.slug}`} className="block group/link">
              <h3 className="font-bold text-slate-900 text-xs sm:text-base leading-snug line-clamp-2 group-hover/link:text-cyan-600 transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="mt-2.5 pt-2 sm:mt-3 sm:pt-3 border-t border-slate-100 space-y-2">
            {/* Price & Estampable */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-[#0B1528] text-sm sm:text-lg">
                  {formatPrice(price)}
                </span>
                {onSale && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {product.customization?.enabled && (
                <span className="text-[9px] sm:text-[10px] text-cyan-700 font-semibold flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> Estampable
                </span>
              )}
            </div>

            {/* CLEAR VISIBLE BUTTON FOR MOBILE & DESKTOP */}
            <button
              type="button"
              onClick={() => setQuickViewOpen(true)}
              className="w-full py-2 px-3 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 text-cyan-950 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all border border-cyan-200/90 shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-600" />
              <span>Ver Opciones / Pedir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <ProductQuickView
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
