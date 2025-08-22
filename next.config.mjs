import next from 'next';

const nextConfig = {
  // Add the hostname for your logo to the list of allowed image domains.
  // This is required for Next.js Image component to work with external URLs.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
        port: '',
        pathname: '/file_content/2/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;