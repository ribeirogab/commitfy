import { AppUtils } from './app.utils';
import { ProcessUtils } from './process.utils';

const makeSut = () => {
  const appUtils = new AppUtils();
  const sut = new ProcessUtils(appUtils);

  return { sut, appUtils };
};

describe('ProcessUtils', () => {
  describe('exec', () => {
    it('should execute the command and resolve with the stdout', async () => {
      const { sut } = makeSut();
      const command = 'echo "Hello, World!"';
      const expectedStdout = 'Hello, World!\n';

      const result = await sut.exec(command);

      expect(result).toBe(expectedStdout);
    });

    it('should execute the command and reject with an error if the command fails', async () => {
      const { sut } = makeSut();
      const command = 'invalid-command';

      await expect(sut.exec(command)).rejects.toMatch('Command failed');
    });

    it('should execute the command and write the stdout to process.stdout if showStdout is true', async () => {
      const { sut } = makeSut();
      const command = 'echo "Hello, World!"';
      const expectedStdout = 'Hello, World!\n';

      vi.spyOn(process.stdout, 'write');

      await sut.exec(command, { showStdout: true });

      expect(process.stdout.write).toHaveBeenCalledWith(expectedStdout);
    });

    it('should execute the command and write the stderr to process.stderr', async () => {
      const { sut } = makeSut();
      const command = 'invalid-command';

      vi.spyOn(process.stderr, 'write');

      await expect(sut.exec(command)).rejects.toThrow();

      expect(process.stderr.write).toHaveBeenCalled();
    });
  });
});
