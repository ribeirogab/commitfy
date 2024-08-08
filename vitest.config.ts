import { configDefaults, defineConfig } from 'vitest/config';

const EXCLUDE_PATHS: string[] = [];

export default defineConfig({
  test: {
    globals: true,
    forceRerunTriggers: [...configDefaults.forceRerunTriggers, '**/src/**'],
    exclude: [...configDefaults.exclude, ...EXCLUDE_PATHS],
    coverage: {
      reportsDirectory: './test-output/coverage',
      reporter: ['cobertura', 'lcov'],
      exclude: [...EXCLUDE_PATHS],
      provider: 'v8',
    },
    env: {},
  },
});
