import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { AppUtils as AppUtilsInterface } from '../interfaces';

export class AppUtils implements AppUtilsInterface {
  public readonly name = 'commitfy';
  public readonly homeDirectory = os.homedir();
  public readonly projectConfigDirectory = path.resolve(
    this.homeDirectory,
    `.${this.name}`,
  );

  public readonly envFilePath = path.resolve(
    this.projectConfigDirectory,
    '.env',
  );

  constructor() {
    if (!fs.existsSync(this.projectConfigDirectory)) {
      fs.mkdirSync(this.projectConfigDirectory);
    }
  }

  public get version() {
    return this.packageJson.version;
  }

  private get packageJson(): { version: string } {
    return JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf-8'),
    );
  }
}
