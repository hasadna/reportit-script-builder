export interface Yaml {
  description: string;
  name: string;
  constants?: string[];
  infocards?: ChatInfocard[];
  organizations?: ChatOrganization[];
  taskTemplates?: ChatTaskTemplate[];
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
    long?: boolean;
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

export interface ChatInfocard {
  title: string;
  content: string;
  slug: string;
}

export interface ChatTaskTemplate {
  title: string;
  description: string;
  infocardSlugs: string;
  slug: string;
}

export interface ChatScenario {
  json: string;
}

export interface ChatOrganization {
  contactPerson1: string;
  contactPerson2: string;
  description: string;
  email1: string;
  email2: string;
  fax: string;
  mailAddress: string;
  organizationName: string;
  organizationType: string;
  phoneNumber1: string;
  phoneNumber2: string;
  phoneResponseDetails: string;
  receptionDetails: string;
  scenariosRelevancy: string;
  slug: string;
  websiteLabel1: string;
  websiteLabel2: string;
  websiteUrl1: string;
  websiteUrl2: string;
  scenarios?: ChatScenario[];
}
