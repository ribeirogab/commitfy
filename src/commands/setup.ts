import type { InputUtils, Provider, ProviderEnum } from '../interfaces';

export class Setup {
  constructor(
    private readonly providers: { [ProviderEnum.OpenAI]: Provider },
    private readonly inputUtils: InputUtils,
  ) {}

  public async execute(): Promise<void> {
    const choices = Object.keys(this.providers);

    const providerKey = await this.inputUtils.prompt({
      message: 'Choose your AI provider',
      type: 'list',
      choices,
    });

    const provider = this.providers[providerKey];

    await provider.setup();

    process.exit(0);
  }
}
