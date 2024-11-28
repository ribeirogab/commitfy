import type { ChatModel } from 'openai/resources';

import type { SetupContextEnum } from '../commands/setup';
import type { ProviderEnum } from '../provider';

export type Env = {
  PROVIDER?: ProviderEnum;
  SETUP_CONTEXT: SetupContextEnum;

  OPENAI_API_KEY?: string;
  OPENAI_N_COMMITS?: number | string;
  OPENAI_CHAT_MODEL?: ChatModel;

  CONFIG_COMMIT_LANGUAGE: string;
  CONFIG_MAX_COMMIT_CHARACTERS: string | number;
  CONFIG_PROMPT_AUTOMATIC_CONTEXT: string;
  CONFIG_PROMPT_MANUAL_CONTEXT: string;
};

export interface EnvUtils {
  variables(): Env;
  update(updates: Partial<Env>): void;
}
