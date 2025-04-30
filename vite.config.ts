import react from "@vitejs/plugin-react-swc";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.tsx"),
      name: "schemaHookFormSemi",
      fileName: "index",
    },
    rollupOptions: {
      // 确保外部化处理那些
      // 你不想打包进库的依赖
      external: [
        "react",
        "react-dom",
        "zod",
        "yup",
        "yup-locales",
        "@douyinfe/semi-icons",
        "@douyinfe/semi-ui",
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖
        // 提供一个全局变量
        globals: {
          react: "React",
          zod: "Zod",
          yup: "Yup",
          ["yup-locales"]: "YupLocales",
          ["react-dom"]: "ReactDom",
          ["@douyinfe/semi-ui"]: "SemiUI",
          ["@douyinfe/semi-icons"]: "SemiIcons",
        },
      },
    },
  },
});
