/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'picsum.photos', 'avatars.githubusercontent.com', 'diurc.vercel.app', 'www.kazinayeem.site', 'kazinayeem.site'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },


  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      maxDuration: 120, // 120 seconds for server actions
    },
  },
}

module.exports = nextConfig

