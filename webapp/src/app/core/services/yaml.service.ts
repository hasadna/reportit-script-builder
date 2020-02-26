import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as YAML from 'yaml';

import {
  BlockType,
  Block,
  SayBlock,
  WaitInputBlock,
  WaitButtonBlock,
  WaitButtonStepBlock,
  SwitchBlock,
  SnippetBlock,
  GotoBlock,
  DoBlock,
  InfocardBlock,
  TaskTemplateBlock,
  OrganizationBlock,
  Case,
  WaitStepButton,
  WithParent,
} from '@/core/types';
import {
  Yaml,
  ChatDo,
  ChatSay,
  ChatGoto,
  ChatSwitch,
  ChatWaitVar,
  ChatWaitButton,
  ChatWaitButtonStep,
  ChatInfocard,
  ChatTaskTemplate,
  ChatOrganization,
  Steps,
  Snippet,
  SwitchCase,
  ButtonStep,
} from '@/core/types';

import { BlockService } from './block.service';
import { NotificationService } from './notification.service';

const VALIDATION_LABELS: string[] = [
  'no-empty-answer',
  'phone-number',
  'email-address',
  'date',
  'hour',
  'number',
];

@Injectable()
export class YamlService {
  description: string = '';
  name: string = '';
  yaml: string;
  infocards: Block[];
  organizations: Block[];
  taskTemplates: Block[];
  constants: string[] = [];
  yamlChanges = new Subject<void>();

  constructor(
    private blockService: BlockService,
    private notificationService: NotificationService,
  ) { }

  // Converts YAML string to app data.
  // Returns block list if yaml is valid.
  fromYAML(): Block[] {
    let yamlList: Yaml[];
    try {
      yamlList = YAML.parse(this.yaml);
    } catch (e) {
      console.error(e);
      this.notificationService.error('Parsing error');
    }
    if (yamlList) {
      if (!yamlList || yamlList.length !== 1) {
        throw new Error('Invalid yaml');
      }
      const yaml: Yaml = yamlList[0];
      this.description = yaml.description;
      this.name = yaml.name;
      this.infocards = this.getInfocards(yaml);
      this.organizations = this.getOrganization(yaml);
      this.taskTemplates = this.getTaskTemplates(yaml);
      this.constants = yaml.constants || [];
      this.yamlChanges.next();
      return this.yamlToBlocks(yaml);
    }
  }

  // Converts app data to YAML string
  toYAML(): void {
    const yamlList: Yaml[] = [{
      description: this.description,
      name: this.name,
      constants: this.constants,
      snippets: this.snippetsToYaml(this.blockService.blockList),
    }];
    if (!this.blockService.isUserScript) {
      yamlList[0].infocards = this.getYamlInfocards(this.infocards);
      yamlList[0].organizations = this.getYamlOrganizations(this.organizations);
      yamlList[0].taskTemplates = this.getYamlTaskTemplates(this.taskTemplates);
    }
    this.yaml = YAML.stringify(yamlList);
  }

  // Converts app snippets to YAML snippets
  snippetsToYaml(blockList: Block[]) {
    const snippet: Snippet[] = [];
    for (const block of blockList) {
      if (block.type !== BlockType.Snippet) {
        throw new Error('Should be snippet');
      }
      const snippetBlock = block as SnippetBlock;
      snippet.push({
        name: snippetBlock.name,
        steps: this.blocksToYaml(snippetBlock.steps).steps,
      });
    }
    return snippet;
  }

