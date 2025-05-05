/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: 'loremflickr.com',
      },
      {
        hostname: 'res.cloudinary.com',
      },
      {
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};
export default nextConfig;
