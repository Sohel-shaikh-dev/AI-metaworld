import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BUSINESS_ADDRESS = "Room No. 2, besides Mahesh Medical, Azad Chawl, 90 Feet Rd, near Basera Garden, Gala Nagar, Pragati Nagar, Nalasopara East, Vasai-Virar, Maharashtra 401209";
export const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Ai+Metaworld/@19.4344149,72.814243,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7a99cdf20c495:0x8cd2a1e6f0979ca3!8m2!3d19.4344099!4d72.8168179!16s%2Fg%2F11zd8gzvwk";
