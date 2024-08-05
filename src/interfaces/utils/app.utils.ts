// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppLoggerMessage = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppLoggerOptionalParams = any;

type LoggerFunction = (
  message?: AppLoggerMessage,
  ...params: AppLoggerOptionalParams[]
) => void;

export interface AppUtils {
  projectConfigDirectory: string;
  homeDirectory: string;
  envFilePath: string;
  version: string;
  name: string;
  logger: {
    error: LoggerFunction;
    warn: LoggerFunction;
    log: LoggerFunction;
  };
}
