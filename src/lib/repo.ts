"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "./firebase";
import { DEFAULT_BANNERS, DEFAULT_CATEGORIES, DEFAULT_SETTINGS, DEFAULT_TEAMS } from "./defaults";
import type { Banner, CatalogData, Category, Order, OrderStatus, Product, StoreSettings, Team } from "./types";

export type CollectionName = "products" | "categories" | "teams" | "banners" | "orders";
type Entity = { id: string };

const LS_PREFIX = "mf-demo-";
const clean = <T,>(o: T): T => JSON.parse(JSON.stringify(o));
const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/* ------------------------------------------------------------------ */
/* Modo demo (sin Firebase): datos en localStorage                      */
/* ------------------------------------------------------------------ */

let seedProductsCache: Product[] | null = null;
async function loadSeedProducts(): Promise<Product[]> {
  if (seedProductsCache) return seedProductsCache;
  const res = await fetch("/seed/products.json");
  const raw = (await res.json()) as (Product & { page?: number })[];
  seedProductsCache = raw.map(({ page: _page, ...p }) => ({ ...p, createdAt: Date.now() }));
  return seedProductsCache;
}

function lsGet<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(LS_PREFIX + key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
function lsSet(key: string, value: unknown) {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
  } catch {
    throw new Error("El almacenamiento local del navegador está lleno. Usa imágenes más livianas o configura la base de datos.");
  }
}

async function localDefaults(col: CollectionName): Promise<Entity[]> {
  switch (col) {
    case "products":
      return loadSeedProducts();
    case "categories":
      return DEFAULT_CATEGORIES;
    case "teams":
      return DEFAULT_TEAMS;
    case "banners":
      return DEFAULT_BANNERS;
    default:
      return [];
  }
}

async function localList<T extends Entity>(col: CollectionName): Promise<T[]> {
  const stored = lsGet<T[]>(col);
  if (stored) {
    // Si los productos guardados en caché local tienen nombres genéricos antiguos ("Retro #1", etc.),
    // actualizamos automáticamente a los nombres reales del seed actualizado.
    if (col === "products") {
      const hasOldGenericNames = (stored as unknown as Product[]).some(
        (p) => p.name && /#(?:[0-9]+)/.test(p.name)
      );
      if (!hasOldGenericNames) return stored;
    } else if (col === "teams") {
      // Si la lista de equipos en local tiene menos equipos que el nuevo DEFAULT_TEAMS, actualizar
      if (stored.length >= DEFAULT_TEAMS.length) return stored;
    } else if (col === "banners") {
      // Si los banners guardados en local usan las imágenes antiguas con fondo blanco, actualizar
      const hasOldImages = (stored as unknown as Banner[]).some((b) =>
        b.image ? b.image.includes("/seed/products/") : true
      );
      if (!hasOldImages && stored.length >= DEFAULT_BANNERS.length) return stored;
    } else if (col === "categories") {
      // Si las categorías guardadas en local usan las imágenes antiguas con fondo blanco, actualizar
      const hasOldImages = (stored as unknown as Category[]).some((c) =>
        c.image ? c.image.includes("/seed/products/") : true
      );
      if (!hasOldImages && stored.length >= DEFAULT_CATEGORIES.length) return stored;
    } else {
      return stored;
    }
  }
  const def = (await localDefaults(col)) as T[];
  lsSet(col, def);
  return def;
}

/* ------------------------------------------------------------------ */
/* API pública                                                         */
/* ------------------------------------------------------------------ */

export async function listCollection<T extends Entity>(col: CollectionName): Promise<T[]> {
  if (!isFirebaseEnabled) return localList<T>(col);
  const snap = await getDocs(collection(db(), col));
  return snap.docs.map((d) => ({ ...(d.data() as Omit<T, "id">), id: d.id }) as T);
}

export async function upsertItem<T extends Entity>(col: CollectionName, item: T): Promise<void> {
  const data = clean({ ...item, updatedAt: Date.now() });
  if (!isFirebaseEnabled) {
    const list = await localList<T>(col);
    const idx = list.findIndex((x) => x.id === item.id);
    const next = idx >= 0 ? list.map((x) => (x.id === item.id ? data : x)) : [...list, data];
    lsSet(col, next);
    return;
  }
  const { id, ...rest } = data;
  await setDoc(doc(db(), col, id), rest);
}

export async function removeItem(col: CollectionName, id: string): Promise<void> {
  if (!isFirebaseEnabled) {
    const list = await localList<Entity>(col);
    lsSet(col, list.filter((x) => x.id !== id));
    return;
  }
  await deleteDoc(doc(db(), col, id));
}

