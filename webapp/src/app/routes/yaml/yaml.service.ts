import { Injectable } from '@angular/core';

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
  Steps,
  Snippet,
  SwitchCase,
  ButtonStep,
} from './yaml.interface';

const VALIDATION_LABELS: string[] = [
  'no-empty-answer',
  'phone-number',
  'email-address',
  'date',
  'hour',
];

@Injectable()
export class YamlService {
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
          }
          yaml.steps.push(waitYamlBlock);
          break;
        case BlockType.Switch:
          const switchBlock = block as SwitchBlock;
          const cases: SwitchCase[] = [];
          for (const blockCase of switchBlock.cases) {
            cases.push({
              steps: this.blocksToYaml(blockCase.steps).steps,
              default: blockCase.isDefault,
              match: blockCase.match,
            });
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
  yamlToBlocks(yaml: Yaml[]): Block[] {
    if (!yaml || yaml.length !== 1) {
      throw new Error('Invalid yaml');
    }
    const blockList: Block[] = [];
    for (const snippet of yaml[0].snippets) {
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
        default: throw new Error('Block key not found');
      }
    }
    return blockList;
  }
}
