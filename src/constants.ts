import os from 'node:os';
import path from 'node:path';

export const PACKAGE_JSON_PATH = path.resolve(__dirname, '..', 'package.json');

export const USER_HOME_DIRECTORY = os.homedir();

export const TEMP_DIRECTORY = path.resolve(__dirname, '..', 'tmp');

export const DEFAULT_N_COMMITS = 2;

export enum SemanticCommitContextEnum {
  Refactor = 'refactor',
  Style = 'style',
  Chore = 'chore',
  Docs = 'docs',
  Test = 'test',
  Feat = 'feat',
  Fix = 'fix',
}

export enum CustomConfigKeysEnum {
  MaxCommitCharacters = '{{CONFIG_MAX_COMMIT_CHARACTERS}}',
  CommitLanguage = '{{CONFIG_COMMIT_LANGUAGE}}',
  CustomContext = '{{CUSTOM_CONTEXT}}',
}

export enum CommitPromptEnum {
  AutomaticContext = 'automatic-context',
  ManualContext = 'manual-context',
}

const semanticCommitContextsText = Object.values(
  SemanticCommitContextEnum,
).join(', ');

export const DEFAULT_COMMIT_PROMPTS = {
  [CommitPromptEnum.AutomaticContext]: `Generate a short commit message in ${CustomConfigKeysEnum.CommitLanguage} with a maximum of ${CustomConfigKeysEnum.MaxCommitCharacters} characters, following the Conventional Commits format. The message should begin with one of the following types: ${semanticCommitContextsText}, followed by a concise description of the change in lowercase. Do not include a scope, do not end the message with a period, and always start the description with a lowercase letter. Ensure the total length does not exceed ${CustomConfigKeysEnum.MaxCommitCharacters} characters.`,

  [CommitPromptEnum.ManualContext]: `Generate a short commit message in ${CustomConfigKeysEnum.CommitLanguage} with a maximum of ${CustomConfigKeysEnum.MaxCommitCharacters} characters, following the Conventional Commits format. The message should begin with one of the following types: ${semanticCommitContextsText}, followed by a concise description of the change in lowercase. Context: ${CustomConfigKeysEnum.CustomContext}. Do not include a scope, do not end the message with a period, and always start the description with a lowercase letter. Ensure the total length does not exceed ${CustomConfigKeysEnum.MaxCommitCharacters} characters.`,
};
