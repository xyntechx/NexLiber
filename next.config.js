/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "xpxzssutlvthkwdmxflb.supabase.co",
                port: "",
            },
        ],
    },
};

module.exports = nextConfig;
