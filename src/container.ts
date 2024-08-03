import { EnvConfig, execConfig, readlineConfig } from './configs';
import type { Providers } from './interfaces';
import { OpenAIProvider } from './providers';
import { GenerateCommitMessageService, SetupService } from './services';

const envConfig = new EnvConfig();

const providers: Providers = {
  openai: new OpenAIProvider(envConfig, readlineConfig),
};

export const setupService = new SetupService(
  providers,
  readlineConfig,
  envConfig,
);

export const generateCommitMessageService = new GenerateCommitMessageService(
  providers,
  envConfig,
  execConfig,
  readlineConfig,
);
