import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok to access Next.js dev resources
  // This stops the cross-origin warning when testing via ngrok
  allowedDevOrigins: ["tactical-curly-knickers.ngrok-free.dev"],
};

export default nextConfig;
