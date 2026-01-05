/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rtudfkccbzbblfmeoyop.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error', 'warn'] } 
      : false
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.timify.com https://*.studiobookr.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.timify.com https://*.studiobookr.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in https://*.timify.com https://*.studiobookr.com",
              "child-src 'self' https://www.youtube.com https://player.vimeo.com https://book.timify.com https://*.timify.com https://www.studiobookr.com https://*.studiobookr.com https://studiobookr.com",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://book.timify.com https://*.timify.com https://www.studiobookr.com https://*.studiobookr.com https://studiobookr.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://*.timify.com https://*.studiobookr.com",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
        ],
      },
    ]
  },
}

export default nextConfig