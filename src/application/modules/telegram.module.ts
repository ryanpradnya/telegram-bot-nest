import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { GeneralModule } from './general.module';
import { TelegramActions } from '../../delivery/telegram/actions/_index';
import { TelegramCustomModule } from './telegram-cutom.module';
import { TelegramGeneralService } from '../../usecase/crud/telegram/telegram.general.service';
import { TelegramEditService } from '../../usecase/crud/telegram/telegram-edit.service';
import { TelegramSendService } from '../../usecase/crud/telegram/telegram-send.service';
import { TelegramMessageService } from '../../usecase/crud/telegram/telegram-message.service';
import { TelegramMenuService } from '../../usecase/crud/telegram/telegram-menu.service';

@Module({
  imports: [ConfigModule, GeneralModule, TelegramCustomModule.init()],
  providers: [
    TelegramGeneralService,
    TelegramEditService,
    TelegramSendService,
    TelegramMessageService,
    TelegramMenuService,
    ...TelegramActions,
  ],
  controllers: [],
  exports: [TelegramCustomModule],
})
export class TelegramModule {}
