import { CustomConfigKeysEnum, SemanticCommitContextEnum } from '@/constants';
import {
  type AppUtils,
  type Env,
  type EnvUtils,
  type InputUtils,
  InputUtilsCustomChoiceEnum,
  type ProcessUtils,
  type Provider,
  type Providers,
  SetupContextEnum,
} from '@/interfaces';

export class GenerateCommit {
  private readonly regeneratorText = '↻ regenerate';

  constructor(
    private readonly providers: Providers,
    private readonly envUtils: EnvUtils,
    private readonly processUtils: ProcessUtils,
    private readonly inputUtils: InputUtils,
    private readonly appUtils: AppUtils,
  ) {}

  public async execute(): Promise<void> {
    const env = this.envUtils.variables();
    const diff = await this.getGitDiff();
    const context = await this.getContext({ env });

    const commits = await this.getProvider({ env }).generateCommitMessages({
      prompt: this.generatePrompt({ context, env }),
      diff,
    });

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

  private async getContext({ env }: { env: Env }): Promise<string> {
    if (env.SETUP_CONTEXT === SetupContextEnum.Automatic) {
      return null;
    }

    const context = await this.inputUtils.prompt({
      default: SetupContextEnum.Automatic,
      message: 'Choose context for the commit',
      type: 'list',
      choices: [
        {
          name: `${SemanticCommitContextEnum.Feat}: (new feature for the user, not a new feature for build script)`,
          value: SemanticCommitContextEnum.Feat,
          short: SemanticCommitContextEnum.Feat,
        },
        {
          name: `${SemanticCommitContextEnum.Fix}: (bug fix for the user, not a fix to a build script)`,
          value: SemanticCommitContextEnum.Fix,
          short: SemanticCommitContextEnum.Fix,
        },
        {
          name: `${SemanticCommitContextEnum.Docs}: (changes to the documentation)`,
          value: SemanticCommitContextEnum.Docs,
          short: SemanticCommitContextEnum.Docs,
        },
        {
          name: `${SemanticCommitContextEnum.Style}: (formatting, missing semi colons, etc; no production code change)`,
          value: SemanticCommitContextEnum.Style,
          short: SemanticCommitContextEnum.Style,
        },
        {
          name: `${SemanticCommitContextEnum.Refactor}: (refactoring production code, eg. renaming a variable)`,
          value: SemanticCommitContextEnum.Refactor,
          short: SemanticCommitContextEnum.Refactor,
        },
        {
          name: `${SemanticCommitContextEnum.Test}: (adding missing tests, refactoring tests; no production code change)`,
          value: SemanticCommitContextEnum.Test,
          short: SemanticCommitContextEnum.Test,
        },
        {
          name: `${SemanticCommitContextEnum.Chore}: (updating grunt tasks etc; no production code change)`,
          value: SemanticCommitContextEnum.Chore,
          short: SemanticCommitContextEnum.Chore,
        },
      ],
    });

    return context;
  }

  private generatePrompt({
    context,
    env,
  }: {
    context?: string | null;
    env: Env;
  }) {
    let prompt = context
      ? env.CONFIG_PROMPT_MANUAL_CONTEXT
      : env.CONFIG_PROMPT_AUTOMATIC_CONTEXT;

    if (context) {
      prompt = prompt.replaceAll(CustomConfigKeysEnum.CustomContext, context);
    }

    prompt = prompt
      .replaceAll(
        CustomConfigKeysEnum.CommitLanguage,
        env.CONFIG_COMMIT_LANGUAGE,
      )
      .replaceAll(
        CustomConfigKeysEnum.MaxCommitCharacters,
        String(env.CONFIG_MAX_COMMIT_CHARACTERS),
      );

    return prompt;
  }

  private async getGitDiff(): Promise<string> {
    try {
      await this.processUtils.exec('git --version', {
        showStdout: false,
      });
    } catch {
      this.appUtils.logger.error('Git is not installed.');

      process.exit(0);
    }

    try {
      await this.processUtils.exec('git status', {
        showStdout: false,
      });
    } catch {
      this.appUtils.logger.error('Current directory is not a git repository.');

      process.exit(0);
    }

    const diff = await this.processUtils.exec('git diff --cached', {
      showStdout: false,
    });

    if (!diff) {
      this.appUtils.logger.error('No changes to commit.');

      process.exit(0);
    }

    return diff;
  }

  private getProvider({ env }: { env: Env }): Provider {
    const provider = this.providers[env.PROVIDER];

    if (!provider) {
      this.appUtils.logger.error('AI provider not set.');

      this.appUtils.logger.message(
        "Run 'commitfy setup' to set up the provider.",
      );

      process.exit(0);
    }

    return provider;
  }
}
