import { OpenAI } from 'openai';
import type { ChatCompletion } from 'openai/resources';

import { OpenAIProvider } from './openai.provider';
import { ProviderEnum } from '@/interfaces';
import {
  makeAppUtilsFake,
  makeEnvUtilsFake,
  makeInputUtilsFake,
} from '@/tests/fakes/utils';

vi.mock('openai');

const makeSut = () => {
  const envUtils = makeEnvUtilsFake();
  const inputUtils = makeInputUtilsFake();
  const appUtils = makeAppUtilsFake();
  const openAIClient = {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  };

  vi.mocked(OpenAI).mockImplementation(() => openAIClient as unknown as OpenAI);

  const sut = new OpenAIProvider(envUtils, inputUtils, appUtils);

  return {
    openAIClient,
    inputUtils,
    appUtils,
    envUtils,
    sut,
  };
};

describe('OpenAIProvider', () => {
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    exitSpy.mockRestore();
  });

  describe('generateCommitMessages', () => {
    it('should throw an error if OPENAI_API_KEY is not set', async () => {
      const { sut, envUtils, appUtils } = makeSut();

      vi.spyOn(envUtils, 'variables').mockReturnValueOnce({});
      const loggerErrorSpy = vi.spyOn(appUtils.logger, 'error');

      await expect(
        sut.generateCommitMessages({ diff: 'some changes' }),
      ).rejects.toThrow();

      expect(loggerErrorSpy).toHaveBeenCalledWith('OPENAI_API_KEY is required');
    });

    it('should generate commit messages successfully', async () => {
      const { sut, envUtils, openAIClient } = makeSut();

      vi.spyOn(envUtils, 'variables').mockReturnValue({
        OPENAI_API_KEY: 'valid-api-key',
        OPENAI_N_COMMITS: 2,
      });

      const chatCompletionMock = {
        choices: [
          { message: { content: 'feat: implement new feature' } },
          { message: { content: 'fix: resolve bug' } },
        ],
      } as ChatCompletion;

      vi.spyOn(openAIClient.chat.completions, 'create').mockResolvedValueOnce(
        chatCompletionMock,
      );

      const commitMessages = await sut.generateCommitMessages({
        diff: 'some changes',
      });

      expect(commitMessages).toEqual([
        'feat: implement new feature',
        'fix: resolve bug',
      ]);
    });

    it('should log an error and exit if commit message generation fails', async () => {
      const { sut, envUtils, appUtils, openAIClient } = makeSut();

      vi.spyOn(envUtils, 'variables').mockReturnValue({
        OPENAI_API_KEY: 'valid-api-key',
        OPENAI_N_COMMITS: 2,
      });

      const loggerErrorSpy = vi.spyOn(appUtils.logger, 'error');

      vi.spyOn(openAIClient.chat.completions, 'create').mockRejectedValueOnce(
        new Error('OpenAI API error'),
      );

      await expect(
        sut.generateCommitMessages({ diff: 'some changes' }),
      ).rejects.toThrow('process.exit called');

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Failed to generate commit message.',
        'OpenAI API error',
      );
    });
  });

  describe('setup', () => {
    it('should successfully setup OpenAI provider', async () => {
      const { sut, envUtils, inputUtils, appUtils } = makeSut();

      vi.spyOn(envUtils, 'variables').mockReturnValueOnce({
        OPENAI_API_KEY: '',
      });

      vi.spyOn(inputUtils, 'prompt')
        .mockResolvedValueOnce('new-api-key')
        .mockResolvedValueOnce('3');

      const loggerMessageSpy = vi.spyOn(appUtils.logger, 'message');

      const testSpy = vi
        .spyOn(sut as OpenAIProvider & { test: () => Promise<void> }, 'test')
        .mockReturnValueOnce(Promise.resolve());

      await sut.setup();

      expect(envUtils.update).toHaveBeenCalledWith({
        OPENAI_API_KEY: 'new-api-key',
        OPENAI_N_COMMITS: 3,
        PROVIDER: ProviderEnum.OpenAI,
      });

      expect(loggerMessageSpy).toHaveBeenCalledWith(
        '\x1b[32m✓\x1b[0m',
        'OpenAI setup successfully completed.',
      );

      expect(testSpy).toHaveBeenCalled();
    });

    it('should log an error and exit if setup fails', async () => {
      const { sut, envUtils, inputUtils, appUtils } = makeSut();

      vi.spyOn(envUtils, 'variables').mockReturnValueOnce({
        OPENAI_API_KEY: '',
      });

      vi.spyOn(inputUtils, 'prompt').mockResolvedValueOnce('new-api-key');
      vi.spyOn(inputUtils, 'prompt').mockResolvedValueOnce('3');

      vi.spyOn(
        sut as OpenAIProvider & { test: () => Promise<void> },
        'test',
      ).mockRejectedValueOnce(new Error('Test failed'));

      const loggerErrorSpy = vi.spyOn(appUtils.logger, 'error');

      await expect(sut.setup()).rejects.toThrow('process.exit called');

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Failed to set up OpenAI.',
        'Test failed',
      );

      expect(envUtils.update).toHaveBeenCalled();
    });
  });
});
