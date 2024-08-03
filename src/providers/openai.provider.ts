import { OpenAI } from 'openai';

import { type EnvConfig, Provider, type ReadlineConfig } from '../interfaces';

export class OpenAIProvider implements Provider {
  private openai: OpenAI;

  constructor(
    private readonly envConfig: EnvConfig,
    private readonly readlineConfig: ReadlineConfig,
  ) {}

  private get client() {
    if (this.openai) {
      return this.openai;
    }

    const env = this.envConfig.get();

    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }

    this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    return this.openai;
  }

  public async generateCommitMessage({
    diff,
  }: {
    diff: string;
  }): Promise<string> {
    try {
      const prompt = `Generate a concise and clear commit message using the commitizen format (e.g., feat, chore, refactor, etc.) for the following code changes. The message should be at most 72 characters long:`;

      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          { role: 'user', content: prompt },
          { role: 'user', content: diff },
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 50,
        n: 1,
      });

      const commitMessage = chatCompletion.choices[0].message.content;

      if (!commitMessage) {
        throw new Error('Failed to generate commit message');
      }

      return commitMessage;
    } catch (error) {
      console.error('Failed to generate commit message');

      throw error;
    }
  }

  public async setup(): Promise<void> {
    const apiKey = await this.readlineConfig.askQuestion(
      'Enter your OpenAI API key: ',
    );

    this.envConfig.update({ OPENAI_API_KEY: apiKey });

    console.log('OpenAI setup complete!');
  }
}
