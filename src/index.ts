import { generateCommitMessageService, setupService } from './container';

export function setup() {
  return setupService.execute.bind(setupService)();
}

export function generateCommit() {
  return generateCommitMessageService.execute.bind(
    generateCommitMessageService,
  )();
}
