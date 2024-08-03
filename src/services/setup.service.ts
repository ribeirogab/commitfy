import {
  type EnvConfig,
  Provider,
  ProviderEnum,
  type ReadlineConfig,
} from '../interfaces';

export class SetupService {
  constructor(
    private readonly providers: { [ProviderEnum.OpenAI]: Provider },
    private readonly readlineConfig: ReadlineConfig,
    private readonly envConfig: EnvConfig,
  ) {}

  public async execute(): Promise<void> {
    const providerIndex = await this.readlineConfig.askQuestion(
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
