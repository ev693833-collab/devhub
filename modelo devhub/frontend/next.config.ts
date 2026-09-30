import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // REMOVIDO: output: 'standalone' causava scan de todo o disco em dev
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      // Exclui arquivos de sistema do Windows e pastas pesadas do scan
      ignored: [
        "**/node_modules/**",
        "**/.next/**",
        "**/C:/Windows/**",
        "**/C:/DumpStack*",
        "**/C:/hiberfil*",
        "**/C:/pagefile*",
        "**/C:/swapfile*",
      ],
      // Reduz a frequência de polling
      poll: false,
    };
    return config;
  },
};

export default nextConfig;
