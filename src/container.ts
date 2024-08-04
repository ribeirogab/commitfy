import { GenerateCommit, GetVersion, Setup } from './commands';
import type { Providers } from './interfaces';
import { OpenAIProvider } from './providers';
import { AppUtils, EnvUtils, InputUtils, ProcessUtils } from './utils';

const processUtils = new ProcessUtils();
const inputUtils = new InputUtils();
const appUtils = new AppUtils();
const envUtils = new EnvUtils(appUtils);

const providers: Providers = {
  openai: new OpenAIProvider(envUtils, inputUtils),
};

const setup = new Setup(providers, inputUtils);

const getVersion = new GetVersion(appUtils);

const generateCommit = new GenerateCommit(
  providers,
  envUtils,
  processUtils,
  inputUtils,
);

export { setup, getVersion, generateCommit };
