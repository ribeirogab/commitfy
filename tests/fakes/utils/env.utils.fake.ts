import { CommitPromptEnum, DEFAULT_COMMIT_PROMPTS } from '@/constants';
import { EnvUtils as EnvUtilsInterface, SetupContextEnum } from '@/interfaces';

export const DEFAULT_ENV = {
  SETUP_CONTEXT: SetupContextEnum.Automatic,
  CONFIG_COMMIT_LANGUAGE: 'English (EN)',
  CONFIG_MAX_COMMIT_CHARACTERS: '72',
  CONFIG_PROMPT_AUTOMATIC_CONTEXT:
    DEFAULT_COMMIT_PROMPTS[CommitPromptEnum.AutomaticContext],
  CONFIG_PROMPT_MANUAL_CONTEXT:
    DEFAULT_COMMIT_PROMPTS[CommitPromptEnum.ManualContext],
};

export const makeEnvUtilsFake = () => {
  class EnvUtilsFake {
    public update = vi.fn();

    public variables() {
      return DEFAULT_ENV;
    }
  }

  return new EnvUtilsFake() as EnvUtilsInterface;
};
