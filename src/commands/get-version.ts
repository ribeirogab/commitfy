import type { AppUtils } from '../interfaces';

export class GetVersion {
  constructor(private appUtils: AppUtils) {}

  public execute(): void {
    this.appUtils.logger.message(
      `${this.appUtils.name} version v${this.appUtils.version}`,
    );
  }
}