  // Converts app block list to YAML steps
  blocksToYaml(blockList: Block[]): Steps {
    const yaml: Steps = { steps: [] };
    for (const block of blockList) {
      switch (block.type) {
        case BlockType.Say:
          yaml.steps.push({
            say: (block as SayBlock).say,
          });
          break;
        case BlockType.WaitDate:
        case BlockType.WaitText:
          const waitBlock = block as WaitInputBlock;
          const waitYamlBlock: ChatWaitVar = {
            wait: {
              variable: waitBlock.variable,
            },
          };
          if (waitBlock.validation) {
            waitYamlBlock.wait.validation = waitBlock.validation;
          }
          if (waitBlock.placeholder) {
            waitYamlBlock.wait.placeholder = waitBlock.placeholder;
          }
          if (waitBlock.validations.length) {
            waitYamlBlock.wait.validations = waitBlock.validations.map(validation => {
              return VALIDATION_LABELS[validation];
            });
          }
          if (waitBlock.type === BlockType.WaitDate) {
            waitYamlBlock.wait.date = true;
          } else if (waitBlock.long) {
            waitYamlBlock.wait.long = waitBlock.long;
          }
          yaml.steps.push(waitYamlBlock);
          break;
        case BlockType.Switch:
          const switchBlock = block as SwitchBlock;
          const cases: SwitchCase[] = [];
          for (const blockCase of switchBlock.cases) {
            const switchCase: SwitchCase = {};
            if (blockCase.isDefault) {
              switchCase.default = blockCase.isDefault;
            } else {
              switchCase.match = blockCase.match;
            }
            switchCase.steps = this.blocksToYaml(blockCase.steps).steps;
            cases.push(switchCase);
          }
          yaml.steps.push({
            switch: {
              arg: switchBlock.arg,
              cases: cases,
            },
          });
          break;
        case BlockType.Goto:
          yaml.steps.push({
            goto: (block as GotoBlock).goto,
          });
          break;
        case BlockType.WaitButton:
          const waitButtonBlock = block as WaitButtonBlock;
          yaml.steps.push({
            wait: {
              variable: waitButtonBlock.variable,
              options: waitButtonBlock.buttons,
            },
          });
          break;
        case BlockType.WaitButtonStep:
          const waitButtonStepBlock = block as WaitButtonStepBlock;
          const options: ButtonStep[] = [];
          for (const button of waitButtonStepBlock.buttons) {
            options.push({
              show: button.show,
              steps: this.blocksToYaml(button.steps).steps,
            });
          }
          yaml.steps.push({
            wait: {
              options: options,
            },
          });
          break;
        case BlockType.Do:
          const doBlock = block as DoBlock;
          const chatDo: ChatDo = {
            do: {
              cmd: doBlock.cmd,
            },
          };
          if (doBlock.variable) {
            chatDo.do.variable = doBlock.variable;
          }
          if (doBlock.params) {
            chatDo.do.params = doBlock.params.split(',');
          }
          yaml.steps.push(chatDo);
          break;
        default: throw new Error('Block type not found');
      }
    }
    return yaml;
  }

  // Converts YAML snippets to app snippets
  yamlToBlocks(yaml: Yaml): Block[] {
    const blockList: Block[] = [];
    for (const snippet of yaml.snippets) {
      const snippetBlock = new SnippetBlock(BlockType.Snippet, null);
      snippetBlock.name = snippet.name;
      snippetBlock.steps = this.yamlStepsToBlockSteps(snippet, snippetBlock);
      blockList.push(snippetBlock);
    }
    return blockList;
  }

