export interface Yaml {
  description: string;
  name: string;
  snippets: Snippet[];
}

export interface Steps {
  steps?: (
    ChatSay |
    ChatDo |
    ChatGoto |
    ChatWaitVar |
    ChatWaitButton |
    ChatWaitButtonStep |
    ChatSwitch
  )[];
}

export interface Snippet extends Steps {
  name: string;
}

export interface ChatSay {
  say: string;
}

export interface ChatDo {
  do: {
    cmd: string;
    params?: string[];
    variable?: string;
  };
}

export interface ChatGoto {
  goto: string;
}

export interface ChatWaitVar {
  wait: {
    variable: string;
    placeholder?: string;
    validation?: string;
    validations?: string[];
    date?: boolean;
  };
}

export interface ChatWaitButton {
  wait: {
    variable: string;
    options: ButtonOption[];
  };
}

export interface ButtonOption {
  show: string;
  value: string;
}

export interface ChatWaitButtonStep {
  wait: {
    options: ButtonStep[];
  };
}

export interface ButtonStep extends Steps {
  show: string;
}

export interface ChatSwitch {
  switch: {
    arg: string;
    cases: SwitchCase[];
  };
}

export interface SwitchCase extends Steps {
  match?: string;
  default?: boolean;
}
