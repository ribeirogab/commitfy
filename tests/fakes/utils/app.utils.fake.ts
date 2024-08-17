import path from 'node:path';

import { TEMP_DIRECTORY } from '@/constants';
import { AppUtils as AppUtilsInterface } from '@/interfaces';

const ENV_FILE_PATH = path.join(TEMP_DIRECTORY, '.env');

export const makeAppUtilsFake = () =>
  ({
    ignoreFiles: ['package-lock.json', 'yarn.lock', 'node_modules'],
    projectConfigDirectory: TEMP_DIRECTORY,
    envFilePath: ENV_FILE_PATH,
    version: '1.0.0',
    name: 'commitfy',
    logger: {
      message: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      log: vi.fn(),
    },
  } as AppUtilsInterface);
