export class Help {
  public execute() {
    const commands = [
      {
        command: 'cfy',
        description: 'Create commit messages and show on the terminal',
      },
      {
        command: 'cfy setup',
        description:
          'Responsible for initial setup and updating configurations.',
      },
      {
        command: 'cfy --help',
        description:
          'List all commands and information of files and providers.',
      },
      { command: 'cfy --version', description: 'Output the current version.' },
    ];

    const directoriesAndFiles = [
      { path: '~/.commitfy', description: 'Directory for all configs.' },
      {
        path: '~/.commitfy/.env',
        description: 'File for environment variables.',
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

    console.log('\nProviders:');
    console.log(' OpenAI:');

    console.log(
      '  - API key required. Get it from https://platform.openai.com/account/api-keys.',
    );
  }
}
