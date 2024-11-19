import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "https://shopproject-template-valeriia.onrender.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
