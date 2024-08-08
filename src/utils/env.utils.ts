import * as fs from 'node:fs';

import type {
  AppUtils,
  Env,
  EnvUtils as EnvUtilsInterface,
} from '../interfaces';

export class EnvUtils implements EnvUtilsInterface {
  constructor(private readonly appUtils: AppUtils) {}

  public get variables(): Env {
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
    const fileContent = Object.entries({ ...this.variables, ...updates })
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(this.appUtils.envFilePath, fileContent, 'utf8');
  }
}
