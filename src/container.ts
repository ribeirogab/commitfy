import { GenerateCommitService, SetupService } from './commands';
import type { Providers } from './interfaces';
import { OpenAIProvider } from './providers';
import { EnvUtils, execUtils, readlineUtils } from './utils';

const envConfig = new EnvUtils();

const providers: Providers = {
  openai: new OpenAIProvider(envConfig, readlineUtils),
};

const setup = new SetupService(providers, readlineUtils, envConfig);

const generateCommit = new GenerateCommitService(
  providers,
  envConfig,
  execUtils,
  readlineUtils,
);

export { setup, generateCommit };
