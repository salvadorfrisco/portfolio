const nextConfig = {
  // Configuração do Webpack
  webpack(config) {
    // Configuração para processar SVGs como componentes React
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Configuração para carregar SVGs como URLs (imagens)
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next/static/images",
            outputPath: "static/images",
            name: "[name].[hash].[ext]",
          },
        },
      ],
    });

    return config;
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "/" : "",
  images: {
    domains: ["frisco.dev.br", "localhost", "localhost:3010"],
  },
  experimental: {
    turbo: {
      // ...
    },
  },
};

export default nextConfig;
