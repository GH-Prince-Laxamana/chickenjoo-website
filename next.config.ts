import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  redirects() {
    return [{ source: "/blog/:path*", destination: "/news/:path*", permanent: true }];
  },
};

export default nextConfig;
