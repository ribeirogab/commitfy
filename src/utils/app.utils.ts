import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { AppUtils as AppUtilsInterface } from '../interfaces';

export class AppUtils implements AppUtilsInterface {
  public readonly homeDirectory = os.homedir();
  public readonly projectConfigDirectory = path.resolve(
    this.homeDirectory,
    `.${this.name}`,
  );

  public readonly envFilePath = path.resolve(
    this.projectConfigDirectory,
    '.env',
  );

  public readonly logger: AppUtilsInterface['logger'] = {
    error: (message, ...params) =>
      console.error(`${this.name}:`, ...[message, ...params]),
    warn: (message, ...params) =>
      console.warn(`${this.name}:`, ...[message, ...params]),
    log: (message, ...params) =>
      console.log(`${this.name}:`, ...[message, ...params]),
  };

  constructor() {
    if (!fs.existsSync(this.projectConfigDirectory)) {
      fs.mkdirSync(this.projectConfigDirectory);
    }
  }

  public get name() {
    return this.packageJson.name;
  }

  public get version() {
    return this.packageJson.version;
  }

  private get packageJson(): { version: string; name: string } {
    return JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf-8'),
    );
  }
}
