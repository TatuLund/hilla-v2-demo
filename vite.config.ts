import type { UserConfigFn } from 'vite';
import { overrideVaadinConfig } from './vite.generated';
// import { defineConfig } from 'vite';

const customConfig: UserConfigFn = (env) => ({
  // Here you can add custom Vite parameters
  // https://vitejs.dev/config/
});

export default overrideVaadinConfig(customConfig);
// export default defineConfig(overrideVaadinConfig(customConfig));
