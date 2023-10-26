import type { UserConfigFn } from 'vite';
import { overrideVaadinConfig } from './vite.generated';

const customConfig: UserConfigFn = (env) => ({
  plugins: [],
  test: {
    include: ['./tests/**/*.{test,spec}.ts?(x)'],
    globals: true,
    browser: {
      enabled: true,
      name: 'chrome',
    }
  },
});

export default overrideVaadinConfig(customConfig);