/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: [
            'images.unsplash.com',
            "res.cloudinary.com",
        ],
        unoptimized: true,
    },
}

module.exports = nextConfig