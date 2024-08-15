import inquirer from 'inquirer';

import {
  type InputPromptDto,
  InputTypeEnum,
  InputUtilsCustomChoiceEnum,
  type InputUtils as InputUtilsInterface,
} from '@/interfaces';

export class InputUtils implements InputUtilsInterface {
  public async prompt(input: InputPromptDto) {
    try {
      const promptDto = [{ name: 'data', ...input }];

      if (input.type === InputTypeEnum.List) {
        const choicesWithCustom =
          input.type === InputTypeEnum.List &&
          input.choices.map((choice) =>
            choice === InputUtilsCustomChoiceEnum.Separator
              ? new inquirer.Separator()
              : choice,
          );

        Object.assign(promptDto[0], { choices: choicesWithCustom });
      }

      const { data } = await inquirer.prompt(promptDto as never);

      return data;
    } catch (error) {
      if (error.message === 'User force closed the prompt with 0 null') {
        process.exit(0);
      }

      throw error;
    }
  }
}
