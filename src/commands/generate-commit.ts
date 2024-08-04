import type {
  EnvUtils,
  ExecUtils,
  Provider,
  Providers,
  ReadlineUtils,
} from '../interfaces';

export class GenerateCommitService {
  private readonly provider: Provider;

  constructor(
    private readonly providers: Providers,
    private readonly envUtils: EnvUtils,
    private readonly execUtils: ExecUtils,
    private readonly readlineUtils: ReadlineUtils,
  ) {
    this.provider = this.providers[this.envUtils.get().PROVIDER];
  }

  public async execute(): Promise<void> {
    const diff = await this.execUtils('git diff --cached');

    if (!diff) {
      console.error('No changes to commit');

      process.exit(0);
    }

    const commit = await this.provider.generateCommitMessage({ diff });

    const response = await this.readlineUtils.askQuestion(
      `${commit}\nDo you want to use this message? [yes / y] [no / n]\n`,
    );

    const accepted = ['yes', 'y'].includes(response.toLowerCase().trim());

    if (!accepted) {
      process.exit(0);
    }

    await this.execUtils(`git commit -m "${commit}"`);

    process.exit(0);
  }
}
