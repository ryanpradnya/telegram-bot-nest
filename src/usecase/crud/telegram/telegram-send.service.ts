import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import {
  ForceReply,
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
} from 'telegraf/typings/core/types/typegram';
import { TelegramGeneralService } from './telegram.general.service';

export interface ExtraSend {
  reply_markup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
}

@Injectable()
export class TelegramSendService {
  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private readonly tGeneralService: TelegramGeneralService,
  ) {}

  sendText(chatId: string | number, message: any, extra?: ExtraSend) {
    if (message.text) {
      const text = message.entities
        ? this.tGeneralService.getMessage(message.text, message.entities)
        : message.text;
      const entities = message.entities
        ? this.tGeneralService.removeCommand(message.entities)
        : [];
      return this.bot.telegram.sendMessage(chatId, text, {
        ...extra,
        entities,
      });
    }
  }

  sendPhoto(chatId: string | number, message: any, extra?: ExtraSend) {
    if (message.photo) {
      const photos: any[] = message.photo;
      return this.bot.telegram.sendPhoto(chatId, photos[0].file_id, {
        caption: message.caption,
        caption_entities: message.caption_entities,
        ...extra,
      });
    }
  }

  sendDocument(chatId: string | number, message: any, extra?: ExtraSend) {
    if (message.document && message.document.mime_type !== 'video/mp4') {
      return this.bot.telegram.sendDocument(chatId, message.document.file_id, {
        caption: message.caption,
        caption_entities: message.caption_entities,
        ...extra,
      });
    }
  }

  sendVoice(chatId: string | number, message: any, extra?: ExtraSend) {
    if (message.voice) {
      return this.bot.telegram.sendVoice(chatId, message.voice.file_id, {
        caption: message.caption,
        caption_entities: message.caption_entities,
        ...extra,
      });
    }
  }

  sendAudio(chatId: string | number, message: any, extra?: ExtraSend) {
    if (message.audio) {
      return this.bot.telegram.sendAudio(chatId, message.audio.file_id, {
        caption: message.caption,
        caption_entities: message.caption_entities,
        ...extra,
      });
    }
  }

  sendVideo(chatId: string | number, message: any, extra?: ExtraSend) {
    if (message.video) {
      return this.bot.telegram.sendVideo(chatId, message.video.file_id, {
        caption: message.caption,
        caption_entities: message.caption_entities,
        ...extra,
      });
    }
  }

  sendLocation(chatId: string | number, message: any, extra?: ExtraSend) {
    if (message.location) {
      const latitude = message.location.latitude;
      const longitude = message.location.longitude;
      return this.bot.telegram.sendLocation(chatId, latitude, longitude, extra);
    }
  }

  sendAnimation(chatId: string | number, message: any, extra?: ExtraSend) {
    if (message.animation) {
      return this.bot.telegram.sendAnimation(
        chatId,
        message.animation.file_id,
        {
          caption: message.caption,
          caption_entities: message.caption_entities,
          ...extra,
        },
      );
    }
  }

  sendContact(chatId: string | number, message: any, extra?: ExtraSend) {
    if (message.contact) {
      return this.bot.telegram.sendContact(
        chatId,
        message.contact.phone_number,
        message.contact.first_name,
        {
          vcard: message.contact.vcard,
          ...extra,
        },
      );
    }
  }
}
