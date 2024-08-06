import type { ProviderEnum } from '../provider';

export type Env = {
  PROVIDER?: ProviderEnum;
  OPENAI_API_KEY?: string;
  OPENAI_N_COMMITS?: number;
};

export interface EnvUtils {
  variables: Env;
  update(updates: Partial<Env>): void;
}
