import type { CartItem, OrderCustomer, Product } from "./types";

export const formatPrice = (n: number) =>
  "$" + Math.round(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });

export const effectivePrice = (p: Product) =>
  p.salePrice != null && p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : p.price;

export const isOnSale = (p: Product) => effectivePrice(p) < p.price;

export const isSoldOut = (p: Product) => p.sizes.length > 0 && p.sizes.every((s) => s.soldOut);

export const discountPercent = (p: Product) => Math.round((1 - effectivePrice(p) / p.price) * 100);

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const itemTotal = (i: Pick<CartItem, "unitPrice" | "quantity" | "customization">) =>
  (i.unitPrice + (i.customization?.extraPrice ?? 0)) * i.quantity;

export function buildWhatsappMessage(items: CartItem[], customer: OrderCustomer): string {
  const lines: string[] = [
    "⚽ *¡HOLA J&A MUNDO FÚTBOL!* 👋",
    "🛒 *Quiero realizar el siguiente pedido:*",
    "━━━━━━━━━━━━━━━━━━━━━━",
  ];

  items.forEach((it, idx) => {
    lines.push(`👕 *${idx + 1}. ${it.name}*`);
    lines.push(`   ▫️ Talla: *${it.size}*   |   Cantidad: *${it.quantity}*`);
    if (it.customization) {
      lines.push(
        `   ✨ *Estampado:* ${it.customization.name || "-"} #${it.customization.number || "-"} (+${formatPrice(it.customization.extraPrice)})`,
      );
    }
    lines.push(`   💵 Subtotal: *${formatPrice(itemTotal(it))}*`);
    lines.push("");
  });

  const total = items.reduce((s, i) => s + itemTotal(i), 0);

  lines.push("━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`💰 *TOTAL ESTIMADO: ${formatPrice(total)}*`);
  lines.push("━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("");
  lines.push("📦 *DATOS PARA EL ENVÍO:*");
  lines.push(`👤 *Nombre:* ${customer.name}`);
  if (customer.phone) lines.push(`📱 *Teléfono:* ${customer.phone}`);
  if (customer.city) lines.push(`🏙️ *Ciudad:* ${customer.city}`);
  if (customer.address) lines.push(`📍 *Dirección:* ${customer.address}`);
  if (customer.notes) lines.push(`📝 *Notas:* ${customer.notes}`);
  lines.push("");
  lines.push("¿Me confirman disponibilidad y medios de pago para despacho? ¡Muchas gracias! 🙌🔥");

  return lines.join("\n");
}

export const whatsappUrl = (phone: string, text: string) => {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
};
