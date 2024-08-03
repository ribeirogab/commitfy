import type { ProviderEnum } from '../provider';

export type Env = {
  PROVIDER?: ProviderEnum;
  OPENAI_API_KEY?: string;
  HOME_DIRECTORY: string;
  ENV_FILE_PATH: string;
};

export interface EnvConfig {
  update(updates: Partial<Env>): void;
  get(): Env;
}
