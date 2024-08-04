import { generateCommit, getVersion, setup } from './container';

export enum CommandEnum {
  GetVersion = '-v, --v, -version, --version',
  GenerateCommit = 'generate-commit',
  Setup = 'setup',
}

const COMMAND_MAPPER = [
  {
    match: CommandEnum.Setup.split(',').map((command) => command.trim()),
    command: setup,
  },
  {
    match: CommandEnum.GetVersion.split(',').map((command) => command.trim()),
    command: getVersion,
  },
  {
    match: CommandEnum.GenerateCommit.split(',').map((command) =>
      command.trim(),
    ),
    command: generateCommit,
  },
];

export const run = async () => {
  const command = process.argv[2];

  if (!command) {
    return generateCommit.execute();
  }

  const matchedCommand = COMMAND_MAPPER.find(({ match }) =>
    match.includes(command),
  );

  if (matchedCommand) {
    return matchedCommand.command.execute();
  }

  console.error('Invalid command. Please try again.');
  process.exit(0);
};
