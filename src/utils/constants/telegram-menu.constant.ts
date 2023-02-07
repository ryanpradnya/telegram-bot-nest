import { TelegramMenuAction } from 'src/delivery/enum/telegram.enum';
import { CallbackButton } from 'src/delivery/interfaces/telegram/telegram-component.interface';
import {
  BROADCAST_COMMAND,
  BROADCAST_LIST_COMMAND,
  BROADCAST_MENU_COMMAND,
  BROADCAST_PARTIAL_COMMAND,
  MENU_COMMAND,
} from './bot-command.constant';

export const INIT_MENUS = [
  BROADCAST_PARTIAL_COMMAND,
  BROADCAST_MENU_COMMAND,
  BROADCAST_COMMAND,
  MENU_COMMAND,
  BROADCAST_LIST_COMMAND,
  'button',
];

export const TEXT_BUTTON_MENU = {
  label: '📃 Text',
  value: '',
  action: TelegramMenuAction.TEXT,
};

export const CHOICE_BUTTON_MENU = {
  label: '✏ Choice',
  value: '',
  action: TelegramMenuAction.CHOICE,
};

export const INIT_BACK_BUTTON: CallbackButton = {
  label: '⬅ Back',
  value: '',
  action: TelegramMenuAction.BACK,
};
