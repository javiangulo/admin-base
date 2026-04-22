import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
    tailwindcss(),
  ],
  server: {
    host: process.env.VITE_HOST,
    port: parseInt(process.env.VITE_PORT || '4400'),
    allowedHosts: ['.ngrok-free.app'],
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '@utils',
        replacement: path.resolve(__dirname, 'src/utils'),
      },
      {
        find: '@lib',
        replacement: path.resolve(__dirname, 'src/components'),
      },
      {
        find: '@layout',
        replacement: path.resolve(__dirname, 'src/layout'),
      },
      {
        find: '@hooks',
        replacement: path.resolve(__dirname, 'src/utils/hooks'),
      },
      {
        find: '@context',
        replacement: path.resolve(__dirname, 'src/context'),
      },
      {
        find: '@types',
        replacement: path.resolve(__dirname, 'src/types'),
      },
      {
        find: '@routes',
        replacement: path.resolve(__dirname, 'src/routes'),
      },
      {
        find: '@gql',
        replacement: path.resolve(__dirname, 'src/utils/gql'),
      },
    ],
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
  },
})
