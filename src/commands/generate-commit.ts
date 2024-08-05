import {
  type AppUtils,
  type EnvUtils,
  type InputUtils,
  InputUtilsCustomChoiceEnum,
  type ProcessUtils,
  type Provider,
  type Providers,
} from '../interfaces';

export class GenerateCommit {
  private readonly provider: Provider;

  constructor(
    private readonly providers: Providers,
    private readonly envUtils: EnvUtils,
    private readonly processUtils: ProcessUtils,
    private readonly inputUtils: InputUtils,
    private readonly appUtils: AppUtils,
  ) {
    this.provider = this.providers[this.envUtils.get().PROVIDER];
  }

  public async execute(): Promise<void> {
    if (!this.provider) {
      this.appUtils.logger.error('AI provider not set.');
      console.log("Run 'commitfy setup' to set up the provider.");

      process.exit(0);
    }

    const diff = await this.processUtils.exec('git diff --cached');

    if (!diff) {
      console.error(`${this.appUtils.name}: no changes to commit.`);

      process.exit(0);
    }

    const commits = await this.provider.generateCommitMessages({ diff });
    const oneLineCommits = commits.map((commit) => commit.split('\n')[0]);
    const regenerateText = '↻ regenerate';

    const choices = [
      ...oneLineCommits,
      InputUtilsCustomChoiceEnum.Separator,
      regenerateText,
    ];

    const response = await this.inputUtils.prompt({
      message: 'Choose your commit message or regenerate',
      type: 'list',
      choices,
    });

    if (response === regenerateText) {
      return this.execute();
    }

    await this.processUtils.exec(`git commit -m "${response}"`);

    process.exit(0);
  }
}
