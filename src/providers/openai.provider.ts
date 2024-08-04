import { OpenAI } from 'openai';

import {
  type EnvUtils,
  InputTypeEnum,
  type InputUtils,
  type Provider,
  ProviderEnum,
} from '../interfaces';

export class OpenAIProvider implements Provider {
  private openai: OpenAI;

  constructor(
    private readonly envUtils: EnvUtils,
    private readonly inputUtils: InputUtils,
  ) {}

  private get client() {
    if (this.openai) {
      return this.openai;
    }

    const env = this.envUtils.get();

    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }

    this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    return this.openai;
  }

  public async generateCommitMessages({
    diff,
  }: {
    diff: string;
  }): Promise<string[]> {
    try {
      const prompt = `Generate a concise and clear commit message using the commitizen format (e.g., feat, chore, refactor, etc.) for the following code changes. The message should be at most 72 characters long:`;
      const n = Number(this.envUtils.get().OPENAI_N_COMMITS) || 2;

      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          { role: 'user', content: prompt },
          { role: 'user', content: diff },
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 50,
        n,
      });

      const commitMessages = chatCompletion.choices.map(
        (choice) => choice.message.content,
      );

      if (!commitMessages) {
        throw new Error('Failed to generate commit messages');
      }

      return commitMessages;
    } catch (error) {
      console.error('Failed to generate commit message');

      throw error;
    }
  }

  public async setup(): Promise<void> {
    const env = this.envUtils.get();

    const apiKey = await this.inputUtils.prompt({
      message: 'Enter your OpenAI API key:',
      default: env.OPENAI_API_KEY,
      type: InputTypeEnum.Input,
    });

    const numberOfCommits = await this.inputUtils.prompt({
      message: 'Enter the number of commits to generate:',
      default: String(env.OPENAI_N_COMMITS) || '2',
      type: InputTypeEnum.Input,
    });

    this.envUtils.update({
      ...env,
      OPENAI_N_COMMITS: Number(numberOfCommits),
      PROVIDER: ProviderEnum.OpenAI,
      OPENAI_API_KEY: apiKey,
    });

    await this.test();

    console.log('\x1b[32m✓\x1b[0m', 'OpenAI setup successfully completed');
  }

  private async test(): Promise<void> {
    await this.client.chat.completions.create({
      messages: [{ role: 'user', content: 'hello!' }],
      model: 'gpt-3.5-turbo',
      max_tokens: 10,
      n: 1,
    });
  }
}
