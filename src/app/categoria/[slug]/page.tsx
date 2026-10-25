"use client";

import { use, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Filter, Check } from "lucide-react";
import { useCatalog, useVisibleProducts } from "@/components/CatalogProvider";
import { ProductCard } from "@/components/ProductCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function CategoryInner({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const { categories, teams, loading } = useCatalog();
  const allProducts = useVisibleProducts();

  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [onlyWomen, setOnlyWomen] = useState(false);
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);

  const category = categories.find((c) => c.slug === slug);

  // Products belonging to this category
  const categoryProducts = useMemo(() => {
    return allProducts.filter((p) => p.categorySlug === slug);
  }, [allProducts, slug]);

  // Teams that exist within this category
  const availableTeams = useMemo(() => {
    const teamSlugs = new Set(categoryProducts.map((p) => p.teamSlug).filter(Boolean));
    return teams.filter((t) => teamSlugs.has(t.slug));
  }, [categoryProducts, teams]);

  // Filtered by team or features
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((p) => {
      if (selectedTeam !== "all" && p.teamSlug !== selectedTeam) return false;
      if (onlyWomen && !p.forWomen) return false;
      if (onlyCustomizable && !p.customization?.enabled) return false;
      return true;
    });
  }, [categoryProducts, selectedTeam, onlyWomen, onlyCustomizable]);

  if (!loading && !category && categoryProducts.length === 0) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-cyan-600">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-cyan-600">
          Categorías
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-900">{category?.name || slug}</span>
      </nav>

      {/* Hero Banner for Category */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#060D1A] via-[#0B1528] to-[#162447] text-white p-8 sm:p-12 border border-cyan-500/30 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-wider">
              Colección Oficial
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white">
              {category?.name || slug.toUpperCase()}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {category?.description || "Explora todas las camisetas disponibles en esta colección exclusiva."}
            </p>
          </div>

          <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-slate-700 text-center flex-shrink-0">
            <div className="text-3xl font-black text-cyan-400">{filteredProducts.length}</div>
            <div className="text-[11px] text-slate-300 uppercase font-bold">Camisetas disponibles</div>
          </div>
        </div>
      </div>

      {/* Subfilters bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Team pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={() => setSelectedTeam("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedTeam === "all"
                ? "bg-[#0B1528] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Todos los Equipos
          </button>
          {availableTeams.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTeam(t.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedTeam === t.slug
                  ? "bg-cyan-500 text-slate-950 font-extrabold shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Checkbox toggles */}
        <div className="flex items-center gap-4 text-xs font-bold flex-shrink-0">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyWomen}
              onChange={(e) => setOnlyWomen(e.target.checked)}
              className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-slate-300"
            />
            <span className="text-slate-800">Para Mujer</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyCustomizable}
              onChange={(e) => setOnlyCustomizable(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
            />
            <span className="text-slate-800">Con Estampado</span>
          </label>
        </div>
      </div>

      {/* Grid of products */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-slate-800 text-lg">
            No hay camisetas con estos filtros seleccionados
          </h3>
          <button
            onClick={() => {
              setSelectedTeam("all");
              setOnlyWomen(false);
              setOnlyCustomizable(false);
            }}
            className="px-5 py-2.5 bg-[#0B1528] text-white rounded-xl text-xs font-bold"
          >
            Ver todas las de {category?.name || "esta categoría"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-400">Cargando categoría...</div>}>
      <CategoryInner params={params} />
    </Suspense>
  );
}
