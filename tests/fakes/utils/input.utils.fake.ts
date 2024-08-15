import type { InputUtils } from '@/interfaces';

export const makeInputUtilsFake = () => {
  class InputUtilsFake {
    public prompt = vi.fn();
  }

  return new InputUtilsFake() as InputUtils;
};
