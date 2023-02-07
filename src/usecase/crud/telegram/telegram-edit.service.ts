import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { TelegramGeneralService } from './telegram.general.service';

export interface ExtraEdit {
  reply_markup?: InlineKeyboardMarkup;
}

@Injectable()
export class TelegramEditService {
  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private readonly tGeneralService: TelegramGeneralService,
  ) {}

  editText(
    chatId: string | number,
    messageId: number,
    message: any,
    extra?: ExtraEdit,
  ) {
    if (message.text) {
      const text = message.entities
        ? this.tGeneralService.getMessage(message.text, message.entities)
        : message.text;
      const entities = message.entities
        ? this.tGeneralService.removeCommand(message.entities)
        : [];
      return this.bot.telegram.editMessageText(chatId, messageId, null, text, {
        ...extra,
        entities,
      });
    }
  }

  editPhoto(
    chatId: string | number,
    messageId: number,
    message: any,
    extra?: ExtraEdit,
  ) {
    if (message.photo) {
      const photos: any[] = message.photo;
      return this.bot.telegram.editMessageMedia(
        chatId,
        messageId,
        null,
        {
          type: 'photo',
          media: photos[0].file_id,
          caption: message.caption,
          caption_entities: message.caption_entities,
        },
        { ...extra },
      );
    }
  }

  editDocument(
    chatId: string | number,
    messageId: number,
    message: any,
    extra?: ExtraEdit,
  ) {
    if (message.document && message.document.mime_type !== 'video/mp4') {
      return this.bot.telegram.editMessageMedia(
        chatId,
        messageId,
        null,
        {
          type: 'document',
          media: message.document.file_id,
          caption: message.caption,
          caption_entities: message.caption_entities,
        },
        { ...extra },
      );
    }
  }

  editAudio(
    chatId: string | number,
    messageId: number,
    message: any,
    extra?: ExtraEdit,
  ) {
    if (message.audio) {
      return this.bot.telegram.editMessageMedia(
        chatId,
        messageId,
        null,
        {
          type: 'audio',
          media: message.audio.file_id,
          caption: message.caption,
          caption_entities: message.caption_entities,
        },
        { ...extra },
      );
    }
  }

  editVideo(
    chatId: string | number,
    messageId: number,
    message: any,
    extra?: ExtraEdit,
  ) {
    if (message.video) {
      return this.bot.telegram.editMessageMedia(
        chatId,
        messageId,
        null,
        {
          type: 'video',
          media: message.video.file_id,
          caption: message.caption,
          caption_entities: message.caption_entities,
        },
        { ...extra },
      );
    }
  }

  editAnimation(
    chatId: string | number,
    messageId: number,
    message: any,
    extra?: ExtraEdit,
  ) {
    if (message.animation) {
      return this.bot.telegram.editMessageMedia(
        chatId,
        messageId,
        null,
        {
          type: 'animation',
          media: message.animation.file_id,
          caption: message.caption,
          caption_entities: message.caption_entities,
        },
        { ...extra },
      );
    }
  }

  editCaption(
    chatId: string | number,
    messageId: number,
    message: any,
    extra?: ExtraEdit,
  ) {
    if (message.voice || message.location || message.contact) {
      return this.bot.telegram.editMessageCaption(
        chatId,
        messageId,
        null,
        message.caption,
        { ...extra },
      );
    }
  }
}
