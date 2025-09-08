/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'development'
            ? 'http://localhost:5005'
            : 'https://six-photo-2-be-ysa8.onrender.com',
    }
};

export default nextConfig;
