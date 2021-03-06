export enum BlockType {
  Say,
  WaitDate,
  WaitText,
  Switch,
  WaitButton,
  WaitButtonStep,
  Snippet,
  Goto,
  Do,
  Infocard,
  Organization,
  TaskTemplate,
}

export enum BlockValidation {
  NoEmptyAnswer,
  PhoneNumber,
  EmailAddress,
  Date,
  Hour,
  Number,
}

export enum OrderArrow {
  Up,
  Down,
}
