import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  /** Service worker + precache only in production builds */
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/offline',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withPWA(nextConfig)
