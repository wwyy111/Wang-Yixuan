import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/llm-dev/', // 重要：适配GitHub Pages子目录
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
    AutoImport({
      imports: ["vue", "vue-router"], // 自动导入 Vue 和 Vue Router 相关 API
    }),
    Components({
      dirs: ["src/components"], // 指定自动导入的组件目录
    }),
  ],
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/styles/variables";`, // 自动注入变量文件
  //     },
  //   },
  // },
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
