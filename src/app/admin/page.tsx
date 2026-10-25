"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Package, 
  ShoppingBag, 
  Layers, 
  ShieldCheck, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Star, 
  UploadCloud, 
  Search, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  MessageCircle, 
  Save, 
  RefreshCw, 
  Database, 
  ExternalLink,
  Lock,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";
import { 
  listCollection, 
  upsertItem, 
  removeItem, 
  saveOrder, 
  listOrders, 
  updateOrderStatus, 
  saveSettings, 
  seedFirestore, 
  resetDemoData 
} from "@/lib/repo";
import { isFirebaseEnabled, auth } from "@/lib/firebase";
import { uploadImage } from "@/lib/upload";
import { ADMIN_EMAILS, slugify } from "@/lib/defaults";
import { formatPrice, effectivePrice, isOnSale, isSoldOut } from "@/lib/utils";
import type { Product, Category, Team, Banner, Order, OrderStatus, StoreSettings, SizeOption } from "@/lib/types";

export default function AdminPage() {
  const { products, categories, teams, banners, settings, reload } = useCatalog();

  // Authentication state
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [tab, setTab] = useState<"productos" | "pedidos" | "categorias" | "equipos" | "banners" | "config">("productos");

  // Orders list
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Product Filter & Search
  const [prodSearch, setProdSearch] = useState("");
  const [prodCatFilter, setProdCatFilter] = useState("all");

  // Product Edit Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [newSizeInput, setNewSizeInput] = useState("");

  // Category Edit Modal
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);

  // Team Edit Modal
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isNewTeam, setIsNewTeam] = useState(false);

  // Banner Edit Modal
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isNewBanner, setIsNewBanner] = useState(false);

  // Store Settings local form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Check auth on load
  useEffect(() => {
    // Check local session
    const saved = localStorage.getItem("mf-admin-session");
    if (saved) setCurrentUserEmail(saved);

    // If Firebase Auth is enabled, listen
    if (isFirebaseEnabled) {
      import("firebase/auth").then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth(), (user) => {
          if (user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
            setCurrentUserEmail(user.email);
            localStorage.setItem("mf-admin-session", user.email);
          }
        });
      });
    }
  }, []);

  // Sync settings when loaded
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Load orders when entering pedidos tab
  useEffect(() => {
    if (tab === "pedidos") {
      setOrdersLoading(true);
      listOrders()
        .then(setOrders)
        .finally(() => setOrdersLoading(false));
    }
  }, [tab]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const email = loginEmail.trim().toLowerCase();
    const authorized = ADMIN_EMAILS.map((x) => x.toLowerCase());

    if (!authorized.includes(email)) {
      setAuthError(`El correo ${email} no está en la lista de administradores autorizados.`);
      setAuthLoading(false);
      return;
    }

    if (isFirebaseEnabled) {
      try {
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        await signInWithEmailAndPassword(auth(), email, loginPass);
        setCurrentUserEmail(email);
        localStorage.setItem("mf-admin-session", email);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setAuthError(e.message || "Error al iniciar sesión con Firebase.");
      } finally {
        setAuthLoading(false);
      }
    } else {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: loginPass }),
        });
        const data = await res.json();
        if (!res.ok) {
          setAuthError(data.error || "Contraseña o credenciales incorrectas.");
          setAuthLoading(false);
          return;
        }
        setCurrentUserEmail(email);
        localStorage.setItem("mf-admin-session", email);
      } catch {
        setAuthError("No se pudo conectar con el servidor para validar la contraseña.");
      } finally {
        setAuthLoading(false);
      }
    }
  };

  const handleLogout = () => {
    if (isFirebaseEnabled) {
      import("firebase/auth").then(({ signOut }) => signOut(auth()));
    }
    localStorage.removeItem("mf-admin-session");
    setCurrentUserEmail(null);
  };

  // ----------------------------------------------------------------
  // Product handlers
  // ----------------------------------------------------------------
  const handleOpenCreateProduct = () => {
    const defaultSizes: SizeOption[] = [
      { label: "S", soldOut: false },
      { label: "M", soldOut: false },
      { label: "L", soldOut: false },
      { label: "XL", soldOut: false },
      { label: "XXL", soldOut: false },
    ];
    setEditingProduct({
      id: "prod-" + Date.now().toString(36),
      name: "",
      slug: "",
      categorySlug: categories[0]?.slug || "retro",
      teamSlug: null,
      forWomen: false,
      description: "",
      images: [],
      price: 85000,
      salePrice: null,
      sizes: defaultSizes,
      customization: { enabled: true, extraPrice: 25000 },
      isNew: true,
      isFeatured: false,
      hidden: false,
      order: products.length,
    });
    setIsNewProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;

    const prodToSave = {
      ...editingProduct,
      slug: editingProduct.slug || slugify(editingProduct.name),
      updatedAt: Date.now(),
    };

    await upsertItem("products", prodToSave);
    await reload();
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Seguro que deseas eliminar la camiseta "${name}"?`)) return;
    await removeItem("products", id);
    await reload();
  };

  const handleToggleProductProp = async (prod: Product, prop: "hidden" | "isFeatured" | "isNew") => {
    const updated = { ...prod, [prop]: !prod[prop] };
    await upsertItem("products", updated);
    await reload();
  };

  const handleToggleProductSoldOut = async (prod: Product) => {
    const allSoldOut = isSoldOut(prod);
    const newSizes = prod.sizes.map((s) => ({ ...s, soldOut: !allSoldOut }));
    const updated = { ...prod, sizes: newSizes };
    await upsertItem("products", updated);
    await reload();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editingProduct) return;
    setUploadingImg(true);
    try {
      const url = await uploadImage(e.target.files[0]);
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, url],
      });
    } catch (err) {
      alert("Error al subir la imagen: " + (err as Error).message);
    } finally {
      setUploadingImg(false);
    }
  };

  // ----------------------------------------------------------------
  // Settings & Sync Handlers
  // ----------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(settingsForm);
    await reload();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleSyncFirestore = async () => {
    if (!confirm("¿Deseas subir todos los productos iniciales a Firestore? Esto creará las colecciones en tu proyecto de Firebase.")) return;
    setSyncStatus("Subiendo catálogo a Firestore...");
    try {
      await seedFirestore((msg) => setSyncStatus(msg));
      await reload();
      setSyncStatus("¡Sincronización completada con éxito!");
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      setSyncStatus("Error: " + (err as Error).message);
    }
  };

  // Filtered Products for Admin Table
  const adminFilteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (prodSearch.trim()) {
        const q = prodSearch.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.categorySlug.includes(q)) return false;
      }
      if (prodCatFilter !== "all" && p.categorySlug !== prodCatFilter) {
        return false;
      }
      return true;
    });
  }, [products, prodSearch, prodCatFilter]);

  // If not logged in, show Login Screen
  if (!currentUserEmail) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-100">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 space-y-6">
          <div className="text-center space-y-2">
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-cyan-400 p-0.5 bg-white shadow-md">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover rounded-full" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Panel Administrativo
            </h1>
            <p className="text-xs text-slate-500">
              Acceso exclusivo para administradores de J&A Mundo Fútbol.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Correo Electrónico de Administrador
              </label>
              <input
                type="email"
                placeholder="pradoblancop@gmail.com o adrianapradob@hotmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {!isFirebaseEnabled && "(Modo demo local: ingresa tu correo autorizado para entrar directamente)"}
              </p>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0B1528] hover:bg-[#162447] text-white font-black text-xs sm:text-sm shadow-lg transition-all"
            >
              {authLoading ? "Verificando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-cyan-600 hover:underline">
              ← Volver a la Tienda Pública
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard Main Layout
  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Top Admin Header */}
      <header className="bg-[#0B1528] text-white border-b border-cyan-500/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400 relative">
              <Image src="/logo.jpg" alt="" fill className="object-cover" />
            </div>
            <div>
              <span className="font-black text-sm tracking-wide text-white uppercase">
                Panel <span className="text-cyan-400">Admin</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] text-cyan-300 ml-2 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40">
                {currentUserEmail}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Ver Tienda
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto text-xs font-bold border-t border-slate-800">
          <button
            onClick={() => setTab("productos")}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              tab === "productos"
                ? "border-cyan-400 text-cyan-400 bg-white/5"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" /> Camisetas ({products.length})
          </button>

          <button
            onClick={() => setTab("pedidos")}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              tab === "pedidos"
                ? "border-cyan-400 text-cyan-400 bg-white/5"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Pedidos Registrados
          </button>

          <button
            onClick={() => setTab("categorias")}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              tab === "categorias"
                ? "border-cyan-400 text-cyan-400 bg-white/5"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" /> Categorías ({categories.length})
          </button>

          <button
            onClick={() => setTab("equipos")}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              tab === "equipos"
                ? "border-cyan-400 text-cyan-400 bg-white/5"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Equipos ({teams.length})
          </button>

          <button
            onClick={() => setTab("banners")}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              tab === "banners"
                ? "border-cyan-400 text-cyan-400 bg-white/5"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Banners Portada ({banners.length})
          </button>

          <button
            onClick={() => setTab("config")}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              tab === "config"
                ? "border-cyan-400 text-cyan-400 bg-white/5"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <SettingsIcon className="w-4 h-4" /> Configuración de Tienda
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 pt-3 sm:pt-6 pb-12">
        
        {/* ========================================================== */}
        {/* TAB 1: PRODUCTOS                                           */}
        {/* ========================================================== */}
        {tab === "productos" && (
          <div className="space-y-3">
            {/* Toolbar Compact */}
            <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar camiseta por nombre..."
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    className="w-full bg-slate-50 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Filter Category */}
                <select
                  value={prodCatFilter}
                  onChange={(e) => setProdCatFilter(e.target.value)}
                  className="w-full sm:w-auto bg-slate-50 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">Todas las Categorías ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add New Product Button */}
              <button
                onClick={handleOpenCreateProduct}
                className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Nueva Camiseta
              </button>
            </div>

            {/* Products Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* VISTA MÓVIL (Compacta, sin scroll horizontal) */}
              <div className="block md:hidden divide-y divide-slate-100">
                {adminFilteredProducts.map((p) => {
                  const soldOut = isSoldOut(p);
                  return (
                    <div
                      key={p.id}
                      className={`p-2.5 flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                        p.hidden ? "opacity-60 bg-slate-50/60" : ""
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-14 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200 shrink-0">
                        <Image src={p.images[0] || "/logo.jpg"} alt="" fill className="object-contain p-0.5" />
                      </div>

                      {/* Info & Controles */}
                      <div className="flex-1 min-w-0">
                        {/* Fila 1: Título y Precio */}
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 text-xs truncate leading-snug">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-cyan-700 font-semibold flex items-center gap-1 mt-0.5">
                              <span>{p.categorySlug}</span>
                              {p.teamSlug && <span>• {p.teamSlug}</span>}
                              {p.forWomen && <span className="text-pink-600 font-bold">• Mujer</span>}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-black text-slate-900 text-xs">
                              {formatPrice(effectivePrice(p))}
                            </div>
                            {p.salePrice && (
                              <div className="text-[9px] text-amber-600 font-bold line-through">
                                {formatPrice(p.price)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Fila 2: Tallas y Acciones */}
                        <div className="flex items-center justify-between gap-1 mt-1.5 pt-1 border-t border-slate-100">
                          {/* Tallas */}
                          <div className="flex items-center gap-1 flex-wrap">
                            {p.sizes.map((s) => (
                              <span
                                key={s.label}
                                className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                                  s.soldOut
                                    ? "bg-red-100 text-red-600 line-through"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {s.label}
                              </span>
                            ))}
                            <button
                              onClick={() => handleToggleProductSoldOut(p)}
                              className={`text-[9px] font-bold underline ml-1 ${
                                soldOut ? "text-green-600" : "text-amber-600"
                              }`}
                            >
                              {soldOut ? "Disponible" : "Agotar"}
                            </button>
                          </div>

                          {/* Botones de Estado y Acciones */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleToggleProductProp(p, "isFeatured")}
                              className={`p-1 rounded-md border ${
                                p.isFeatured
                                  ? "bg-amber-100 border-amber-300 text-amber-600"
                                  : "bg-slate-50 border-slate-200 text-slate-300"
                              }`}
                              title="Destacado"
                            >
                              <Star className={`w-3 h-3 ${p.isFeatured ? "fill-current" : ""}`} />
                            </button>

                            <button
                              onClick={() => handleToggleProductProp(p, "hidden")}
                              className={`p-1 rounded-md border ${
                                p.hidden
                                  ? "bg-slate-200 border-slate-300 text-slate-500"
                                  : "bg-green-50 border-green-200 text-green-600"
                              }`}
                              title={p.hidden ? "Oculto" : "Visible"}
                            >
                              {p.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>

                            <button
                              onClick={() => {
                                setEditingProduct({ ...p });
                                setIsNewProduct(false);
                              }}
                              className="p-1 rounded-md bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700"
                              title="Editar"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1 rounded-md bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* VISTA ESCRITORIO (Tabla compacta y densa) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-2 px-3 w-14">Foto</th>
                      <th className="py-2 px-3">Nombre / Categoría</th>
                      <th className="py-2 px-3">Precio</th>
                      <th className="py-2 px-3">Tallas / Stock</th>
                      <th className="py-2 px-3">Estado</th>
                      <th className="py-2 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {adminFilteredProducts.map((p) => {
                      const soldOut = isSoldOut(p);
                      return (
                        <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${p.hidden ? "opacity-60 bg-slate-50/50" : ""}`}>
                          {/* Image */}
                          <td className="py-1.5 px-3">
                            <div className="w-9 h-11 rounded-md bg-slate-100 overflow-hidden relative border border-slate-200">
                              <Image src={p.images[0] || "/logo.jpg"} alt="" fill className="object-contain p-0.5" />
                            </div>
                          </td>

                          {/* Name and Category */}
                          <td className="py-1.5 px-3 max-w-sm">
                            <div className="font-extrabold text-slate-900 text-xs truncate">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-cyan-600 font-semibold flex items-center gap-1.5 mt-0.5">
                              <span>{p.categorySlug}</span>
                              {p.teamSlug && <span>• {p.teamSlug}</span>}
                              {p.forWomen && <span className="text-pink-600 font-bold">• Mujer</span>}
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-1.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                            <div>{formatPrice(effectivePrice(p))}</div>
                            {p.salePrice && (
                              <div className="text-[9px] text-amber-600 font-bold">
                                Oferta (orig. {formatPrice(p.price)})
                              </div>
                            )}
                          </td>

                          {/* Sizes / Sold Out Toggle */}
                          <td className="py-1.5 px-3">
                            <div className="flex items-center gap-1 flex-wrap">
                              {p.sizes.map((s) => (
                                <span
                                  key={s.label}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                    s.soldOut
                                      ? "bg-red-100 text-red-600 line-through"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {s.label}
                                </span>
                              ))}
                              <button
                                onClick={() => handleToggleProductSoldOut(p)}
                                className={`text-[10px] font-bold underline ml-1.5 ${
                                  soldOut ? "text-green-600" : "text-amber-600"
                                }`}
                              >
                                {soldOut ? "Disponible" : "Agotar"}
                              </button>
                            </div>
                          </td>

                          {/* Badges Toggles */}
                          <td className="py-1.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              {/* Featured Toggle */}
                              <button
                                onClick={() => handleToggleProductProp(p, "isFeatured")}
                                className={`p-1 rounded-md border transition-colors ${
                                  p.isFeatured
                                    ? "bg-amber-100 border-amber-300 text-amber-600"
                                    : "bg-slate-50 border-slate-200 text-slate-300 hover:text-amber-500"
                                }`}
                                title="Destacado en portada"
                              >
                                <Star className={`w-3 h-3 ${p.isFeatured ? "fill-current" : ""}`} />
                              </button>

                              {/* New Toggle */}
                              <button
                                onClick={() => handleToggleProductProp(p, "isNew")}
                                className={`px-1.5 py-0.5 rounded-md border text-[9px] font-black transition-colors ${
                                  p.isNew
                                    ? "bg-cyan-100 border-cyan-300 text-cyan-700"
                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-cyan-600"
                                }`}
                                title="Etiqueta Nuevo"
                              >
                                NUEVO
                              </button>

                              {/* Visibility Toggle */}
                              <button
                                onClick={() => handleToggleProductProp(p, "hidden")}
                                className={`p-1 rounded-md border transition-colors ${
                                  p.hidden
                                    ? "bg-slate-200 border-slate-300 text-slate-500"
                                    : "bg-green-50 border-green-200 text-green-600"
                                }`}
                                title={p.hidden ? "Oculto (clic para mostrar)" : "Visible en la tienda"}
                              >
                                {p.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-1.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditingProduct({ ...p });
                                  setIsNewProduct(false);
                                }}
                                className="p-1.5 rounded-md bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 transition-colors"
                                title="Editar"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 rounded-md bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: PEDIDOS REGISTRADOS                                  */}
        {/* ========================================================== */}
        {tab === "pedidos" && (
          <div className="space-y-6">
            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Pedidos</span>
                <div className="text-3xl font-black text-slate-900 mt-1">{orders.length}</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Estimado</span>
                <div className="text-3xl font-black text-cyan-600 mt-1">
                  {formatPrice(orders.reduce((sum, o) => sum + o.total, 0))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Pedidos Nuevos</span>
                <div className="text-3xl font-black text-green-600 mt-1">
                  {orders.filter((o) => o.status === "nuevo").length}
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Historial de Pedidos Enviados por WhatsApp
                </h3>
                <button
                  onClick={() => listOrders().then(setOrders)}
                  className="text-xs text-cyan-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Actualizar
                </button>
              </div>

              {ordersLoading ? (
                <div className="py-16 text-center text-slate-400">Cargando pedidos...</div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  Aún no se han registrado pedidos desde el carrito.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                      <tr>
                        <th className="py-3 px-4">Fecha / ID</th>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">Contacto / Ciudad</th>
                        <th className="py-3 px-4">Prendas</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">
                              {new Date(ord.createdAt).toLocaleDateString("es-CO")}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {new Date(ord.createdAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-black text-slate-900">
                            {ord.customer.name}
                            {ord.customer.notes && (
                              <div className="text-[10px] font-normal text-slate-500 italic mt-0.5">
                                Nota: {ord.customer.notes}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div>{ord.customer.phone || "-"}</div>
                            <div className="text-[10px] text-slate-400">{ord.customer.city || "-"} {ord.customer.address || ""}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="text-[11px]">
                                  • {it.quantity}x {it.name} (Talla {it.size})
                                  {it.customization && (
                                    <span className="text-cyan-700 font-semibold block text-[10px] pl-2">
                                      ↳ Estampado: {it.customization.name} #{it.customization.number}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-black text-slate-900">
                            {formatPrice(ord.total)}
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={ord.status}
                              onChange={async (e) => {
                                const newSt = e.target.value as OrderStatus;
                                await updateOrderStatus(ord.id, newSt);
                                setOrders((prev) => prev.map((o) => (o.id === ord.id ? { ...o, status: newSt } : o)));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                                ord.status === "nuevo"
                                  ? "bg-green-50 border-green-300 text-green-700"
                                  : ord.status === "confirmado"
                                  ? "bg-blue-50 border-blue-300 text-blue-700"
                                  : ord.status === "entregado"
                                  ? "bg-slate-100 border-slate-300 text-slate-700"
                                  : "bg-red-50 border-red-300 text-red-700"
                              }`}
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="confirmado">Confirmado</option>
                              <option value="entregado">Entregado</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: CATEGORIAS                                          */}
        {/* ========================================================== */}
        {tab === "categorias" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 text-base">
                Gestión de Categorías de la Tienda
              </h2>
              <button
                onClick={() => {
                  setEditingCategory({
                    id: "cat-" + Date.now().toString(36),
                    slug: "",
                    name: "",
                    image: "/seed/products/retro-real-madrid-02.webp",
                    description: "",
                    order: categories.length,
                  });
                  setIsNewCategory(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Nueva Categoría
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="relative aspect-video rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                    <Image src={c.image || "/logo.jpg"} alt="" fill className="object-contain p-2" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{c.name}</h4>
                    <p className="text-[11px] text-slate-400">/{c.slug}</p>
                    {c.description && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditingCategory({ ...c });
                        setIsNewCategory(false);
                      }}
                      className="text-xs text-cyan-600 font-bold hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm(`¿Eliminar la categoría "${c.name}"?`)) return;
                        await removeItem("categories", c.id);
                        await reload();
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: EQUIPOS                                              */}
        {/* ========================================================== */}
        {tab === "equipos" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 text-base">
                Equipos y Clubes (Filtros de Búsqueda)
              </h2>
              <button
                onClick={() => {
                  setEditingTeam({
                    id: "team-" + Date.now().toString(36),
                    name: "",
                    slug: "",
                    order: teams.length,
                  });
                  setIsNewTeam(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Agregar Equipo
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {teams.map((t) => (
                  <div key={t.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.slug}</div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!confirm(`¿Eliminar equipo "${t.name}"?`)) return;
                        await removeItem("teams", t.id);
                        await reload();
                      }}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 5: BANNERS                                              */}
        {/* ========================================================== */}
        {tab === "banners" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 text-base">
                Banners del Carrusel de Portada
              </h2>
              <button
                onClick={() => {
                  setEditingBanner({
                    id: "banner-" + Date.now().toString(36),
                    image: "/seed/products/retro-real-madrid-02.webp",
                    title: "",
                    subtitle: "",
                    link: "/catalogo",
                    buttonText: "Ver Colección",
                    active: true,
                    order: banners.length,
                  });
                  setIsNewBanner(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Nuevo Banner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b) => (
                <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="relative aspect-video rounded-2xl bg-[#0B1528] overflow-hidden p-4 flex items-center justify-center">
                    <Image src={b.image || "/logo.jpg"} alt="" fill className="object-contain p-2" />
                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.active ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"
                    }`}>
                      {b.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900 text-base">{b.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{b.subtitle}</p>
                    <p className="text-[11px] text-cyan-600 font-semibold mt-1">Enlace: {b.link}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditingBanner({ ...b });
                        setIsNewBanner(false);
                      }}
                      className="text-xs text-cyan-600 font-bold hover:underline"
                    >
                      Editar Banner
                    </button>

                    <button
                      onClick={async () => {
                        if (!confirm("¿Eliminar este banner?")) return;
                        await removeItem("banners", b.id);
                        await reload();
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 6: CONFIGURACION DE TIENDA                              */}
        {/* ========================================================== */}
        {tab === "config" && (
          <div className="space-y-8 max-w-4xl">
            {/* Status & Sync Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Estado de la Base de Datos</h3>
                    <p className="text-xs text-slate-500">
                      {isFirebaseEnabled ? "Conectado a Google Firebase Firestore" : "Modo Local / Demo (LocalStorage activo)"}
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  isFirebaseEnabled ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {isFirebaseEnabled ? "Firebase Activo" : "Modo Demo"}
                </span>
              </div>

              {syncStatus && (
                <div className="p-3 bg-cyan-50 text-cyan-800 text-xs rounded-xl font-bold border border-cyan-200">
                  {syncStatus}
                </div>
              )}

              <div className="pt-2 flex flex-wrap gap-3">
                {isFirebaseEnabled && (
                  <button
                    onClick={handleSyncFirestore}
                    className="px-4 py-2.5 rounded-xl bg-[#0B1528] text-white text-xs font-bold hover:bg-[#162447] flex items-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4 text-cyan-400" /> Sincronizar Catálogo al Firestore
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm("¿Restablecer los datos demo locales?")) {
                      resetDemoData();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
                >
                  Restablecer datos de fábrica locales
                </button>
              </div>
            </div>

            {/* General Settings Form */}
            <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-900 text-lg">Información de la Tienda</h3>
                {settingsSaved && (
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> ¡Guardado exitosamente!
                  </span>
                )}
              </div>

              {/* WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Número de WhatsApp para Pedidos (con código de país)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Ej: 573213831679</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Sobrecosto por Defecto de Estampado (COP)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.customizationDefault}
                    onChange={(e) => setSettingsForm({ ...settingsForm, customizationDefault: Number(e.target.value) })}
                    className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Social Networks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Enlace de Instagram
                  </label>
                  <input
                    type="text"
                    value={settingsForm.socials.instagram}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socials: { ...settingsForm.socials, instagram: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Enlace de TikTok
                  </label>
                  <input
                    type="text"
                    value={settingsForm.socials.tiktok}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socials: { ...settingsForm.socials, tiktok: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* About Us text */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Texto "Quiénes Somos"
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.about}
                  onChange={(e) => setSettingsForm({ ...settingsForm, about: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Shipping text */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Texto de Envíos y Despachos
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.shipping}
                  onChange={(e) => setSettingsForm({ ...settingsForm, shipping: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" /> Guardar Configuración de la Tienda
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* MODAL: EDITAR / CREAR PRODUCTO                                */}
      {/* ============================================================ */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900">
                {isNewProduct ? "Agregar Nueva Camiseta" : "Editar Camiseta"}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-black font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Name and Slug */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nombre de la Camiseta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Real Madrid Retro 2002 Local"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
                />
              </div>

              {/* Category, Team and Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Categoría
                  </label>
                  <select
                    value={editingProduct.categorySlug}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categorySlug: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Equipo / Club
                  </label>
                  <select
                    value={editingProduct.teamSlug || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, teamSlug: e.target.value || null })}
                    className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="">(Sin equipo específico)</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ¿Es para mujer?
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.forWomen}
                      onChange={(e) => setEditingProduct({ ...editingProduct, forWomen: e.target.checked })}
                      className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-800">Sí, corte femenino</span>
                  </label>
                </div>
              </div>

              {/* Price and Sale Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Precio Normal (COP) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Precio de Oferta (Opcional)
                  </label>
                  <input
                    type="number"
                    placeholder="Dejar vacío si no aplica"
                    value={editingProduct.salePrice || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        salePrice: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Sizes manager with soldOut checkboxes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tallas Definidas y Disponibilidad:
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingProduct.sizes.map((sz, idx) => (
                    <div
                      key={idx}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                        sz.soldOut ? "bg-red-50 border-red-200 text-red-600" : "bg-slate-100 border-slate-200 text-slate-800"
                      }`}
                    >
                      <span>{sz.label}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...editingProduct.sizes];
                          updated[idx].soldOut = !updated[idx].soldOut;
                          setEditingProduct({ ...editingProduct, sizes: updated });
                        }}
                        className="text-[10px] underline ml-1 text-slate-500"
                      >
                        {sz.soldOut ? "Agotada" : "En Stock"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct({
                            ...editingProduct,
                            sizes: editingProduct.sizes.filter((_, i) => i !== idx),
                          });
                        }}
                        className="text-slate-400 hover:text-red-600 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new size input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Agregar talla (ej: 4, 16, 3XL...)"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    className="bg-slate-50 text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSizeInput.trim()) return;
                      setEditingProduct({
                        ...editingProduct,
                        sizes: [...editingProduct.sizes, { label: newSizeInput.trim().toUpperCase(), soldOut: false }],
                      });
                      setNewSizeInput("");
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
                  >
                    + Agregar Talla
                  </button>
                </div>
              </div>

              {/* Customization (Estampado) */}
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.customization.enabled}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        customization: { ...editingProduct.customization, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-cyan-600"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Permitir personalizar con nombre y número
                  </span>
                </label>
                {editingProduct.customization.enabled && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-slate-600">Sobrecosto del estampado:</span>
                    <input
                      type="number"
                      value={editingProduct.customization.extraPrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          customization: { ...editingProduct.customization, extraPrice: Number(e.target.value) },
                        })
                      }
                      className="bg-white text-xs px-2.5 py-1 rounded-lg border border-cyan-300 w-28 font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Images Manager */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Fotos de la Camiseta
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editingProduct.images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden group">
                      <Image src={img} alt="" fill className="object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct({
                            ...editingProduct,
                            images: editingProduct.images.filter((_, i) => i !== idx),
                          });
                        }}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Upload button */}
                  <label className="w-16 h-16 rounded-xl border-2 border-dashed border-cyan-400 bg-cyan-50/50 hover:bg-cyan-50 flex flex-col items-center justify-center cursor-pointer text-cyan-600 text-xs font-bold transition-colors">
                    <UploadCloud className="w-5 h-5 mb-0.5" />
                    <span>{uploadingImg ? "..." : "+ Subir"}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImg} />
                  </label>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Destacado en Portada</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNew}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Marcar como Nuevo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.hidden}
                    onChange={(e) => setEditingProduct({ ...editingProduct, hidden: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-700"
                  />
                  <span className="text-xs font-bold text-slate-800">Ocultar de la Tienda</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0B1528] hover:bg-[#162447] text-white text-xs font-black shadow-md"
                >
                  Guardar Camiseta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDITAR CATEGORIA                                      */}
      {/* ============================================================ */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-black text-base text-slate-900">
              {isNewCategory ? "Nueva Categoría" : "Editar Categoría"}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await upsertItem("categories", {
                  ...editingCategory,
                  slug: editingCategory.slug || slugify(editingCategory.name),
                });
                await reload();
                setEditingCategory(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">URL de la Imagen</label>
                <input
                  type="text"
                  value={editingCategory.image}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Descripción corta</label>
                <input
                  type="text"
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B1528] text-white rounded-xl text-xs font-black"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDITAR EQUIPO                                         */}
      {/* ============================================================ */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-black text-base text-slate-900">
              {isNewTeam ? "Agregar Equipo / Club" : "Editar Equipo"}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await upsertItem("teams", {
                  ...editingTeam,
                  slug: editingTeam.slug || slugify(editingTeam.name),
                });
                await reload();
                setEditingTeam(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Equipo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Liverpool, Boca Juniors..."
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B1528] text-white rounded-xl text-xs font-black"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDITAR BANNER                                         */}
      {/* ============================================================ */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-black text-base text-slate-900">
              {isNewBanner ? "Nuevo Banner de Portada" : "Editar Banner"}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await upsertItem("banners", editingBanner);
                await reload();
                setEditingBanner(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Título Principal</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">URL de la Imagen</label>
                <input
                  type="text"
                  required
                  value={editingBanner.image}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Enlace (Ruta)</label>
                  <input
                    type="text"
                    value={editingBanner.link}
                    onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Texto del Botón</label>
                  <input
                    type="text"
                    value={editingBanner.buttonText}
                    onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingBanner.active}
                  onChange={(e) => setEditingBanner({ ...editingBanner, active: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-600"
                />
                <span className="text-xs font-bold text-slate-800">Banner Activo (Visible en Portada)</span>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B1528] text-white rounded-xl text-xs font-black"
                >
                  Guardar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
