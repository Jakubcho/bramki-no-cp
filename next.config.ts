import type { NextConfig } from "next";

const nextConfig = {
  async headers() {
    return [
      {
        // Dotyczy wszystkich plików w folderze qrcodes
        source: "/qrcodes/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }, // Pozwala każdemu pobrać ten plik
          { key: "Access-Control-Allow-Methods", value: "GET" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
