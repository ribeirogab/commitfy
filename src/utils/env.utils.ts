import * as fs from 'node:fs';

import type { Env, EnvUtils as EnvUtilsInterface } from '../interfaces';
import type { AppUtils } from './app.utils';

export class EnvUtils implements EnvUtilsInterface {
  constructor(private readonly appUtils: AppUtils) {}

  public get(): Env {
    if (!fs.existsSync(this.appUtils.envFilePath)) {
      return {};
    }

    return fs
      .readFileSync(this.appUtils.envFilePath, 'utf-8')
      .split('\n')
      .filter((line) => line.trim() !== '' && !line.trim().startsWith('#'))
      .reduce((variables, line) => {
        const [key, value] = line.split('=');
        variables[key] = value;

        return variables;
      }, {} as Record<string, string>);
  }

  public update(updates: Partial<Env>) {
    const currentConfig = this.get();

    const fileContent = Object.entries({ ...currentConfig, ...updates })
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(this.appUtils.envFilePath, fileContent, 'utf8');
  }
}
