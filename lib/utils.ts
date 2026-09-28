import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatTime(timeString: string): string {
  return timeString;
}

export function generateRegistrationNumber(): string {
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `P2P-2026-${randomChars}`;
}

export function generateTicketToken(): string {
  const array = new Uint8Array(24);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}
