import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import {
  CallbackButton,
  CallbackButtonOption,
} from '../../../delivery/interfaces/telegram/telegram-component.interface';

@Injectable()
export class TelegramComponentService {
  /**
   * Function generateCallbackButton to auto generate telegram callback button with fix row or dinamic row
   * @param values type of CallbackButton
   * @param option type of CallbackButtonOption with default value { row: 1, dinamic: false }
   * @returns InlineKeyboardButton[][]
   */
  generateCallbackButton(
    values: CallbackButton[],
    option: CallbackButtonOption = {},
  ): InlineKeyboardButton[][] {
    const { row = 1, dinamic = false } = option;
    const button: InlineKeyboardButton[][] = [];
    const fixRow = row > 5 ? 5 : row;
    const initLength = 40;
    let maxLength = initLength;

    for (let i = 0; i < values.length; i++) {
      const { label, value } = values[i];
      if (i % fixRow === 0 && !dinamic) {
        button.push([Markup.button.callback(label, value)]);
      } else if (
        (maxLength <= label.length || button.length === 0) &&
        dinamic
      ) {
        button.push([Markup.button.callback(label, value)]);
        maxLength = initLength - label.length;
      } else if (maxLength > label.length && button.length > 0 && dinamic) {
        button[button.length - 1].push(Markup.button.callback(label, value));
        maxLength = maxLength - label.length;
      } else {
        button[Math.floor(i / fixRow)].push(
          Markup.button.callback(label, value),
        );
      }
    }

    return button;
  }
}
