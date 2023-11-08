import { UserConfig, defineConfig } from "vite";

import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";
import react from "@vitejs/plugin-react";

const resolvePath = (str: string) => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const libConfig = {
    minify: "terser",
    build: {
      lib: {
        entry: resolvePath("src/lib/index.tsx"),
        name: "SNS Registration",
        formats: ["es", "cjs", "umd"],
        fileName: (format) =>
          `sns-widget.${
            format === "cjs" ? "cjs" : format === "es" ? "mjs" : "umd.js"
          }`,
      },
      rollupOptions: {
        external: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "@pythnetwork/client",
          "@solana/web3.js",
          "@solana/spl-token",
          "@foxwallet/wallet-adapter-foxwallet",
          "@solana/wallet-adapter-react",
          "@solana/wallet-adapter-react-ui",
          "@solana/wallet-adapter-wallets",
          "ahooks",
          "tailwind-merge",
          "react-async-hook",
          "@bonfida/spl-name-service",
          "split-graphemes",
        ],
        output: {
          // Provide global variables to use in the UMD build for externalized deps
          globals: {
            react: "react",
            "react-dom": "react-dom",
            "react/jsx-runtime": "react/jsx-runtime",
            "@pythnetwork/client": "@pythnetwork/client",
            "@solana/web3.js": "@solana/web3.js",
            "@solana/spl-token": "@solana/spl-token",
            "@solana/wallet-adapter-react": "@solana/wallet-adapter-react",
            "@solana/wallet-adapter-react-ui":
              "@solana/wallet-adapter-react-ui",
            "@foxwallet/wallet-adapter-foxwallet":
              "@foxwallet/wallet-adapter-foxwallet",
            "@solana/wallet-adapter-wallets": "@solana/wallet-adapter-wallets",
            "@bonfida/spl-name-service": "@bonfida/spl-name-service",
            ahooks: "ahooks",
            bs58: "bs58",
            "tailwind-merge": "tailwind-merge",
            "react-async-hook": "react-async-hook",
            "split-graphemes": "split-graphemes",
          },
        },
      },
    },
    plugins: [
      react(),
      nodePolyfills(),
      dts({ rollupTypes: true, include: ["src/lib"] }),
    ],
  };

  const previewConfig = {
    base: "/sns-widget/",
    build: {
      outDir: "./preview-build",
    },
    plugins: [react(), nodePolyfills()],
  };

  let buildConfig = {};

  if (mode === "lib" || mode === "production") buildConfig = libConfig;
  if (mode === "preview") buildConfig = previewConfig;

  return {
    server: {
      port: 3000,
    },
    ...buildConfig,
  } as UserConfig;
});
