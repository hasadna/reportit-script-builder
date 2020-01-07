import { Injectable } from '@angular/core';
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
  ChatScenario,
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
];

@Injectable()
export class YamlService {
  description: string = '';
  name: string = '';
  yaml: string;

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
      return this.yamlToBlocks(yaml);
    }
  }

  // Converts app data to YAML string
  toYAML(): void {
    const yamlList: Yaml[] = [{
      description: this.description,
      name: this.name,
      snippets: this.snippetsToYaml(this.blockService.blockList),
    }];
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
        case BlockType.Infocard:
          const infocardBlock = block as InfocardBlock;
          const chatInfocard: ChatInfocard = {
            infocard: {
              title: infocardBlock.title,
              content: infocardBlock.content,
              slug: infocardBlock.slug,
            },
          };
          yaml.steps.push(chatInfocard);
          break;
        case BlockType.TaskTemplate:
          const taskTemplateBlock = block as TaskTemplateBlock;
          const chatTaskTemplate: ChatTaskTemplate = {
            tasktemplate: {
              title: taskTemplateBlock.title,
              description: taskTemplateBlock.description,
              infocard_slugs: taskTemplateBlock.infocardSlugs,
              slug: taskTemplateBlock.slug,
            },
          };
          yaml.steps.push(chatTaskTemplate);
          break;
        case BlockType.Organization:
          const organizationBlock = block as OrganizationBlock;
          const chatOrganization: ChatOrganization = {
            organization: {
              contact_person1: organizationBlock.contactPerson1,
              contact_person2: organizationBlock.contactPerson2,
              description: organizationBlock.description,
              email1: organizationBlock.email1,
              email2: organizationBlock.email2,
              fax: organizationBlock.fax,
              mail_address: organizationBlock.mailAddress,
              organization_name: organizationBlock.organizationName,
              organization_type: organizationBlock.organizationType,
              phone_number1: organizationBlock.phoneNumber1,
              phone_number2: organizationBlock.phoneNumber2,
              phone_response_details: organizationBlock.phoneResponseDetails,
              reception_details: organizationBlock.receptionDetails,
              scenarios_relevancy: organizationBlock.scenariosRelevancy,
              slug: organizationBlock.slug,
              website_label1: organizationBlock.websiteLabel1,
              website_label2: organizationBlock.websiteLabel2,
              website_url1: organizationBlock.websiteUrl1,
              website_url2: organizationBlock.websiteUrl2,
            },
          };
          if (organizationBlock.scenarios) {
            chatOrganization.organization.scenarios = [];
            for (const scenario of organizationBlock.scenarios) {
              const chatScenario: ChatScenario = {};
              if (scenario.offender) {
                chatScenario.offender = scenario.offender;
              }
              if (scenario.complainttype) {
                chatScenario.complainttype = scenario.complainttype;
              }
              if (scenario.eventlocation) {
                chatScenario.eventlocation = scenario.eventlocation;
              }
              chatOrganization.organization.scenarios.push(chatScenario);
            }
          }
          yaml.steps.push(chatOrganization);
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
      const snippetBlock = new SnippetBlock(BlockType.Snippet);
      snippetBlock.name = snippet.name;
      snippetBlock.steps = this.yamlStepsToBlockSteps(snippet);
      blockList.push(snippetBlock);
    }
    return blockList;
  }

  // Converts YAML steps to app block list
  yamlStepsToBlockSteps(yaml: Steps): Block[] {
    const blockList: Block[] = [];
    for (const step of yaml.steps) {
      const blockKey: string = Object.keys(step)[0];
      // Find out type of the element and create suitable block
      switch (blockKey) {
        case 'say':
          const sayBlock = new SayBlock(BlockType.Say);
          sayBlock.say = (step as ChatSay).say;
          blockList.push(sayBlock);
          break;
        case 'goto':
          const gotoBlock = new GotoBlock(BlockType.Goto);
          gotoBlock.goto = (step as ChatGoto).goto;
          blockList.push(gotoBlock);
          break;
        case 'do':
          const doBlock = new DoBlock(BlockType.Do);
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
          const switchBlock = new SwitchBlock(BlockType.Switch);
          const chatSwitch = step as ChatSwitch;
          switchBlock.arg = chatSwitch.switch.arg;
          const cases: Case[] = [];
          for (const switchCase of chatSwitch.switch.cases) {
            if (!switchCase.steps) {
              switchCase.steps = [];
            }
            cases.push({
              steps: this.yamlStepsToBlockSteps(switchCase),
              isDefault: switchCase.default,
              match: switchCase.match,
            });
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
            const waitButtonBlock = new WaitButtonBlock(BlockType.WaitButton);
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
            const waitInputBlock = new WaitInputBlock(blockType);
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
            const waitButtonStepBlock = new WaitButtonStepBlock(BlockType.WaitButtonStep);
            const chatWaitButtonStep = chatWait as ChatWaitButtonStep;
            const waitStepButtons: WaitStepButton[] = [];
            for (const option of chatWaitButtonStep.wait.options) {
              const steps: Block[] = (option.steps && option.steps.length) ?
                this.yamlStepsToBlockSteps(option) : [];
              waitStepButtons.push({
                show: option.show,
                steps: steps,
              });
            }
            waitButtonStepBlock.buttons = waitStepButtons;
            blockList.push(waitButtonStepBlock);
          } else {
            throw new Error('Invalid wait');
          }
          break;
        case 'infocard':
          const infocardBlock = new InfocardBlock(BlockType.Infocard);
          const chatInfocard = step as ChatInfocard;
          infocardBlock.title = chatInfocard.infocard.title;
          infocardBlock.content = chatInfocard.infocard.content;
          infocardBlock.slug = chatInfocard.infocard.slug;
          blockList.push(infocardBlock);
          break;
        case 'tasktemplate':
          const taskTemplateBlock = new TaskTemplateBlock(BlockType.TaskTemplate);
          const chatTaskTemplate = step as ChatTaskTemplate;
          taskTemplateBlock.title = chatTaskTemplate.tasktemplate.title;
          taskTemplateBlock.description = chatTaskTemplate.tasktemplate.description;
          taskTemplateBlock.infocardSlugs = chatTaskTemplate.tasktemplate.infocard_slugs;
          taskTemplateBlock.slug = chatTaskTemplate.tasktemplate.slug;
          blockList.push(taskTemplateBlock);
          break;
        case 'organization':
          const organizationBlock = new OrganizationBlock(BlockType.Organization);
          const chatOrganization = step as ChatOrganization;
          organizationBlock.contactPerson1 = chatOrganization.organization.contact_person1;
          organizationBlock.contactPerson2 = chatOrganization.organization.contact_person2;
          organizationBlock.description = chatOrganization.organization.description;
          organizationBlock.email1 = chatOrganization.organization.email1;
          organizationBlock.email2 = chatOrganization.organization.email2;
          organizationBlock.fax = chatOrganization.organization.fax;
          organizationBlock.mailAddress = chatOrganization.organization.mail_address;
          organizationBlock.organizationName = chatOrganization.organization.organization_name;
          organizationBlock.organizationType = chatOrganization.organization.organization_type;
          organizationBlock.phoneNumber1 = chatOrganization.organization.phone_number1;
          organizationBlock.phoneNumber2 = chatOrganization.organization.phone_number2;
          organizationBlock.phoneResponseDetails = chatOrganization.organization
            .phone_response_details;
          organizationBlock.receptionDetails = chatOrganization.organization.reception_details;
          organizationBlock.scenariosRelevancy = chatOrganization.organization.scenarios_relevancy;
          organizationBlock.slug = chatOrganization.organization.slug;
          organizationBlock.websiteLabel1 = chatOrganization.organization.website_label1;
          organizationBlock.websiteLabel2 = chatOrganization.organization.website_label2;
          organizationBlock.websiteUrl1 = chatOrganization.organization.website_url1;
          organizationBlock.websiteUrl2 = chatOrganization.organization.website_url2;
          organizationBlock.scenarios = chatOrganization.organization.scenarios;
          blockList.push(organizationBlock);
          break;
        default: throw new Error('Block key not found');
      }
    }
    return blockList;
  }
}
