import { OpenAI } from 'openai';
import type { ChatModel } from 'openai/resources';

import {
  type AppUtils,
  type Env,
  type EnvUtils,
  type GenerateCommitMessagesDto,
  InputTypeEnum,
  type InputUtils,
  type Provider,
  ProviderEnum,
} from '../interfaces';
import { DEFAULT_N_COMMITS } from '@/constants';

export class OpenAIProvider implements Provider {
  private openai: OpenAI;

  private readonly defaultChatModel: ChatModel = 'gpt-4o-mini';
  private readonly chatModels: ChatModel[] = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-4-vision-preview',
    'gpt-4',
    'gpt-3.5-turbo',
  ];

  constructor(
    private readonly envUtils: EnvUtils,
    private readonly inputUtils: InputUtils,
    private readonly appUtils: AppUtils,
  ) {}

  private get client() {
    if (this.openai) {
      return this.openai;
    }

    const env = this.envUtils.variables();

    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }

    this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    return this.openai;
  }

  private get nCommits() {
    return (
      Number(this.envUtils.variables().OPENAI_N_COMMITS) || DEFAULT_N_COMMITS
    );
  }

  public async setup(): Promise<void> {
    const env = this.envUtils.variables();

    try {
      const apiKey = await this.inputUtils.prompt({
        message: 'Enter your OpenAI API key:',
        default: env.OPENAI_API_KEY,
        type: InputTypeEnum.Input,
      });

      const chatModel = await this.inputUtils.prompt<ChatModel>({
        default: env.OPENAI_CHAT_MODEL || this.defaultChatModel,
        message:
          'Choose your OpenAI language model (https://platform.openai.com/docs/models):',
        type: 'list',
        choices: this.chatModels.map((model) => ({
          value: model,
          short: model,
          name: model,
        })),
      });

      const numberOfCommits = await this.inputUtils.prompt({
        default: env.OPENAI_N_COMMITS ? String(env.OPENAI_N_COMMITS) : '2',
        message: 'Enter the number of commits to generate:',
        type: InputTypeEnum.Input,
      });

      this.envUtils.update({
        ...env,
        OPENAI_N_COMMITS: Number(numberOfCommits),
        PROVIDER: ProviderEnum.OpenAI,
        OPENAI_CHAT_MODEL: chatModel,
        OPENAI_API_KEY: apiKey,
      });

      // Ensure the OpenAI integration is working
      await this.test();

      this.appUtils.logger.message(
        '\x1b[32m✓\x1b[0m',
        'OpenAI setup successfully completed.',
      );
    } catch (error) {
      this.envUtils.update(env);

      this.appUtils.logger.error(
        'Failed to set up OpenAI.',
        ...(error?.error
          ? [`\nOpenAI error:`, error.error]
          : [error.message || '']),
      );

      process.exit(1);
    }
  }

  public async generateCommitMessages({
    n = this.nCommits,
    prompt,
    diff,
  }: GenerateCommitMessagesDto): Promise<string[]> {
    try {
      const env = this.envUtils.variables();

      this.checkRequiredEnvVars(env);

      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          { role: 'user', content: prompt },
          { role: 'user', content: `git diff:\n${diff}` },
        ],
        model: env.OPENAI_CHAT_MODEL || this.defaultChatModel,
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
      this.appUtils.logger.error(
        'Failed to generate commit message.',
        ...(error?.error
          ? [`\nOpenAI error:`, error.error]
          : [error.message || '']),
      );

      process.exit(1);
    }
  }

  private checkRequiredEnvVars(env: Env): void {
    if (!env.OPENAI_API_KEY) {
      this.appUtils.logger.error('OPENAI_API_KEY is required');
      this.appUtils.logger.message("Run 'commitfy setup' to set up.");
      process.exit(0);
    }
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
