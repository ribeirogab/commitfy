export class Help {
  public execute() {
    const commands = [
      {
        command: 'cfy',
        description: 'Create and run a new container from an image',
      },
      {
        command: 'cfy setup',
        description:
          'Responsible for initial setup and updating configurations',
      },
      {
        command: 'cfy --help',
        description: 'List all commands and their usage',
      },
      { command: 'cfy --version', description: 'Output the current version' },
    ];

    const directoriesAndFiles = [
      { path: '~/.commitfy', description: 'Directory for configs' },
      {
        path: '~/.commitfy/.env',
        description: 'File for environment variables',
      },
    ];

    console.log('Commands:');

    commands.forEach(({ command, description }) => {
      console.log(`  ${command.padEnd(18)} ${description}`);
    });

    console.log('\nDirectories and files:');

    directoriesAndFiles.forEach(({ path, description }) => {
      console.log(`  ${path.padEnd(25)} ${description}`);
    });
  }
}
