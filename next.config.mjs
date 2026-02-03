/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    // Performance optimizations
    compress: true,
    poweredByHeader: false,

    // Optimize production builds
    swcMinify: true,

    // Enable modern JavaScript
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },

    // Optimize chunks
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        commons: {
                            name: 'commons',
                            chunks: 'all',
                            minChunks: 2,
                        },
                    },
                },
            };
        }
        return config;
    },

    // Add headers for caching
    async headers() {
        return [
            {
                source: '/f1car-zip/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
