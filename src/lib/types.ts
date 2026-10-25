export interface SizeOption {
  label: string;
  soldOut: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  teamSlug: string | null;
  forWomen: boolean;
  description: string;
  images: string[];
  price: number;
  salePrice: number | null;
  sizes: SizeOption[];
  customization: { enabled: boolean; extraPrice: number };
  isNew: boolean;
  isFeatured: boolean;
  hidden: boolean;
  order: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  order: number;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  link: string;
  buttonText: string;
  active: boolean;
  order: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface StoreSettings {
  whatsapp: string;
  socials: { instagram: string; tiktok: string; facebook: string };
  about: string;
  shipping: string;
  payments: string;
  faq: FaqItem[];
  sizeGuide: string;
  customizationDefault: number;
}

export type OrderStatus = "nuevo" | "confirmado" | "entregado" | "cancelado";

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  unitPrice: number;
  customization?: { name: string; number: string; extraPrice: number } | null;
}

export interface OrderCustomer {
  name: string;
  phone?: string;
  city?: string;
  address?: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: Omit<CartItem, "key">[];
  customer: OrderCustomer;
  total: number;
  status: OrderStatus;
  createdAt: number;
}

export interface CatalogData {
  products: Product[];
  categories: Category[];
  teams: Team[];
  banners: Banner[];
  settings: StoreSettings;
}
