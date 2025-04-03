import type { NextConfig } from "next";
import nextPWA from '@ducanh2912/next-pwa'

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextPWA({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development'
})(nextConfig)
