/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // This is crucial for Docker
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**', // Add this to ensure all paths are allowed
      },
    ],
  },
};

export default nextConfig;
