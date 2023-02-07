import { Context } from 'telegraf';
import { TelegramActivity } from '../../../dataprovider/entity/telegram/telegram-activity.entity';
import { TelegramMenuAction } from '../../enum/telegram.enum';
import { CallbackButton } from './telegram-component.interface';

export type TState = Record<string, string>;

export interface MenuOption {
  action: string;
  value: string;
  isDefault?: boolean;
}

/**
 * Short types for callback data
 */
export interface MenuOptionShort {
  a: string;
  v: string;
  d?: 1 | 0;
}

export interface TelegramMenu {
  activeButtons: string[];
  activeValues: string[];
  pages: CallbackButton[][];
  currentPage: number;
  messageId?: number;
  checkCounts?: number[];
  config: MenuConfig;
  errors: string[];
  additional: Record<string, any>;
}

export interface MenuConfig {
  action: TelegramMenuAction;
  message?: any;
  text?: string;
  menu: CallbackButton[];
  numbering?: boolean;
  dinamic?: boolean;
  allButton?: boolean;
  choiceButton?: boolean;
  pageSize?: number;
  row?: number;
  // data?: Record<string, any>
}

export interface InitMenuOpiton {
  menuConfig?: MenuConfig;
  callbackData?: MenuOption;
  additional?: Record<string, any>;
}

export type CustomCtx<T> = Context & { session: TelegramActivity<T> };
