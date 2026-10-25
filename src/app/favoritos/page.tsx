"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useCatalog, useVisibleProducts } from "@/components/CatalogProvider";
import { ProductCard } from "@/components/ProductCard";
import { useFavorites } from "@/lib/store";

export default function FavoritesPage() {
  const { ids: favIds } = useFavorites();
  const allProducts = useVisibleProducts();

  const favoriteProducts = allProducts.filter((p) => favIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-pink-500 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-pink-500" /> Tu lista de deseos
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
            Mis Camisetas Favoritas
          </h1>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? "guardada" : "guardadas"}
        </span>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">
            No tienes camisetas favoritas todavía
          </h3>
          <p className="text-xs text-slate-500">
            Toca el corazón en cualquier camiseta para guardarla aquí y encontrarla rápidamente cuando quieras pedir.
          </p>
          <div className="pt-2">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B1528] text-white text-xs font-bold hover:bg-[#162447] transition-all shadow-md"
            >
              Explorar Catálogo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {favoriteProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
