import type { AppUtils } from '../interfaces';

export class GetVersion {
  constructor(private appUtils: AppUtils) {}

  public execute(): void {
    console.log(`${this.appUtils.name} version v${this.appUtils.version}`);
  }
}
