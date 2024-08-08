import os from 'node:os';
import path from 'node:path';

export const PACKAGE_JSON_PATH = path.resolve(__dirname, '..', 'package.json');

export const USER_HOME_DIRECTORY = os.homedir();

export const TEMP_DIRECTORY = path.resolve(__dirname, '..', 'tmp');
