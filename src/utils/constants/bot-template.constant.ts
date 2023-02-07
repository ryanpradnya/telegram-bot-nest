import {
  HELLO_COMMAND,
  ASK_COMMAND,
  WAIT_COMMAND,
} from './bot-command.constant';

export const WAIT_TEXT = 'Please wait, we will be back';
export const ASK_TEXT = 'Can you explain?';
export const HELLO_TEXT = 'Hello, wellcome to our comunity. Can I help you?';

export const TEMPLATE_COMMANDS = {
  [WAIT_COMMAND]: WAIT_TEXT,
  [ASK_COMMAND]: ASK_TEXT,
  [HELLO_COMMAND]: HELLO_TEXT,
};
