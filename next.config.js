/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['media-exp1.licdn.com', 'static-exp1.licdn.com'],
    dangerouslyAllowSVG: true,
  },
}

module.exports = nextConfig