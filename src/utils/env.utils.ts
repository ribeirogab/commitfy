import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { type Env, EnvUtils as EnvUtilsInterface } from '../interfaces';

const HOME_DIRECTORY = os.homedir();
const ENV_FILE_PATH = path.resolve(HOME_DIRECTORY, '.commit-ai');

export class EnvUtils implements EnvUtilsInterface {
  public get(): Env {
    const currentConfig = fs.existsSync(ENV_FILE_PATH)
      ? fs
          .readFileSync(ENV_FILE_PATH, 'utf-8')
          .split('\n')
          .filter((line) => line.trim() !== '' && !line.trim().startsWith('#'))
          .reduce((variables, line) => {
            const [key, value] = line.split('=');
            variables[key] = value;

            return variables;
          }, {} as Record<string, string>)
      : {};

    return currentConfig as Env;
  }

  public update(updates: Partial<Env>) {
    const currentConfig = this.get();

    const fileContent = Object.entries({ ...currentConfig, ...updates })
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(ENV_FILE_PATH, fileContent, 'utf8');
  }
}
