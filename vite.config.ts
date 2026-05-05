import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      tsr: {
        srcDirectory: "src",
        routesDirectory: "src/routes",
        generatedRouteTree: "src/routeTree.gen.ts",
      },
    }),
    viteReact(),
  ],
});
