import {
  type EnvUtils,
  Provider,
  ProviderEnum,
  type ReadlineUtils,
} from '../interfaces';

export class SetupService {
  constructor(
    private readonly providers: { [ProviderEnum.OpenAI]: Provider },
    private readonly readlineUtils: ReadlineUtils,
    private readonly envConfig: EnvUtils,
  ) {}

  public async execute(): Promise<void> {
    const providerIndex = await this.readlineUtils.askQuestion(
      `Which provider do you want to use?\n${Object.keys(this.providers)
        .map((name, index) => `[${index}] ${name}`)
        .join('\n')}\n`,
    );

    const providerEnum = Object.values(ProviderEnum)[parseInt(providerIndex)];
    const provider = this.providers[providerEnum];

    if (!provider) {
      console.error('Invalid provider choice. Please try again.');

      return this.execute();
    }

    await provider.setup();
    this.envConfig.update({ PROVIDER: providerEnum });

    process.exit(0);
  }
}
