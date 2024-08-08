import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src', '!src/**/*.spec.*', '!src/**/*.test.*'],
  outDir: 'lib',
});