/** Actualiza el campo `order` de varios elementos a la vez. */
export async function saveOrder(col: CollectionName, ids: string[]): Promise<void> {
  if (!isFirebaseEnabled) {
    const list = await localList<Entity & { order: number }>(col);
    const pos = new Map(ids.map((id, i) => [id, i]));
    lsSet(col, list.map((x) => (pos.has(x.id) ? { ...x, order: pos.get(x.id)! } : x)));
    return;
  }
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 400) chunks.push(ids.slice(i, i + 400));
  let offset = 0;
  for (const chunk of chunks) {
    const batch = writeBatch(db());
    chunk.forEach((id, i) => batch.update(doc(db(), col, id), { order: offset + i }));
    await batch.commit();
    offset += chunk.length;
  }
}

export async function getSettings(): Promise<StoreSettings> {
  if (!isFirebaseEnabled) return { ...DEFAULT_SETTINGS, ...(lsGet<StoreSettings>("settings") ?? {}) };
  const snap = await getDoc(doc(db(), "settings", "store"));
  return { ...DEFAULT_SETTINGS, ...((snap.data() as StoreSettings | undefined) ?? {}) };
}

export async function saveSettings(s: StoreSettings): Promise<void> {
  if (!isFirebaseEnabled) return lsSet("settings", s);
  await setDoc(doc(db(), "settings", "store"), clean(s));
}

export async function loadCatalog(): Promise<CatalogData> {
  const [products, categories, teams, banners, settings] = await Promise.all([
    listCollection<Product>("products"),
    listCollection<Category>("categories"),
    listCollection<Team>("teams"),
    listCollection<Banner>("banners"),
    getSettings(),
  ]);
  return {
    products: products.sort(byOrder),
    categories: categories.sort(byOrder),
    teams: teams.sort(byOrder),
    banners: banners.sort(byOrder),
    settings,
  };
}

/* ------------------------------- Pedidos ------------------------------- */

export async function createOrder(order: Omit<Order, "id" | "createdAt" | "status">): Promise<void> {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  if (!isFirebaseEnabled) {
    const list = lsGet<Order[]>("orders") ?? [];
    lsSet("orders", [...list, { ...clean(order), id, status: "nuevo", createdAt: Date.now() }]);
    return;
  }
  const { serverTimestamp } = await import("firebase/firestore");
  await setDoc(doc(db(), "orders", id), { ...clean(order), status: "nuevo", createdAt: serverTimestamp() });
}

export async function listOrders(): Promise<Order[]> {
  if (!isFirebaseEnabled) return (lsGet<Order[]>("orders") ?? []).sort((a, b) => b.createdAt - a.createdAt);
  const snap = await getDocs(collection(db(), "orders"));
  return snap.docs
    .map((d) => {
      const data = d.data();
      const created = data.createdAt?.toMillis ? data.createdAt.toMillis() : Number(data.createdAt ?? 0);
      return { ...(data as Omit<Order, "id">), id: d.id, createdAt: created };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (!isFirebaseEnabled) {
    const list = lsGet<Order[]>("orders") ?? [];
    lsSet("orders", list.map((o) => (o.id === id ? { ...o, status } : o)));
    return;
  }
  await updateDoc(doc(db(), "orders", id), { status });
}

/* ------------------------- Carga inicial (Firebase) ------------------------- */

/** Sube el catálogo inicial (extraído del PDF) a Firestore. */
export async function seedFirestore(onProgress?: (msg: string) => void): Promise<void> {
  if (!isFirebaseEnabled) return;
  const products = await loadSeedProducts();
  const groups: [CollectionName, Entity[]][] = [
    ["categories", DEFAULT_CATEGORIES],
    ["teams", DEFAULT_TEAMS],
    ["banners", DEFAULT_BANNERS],
    ["products", products],
  ];
  for (const [col, items] of groups) {
    onProgress?.(`Subiendo ${col}…`);
    for (let i = 0; i < items.length; i += 400) {
      const batch = writeBatch(db());
      items.slice(i, i + 400).forEach(({ id, ...rest }) => batch.set(doc(db(), col, id), clean(rest)));
      await batch.commit();
    }
  }
  await saveSettings(DEFAULT_SETTINGS);
  onProgress?.("¡Listo!");
}

/** Restablece los datos de demostración locales. */
export function resetDemoData() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(LS_PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}
