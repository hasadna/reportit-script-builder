export enum  BlockType {
  Say,
  WaitDate,
  WaitText,
  Switch,
  WaitButton,
  WaitButtonStep,
  Snippet,
  Goto,
  Do,
}

export enum  BlockValidation {
  NoEmptyAnswer,
  PhoneNumber,
  EmailAddress,
  Date,
  Hour,
}
