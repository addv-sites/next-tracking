import { defineConfig } from 'vite';

// Dominio propio en GitHub Pages: https://nextracking.com.mx/
export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (info) => {
          const name = info.name || '';
          if (/\.(png|jpe?g|webp|avif|svg|gif)$/.test(name)) return 'assets/img/[name].[hash][extname]';
          if (/\.css$/.test(name)) return 'assets/css/[name].[hash][extname]';
          if (/\.(woff2?|ttf)$/.test(name)) return 'assets/fonts/[name].[hash][extname]';
          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
});
