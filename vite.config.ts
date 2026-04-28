import { defineConfig } from "vite";
import checker from 'vite-plugin-checker'

export default defineConfig({
  server: {
    port: 5501,
    open: true
  },
  plugins: [
    checker({
      typescript: true,
    })
  ]
});
