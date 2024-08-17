import * as fs from 'node:fs';

import { CommitPromptEnum, DEFAULT_COMMIT_PROMPTS } from '@/constants';
import {
  type AppUtils,
  type Env,
  type EnvUtils as EnvUtilsInterface,
  SetupContextEnum,
} from '@/interfaces';

export class EnvUtils implements EnvUtilsInterface {
  private readonly defaultEnv: Env = {
    SETUP_CONTEXT: SetupContextEnum.Automatic,
    CONFIG_COMMIT_LANGUAGE: 'English (EN)',
    CONFIG_MAX_COMMIT_CHARACTERS: '72',
    CONFIG_PROMPT_AUTOMATIC_CONTEXT:
      DEFAULT_COMMIT_PROMPTS[CommitPromptEnum.AutomaticContext],
    CONFIG_PROMPT_MANUAL_CONTEXT:
      DEFAULT_COMMIT_PROMPTS[CommitPromptEnum.ManualContext],
  };

  constructor(private readonly appUtils: AppUtils) {}

  public variables(): Env {
    if (!fs.existsSync(this.appUtils.envFilePath)) {
      return this.defaultEnv;
    }

    return fs
      .readFileSync(this.appUtils.envFilePath, 'utf-8')
      .split('\n')
      .filter((line) => line.trim() !== '' && !line.trim().startsWith('#'))
      .reduce((variables, line) => {
        const [key, value] = line.split('=');
        variables[key] = value;

        return variables;
      }, this.defaultEnv);
  }

  public update(updates: Partial<Env>) {
    const fileContent = Object.entries({
      ...this.defaultEnv,
      ...this.variables(),
      ...updates,
    })
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(this.appUtils.envFilePath, fileContent, 'utf8');
  }
}
