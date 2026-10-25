"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X, ArrowUpDown, Sparkles, SlidersHorizontal } from "lucide-react";
import { useCatalog, useVisibleProducts } from "@/components/CatalogProvider";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";

function CatalogContent() {
  const searchParams = useSearchParams();
  const { categories, teams, loading } = useCatalog();
  const allProducts = useVisibleProducts();

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [onlyWomen, setOnlyWomen] = useState(false);
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("order");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read URL query params on load
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
    const cat = searchParams.get("cat");
    if (cat) setSelectedCat(cat);
    const team = searchParams.get("team");
    if (team) setSelectedTeam(team);
    const mujer = searchParams.get("mujer");
    if (mujer === "true") setOnlyWomen(true);
  }, [searchParams]);

  // Available sizes across all products
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.sizes.forEach((s) => set.add(s.label)));
    return Array.from(set).sort();
  }, [allProducts]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Search query
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.categorySlug.toLowerCase().includes(q);
          const matchTeam = p.teamSlug ? p.teamSlug.toLowerCase().includes(q) : false;
          if (!matchName && !matchCat && !matchTeam) return false;
        }
        // Category filter
        if (selectedCat !== "all" && p.categorySlug !== selectedCat) {
          return false;
        }
        // Team filter
        if (selectedTeam !== "all" && p.teamSlug !== selectedTeam) {
          return false;
        }
        // Women filter
        if (onlyWomen && !p.forWomen) {
          return false;
        }
        // Customizable filter
        if (onlyCustomizable && !p.customization?.enabled) {
          return false;
        }
        // Size filter
        if (selectedSize !== "all") {
          const hasSize = p.sizes.some((s) => s.label === selectedSize && !s.soldOut);
          if (!hasSize) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (a.salePrice || a.price) - (b.salePrice || b.price);
        if (sortBy === "price-desc") return (b.salePrice || b.price) - (a.salePrice || a.price);
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return a.order - b.order;
      });
  }, [allProducts, search, selectedCat, selectedTeam, onlyWomen, onlyCustomizable, selectedSize, sortBy]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCat("all");
    setSelectedTeam("all");
    setOnlyWomen(false);
    setOnlyCustomizable(false);
    setSelectedSize("all");
    setSortBy("order");
  };

  const hasActiveFilters =
    search ||
    selectedCat !== "all" ||
    selectedTeam !== "all" ||
    onlyWomen ||
    onlyCustomizable ||
    selectedSize !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B1528] via-[#162447] to-[#0B1528] text-white p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-cyan-400 font-extrabold text-xs uppercase tracking-wider block mb-1">
            Colección Completa
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Catálogo de Camisetas
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Descubre todos los modelos retro, mundialistas, tipo jugador 1:1, fútbol colombiano y uniformes.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-slate-700 text-center flex-shrink-0">
          <div className="text-2xl font-black text-cyan-400">{filteredProducts.length}</div>
          <div className="text-[11px] text-slate-300 uppercase font-bold">Modelos encontrados</div>
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por equipo, jugador, club..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-slate-900 text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-cyan-500 shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right actions: Filter button (mobile) and Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-600" />
            Filtros {hasActiveFilters && "(Activos)"}
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-2xl focus:outline-none focus:border-cyan-500 shadow-sm"
            >
              <option value="order">Ordenar: Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters Desktop */}
        <aside
          className={`lg:block ${
            mobileFiltersOpen
              ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
              : "hidden"
          } lg:sticky lg:top-24 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6`}
        >
          {/* Mobile close bar */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Filtros de Búsqueda</h3>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-2 text-slate-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="w-full py-2 px-3 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" /> Limpiar todos los filtros
            </button>
          )}

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
              Categoría
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCat("all")}
                className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition-colors flex items-center justify-between ${
                  selectedCat === "all"
                    ? "bg-[#0B1528] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>Todas</span>
                <span>{allProducts.length}</span>
              </button>
              {categories.map((c) => {
                const count = allProducts.filter((p) => p.categorySlug === c.slug).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition-colors flex items-center justify-between ${
                      selectedCat === c.slug
                        ? "bg-[#0B1528] text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[11px] opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Team Filter Dropdown */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-2">
              Equipo / Club
            </h4>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Todos los Equipos</option>
              {teams.map((t) => (
                <option key={t.id} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-2">
              Filtrar por Talla
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSize("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  selectedSize === "all"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                Todas
              </button>
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedSize === s
                      ? "bg-cyan-500 text-slate-950 border-cyan-500 font-extrabold"
                      : "bg-white text-slate-700 border-slate-200 hover:border-cyan-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Checkbox Toggles */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyWomen}
                onChange={(e) => setOnlyWomen(e.target.checked)}
                className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-800">
                Solo Colección Mujer ⚽
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyCustomizable}
                onChange={(e) => setOnlyCustomizable(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> Con opción estampado
              </span>
            </label>
          </div>

          {/* Apply button on mobile */}
          <div className="lg:hidden pt-4">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-3 bg-[#0B1528] text-white font-bold text-xs rounded-xl"
            >
              Ver {filteredProducts.length} Resultados
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="py-24 text-center text-slate-400">Cargando catálogo...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                No encontramos camisetas con estos filtros
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Prueba buscando otro equipo o limpiando los filtros para ver todos los productos.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-[#0B1528] text-white rounded-xl text-xs font-bold"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Cargando catálogo...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
