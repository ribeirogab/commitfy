import * as fs from 'node:fs';
import * as path from 'node:path';

import { PACKAGE_JSON_PATH, USER_HOME_DIRECTORY } from '@/constants';
import { AppUtils as AppUtilsInterface } from '@/interfaces';

export class AppUtils implements AppUtilsInterface {
  public readonly projectConfigDirectory = path.resolve(
    USER_HOME_DIRECTORY,
    `.${this.name}`,
  );

  public readonly envFilePath = path.resolve(
    this.projectConfigDirectory,
    '.env',
  );

  public readonly ignoreFilePath = path.resolve(
    this.projectConfigDirectory,
    '.commitfyignore',
  );

  public readonly logger: AppUtilsInterface['logger'] = {
    error: (message, ...params) =>
      console.error(`${this.name}:`, message, ...params),
    warn: (message, ...params) =>
      console.warn(`${this.name}:`, message, ...params),
    log: (message, ...params) =>
      console.log(`${this.name}:`, message, ...params),
    message: (message, ...params) => console.log(message, ...params),
  };

  constructor() {
    if (!fs.existsSync(this.projectConfigDirectory)) {
      fs.mkdirSync(this.projectConfigDirectory);
    }

    if (!fs.existsSync(this.ignoreFilePath)) {
      fs.writeFileSync(
        this.ignoreFilePath,
        ['package-lock.json', 'yarn.lock', 'node_modules'].join('\n'),
        'utf-8',
      );
    }
  }

  public get name() {
    return this.packageJson.name;
  }

  public get version() {
    return this.packageJson.version;
  }

  public get ignoreFiles(): string[] {
    if (fs.existsSync('.commitfyignore')) {
      return fs
        .readFileSync('.commitfyignore', 'utf-8')
        .split('\n')
        .filter((line) => line.trim() !== '');
    }

    return fs
      .readFileSync(this.ignoreFilePath, 'utf-8')
      .split('\n')
      .filter((line) => line.trim() !== '');
  }

  private get packageJson(): { version: string; name: string } {
    return JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
  }
}
