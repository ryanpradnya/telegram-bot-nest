import { TelegramMenuAction } from 'src/delivery/enum/telegram.enum';
import { generateAction } from '../telegram.util';
import {
  ADMIN_ACTION,
  BROADCAST_GAME_MAINTENANCE_SEND,
  BROADCAST_LIST_ACTION,
  BROADCAST_MAINTENANCE_COMPLETE,
  BROADCAST_MENU_SEND,
  BROADCAST_PARTIAL_SEND,
  BROADCAST_SEND,
  BROADCAST_URGENT_MAINTENANCE,
  COMMAND_LIST_ACTION,
  GENERAL_MESSAGE_CLOSE,
  GROUP_ACTION,
  MAIN_MENU,
} from './action.constant';

// Menu
export const MENU_ACTION_REGEX = generateAction([
  TelegramMenuAction.CHECK,
  TelegramMenuAction.UNCHECK,
  TelegramMenuAction.CHOOSE,
  TelegramMenuAction.BACK,
  TelegramMenuAction.CHOICE,
  TelegramMenuAction.TEXT,
  `${TelegramMenuAction.GO_PAGE}[1-9]+`,
  `${TelegramMenuAction.ALL_PAGE}[0-9]+`,
]);
export const NO_ACTION_REGEX = generateAction([TelegramMenuAction.NO_ACTION]);

// Broadcast
export const BROADCAST_SEND_REGEX = generateAction([BROADCAST_SEND]);
export const BROADCAST_GAME_MAINTENANCE_SEND_REGEX = generateAction([
  BROADCAST_GAME_MAINTENANCE_SEND,
]);
export const BROADCAST_URGENT_MAINTENANCE_REGEX = generateAction([
  BROADCAST_URGENT_MAINTENANCE,
]);
export const BROADCAST_MAINTENANCE_COMPLETE_REGEX = generateAction([
  BROADCAST_MAINTENANCE_COMPLETE,
]);
export const BROADCAST_MENU_SEND_REGEX = generateAction([BROADCAST_MENU_SEND]);
export const BROADCAST_PARTIAL_SEND_REGEX = generateAction([
  BROADCAST_PARTIAL_SEND,
]);

// General
export const GENERAL_MESSAGE_CLOSE_REGEX = generateAction([
  GENERAL_MESSAGE_CLOSE,
]);

// Restrict
export const MAIN_MENU_REGEX = generateAction([MAIN_MENU]);
export const GROUP_ACTION_REGEX = generateAction([GROUP_ACTION]);
export const ADMIN_ACTION_REGEX = generateAction([ADMIN_ACTION]);
export const COMMAND_LIST_ACTION_REGEX = generateAction([COMMAND_LIST_ACTION]);
export const BROADCAST_LIST_ACTION_REGEX = generateAction([
  BROADCAST_LIST_ACTION,
]);
