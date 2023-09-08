import react from '@vitejs/plugin-react';
import type { UserConfigFn } from 'vite';
import { overrideVaadinConfig } from './vite.generated';
import { defineConfig } from 'vite';

const customConfig: UserConfigFn = (env) => ({
  // Here you can add custom Vite parameters
  // https://vitejs.dev/config/
  plugins: [
    react({
      include: '**/*.tsx',
    }),
  ],
  test: {
    environment: 'jsdom',
    root: './tests',
  },
});

export default defineConfig(overrideVaadinConfig(customConfig));
