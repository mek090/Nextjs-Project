import { NextConfig } from 'next'

const config: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    }
  }
}

export default config

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     serverActions: {
//       bodySizeLimit: '5mb',
//     },
//   },
//   reactStrictMode: false,
//   images: {
//     domains: ['qwnhsckiyphwggwoaqmr.supabase.co'],

//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'qwnhsckiyphwggwoaqmr.supabase.co',
//         port: '',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'example.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'img.clerk.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'maps.googleapis.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'kxouaaerjjtddxugijev.supabase.co',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
// };

// export default nextConfig;
