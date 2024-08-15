import { ProviderEnum, type Providers } from '@/interfaces';

export const makeProvidersFake = () =>
  Object.values(ProviderEnum).reduce(
    (providers, provider) => ({
      ...providers,
      [provider]: {
        generateCommitMessages: vi.fn(),
        setup: vi.fn(),
      },
    }),
    {},
  ) as Providers;
