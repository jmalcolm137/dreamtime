/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['local', '*.local', '10.0.0.*', '192.168.*.*'],
}

export default nextConfig
