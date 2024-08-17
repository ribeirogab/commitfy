import {
  type Env,
  type EnvUtils,
  type InputUtils,
  type Provider,
  ProviderEnum,
  SetupContextEnum,
} from '@/interfaces';

export class Setup {
  constructor(
    private readonly providers: { [ProviderEnum.OpenAI]: Provider },
    private readonly inputUtils: InputUtils,
    private readonly envUtils: EnvUtils,
  ) {}

  public async execute(): Promise<void> {
    const env = this.envUtils.variables();

    await this.setupContext({ env });

    const providerKey = await this.getProviderKey();
    const provider = this.providers[providerKey];

    await provider.setup();

    process.exit(0);
  }

  private async setupContext({ env }: { env: Env }): Promise<void> {
    const context = await this.inputUtils.prompt({
      default: env.SETUP_CONTEXT,
      message:
        'Choose how you want to set the context (feat, refactor, fix, etc.)',
      type: 'list',
      choices: [
        {
          name: 'Automatic in-context generation based on changes',
          value: SetupContextEnum.Automatic,
          short: SetupContextEnum.Automatic,
        },
        {
          name: 'Choose the context manually',
          value: SetupContextEnum.Manual,
          short: SetupContextEnum.Manual,
        },
      ],
    });

    this.envUtils.update({ SETUP_CONTEXT: context as SetupContextEnum });
  }

  private async getProviderKey(): Promise<string> {
    const providerKey = await this.inputUtils.prompt({
      choices: Object.keys(this.providers),
      message: 'Choose your AI provider',
      type: 'list',
    });

    return providerKey;
  }
}
