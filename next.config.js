/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "ecommerce-first.s3.amazonaws.com",
    ]
  }
}

module.exports = nextConfig
