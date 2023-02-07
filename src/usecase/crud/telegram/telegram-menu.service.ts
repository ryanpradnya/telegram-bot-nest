import { Injectable } from '@nestjs/common';
import { from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Context, Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'typegram';
import { TelegramActivity } from '../../../dataprovider/entity/telegram/telegram-activity.entity';
import { UserActivityType } from '../../../delivery/enum/activity.enum';
import { TelegramMenuAction } from '../../../delivery/enum/telegram.enum';
import { CallbackButton } from '../../../delivery/interfaces/telegram/telegram-component.interface';
import {
  CustomCtx,
  InitMenuOpiton,
  MenuConfig,
  MenuOption,
  MenuOptionShort,
  TelegramMenu,
} from '../../../delivery/interfaces/telegram/telegram-menu.interface';
import { TelegramSessionService } from '../../../delivery/session/telegram-session.service';
import { ButtonComponent } from '../../../delivery/telegram/components/button.component';
import { FORMATTING_LABEL } from '../../../utils/constants/bot-formating.constant';
import {
  CHOICE_BUTTON_MENU,
  INIT_BACK_BUTTON,
  TEXT_BUTTON_MENU,
} from '../../../utils/constants/telegram-menu.constant';
import {
  getChatId,
  getMessageFromReply,
  getOnlyMessageFromReply,
  getReplayMessageEntities,
  removeCommand,
} from '../../../utils/telegram.util';
import { DefaultService } from '../../default/default.usecase.service';
import { TelegramMessageService } from './telegram-message.service';

@Injectable()
export class TelegramMenuService {
  messageId: number;
  callbackData: MenuOption;
  ctx: CustomCtx<TelegramMenu>;
  session: TelegramActivity<TelegramMenu>;

  private checkCount: number;
  private keyboarSize: number;
  private tActions: string[] = [
    TelegramMenuAction.CHECK,
    TelegramMenuAction.UNCHECK,
    TelegramMenuAction.CHOOSE,
    TelegramMenuAction.NO_ACTION,
  ];

  constructor(
    private readonly sessionService: TelegramSessionService,
    private readonly defaultService: DefaultService,
    private readonly tMessageService: TelegramMessageService,
  ) {}

  private get ctxSession() {
    return this.ctx.session;
  }

  private get data() {
    return this.session.data;
  }

  private get activeButtons() {
    return this.data.activeButtons;
  }

  private get activeValues() {
    return this.data.activeValues;
  }

  private get cbValue() {
    return this.callbackData.value;
  }

  private get cbAction() {
    return this.callbackData.action;
  }

  private get config() {
    return this.data.config;
  }

  private get currentPage() {
    return this.data.currentPage;
  }

  static remapShortToFull(option: MenuOptionShort): MenuOption {
    const { a, v, d } = option;
    const newOption: MenuOption = {
      action: a,
      value: v,
    };

    return d === undefined || d === null
      ? newOption
      : { ...newOption, isDefault: !!d };
  }

  static remapFullToShort(option: MenuOption): MenuOptionShort {
    const { action, value, isDefault } = option;
    const newOption: MenuOptionShort = {
      a: action,
      v: value,
    };

    return isDefault === undefined || isDefault === null
      ? newOption
      : { ...newOption, d: Number(isDefault) as 1 | 0 };
  }

  async initMenu(
    ctx: CustomCtx<TelegramMenu>,
    option: InitMenuOpiton,
  ): Promise<void> {
    const { menuConfig, callbackData, additional = {} } = option;

    /*
            To avoid not menu activity to run this block code
        */
    if (ctx.session?.type === UserActivityType.MENU) {
      this.ctx = ctx;
      this.callbackData = callbackData;

      await this.createActivity(menuConfig, additional);
      await this.sendMenu();
    }
  }

  async sendToChat(
    chatId: string,
    ctx: Context,
    option: InitMenuOpiton,
  ): Promise<void> {
    const { menuConfig, callbackData, additional = {} } = option;
    const session = new TelegramActivity<TelegramMenu>({
      type: UserActivityType.MENU,
      isInit: true,
    });
    const newCtx: any = ctx;
    this.ctx = newCtx;
    this.ctx.session = session;
    this.callbackData = callbackData;

    await this.createActivity(menuConfig, additional);
    await this.sendMenuToChat(chatId);
  }

  /*
        Get from context session if not init
        Create new session if not init
    */
  private async createActivity(
    config: MenuConfig,
    additional: Record<string, any>,
  ) {
    const { data, isInit } = this.ctxSession;
    const fixConfig = isInit ? config : data.config;

    this.session = !isInit
      ? this.ctxSession
      : new TelegramActivity<TelegramMenu>({
          type: UserActivityType.MENU,
          data: {
            activeButtons: [],
            activeValues: data && data.activeValues ? data.activeValues : [],
            pages: await this.createPages(fixConfig),
            config: this.getConfig(fixConfig),
            currentPage: 0,
            checkCounts: this.generateCheckCounts(fixConfig),
            errors: [],
            additional,
          },
        });

    /*
            To avoid code for first time generate menu
        */
    if (
      this.callbackData &&
      (this.tActions.includes(this.cbAction) ||
        this.cbAction.includes(TelegramMenuAction.ALL_PAGE))
    ) {
      /*
                Get number of active check box button
                for make uncheck all button if all button have been checked
                and avoid error message is not modified
            */
      this.checkCount = this.data.checkCounts[this.currentPage];

      /*
                Get button based on current page and transformed button
            */
      this.session.data.pages[this.currentPage] = this.data.pages[
        this.currentPage
      ].map((button) => (!button.value ? button : this.getNewButton(button)));
    }
  }

  /*
        Use config text in message if availabale
    */
  private getConfig(config: MenuConfig): MenuConfig {
    const message = getMessageFromReply(this.ctx);
    const text = getOnlyMessageFromReply(this.ctx);

    const newMessage = message.text
      ? {
          ...message,
          text: text ? text : '(Empty Text)',
          entities: removeCommand(getReplayMessageEntities(this.ctx)),
        }
      : message;

    const configMessage = message.text
      ? { ...message, text: config.text, entities: [] }
      : { ...message, caption: config.text, caption_entities: [] };

    return {
      ...config,
      message: !config.text ? newMessage : configMessage,
    };
  }

  /*
        Generate array with length based on pagination and all value = 0
        except the last value using the rest length of button
        to equality the max value in array
    */
  private generateCheckCounts(config: MenuConfig): number[] {
    const { menu, pageSize } = config;
    const menuLength = menu.filter((val) => !val.main).length;
    this.keyboarSize = pageSize ? pageSize : menuLength;

    if (!pageSize) return [0];

    const length = Math.ceil(menuLength / pageSize);
    const div = menuLength % pageSize;
    return Array.from({ length: length + 1 }, (_, i) =>
      i === length && div !== 0 ? pageSize - (menuLength % pageSize) : 0,
    );
  }

  private async transformButton(
    pages: CallbackButton[][],
    config: MenuConfig,
  ): Promise<CallbackButton[][]> {
    return from(pages)
      .pipe(
        mergeMap((page) =>
          of(
            page.map((button) =>
              !button.value
                ? button
                : {
                    ...button,
                    action: config.action,
                  },
            ),
          ),
        ),
        this.defaultService.join$<CallbackButton[]>(),
      )
      .toPromise();
  }

  /*
        Create transformed button and pagination
    */
  private async createPages(config: MenuConfig): Promise<CallbackButton[][]> {
    const { menu, pageSize, allButton, action } = config;
    const pages: CallbackButton[][] = config.choiceButton
      ? [[CHOICE_BUTTON_MENU]]
      : [[]];
    let num = 1;

    if (pageSize) {
      const maxSize =
        allButton && action === TelegramMenuAction.CHECK
          ? pageSize + 2
          : pageSize + 1;
      let index = 1;

      for (const button of menu) {
        const { main, page } = button;

        if (main) {
          pages[0].push(button);
        } else if (page) {
          pages[page].push(button);
        } else if (!pages[index]) {
          pages[index] = this.getFirstButtton(
            config,
            { ...button, number: num },
            index,
          );
          pages[0].push({
            label: `Pilihan ${1 + pageSize * (index - 1)} - ${
              pageSize * index
            }`,
            value: '',
            action: `${TelegramMenuAction.GO_PAGE}${index}`,
          });
          if (pages[index].length === maxSize) index++;
          num++;
        } else if (pages[index] && pages[index].length < maxSize) {
          pages[index].push({ ...button, number: num });
          if (pages[index].length === maxSize) index++;
          num++;
        }
      }
    } else {
      if (allButton && action === TelegramMenuAction.CHECK)
        pages[0].push({
          label: '✔ All',
          value: '',
          action: `${TelegramMenuAction.ALL_PAGE}0`,
        });

      for (const button of menu) {
        const newButton = button.main ? button : { ...button, number: num };
        pages[0].push(newButton);
        num++;
      }
    }

    return await this.transformButton(pages, config);
  }

  /*
        Add All and Back button for initiation in generate pagination
    */
  private getFirstButtton(
    config: MenuConfig,
    button: CallbackButton,
    index: number,
  ): CallbackButton[] {
    const { allButton, action } = config;
    const firstButtton = [INIT_BACK_BUTTON, button];

    return allButton && action === TelegramMenuAction.CHECK
      ? [
          {
            label: '✔ All',
            value: '',
            action: `${TelegramMenuAction.ALL_PAGE}${index}`,
          },
          ...firstButtton,
        ]
      : firstButtton;
  }

  /*
        Rule to change button action and
        manipulate menu active values and active button
    */
  private getNewButton(button: CallbackButton): CallbackButton {
    switch (button.action) {
      case TelegramMenuAction.CHECK:
        return this.checkButtonAction(button);
      case TelegramMenuAction.UNCHECK:
        return this.uncheckButtonAction(button);
      case TelegramMenuAction.CHOOSE:
        return this.chooseButtonAction(button);
      case TelegramMenuAction.NO_ACTION:
        return {
          ...button,
          label: this.removeFormat(button.label, FORMATTING_LABEL.radio),
          action: TelegramMenuAction.CHOOSE,
        };
      default:
        return { ...button, action: this.config.action };
    }
  }

  /*
        ALLPAGE action will make all button value change to uncheck
    */
  private checkButtonAction(button: CallbackButton): CallbackButton {
    if (
      (this.callbackData && button.value === this.cbValue) ||
      this.callbackData.action.includes(TelegramMenuAction.ALL_PAGE)
    ) {
      this.data.checkCounts[this.currentPage] =
        this.data.checkCounts[this.currentPage] + 1;
      this.session.data.activeButtons.push(button.label);
      this.session.data.activeValues.push(button.value);

      return {
        ...button,
        label: `${button.label} ${FORMATTING_LABEL.checkbox}`,
        action: TelegramMenuAction.UNCHECK,
      };
    } else {
      return button;
    }
  }

  /*
        ALLPAGE action will make all button value change to check
        if check count exceed
    */
  private uncheckButtonAction(button: CallbackButton): CallbackButton {
    if (
      (this.callbackData && button.value === this.cbValue) ||
      (this.callbackData.action.includes(TelegramMenuAction.ALL_PAGE) &&
        this.checkCount === this.keyboarSize)
    ) {
      this.data.checkCounts[this.currentPage] =
        this.data.checkCounts[this.currentPage] - 1;
      this.session.data.activeButtons = this.activeButtons.filter(
        (val) => !button.label.includes(val),
      );
      this.session.data.activeValues = this.activeValues.filter(
        (val) => !button.value.includes(val),
      );

      return {
        ...button,
        label: this.removeFormat(button.label, FORMATTING_LABEL.checkbox),
        action: TelegramMenuAction.CHECK,
      };
    } else {
      return button;
    }
  }

  private chooseButtonAction(button: CallbackButton): CallbackButton {
    if (this.callbackData && button.value === this.cbValue) {
      this.session.data.activeButtons = [button.label];
      this.session.data.activeValues = [button.value];

      return {
        ...button,
        label: `${button.label} ${FORMATTING_LABEL.radio}`,
        action: TelegramMenuAction.NO_ACTION,
      };
    } else {
      return button;
    }
  }

  private removeFormat(label: string, formating: string): string {
    return label.replace(` ${formating}`, '');
  }

  /*
        To get page based on menu action BACK or GOPAGE
    */
  private getPage(): CallbackButton[] {
    const { pages } = this.data;

    if (this.callbackData?.action === TelegramMenuAction.BACK) {
      this.session.data.currentPage = 0;
    } else if (this.callbackData?.action.includes(TelegramMenuAction.GO_PAGE)) {
      this.session.data.currentPage = Number(
        this.cbAction.replace(TelegramMenuAction.GO_PAGE, ''),
      );
    } else if (this.callbackData?.action === TelegramMenuAction.CHOICE) {
      this.data.pages[0][0] = TEXT_BUTTON_MENU;
    } else if (this.callbackData?.action === TelegramMenuAction.TEXT) {
      this.data.pages[0][0] = CHOICE_BUTTON_MENU;
    }

    return pages[this.currentPage];
  }

  /*
        Get keyboard with transformed button based on page
    */
  private getKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
    const { dinamic, numbering, row } = this.config;
    const page = this.getPage();
    const buttons = ButtonComponent.CallbackButtons(page, {
      dinamic,
      numbering,
      row,
    });

    return Markup.inlineKeyboard(buttons);
  }

  /*
        Show message text/caption or show choosen or active button
    */
  private getMessage(): any {
    const { message } = this.config;
    const choice = `Pilihan:\n${this.activeButtons}`;

    if (!this.config.choiceButton) return message;

    if (this.data.pages[0][0].action === TelegramMenuAction.CHOICE) {
      return message;
    } else {
      return message.text
        ? { ...message, text: choice, entities: [] }
        : { ...message, caption: choice, caption_entities: [] };
    }
  }

  /*
        Send new message and save sent message Id for first time message
        Use edit message instead of sending messages over and over
        after manipulate message and button
        Using send any and edit any in this function
    */
  private async sendMenu() {
    /*
            Need execute get keyboard first to handle text button
            and choice button
        */
    const keyboard = this.getKeyboard();

    if (this.callbackData) {
      await this.tMessageService.editAny(
        this.ctx.chat.id,
        this.data.messageId,
        this.getMessage(),
        keyboard,
      );
    } else {
      const sentMessage = await this.tMessageService.sendAny(
        getChatId(this.ctx),
        this.getMessage(),
        keyboard,
      );
      this.session.data.messageId = sentMessage.message_id;
    }

    await this.sessionService.saveSession<TelegramMenu>(this.ctx, this.session);
  }

  private async sendMenuToChat(chatId: string) {
    /*
            Need execute get keyboard first to handle text button
            and choice button
        */
    const keyboard = this.getKeyboard();
    const sentMessage = await this.tMessageService.sendAny(
      chatId,
      this.getMessage(),
      keyboard,
    );
    this.session.data.messageId = sentMessage.message_id;

    await this.sessionService.saveSession<TelegramMenu>(
      this.ctx,
      this.session,
      { sessionKey: `${chatId}:${chatId}` },
    );
  }
}
