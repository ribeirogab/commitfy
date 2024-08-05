import { exec } from 'node:child_process';

import type {
  AppUtils,
  ProcessUtils as ProcessUtilsInterface,
} from '../interfaces';

export class ProcessUtils implements ProcessUtilsInterface {
  constructor(private readonly appUtils: AppUtils) {}

  public async exec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.appUtils.logger.error(
            `Error executing command '${command}'\n`,
            error,
          );

          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
