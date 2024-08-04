export enum ProviderEnum {
  OpenAI = 'openai',
}

export interface Provider {
  generateCommitMessages({ diff }: { diff: string }): Promise<string[]>;
  setup(): Promise<void>;
}

export type Providers = {
  [ProviderEnum.OpenAI]: Provider;
};
