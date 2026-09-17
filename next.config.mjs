import withBundleAnalyzer from '@next/bundle-analyzer';

const analyze = process.env.ANALYZE === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  }
};

export default withBundleAnalyzer({
  enabled: analyze,
})(nextConfig);
