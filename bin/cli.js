#!/usr/bin/env node

const { exec } = require('node:child_process');

const command = process.argv[2];

if (command === 'setup') {
  exec('npm run setup', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      process.exit(1);
    }

    console.log(stdout);
  });
} else {
  exec('npm run generateCommit', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      process.exit(1);
    }

    console.log(stdout);
  });
}
