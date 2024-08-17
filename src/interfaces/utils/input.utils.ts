export enum InputUtilsCustomChoiceEnum {
  Separator = 'separator',
}

export enum InputTypeEnum {
  Input = 'input',
  List = 'list',
}

type DefaultInput = {
  default?: string;
  message: string;
};

export interface Input extends DefaultInput {
  type: InputTypeEnum.Input;
  mask?: string;
}

export interface InputList extends DefaultInput {
  choices: (
    | string
    | { name: string; value: string; short?: string }
    | InputUtilsCustomChoiceEnum
  )[];
  type: 'list';
}

export type InputPromptDto = Input | InputList;

export interface InputUtils {
  prompt(input: InputPromptDto): Promise<string>;
}
