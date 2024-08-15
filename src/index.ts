import { generateCommit, getVersion, help, setup } from '@/container';

enum CommandEnum {
  GenerateCommit,
  GetVersion,
  Setup,
  Help,
}

const COMMAND_MAPPER = {
  [CommandEnum.GenerateCommit]: {
    match: ['run', 'generate-commit'],
    command: generateCommit,
  },

  [CommandEnum.GetVersion]: {
    match: ['-v', '--v', '-version', '--version'],
    command: getVersion,
  },

  [CommandEnum.Setup]: {
    match: ['setup'],
    command: setup,
  },

  [CommandEnum.Help]: {
    match: ['--help'],
    command: help,
  },
};

export const run = async () => {
  const command = process.argv[2];

  if (!command) {
    return generateCommit.execute();
  }

  const matchedCommand = Object.values(COMMAND_MAPPER).find(({ match }) =>
    match.includes(command),
  );

  if (matchedCommand) {
    return matchedCommand.command.execute();
  }

  console.error(`commitfy: '${command}' is not a commitfy command.`);
  console.log(`See 'commitfy --help'.`);
  process.exit(0);
};
