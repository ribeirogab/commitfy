import { generateCommit, getVersion, help, setup } from './container';

export enum CommandEnum {
  GetVersion = '-v, --v, -version, --version',
  GenerateCommit = 'run, generate-commit',
  Setup = 'setup',
  Help = '--help',
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
  {
    match: CommandEnum.Help.split(',').map((command) => command.trim()),
    command: help,
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

  console.error(`commitfy: '${command}' is not a commitfy command.`);
  console.log(`See 'commitfy --help'.`);
  process.exit(0);
};
