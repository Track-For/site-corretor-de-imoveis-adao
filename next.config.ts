import type { NextConfig } from "next";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseStoragePattern = supabaseUrl
  ? new URL(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/**`)
  : undefined;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseStoragePattern ? [supabaseStoragePattern] : [],
  },
};

export default nextConfig;
