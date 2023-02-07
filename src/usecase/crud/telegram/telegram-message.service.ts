import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { ExtraEdit, TelegramEditService } from './telegram-edit.service';
import { ExtraSend, TelegramSendService } from './telegram-send.service';
import { TelegramGeneralService } from './telegram.general.service';

@Injectable()
export class TelegramMessageService {
  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private readonly tGeneralService: TelegramGeneralService,
    private readonly tSendService: TelegramSendService,
    private readonly tEditService: TelegramEditService,
  ) {}

  async sendAny(chatId: string | number, message: any, extra?: ExtraSend) {
    try {
      return (
        await Promise.all([
          this.tSendService.sendText(chatId, message, extra),
          this.tSendService.sendPhoto(chatId, message, extra),
          this.tSendService.sendDocument(chatId, message, extra),
          this.tSendService.sendVoice(chatId, message, extra),
          this.tSendService.sendAudio(chatId, message, extra),
          this.tSendService.sendVideo(chatId, message, extra),
          this.tSendService.sendLocation(chatId, message, extra),
          this.tSendService.sendAnimation(chatId, message, extra),
          this.tSendService.sendContact(chatId, message, extra),
        ])
      ).find((res) => res);
    } catch (err) {
      const ctx: any = this.bot;
      await this.tGeneralService.sendLog(
        ctx,
        `Function send any error\n${err}`,
      );
    }
  }

  async editAny(
    chatId: string | number,
    messageId: number,
    message: any,
    extra?: ExtraEdit,
  ) {
    try {
      return (
        await Promise.all([
          this.tEditService.editText(chatId, messageId, message, extra),
          this.tEditService.editPhoto(chatId, messageId, message, extra),
          this.tEditService.editDocument(chatId, messageId, message, extra),
          this.tEditService.editAudio(chatId, messageId, message, extra),
          this.tEditService.editVideo(chatId, messageId, message, extra),
          this.tEditService.editAnimation(chatId, messageId, message, extra),
          this.tEditService.editCaption(chatId, messageId, message, extra),
        ])
      ).find((res) => res);
    } catch (err) {
      const ctx: any = this.bot;
      await this.tGeneralService.sendLog(
        ctx,
        `Function edit any error\n${err}`,
      );
    }
  }
}
