"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, OrderCustomer } from "./types";

interface CartState {
  items: CartItem[];
  customer: OrderCustomer;
  isOpen: boolean;
  add: (item: Omit<CartItem, "key">) => void;
  updateQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setCustomer: (c: Partial<OrderCustomer>) => void;
  open: () => void;
  close: () => void;
}

const itemKey = (i: Omit<CartItem, "key">) =>
  [i.productId, i.size, i.customization?.name ?? "", i.customization?.number ?? ""].join("|");

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      customer: { name: "" },
      isOpen: false,
      add: (item) =>
        set((s) => {
          const key = itemKey(item);
          const existing = s.items.find((i) => i.key === key);
          const items = existing
            ? s.items.map((i) => (i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i))
            : [...s.items, { ...item, key }];
          return { items, isOpen: true };
        }),
      updateQty: (key, qty) =>
        set((s) => ({ items: s.items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(99, qty)) } : i)) })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
      setCustomer: (c) => set((s) => ({ customer: { ...s.customer, ...c } })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "mf-cart",
      skipHydration: true,
      partialize: (s) => ({ items: s.items, customer: s.customer }),
    },
  ),
);

interface FavState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useFavorites = create<FavState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
    }),
    { name: "mf-favorites", skipHydration: true },
  ),
);
