/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: __dirname, // Ограничивает сканирование только текущей папкой
  },
};

module.exports = nextConfig;
