import type {
  EnvConfig,
  ExecConfig,
  Provider,
  Providers,
  ReadlineConfig,
} from '../interfaces';

export class GenerateCommitMessageService {
  private readonly provider: Provider;

  constructor(
    private readonly providers: Providers,
    private readonly envConfig: EnvConfig,
    private readonly execConfig: ExecConfig,
    private readonly readlineConfig: ReadlineConfig,
  ) {
    this.provider = this.providers[this.envConfig.get().PROVIDER];
  }

  public async execute(): Promise<void> {
    const diff = await this.execConfig('git diff --cached');

    if (!diff) {
      console.error('No changes to commit');

      process.exit(0);
    }

    const commit = await this.provider.generateCommitMessage({ diff });

    const response = await this.readlineConfig.askQuestion(
      `${commit}\nDo you want to use this message? [yes / y] [no / n]\n`,
    );

    const accepted = ['yes', 'y'].includes(response.toLowerCase().trim());

    if (!accepted) {
      process.exit(0);
    }

    await this.execConfig(`git commit -m "${commit}"`);

    process.exit(0);
  }
}
