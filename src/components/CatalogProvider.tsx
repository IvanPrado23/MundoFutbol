"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadCatalog } from "@/lib/repo";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { useCart, useFavorites } from "@/lib/store";
import type { CatalogData } from "@/lib/types";

interface CatalogCtx extends CatalogData {
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const empty: CatalogData = { products: [], categories: [], teams: [], banners: [], settings: DEFAULT_SETTINGS };
const Ctx = createContext<CatalogCtx | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CatalogData>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setError(null);
      setData(await loadCatalog());
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar el catálogo. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    useCart.persist.rehydrate();
    useFavorites.persist.rehydrate();
    reload();
  }, [reload]);

  const value = useMemo(() => ({ ...data, loading, error, reload }), [data, loading, error, reload]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCatalog debe usarse dentro de CatalogProvider");
  return v;
}

/** Productos visibles para el público. */
export function useVisibleProducts() {
  const { products } = useCatalog();
  return useMemo(() => products.filter((p) => !p.hidden), [products]);
}
