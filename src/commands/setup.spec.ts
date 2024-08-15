import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Setup } from './setup';
import { InputUtils, ProviderEnum } from '@/interfaces';
import { makeProvidersFake } from '@/tests/fakes/providers';

const makeInputUtilsFake = (): InputUtils => ({
  prompt: vi.fn(),
});

const makeSut = () => {
  const providers = makeProvidersFake();
  const inputUtils = makeInputUtilsFake();
  const sut = new Setup(providers, inputUtils);

  return {
    sut,
    providers,
    inputUtils,
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
    const { sut, providers, inputUtils } = makeSut();

    vi.spyOn(inputUtils, 'prompt').mockResolvedValueOnce(ProviderEnum.OpenAI);

    await expect(sut.execute()).rejects.toThrow('process.exit called');

    expect(providers[ProviderEnum.OpenAI].setup).toHaveBeenCalled();

    expect(inputUtils.prompt).toHaveBeenCalledWith({
      choices: Object.values(ProviderEnum),
      message: 'Choose your AI provider',
      type: 'list',
    });
  });

  it('should exit the process after setup is complete', async () => {
    const { sut, inputUtils } = makeSut();

    vi.spyOn(inputUtils, 'prompt').mockResolvedValueOnce(ProviderEnum.OpenAI);

    await expect(sut.execute()).rejects.toThrow('process.exit called');

    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
