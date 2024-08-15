import { Help } from './help';

const makeSut = () => {
  const sut = new Help();

  return { sut };
};

describe('Help', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should execute without errors', () => {
    const { sut } = makeSut();

    expect(() => sut.execute()).not.toThrow();
  });

  it('should log messages when executed', () => {
    const { sut } = makeSut();

    sut.execute();

    expect(consoleLogSpy).toHaveBeenCalled();
  });
});
