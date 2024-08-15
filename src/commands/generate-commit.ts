import {
  type AppUtils,
  type EnvUtils,
  type InputUtils,
  InputUtilsCustomChoiceEnum,
  type ProcessUtils,
  type Provider,
  type Providers,
} from '@/interfaces';

export class GenerateCommit {
  private readonly regeneratorText = '↻ regenerate';
  private provider: Provider;

  constructor(
    private readonly providers: Providers,
    private readonly envUtils: EnvUtils,
    private readonly processUtils: ProcessUtils,
    private readonly inputUtils: InputUtils,
    private readonly appUtils: AppUtils,
  ) {}

  public async execute(): Promise<void> {
    this.provider = this.providers[this.envUtils.variables().PROVIDER];

    if (!this.provider) {
      this.appUtils.logger.error('AI provider not set.');

      this.appUtils.logger.message(
        "Run 'commitfy setup' to set up the provider.",
      );

      process.exit(0);
    }

    const diff = await this.processUtils.exec('git diff --cached', {
      showStdout: false,
    });

    if (!diff) {
      this.appUtils.logger.error('No changes to commit.');

      process.exit(0);
    }

    const commits = await this.provider.generateCommitMessages({ diff });
    const oneLineCommits = commits.map((commit) => commit.split('\n')[0]);

    const choices = [
      ...oneLineCommits,
      InputUtilsCustomChoiceEnum.Separator,
      this.regeneratorText,
    ];

    const response = await this.inputUtils.prompt({
      message: 'Choose your commit message or regenerate',
      type: 'list',
      choices,
    });

    if (response === this.regeneratorText) {
      return this.execute();
    }

    await this.processUtils.exec(`git commit -m "${response}"`, {
      showStdout: true,
    });

    process.exit(0);
  }
}
