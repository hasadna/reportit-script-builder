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
    ChatSwitch |
    ChatInfocard |
    ChatTaskTemplate |
    ChatOrganization
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
  infocard: {
    title: string;
    content: string;
    slug: string;
  };
}

export interface ChatTaskTemplate {
  tasktemplate: {
    title: string;
    description: string;
    infocard_slugs: string;
    slug: string;
  };
}

export interface ChatScenario {
  offender?: string;
  eventlocation?: string;
  complainttype?: string;
}

export interface ChatOrganization {
  organization: {
    contact_person1: string;
    contact_person2: string;
    description: string;
    email1: string;
    email2: string;
    fax: string;
    mail_address: string;
    organization_name: string;
    organization_type: string;
    phone_number1: string;
    phone_number2: string;
    phone_response_details: string;
    reception_details: string;
    scenarios_relevancy: string;
    slug: string;
    website_label1: string;
    website_label2: string;
    website_url1: string;
    website_url2: string;
    scenarios?: ChatScenario[];
  };
}
