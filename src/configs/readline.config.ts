import * as readline from 'node:readline';

import type { ReadlineConfig } from '../interfaces';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

export const readlineConfig: ReadlineConfig = {
  askQuestion,
};
