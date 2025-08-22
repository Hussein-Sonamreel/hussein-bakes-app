import next from 'next';

const nextConfig = {
  // Added a remote pattern for the Spoonacular API domain to allow recipe images.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
        port: '',
        pathname: '/**',
      },
      // New: Added Spoonacular's image domain to the allowed list.
      {
        protocol: 'https',
        hostname: 'spoonacular.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;