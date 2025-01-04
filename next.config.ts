import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    // Find the existing rule for handling SVG files
    const fileLoaderRule = config.module.rules.find((rule: { test: { test: (arg0: string) => any; }; }) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Reapply the existing rule for files ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/ // *.svg?url
      },
      // Add a new rule to convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule?.issuer, // Use the original issuer rule
        resourceQuery: { not: [...fileLoaderRule?.resourceQuery?.not, /url/] }, // Exclude if *.svg?url
        use: ['@svgr/webpack'] // Use svgr to convert to React components
      }
    );

    // Modify the file loader rule to exclude *.svg
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;