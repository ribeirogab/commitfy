export type ProcessUtilsExecOptions = {
  showStdout: boolean;
};

export interface ProcessUtils {
  exec(command: string, options?: ProcessUtilsExecOptions): Promise<string>;
}
