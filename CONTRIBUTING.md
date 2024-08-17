# Contributing to `commitfy`

Thank you for considering contributing to `commitfy`! This document provides guidelines and an overview of the project structure to help you contribute effectively.

## Project Structure

The project is organized as follows:

- **`src/`**: Contains the main source code, divided into the following subdirectories:
  - **`commands/`**: Contains the command implementations that define the functionalities of `commitfy`. Each command is responsible for a specific task, such as generating a commit message, setting up the environment, or displaying help information.
  - **`interfaces/`**: Defines TypeScript interfaces and types used throughout the project. This directory helps ensure type safety and consistency across different parts of the codebase.
  - **`providers/`**: Contains the implementations of the AI providers supported by `commitfy`. This includes setting up connections, handling API requests, and processing responses from AI services like OpenAI.
  - **`utils/`**: Includes utility functions and helpers that are used across the project. These utilities perform common tasks such as environment management, input validation, and process handling.
  - **`container.ts`**: Manages dependency injection, allowing for loose coupling between components and making the system more modular and testable.
  - **`constants.ts`**: Stores constant values used across the project, such as default settings or configuration keys.
  - **`index.ts`**: The entry point of the application that ties together different components and initializes the command-line interface.

- **`bin/`**: Contains executable scripts that are used to run the application from the command line. This typically includes the entry point script that initializes and launches the `commitfy` CLI.
- **`tests/`**: Includes supporting files for tests. The tests themselves are located alongside the original files (e.g., `./src/utils/env.utils.ts`, `./src/utils/env.utils.spec.ts`), ensuring that each module is thoroughly tested.
- **`lib/`**: Contains the compiled version of the source code, generated after the build process. This directory is what gets executed when you run the tool in production.
- **`tmp/`**: A temporary folder used during development and testing. It may hold temporary files, logs, or other data generated during runtime.

## Labels

To help manage issues and pull requests, we use a set of labels. You can view and understand the purpose of each label by visiting the [labels page on GitHub](https://github.com/ribeirogab/commitfy/labels).

## Running Tests

To run the project's tests, use the following command:

```bash
npm test
```

## Contribution Workflow

1. **Fork the Repository**: Click the "Fork" button on the top right corner of the repository page to create a copy of the repository under your GitHub account.

2. **Create a Branch**: Create a new branch for your contribution using the following command:

    ```bash
    git checkout -b feature/your-feature-name
    ```

3. **Make Changes**: Implement your changes in the newly created branch.

4. **Commit Your Changes**: Use `cfy` to generate a commit message, and then commit your changes:

    ```bash
    git add .
    cfy
    ```

5. **Push to Your Fork**: Push your changes to your forked repository:

    ```bash
    git push origin feature/your-feature-name
    ```

6. **Open a Pull Request**: Go to the original repository and open a pull request. Be sure to include a detailed description of the changes you have made.

## Code Style and Guidelines

- Follow the existing coding style and conventions in the project.
- Ensure that your changes do not break any existing functionality or tests.
- Write clear and concise commit messages using `cfy`.

## Issues and Bugs

If you encounter any issues or bugs, feel free to [open an issue](https://github.com/ribeirogab/commitfy/issues) on GitHub. Please provide as much detail as possible to help us resolve the issue quickly.

## Thank You!

Your contributions are valuable, and we appreciate your effort in improving `commitfy`. Thank you for taking the time to contribute!
