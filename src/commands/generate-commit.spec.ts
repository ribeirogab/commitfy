import { GenerateCommit } from './generate-commit';
import { ProviderEnum } from '@/interfaces';
import { makeProvidersFake } from '@/tests/fakes/providers';
import {
  makeAppUtilsFake,
  makeEnvUtilsFake,
  makeInputUtilsFake,
  makeProcessUtilsFake,
} from '@/tests/fakes/utils';

export const makeSut = () => {
  const processUtils = makeProcessUtilsFake();
  const inputUtils = makeInputUtilsFake();
  const providers = makeProvidersFake();
  const envUtils = makeEnvUtilsFake();
  const appUtils = makeAppUtilsFake();
  const sut = new GenerateCommit(
    providers,
    envUtils,
    processUtils,
    inputUtils,
    appUtils,
  );

  return {
    processUtils,
    inputUtils,
    providers,
    envUtils,
    appUtils,
    sut,
  };
};

describe('GenerateCommit', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create an instance of GenerateCommit', () => {
    const { sut } = makeSut();

    expect(sut).toBeInstanceOf(GenerateCommit);
  });

  it('should log an error and exit if provider is not set', async () => {
    const { sut, appUtils } = makeSut();

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((number) => {
      throw new Error('process.exit: ' + number);
    });
    const loggerMessageSpy = vi.spyOn(appUtils.logger, 'message');
    const loggerErrorSpy = vi.spyOn(appUtils.logger, 'error');

    await expect(sut.execute()).rejects.toThrow();

    expect(loggerErrorSpy).toHaveBeenCalledWith('AI provider not set.');

    expect(loggerMessageSpy).toHaveBeenCalledWith(
      "Run 'commitfy setup' to set up the provider.",
    );

    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('should log an error and exit if there are no changes to commit', async () => {
    const { sut, appUtils, envUtils, processUtils } = makeSut();

    const loggerMessageSpy = vi.spyOn(appUtils.logger, 'error');
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((number) => {
      throw new Error('process.exit: ' + number);
    });

    vi.spyOn(envUtils, 'variables').mockReturnValueOnce({
      PROVIDER: ProviderEnum.OpenAI,
    });

    vi.spyOn(processUtils, 'exec').mockResolvedValueOnce('');

    await expect(sut.execute()).rejects.toThrow();
    expect(loggerMessageSpy).toHaveBeenCalledWith('No changes to commit.');
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('should execute successfully if provider is set and there are changes to commit', async () => {
    const { sut, envUtils, processUtils, inputUtils, providers } = makeSut();

    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((number) => number as never);

    const variablesSpy = vi.spyOn(envUtils, 'variables').mockReturnValueOnce({
      PROVIDER: ProviderEnum.OpenAI,
    });

    const generateCommitMessagesSpy = vi
      .spyOn(providers[ProviderEnum.OpenAI], 'generateCommitMessages')
      .mockResolvedValueOnce(['commit message']);

    const execSpy = vi
      .spyOn(processUtils, 'exec')
      .mockResolvedValueOnce('some changes');

    const promptSpy = vi
      .spyOn(inputUtils, 'prompt')
      .mockResolvedValueOnce('commit message');

    await expect(sut.execute()).resolves.not.toThrow();

    expect(variablesSpy).toHaveBeenCalled();

    expect(generateCommitMessagesSpy).toHaveBeenCalledWith({
      diff: 'some changes',
    });

    expect(execSpy).toHaveBeenCalledWith(`git commit -m "commit message"`, {
      showStdout: true,
    });

    expect(promptSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('should call execute again if user chooses to regenerate', async () => {
    const { sut, envUtils, processUtils, inputUtils, providers } = makeSut();

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    vi.spyOn(envUtils, 'variables').mockReturnValue({
      PROVIDER: ProviderEnum.OpenAI,
    });

    vi.spyOn(
      providers[ProviderEnum.OpenAI],
      'generateCommitMessages',
    ).mockResolvedValueOnce(['commit 1', 'commit 2']);

    vi.spyOn(processUtils, 'exec').mockResolvedValueOnce('some changes');

    vi.spyOn(inputUtils, 'prompt').mockResolvedValueOnce('↻ regenerate');

    const executeSpy = vi.spyOn(sut, 'execute');

    await expect(sut.execute()).rejects.toThrow('process.exit called');

    expect(executeSpy).toHaveBeenCalledTimes(2);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
