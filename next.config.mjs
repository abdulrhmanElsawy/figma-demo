const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: isProd ? '/figma-demo' : '',
    assetPrefix: isProd ? '/figma-demo' : '',
    images: {
        
        domains: ['lh3.googleusercontent.com'],
        unoptimized: true ,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'liveblocks.io',
                port: '',
            }
        ]
    }
    ,output: "export",
    
    
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    reactStrictMode: true,
    webpack(config, options) {
        config.module.rules.push({
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
            use: 'file-loader',
        });

        return config;
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
