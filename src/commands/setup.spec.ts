import { Setup } from './setup';
import { ProviderEnum, SetupContextEnum } from '@/interfaces';
import { makeProvidersFake } from '@/tests/fakes/providers';
import {
  DEFAULT_ENV,
  makeEnvUtilsFake,
  makeInputUtilsFake,
} from '@/tests/fakes/utils';

const makeSut = () => {
  const inputUtils = makeInputUtilsFake();
  const providers = makeProvidersFake();
  const envUtils = makeEnvUtilsFake();
  const sut = new Setup(providers, inputUtils, envUtils);

  return {
    inputUtils,
    providers,
    envUtils,
    sut,
  };
};

describe('Setup', () => {
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    exitSpy.mockRestore();
  });

  it('should call setup on the chosen provider', async () => {
    const { sut, providers, inputUtils, envUtils } = makeSut();

    vi.spyOn(inputUtils, 'prompt')
      .mockResolvedValueOnce(SetupContextEnum.Automatic)
      .mockResolvedValueOnce(ProviderEnum.OpenAI);

    await expect(sut.execute()).rejects.toThrow('process.exit called');

    expect(providers[ProviderEnum.OpenAI].setup).toHaveBeenCalled();

    expect(inputUtils.prompt).toHaveBeenCalledWith({
      choices: Object.keys(providers),
      message: 'Choose your AI provider',
      type: 'list',
    });

    expect(envUtils.update).toHaveBeenCalledWith({
      SETUP_CONTEXT: SetupContextEnum.Automatic,
    });
  });

  it('should exit the process after setup is complete', async () => {
    const { sut, inputUtils } = makeSut();

    vi.spyOn(inputUtils, 'prompt')
      .mockResolvedValueOnce(SetupContextEnum.Automatic)
      .mockResolvedValueOnce(ProviderEnum.OpenAI);

    await expect(sut.execute()).rejects.toThrow('process.exit called');

    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('should update the environment with the chosen context', async () => {
    const { sut, inputUtils, envUtils } = makeSut();

    vi.spyOn(inputUtils, 'prompt')
      .mockResolvedValueOnce(SetupContextEnum.Manual)
      .mockResolvedValueOnce(ProviderEnum.OpenAI);

    await expect(sut.execute()).rejects.toThrow('process.exit called');

    expect(envUtils.update).toHaveBeenCalledWith({
      SETUP_CONTEXT: SetupContextEnum.Manual,
    });
  });

  it('should prompt for both context and provider', async () => {
    const { sut, inputUtils, providers } = makeSut();

    const promptSpy = vi
      .spyOn(inputUtils, 'prompt')
      .mockResolvedValueOnce(SetupContextEnum.Automatic)
      .mockResolvedValueOnce(ProviderEnum.OpenAI);

    await expect(sut.execute()).rejects.toThrow('process.exit called');

    expect(promptSpy).toHaveBeenNthCalledWith(1, {
      default: DEFAULT_ENV.SETUP_CONTEXT,
      message:
        'Choose how you want to set the context (feat, refactor, fix, etc.)',
      type: 'list',
      choices: [
        {
          name: 'Automatic in-context generation based on changes',
          value: SetupContextEnum.Automatic,
          short: SetupContextEnum.Automatic,
        },
        {
          name: 'Choose the context manually',
          value: SetupContextEnum.Manual,
          short: SetupContextEnum.Manual,
        },
      ],
    });

    expect(promptSpy).toHaveBeenNthCalledWith(2, {
      choices: Object.keys(providers),
      message: 'Choose your AI provider',
      type: 'list',
    });
  });
});
