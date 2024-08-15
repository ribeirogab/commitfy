import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

const EXCLUDE_PATHS: string[] = [
  '**/bin/**',
  '**/lib/**',
  '**/node_modules/**',
];

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    forceRerunTriggers: [
      ...configDefaults.forceRerunTriggers,
      '**/src/**',
      '**/tests/**',
    ],
    exclude: [...configDefaults.exclude, ...EXCLUDE_PATHS],
    coverage: {
      exclude: [
        ...EXCLUDE_PATHS,
        '**/src/*/index.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/src/*.ts',
        '*.ts',
      ],
      reportsDirectory: './test-output/coverage',
      reporter: ['cobertura', 'lcov'],
      provider: 'v8',
    },
    env: {},
  },
});
