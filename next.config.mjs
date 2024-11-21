// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // Option 1: Allow specific domains (recommended)
      domains: [
        'www.touraineloirevalley.co.uk',
        'images.unsplash.com',
        'example.com',
        // Add other domains as needed
      ],
  
      // Option 2: Allow any domain using remotePatterns (more flexible)
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
        {
          protocol: 'http',
          hostname: '**',
        }
      ],
  
      // Option 3: Use unoptimized images (not recommended for production)
      // unoptimized: true,
      
      // Configure maximum dimensions
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    
    // Other Next.js config options
    reactStrictMode: true,
  };
  
  export default nextConfig;