import { defineConfig } from 'vite';

// GitHub Pages project site: https://addv-sites.github.io/next-tracking/
export default defineConfig({
  base: '/next-tracking/',
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
