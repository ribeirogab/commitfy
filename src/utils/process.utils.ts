import { exec } from 'node:child_process';

import type {
  AppUtils,
  ProcessUtilsExecOptions,
  ProcessUtils as ProcessUtilsInterface,
} from '@/interfaces';

export class ProcessUtils implements ProcessUtilsInterface {
  constructor(private readonly appUtils: AppUtils) {}

  public async exec(
    command: string,
    options: ProcessUtilsExecOptions = { showStdout: false },
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const childProcess = exec(command);
      let stdout = '';

      childProcess.stdout.on('data', (data) => {
        if (options.showStdout) {
          process.stdout.write(data);
        }

        stdout += data.toString();
      });

      childProcess.stderr.on('data', (data) => {
        process.stderr.write(data);
      });

      childProcess.on('error', (error) => {
        this.appUtils.logger.error(
          `Error executing command '${command}'\n`,
          error,
        );

        reject(error);
      });

      childProcess.on('close', (code) => {
        if (code !== 0) {
          reject(`Command failed with exit code ${code}`);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
