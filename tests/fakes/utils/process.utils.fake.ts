import type { ProcessUtils } from '@/interfaces';

export const makeProcessUtilsFake = () => {
  class ProcessUtilsFake {
    public exec = vi.fn();
  }

  return new ProcessUtilsFake() as ProcessUtils;
};
