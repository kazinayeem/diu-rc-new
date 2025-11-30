/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'picsum.photos', 'avatars.githubusercontent.com'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },


  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig

