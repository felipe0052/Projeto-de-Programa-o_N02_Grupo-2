/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
    return [
      {
        source: "/api/:path*",
        destination: `${base}/:path*`,
      },
    ]
  },
}

export default nextConfig
