"use client";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryEnabled = Boolean(CLOUD && PRESET);

/** Redimensiona y convierte una imagen a WebP en el navegador. */
export async function compressImage(file: File, maxSize = 1200, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo procesar la imagen"))), "image/webp", quality),
  );
}

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

/**
 * Sube una imagen y devuelve su URL pública.
 * - Con Cloudinary configurado: sube a Cloudinary (gratis).
 * - Sin Cloudinary (modo demo): devuelve una imagen embebida (data URL) reducida.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!isCloudinaryEnabled) {
    const small = await compressImage(file, 700, 0.72);
    return blobToDataUrl(small);
  }
  const blob = await compressImage(file);
  const form = new FormData();
  form.append("file", blob, file.name.replace(/\.[^.]+$/, "") + ".webp");
  form.append("upload_preset", PRESET!);
  form.append("folder", "mundo-futbol");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Error subiendo la imagen a Cloudinary");
  const json = (await res.json()) as { secure_url: string };
  return json.secure_url;
}
