import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeUtcIso(isoLike: string) {
  if (isoLike.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(isoLike)) return isoLike;

  return `${isoLike}Z`;
}

export function toQuery(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && v.trim()) sp.set(k, v.trim());
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}