  // Converts YAML steps to app block list
  yamlStepsToBlockSteps(yaml: Steps, parent: WithParent): Block[] {
    const blockList: Block[] = [];
    for (const step of yaml.steps) {
      const blockKey: string = Object.keys(step)[0];
      // Find out type of the element and create suitable block
      switch (blockKey) {
        case 'say':
          const sayBlock = new SayBlock(BlockType.Say, parent);
          sayBlock.say = (step as ChatSay).say;
          blockList.push(sayBlock);
          break;
        case 'goto':
          const gotoBlock = new GotoBlock(BlockType.Goto, parent);
          gotoBlock.goto = (step as ChatGoto).goto;
          blockList.push(gotoBlock);
          break;
        case 'do':
          const doBlock = new DoBlock(BlockType.Do, parent);
          const chatDo = step as ChatDo;
          doBlock.cmd = chatDo.do.cmd;
          if (chatDo.do.variable) {
            doBlock.variable = chatDo.do.variable;
          }
          if (chatDo.do.params) {
            doBlock.params = chatDo.do.params.join(',');
          }
          blockList.push(doBlock);
          break;
        case 'switch':
          const switchBlock = new SwitchBlock(BlockType.Switch, parent);
          const chatSwitch = step as ChatSwitch;
          switchBlock.arg = chatSwitch.switch.arg;
          const cases: Case[] = [];
          for (const switchCase of chatSwitch.switch.cases) {
            if (!switchCase.steps) {
              switchCase.steps = [];
            }
            const theCase: Case = {
              parent: switchBlock,
              steps: [],
              isDefault: switchCase.default,
              match: switchCase.match,
            };
            theCase.steps = this.yamlStepsToBlockSteps(switchCase, theCase);
            cases.push(theCase);
          }
          switchBlock.cases = cases;
          blockList.push(switchBlock);
          break;
        case 'wait':
          const chatWait = step as (ChatWaitVar | ChatWaitButtonStep | ChatWaitButton);

          // We also have 3 different elements, which have key "wait".
          // So we need to find out its type by its structure
          const isVar: boolean = chatWait.wait.hasOwnProperty('variable');
          const isButton: boolean = chatWait.wait.hasOwnProperty('options');
          if (isVar && isButton) {
            // Wait button
            const waitButtonBlock = new WaitButtonBlock(BlockType.WaitButton, parent);
            const chatWaitButton = chatWait as ChatWaitButton;
            waitButtonBlock.variable = chatWaitButton.wait.variable;
            waitButtonBlock.buttons = chatWaitButton.wait.options;
            blockList.push(waitButtonBlock);
          } else if (isVar && !isButton) {
            // Wait input
            const chatWaitVar = chatWait as ChatWaitVar;
            const blockType: BlockType = chatWaitVar.wait.date ?
              BlockType.WaitDate :
              BlockType.WaitText;
            const waitInputBlock = new WaitInputBlock(blockType, parent);
            waitInputBlock.variable = chatWaitVar.wait.variable;
            if (!chatWaitVar.wait.date) {
              // Wait text only
              waitInputBlock.long = chatWaitVar.wait.long;
            }
            waitInputBlock.placeholder = chatWaitVar.wait.placeholder;
            waitInputBlock.validation = chatWaitVar.wait.validation;
            if (chatWaitVar.wait.validations) {
              waitInputBlock.validations = chatWaitVar.wait.validations.map(label => {
                return VALIDATION_LABELS.indexOf(label);
              });
            }
            blockList.push(waitInputBlock);
          } else if (!isVar && isButton) {
            // Wait step
            const waitButtonStepBlock = new WaitButtonStepBlock(BlockType.WaitButtonStep, parent);
            const chatWaitButtonStep = chatWait as ChatWaitButtonStep;
            const waitStepButtons: WaitStepButton[] = [];
            for (const option of chatWaitButtonStep.wait.options) {
                const button: WaitStepButton = {
                  parent: waitButtonStepBlock,
                  show: option.show,
                  steps: [],
                };
                button.steps = (option.steps && option.steps.length) ?
                  this.yamlStepsToBlockSteps(option, button) : [];
                waitStepButtons.push(button);
            }
            waitButtonStepBlock.buttons = waitStepButtons;
            blockList.push(waitButtonStepBlock);
          } else {
            throw new Error('Invalid wait');
          }
          break;
        default: throw new Error('Block key not found');
      }
    }
    return blockList;
  }

  // Converts YAML infocards to app blocks
  getInfocards(yaml: Yaml): Block[] {
    const blockList: Block[] = [];
    if (yaml.infocards) {
      for (const infocard of yaml.infocards) {
        const infocardBlock = new InfocardBlock(BlockType.Infocard, null);
        infocardBlock.title = infocard.title;
        infocardBlock.content = infocard.content;
        infocardBlock.slug = infocard.slug;
        blockList.push(infocardBlock);
      }
    }
    return blockList;
  }

