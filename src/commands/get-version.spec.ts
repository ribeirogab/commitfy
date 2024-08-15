import { GetVersion } from './get-version';
import { makeAppUtilsFake } from '@/tests/fakes/utils';

const makeSut = () => {
  const appUtils = makeAppUtilsFake();
  const sut = new GetVersion(appUtils);

  return {
    appUtils,
    sut,
  };
};

describe('GetVersion', () => {
  it('should log the application name and version', () => {
    const { sut, appUtils } = makeSut();

    sut.execute();

    expect(appUtils.logger.message).toHaveBeenCalledWith(
      `${appUtils.name} version v${appUtils.version}`,
    );
  });

  it('should not log an error', () => {
    const { sut, appUtils } = makeSut();

    sut.execute();

    expect(appUtils.logger.error).not.toHaveBeenCalled();
  });
});
