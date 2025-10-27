/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      "@mui/icons-material": "@mui/icons-material",
    });
    return config;
  },
};

module.exports = nextConfig;