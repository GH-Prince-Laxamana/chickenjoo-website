import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  redirects() {
    return [
      { source: "/blog/:path*", destination: "/news/:path*", permanent: true },
      { source: "/our-story", destination: "/about-us", permanent: true },
    ];
  },
};

export default nextConfig;
