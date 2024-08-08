import inquirer from 'inquirer';
import type { Mock } from 'vitest';

import {
  InputPromptDto,
  InputTypeEnum,
  InputUtilsCustomChoiceEnum,
} from '../interfaces';
import { InputUtils } from './input.utils';

vi.mock('inquirer');

const makeSut = () => {
  const inputUtils = new InputUtils();

  return { sut: inputUtils };
};

class SeparatorMock {
  constructor() {
    return '';
  }
}

describe('InputUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (inquirer.Separator as unknown as Mock).mockReturnValueOnce(SeparatorMock);
  });

  describe('prompt', () => {
    it('should prompt for user input', async () => {
      const { sut } = makeSut();

      const input: InputPromptDto = {
        type: InputTypeEnum.Input,
        message: 'Enter your name:',
      };

      const expectedData = 'John Doe';

      (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
        data: expectedData,
      });

      const result = await sut.prompt(input);

      expect(result).toBe(expectedData);

      expect(inquirer.prompt).toHaveBeenCalledWith([
        { name: 'data', ...input },
      ]);
    });

    it('should handle list input type with custom choices', async () => {
      const { sut } = makeSut();

      const input: InputPromptDto = {
        type: InputTypeEnum.List,
        message: 'Select your favorite color:',
        choices: [
          'Red',
          'Green',
          'Blue',
          InputUtilsCustomChoiceEnum.Separator,
          'Yellow',
        ],
      };

      const expectedData = 'Green';

      (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
        data: expectedData,
      });

      const result = await sut.prompt(input);

      expect(result).toBe(expectedData);

      expect(inquirer.prompt).toHaveBeenCalledWith([
        {
          name: 'data',
          type: 'list',
          message: 'Select your favorite color:',
          choices: ['Red', 'Green', 'Blue', SeparatorMock, 'Yellow'],
        },
      ]);
    });

    it('should exit the process if user force closes the prompt', async () => {
      const { sut } = makeSut();

      const input: InputPromptDto = {
        type: InputTypeEnum.Input,
        message: 'Enter your name:',
      };

      (inquirer.prompt as unknown as Mock).mockRejectedValueOnce(
        new Error('User force closed the prompt with 0 null'),
      );

      const exitSpy = vi.spyOn(process, 'exit');

      await expect(sut.prompt(input)).rejects.toThrowError();

      expect(exitSpy).toHaveBeenCalledWith(0);
    });

    it('should rethrow any other errors', async () => {
      const { sut } = makeSut();

      const input: InputPromptDto = {
        type: InputTypeEnum.Input,
        message: 'Enter your name:',
      };

      const expectedError = new Error('Something went wrong');

      (inquirer.prompt as unknown as Mock).mockRejectedValueOnce(expectedError);

      await expect(sut.prompt(input)).rejects.toThrowError(expectedError);
    });
  });
});
