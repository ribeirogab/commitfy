export enum ProviderEnum {
  OpenAI = 'openai',
}

export type GenerateCommitMessagesDto = {
  prompt: string;
  diff: string;
  n?: number;
};

export interface Provider {
  generateCommitMessages(dto: GenerateCommitMessagesDto): Promise<string[]>;
  setup(): Promise<void>;
}

export type Providers = {
  [ProviderEnum.OpenAI]: Provider;
};
