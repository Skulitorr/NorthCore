import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  resolve: {
    alias: {
      'components': path.resolve(__dirname, './components'),
      'src': path.resolve(__dirname, './src'),
    },
  },
});
