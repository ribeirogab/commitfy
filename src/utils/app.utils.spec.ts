import path from 'node:path';

import { TEMP_DIRECTORY } from '../constants';
import { AppUtils as AppUtilsInterface } from '../interfaces';
import { AppUtils } from './app.utils';

const ENV_FILE_PATH = path.join(TEMP_DIRECTORY, '.env');

export const makeFakeAppUtils = () =>
  ({
    projectConfigDirectory: TEMP_DIRECTORY,
    envFilePath: ENV_FILE_PATH,
    version: 'v1.0.0',
    name: 'commitfy',
    logger: {
      message: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      log: vi.fn(),
    },
  } as AppUtilsInterface);

const makeSut = () => {
  const appUtils = new AppUtils();

  return { sut: appUtils };
};

describe('AppUtils', () => {
  it('should create an instance of AppUtils', () => {
    const { sut } = makeSut();
    expect(sut).toBeInstanceOf(AppUtils);
  });

  describe('projectConfigDirectory', () => {
    it('should have a projectConfigDirectory property', () => {
      const { sut } = makeSut();
      expect(sut.projectConfigDirectory).toBeDefined();
    });
  });

  describe('envFilePath', () => {
    it('should have an envFilePath property', () => {
      const { sut } = makeSut();
      expect(sut.envFilePath).toBeDefined();
    });
  });

  describe('logger', () => {
    it('should have a logger property', () => {
      const { sut } = makeSut();
      expect(sut.logger).toBeDefined();
    });

    it('should have all the required properties', () => {
      const { sut } = makeSut();

      expect(Object.keys(sut.logger)).toEqual([
        'error',
        'warn',
        'log',
        'message',
      ]);
    });
  });

  describe('name', () => {
    it('should have a name property', () => {
      const { sut } = makeSut();
      expect(sut.name).toBeDefined();
    });
  });

  describe('version', () => {
    it('should have a version property', () => {
      const { sut } = makeSut();
      expect(sut.version).toBeDefined();
    });
  });
});
