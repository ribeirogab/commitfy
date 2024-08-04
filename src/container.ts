import { EnvConfig, execConfig, readlineConfig } from './configs';
import type { Providers } from './interfaces';
import { OpenAIProvider } from './providers';
import { GenerateCommitMessageService, SetupService } from './services';

const envConfig = new EnvConfig();

const providers: Providers = {
  openai: new OpenAIProvider(envConfig, readlineConfig),
};

const setupService = new SetupService(providers, readlineConfig, envConfig);

const generateCommitMessageService = new GenerateCommitMessageService(
  providers,
  envConfig,
  execConfig,
  readlineConfig,
);

export function setup() {
  return setupService.execute.bind(setupService)();
}

export function generateCommit() {
  return generateCommitMessageService.execute.bind(
    generateCommitMessageService,
  )();
}
