export enum ProviderEnum {
  OpenAI = 'openai',
}

export interface Provider {
  generateCommitMessage({ diff }: { diff: string }): Promise<string>;
  setup(): Promise<void>;
}

export type Providers = {
  [ProviderEnum.OpenAI]: Provider;
};
