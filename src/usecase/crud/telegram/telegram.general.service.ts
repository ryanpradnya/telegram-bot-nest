import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
// import { FirebaseService } from 'src/delivery/firebase/firebase.service';
import { Context } from 'telegraf';
import { MessageEntity } from 'telegraf/typings/core/types/typegram';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { TelegramActivity } from '../../../dataprovider/entity/telegram/telegram-activity.entity';
import { TelegramMenu } from '../../../delivery/interfaces/telegram/telegram-menu.interface';
import { timer } from '../../../utils/generator.util';

@Injectable()
export class TelegramGeneralService {
  private logChannel: string;

  constructor(
    // private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
  ) {
    this.logChannel = this.configService.get('TELEGRAM_LOG_CHANNEL');
  }

  async sendLog(ctx: Context, message: string, extra?: ExtraReplyMessage) {
    await ctx.telegram.sendMessage(`@${this.logChannel}`, message, extra);
  }

  async sendErrorsToLog(ctx: Context, session: TelegramActivity<TelegramMenu>) {
    const { errors } = session.data;

    while (errors.length > 0) {
      const chunk = errors.splice(0, 20);
      const message = chunk.reduce((prev, curr) => `${prev}${curr}\n\n`, '');
      await this.sendLog(ctx, message);
      await timer(1000);
    }
  }

  //   async sendDocument(
  //     ctx: Context,
  //     filepath: string,
  //     filename: string,
  //     chatId?: string,
  //   ) {
  //     const cId = chatId ? chatId : ctx.chat.id;
  //     if (await this.firebaseService.checkFile(filepath)) {
  //       await ctx.telegram.sendDocument(cId, {
  //         source: this.firebaseService.getFile(filepath),
  //         filename,
  //       });
  //     } else {
  //       await this.sendLog(ctx, `${filepath} not found`, {
  //         entities: [{ offset: 0, length: filepath.length, type: 'bold' }],
  //       });
  //     }
  //   }

  getMessage(message: string, entities: MessageEntity[]) {
    const command = entities.find((entity) => entity.type === 'bot_command');
    return command ? message.slice(command.length, message.length) : message;
  }

  removeCommand(entities: MessageEntity[]) {
    const command = entities.find((entity) => entity.type === 'bot_command');
    if (command) {
      return entities.reduce((val, curr) => {
        const { offset, type } = curr;
        if (type !== 'bot_command') {
          val.push({
            ...curr,
            offset: offset - command.length,
          });
        }
        return val;
      }, new Array<MessageEntity>());
    } else {
      return entities;
    }
  }
}
