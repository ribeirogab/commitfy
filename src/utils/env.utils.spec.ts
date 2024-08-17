import fs from 'node:fs';
import path from 'path';

import { DEFAULT_ENV, makeAppUtilsFake } from '../../tests/fakes/utils';
import { TEMP_DIRECTORY } from '../constants';
import { EnvUtils as EnvUtilsInterface, ProviderEnum } from '../interfaces';
import { EnvUtils } from './env.utils';

const ENV_FILE_PATH = path.join(TEMP_DIRECTORY, '.env');

export const makeFakeEnvUtils = () =>
  ({ update: vi.fn(), variables: vi.fn() } as EnvUtilsInterface);

const makeSut = () => {
  const appUtils = makeAppUtilsFake();

  const envUtils = new EnvUtils(appUtils);

  return { sut: envUtils };
};

describe('EnvUtils', () => {
  beforeEach(() => {
    const fileContent = Object.entries({
      PROVIDER: ProviderEnum.OpenAI,
      OPENAI_API_KEY: '123456789',
      OPENAI_N_COMMITS: '2',
    })
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(ENV_FILE_PATH, fileContent, 'utf8');
  });

  describe('variables', () => {
    it('should return an object with environment variables', () => {
      const { sut } = makeSut();

      const variables = sut.variables();

      expect(variables).toBeDefined();
      expect(typeof variables).toBe('object');
    });
  });

  describe('update', () => {
    it('should update the environment variables', () => {
      const { sut } = makeSut();

      const updates = {
        PROVIDER: ProviderEnum.OpenAI,
        OPENAI_API_KEY: '123456789',
        OPENAI_N_COMMITS: '5',
      };

      sut.update(updates);

      const variables = sut.variables();

      expect(Object.keys(variables)).toEqual(
        Object.keys({ ...DEFAULT_ENV, ...updates }),
      );
    });

    it('should merge the updates with existing environment variables', () => {
      const { sut } = makeSut();
      const initialVariables = sut.variables();

      const updates = {
        OPENAI_N_COMMITS: '5',
      };

      sut.update(updates);

      expect(sut.variables()).toEqual({ ...initialVariables, ...updates });
    });
  });
});
