import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vlsi-assigned-/',
  plugins: [reactRefresh()],
  // Other configurations remain unchanged
  // Add your existing Tailwind and environment configurations here
});
