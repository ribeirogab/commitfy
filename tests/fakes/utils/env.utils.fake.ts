import { EnvUtils as EnvUtilsInterface } from '@/interfaces';

export const makeEnvUtilsFake = () => {
  class EnvUtilsFake {
    public update = vi.fn();

    public variables() {
      return {};
    }
  }

  return new EnvUtilsFake() as EnvUtilsInterface;
};
