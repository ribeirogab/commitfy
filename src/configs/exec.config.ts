import { exec } from 'node:child_process';

import type { ExecConfig } from '../interfaces';

export const execConfig: ExecConfig = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}\n${error}`);
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};
