import { GenerateCommit, GetVersion, Help, Setup } from '@/commands';
import type { Providers } from '@/interfaces';
import { OpenAIProvider } from '@/providers';
import { AppUtils, EnvUtils, InputUtils, ProcessUtils } from '@/utils';

const inputUtils = new InputUtils();
const appUtils = new AppUtils();
const processUtils = new ProcessUtils(appUtils);
const envUtils = new EnvUtils(appUtils);

const providers: Providers = {
  openai: new OpenAIProvider(envUtils, inputUtils, appUtils),
};

const setup = new Setup(providers, inputUtils);

const help = new Help();

const getVersion = new GetVersion(appUtils);

const generateCommit = new GenerateCommit(
  providers,
  envUtils,
  processUtils,
  inputUtils,
  appUtils,
);

export { setup, help, getVersion, generateCommit };
