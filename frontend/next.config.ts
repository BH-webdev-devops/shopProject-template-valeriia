import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname:
          "https://shop-project-valeriia-413936355529.europe-west1.run.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
