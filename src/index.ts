import { generateCommit, setup } from './container';

export enum CommandEnum {
  GenerateCommit = 'generate-commit',
  Setup = 'setup',
}

export const run = async () => {
  const command = process.argv[2];

  if (!command || command === CommandEnum.GenerateCommit) {
    return generateCommit.execute();
  }

  if (command === CommandEnum.Setup) {
    return setup.execute();
  }

  console.error('Invalid command. Please try again.');
  process.exit(0);
};
