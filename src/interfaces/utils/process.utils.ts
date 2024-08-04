export interface ProcessUtils {
  exec(command: string): Promise<string>;
}
