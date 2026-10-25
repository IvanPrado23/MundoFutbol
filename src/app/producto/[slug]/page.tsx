"use client";

import { use, useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  Share2
} from "lucide-react";
import { useCatalog, useVisibleProducts } from "@/components/CatalogProvider";
import { ProductCard } from "@/components/ProductCard";
import { useCart, useFavorites } from "@/lib/store";
import { formatPrice, effectivePrice, isOnSale, isSoldOut, discountPercent, whatsappUrl } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function ProductDetailInner({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { categories, teams, settings, loading } = useCatalog();
  const allProducts = useVisibleProducts();
  const { add: addToCart, open: openCart } = useCart();
  const { ids: favIds, toggle: toggleFav } = useFavorites();

  const product = allProducts.find((p) => p.slug === slug || p.id === slug);

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [customEnabled, setCustomEnabled] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Derived data
  const isFav = product ? favIds.includes(product.id) : false;
  const category = categories.find((c) => c.slug === product?.categorySlug);
  const team = teams.find((t) => t.slug === product?.teamSlug);
  const soldOut = product ? isSoldOut(product) : false;

  const basePrice = product ? effectivePrice(product) : 0;
  const extraPrice = customEnabled ? (product?.customization?.extraPrice || settings.customizationDefault || 15000) : 0;
  const totalPrice = (basePrice + extraPrice) * quantity;

  // Active available sizes
  const activeSizes = product?.sizes.filter((s) => !s.soldOut) || [];
  const currentSize = selectedSize || (activeSizes.length > 0 ? activeSizes[0].label : "");

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
      .slice(0, 4);
  }, [allProducts, product]);

  if (!loading && !product) {
    return notFound();
  }

  if (!product) {
    return <div className="py-24 text-center text-slate-400">Cargando camiseta...</div>;
  }

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
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNowDirect = () => {
    if (!currentSize) return;
    const msg = [
      `⚽ *¡HOLA J&A MUNDO FÚTBOL!* 👋`,
      `Quiero pedir esta camiseta directamente:`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `👕 *${product.name}*`,
      `▫️ Talla: *${currentSize}*`,
      customEnabled ? `✨ *Estampado:* ${customName.toUpperCase()} #${customNumber} (+${formatPrice(extraPrice)})` : null,
      `▫️ Cantidad: *${quantity}*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `💰 *Total estimado: ${formatPrice(totalPrice)}*`,
      ``,
      `¿Tienen disponibilidad para envío inmediato? ¡Muchas gracias! 🙌🔥`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappUrl(settings.whatsapp || "573213831679", msg), "_blank");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-cyan-600">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-cyan-600">
          Catálogo
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/categoria/${category.slug}`} className="hover:text-cyan-600">
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-bold text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[3/4] bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center p-6">
            <Image
              src={product.images[selectedImg] || product.images[0] || "/logo.jpg"}
              alt={product.name}
              fill
              className="object-contain p-4 hover:scale-105 transition-transform duration-500"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
              {isOnSale(product) && (
                <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black rounded-lg shadow uppercase">
                  -{discountPercent(product)}% OFF
                </span>
              )}
              {product.isNew && (
                <span className="px-3 py-1 bg-cyan-500 text-slate-950 text-xs font-black rounded-lg shadow uppercase">
                  Nuevo Modelo
                </span>
              )}
              {product.forWomen && (
                <span className="px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-lg shadow">
                  Versión Femenina
                </span>
              )}
            </div>

            {/* Action icons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-3 rounded-full bg-white/90 text-slate-600 hover:text-cyan-600 hover:bg-white shadow transition-all"
                title="Compartir enlace"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => toggleFav(product.id)}
                className={`p-3 rounded-full shadow transition-all ${
                  isFav
                    ? "bg-pink-500 text-white shadow-pink-500/30"
                    : "bg-white/90 text-slate-600 hover:text-pink-500 hover:bg-white"
                }`}
                title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
              </button>
            </div>
            {copied && (
              <span className="absolute bottom-4 right-4 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg shadow">
                ¡Enlace copiado!
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`w-20 h-20 relative rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-50 ${
                    selectedImg === idx ? "border-cyan-500 scale-105 shadow-md" : "border-slate-200 opacity-70"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Sizes, Personalization, Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 mb-2">
              {category && <span>{category.name}</span>}
              {team && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{team.name}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-black text-[#0B1528]">
                {formatPrice(basePrice)}
              </span>
              {isOnSale(product) && (
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-xs text-slate-500 font-semibold ml-2">
                (Precios en pesos colombianos COP)
              </span>
            </div>
          </div>

          {/* Sizes Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
                Selecciona tu Talla:
              </span>
              <Link
                href="/guia-de-tallas"
                className="text-xs text-cyan-600 hover:text-cyan-700 font-bold underline"
              >
                Guía de Medidas
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const isSelected = currentSize === s.label;
                return (
                  <button
                    key={s.label}
                    type="button"
                    disabled={s.soldOut}
                    onClick={() => setSelectedSize(s.label)}
                    className={`min-w-14 h-12 px-4 rounded-2xl font-black text-sm border transition-all flex items-center justify-center ${
                      s.soldOut
                        ? "bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed"
                        : isSelected
                        ? "bg-[#0B1528] border-[#0B1528] text-white shadow-lg scale-105"
                        : "bg-white border-slate-300 text-slate-800 hover:border-cyan-500"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customization (Estampado) */}
          {product.customization?.enabled && (
            <div className="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={customEnabled}
                  onChange={(e) => setCustomEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                    Personalizar camiseta (Estampado oficial)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Agrega tu nombre o el de tu jugador favorito y dorsal
                  </div>
                </div>
                <span className="text-xs font-black text-cyan-800 ml-auto whitespace-nowrap">
                  +{formatPrice(product.customization.extraPrice || settings.customizationDefault || 15000)}
                </span>
              </label>

              {customEnabled && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                      Nombre en la espalda
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: MESSI, JAMES..."
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                      maxLength={14}
                      className="w-full bg-white px-3.5 py-2 text-xs font-bold rounded-xl border border-cyan-300 uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                      Número (Dorsal)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 10"
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ""))}
                      maxLength={2}
                      className="w-full bg-white px-3.5 py-2 text-xs font-bold rounded-xl border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity and Total */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
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

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Total estimado:</span>
              <span className="text-2xl font-black text-[#0B1528]">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add to cart */}
              <button
                type="button"
                disabled={soldOut || !currentSize}
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all ${
                  soldOut
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : added
                    ? "bg-green-600 text-white shadow-green-500/30"
                    : "bg-[#0B1528] hover:bg-[#162447] text-white shadow-slate-900/20 active:scale-95"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> ¡Agregada al Carrito!
                  </>
                ) : soldOut ? (
                  "Camiseta Agotada"
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-cyan-400" /> Agregar al Carrito
                  </>
                )}
              </button>

              {/* Buy directly on WhatsApp */}
              <button
                type="button"
                disabled={soldOut || !currentSize}
                onClick={handleBuyNowDirect}
                className="py-4 px-6 rounded-2xl font-black text-sm bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 active:scale-95 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Pedir por WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cyan-600 flex-shrink-0" />
              <span>Calidad 1:1 con detalles exactos y escudos bordados.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-cyan-600 flex-shrink-0" />
              <span>Despachos a toda Colombia con transportadora aliada.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {product.description && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-900 text-lg">Descripción del Producto</h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Otras Camisetas Relacionadas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-400">Cargando camiseta...</div>}>
      <ProductDetailInner params={params} />
    </Suspense>
  );
}
