/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'www.shutterstock.com',
          },
        ],
      },
      // async rewrites() {
      //   return [
      //     {
      //       source: '/:shortCode',
      //       destination: '/middleware',  // Ensure this points to your middleware.js file
      //     },
      //   ];
      // },
};

export default nextConfig;