  // Converts YAML organizations to app blocks
  getOrganization(yaml: Yaml): Block[] {
    const blockList: Block[] = [];
    if (yaml.organizations) {
      for (const organization of yaml.organizations) {
        const organizationBlock = new OrganizationBlock(BlockType.Organization, null);
        organizationBlock.contactPerson1 = organization.contactPerson1;
        organizationBlock.contactPerson2 = organization.contactPerson2;
        organizationBlock.description = organization.description;
        organizationBlock.email1 = organization.email1;
        organizationBlock.email2 = organization.email2;
        organizationBlock.fax = organization.fax;
        organizationBlock.mailAddress = organization.mailAddress;
        organizationBlock.organizationName = organization.organizationName;
        organizationBlock.organizationType = organization.organizationType;
        organizationBlock.phoneNumber1 = organization.phoneNumber1;
        organizationBlock.phoneNumber2 = organization.phoneNumber2;
        organizationBlock.phoneResponseDetails = organization.phoneResponseDetails;
        organizationBlock.receptionDetails = organization.receptionDetails;
        organizationBlock.slug = organization.slug;
        organizationBlock.websiteLabel1 = organization.websiteLabel1;
        organizationBlock.websiteLabel2 = organization.websiteLabel2;
        organizationBlock.websiteUrl1 = organization.websiteUrl1;
        organizationBlock.websiteUrl2 = organization.websiteUrl2;
        organizationBlock.scenarios = organization.scenarios;
        blockList.push(organizationBlock);
      }
    }
    return blockList;
  }

  // Converts YAML task templates to app blocks
  getTaskTemplates(yaml: Yaml): Block[] {
    const blockList: Block[] = [];
    if (yaml.taskTemplates) {
      for (const taskTemplate of yaml.taskTemplates) {
        const taskTemplateBlock = new TaskTemplateBlock(BlockType.TaskTemplate, null);
        taskTemplateBlock.title = taskTemplate.title;
        taskTemplateBlock.description = taskTemplate.description;
        taskTemplateBlock.infocardSlugs = taskTemplate.infocardSlugs;
        taskTemplateBlock.slug = taskTemplate.slug;
        blockList.push(taskTemplateBlock);
      }
    }
    return blockList;
  }

  // Converts block infocards to yaml infocards
  getYamlInfocards(blockList: Block[]): ChatInfocard[] {
    const chatInfocards: ChatInfocard[] = [];
    for (const block of blockList) {
      const infocardBlock = block as InfocardBlock;
      const chatInfocard: ChatInfocard = {
        title: infocardBlock.title,
        content: infocardBlock.content,
        slug: infocardBlock.slug,
      };
      chatInfocards.push(chatInfocard);
    }
    return chatInfocards;
  }

  // Converts block task templates to yaml task templates
  getYamlTaskTemplates(blockList: Block[]): ChatTaskTemplate[] {
    const chatTaskTemplates: ChatTaskTemplate[] = [];
    for (const block of blockList) {
      const taskTemplateBlock = block as TaskTemplateBlock;
      const chatTaskTemplate: ChatTaskTemplate = {
        title: taskTemplateBlock.title,
        description: taskTemplateBlock.description,
        infocardSlugs: taskTemplateBlock.infocardSlugs,
        slug: taskTemplateBlock.slug,
      };
      chatTaskTemplates.push(chatTaskTemplate);
    }
    return chatTaskTemplates;
  }

  // Converts block organizations to yaml organizations
  getYamlOrganizations(blockList: Block[]): ChatOrganization[] {
    const chatOrganizations: ChatOrganization[] = [];
    for (const block of blockList) {
      const organizationBlock = block as OrganizationBlock;
      const chatOrganization: ChatOrganization = {
        contactPerson1: organizationBlock.contactPerson1,
        contactPerson2: organizationBlock.contactPerson2,
        description: organizationBlock.description,
        email1: organizationBlock.email1,
        email2: organizationBlock.email2,
        fax: organizationBlock.fax,
        mailAddress: organizationBlock.mailAddress,
        organizationName: organizationBlock.organizationName,
        organizationType: organizationBlock.organizationType,
        phoneNumber1: organizationBlock.phoneNumber1,
        phoneNumber2: organizationBlock.phoneNumber2,
        phoneResponseDetails: organizationBlock.phoneResponseDetails,
        receptionDetails: organizationBlock.receptionDetails,
        slug: organizationBlock.slug,
        websiteLabel1: organizationBlock.websiteLabel1,
        websiteLabel2: organizationBlock.websiteLabel2,
        websiteUrl1: organizationBlock.websiteUrl1,
        websiteUrl2: organizationBlock.websiteUrl2,
      };
      if (organizationBlock.scenarios && organizationBlock.scenarios.length > 0) {
        chatOrganization.scenarios = organizationBlock.scenarios;
      }
      chatOrganizations.push(chatOrganization);
    }
    return chatOrganizations;
  }
}
