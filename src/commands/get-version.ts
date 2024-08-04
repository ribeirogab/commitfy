import type { AppUtils } from '../interfaces';

export class GetVersion {
  constructor(private appUtils: AppUtils) {}

  public execute(): void {
    console.log(`Commitfy version v${this.appUtils.version}`);
  }
}
