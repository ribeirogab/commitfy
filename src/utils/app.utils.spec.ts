import { AppUtils } from './app.utils';

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
