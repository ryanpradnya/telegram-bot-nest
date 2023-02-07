import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { configService } from '../../config/config.service';
import { TelegramActivity } from '../../dataprovider/entity/telegram/telegram-activity.entity';
import { UserActivityType } from '../../delivery/enum/activity.enum';
import {
  CustomCtx,
  TelegramMenu,
} from '../../delivery/interfaces/telegram/telegram-menu.interface';
import { TelegramSessionService } from '../../delivery/session/telegram-session.service';
import { TelegramMenuService } from '../../usecase/crud/telegram/telegram-menu.service';
import { INIT_MENUS } from '../../utils/constants/telegram-menu.constant';
import { isCommand } from '../../utils/telegram.util';
import { ConfigModule } from './config.module';
import { GeneralModule } from './general.module';

@Module({
  imports: [ConfigModule, GeneralModule],
  providers: [TelegramSessionService],
})
export class TelegramCustomModule implements OnModuleInit {
  static sessionService: TelegramSessionService;

  constructor(private readonly tSessionService: TelegramSessionService) {}

  onModuleInit() {
    TelegramCustomModule.sessionService = this.tSessionService;
  }

  static init(): DynamicModule {
    return {
      module: TelegramCustomModule,
      imports: [
        TelegrafModule.forRoot({
          token: configService.get('TELEGRAM_TOKEN'),
          middlewares: [
            TelegramCustomModule.session(),
            TelegramCustomModule.callback(),
          ],
        }),
      ],
      exports: [TelegrafModule, TelegramSessionService],
    };
  }

  static session() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (ctx: Context, next: Function) => {
      const sessionKey = this.sessionService.getSessionKey(ctx);
      if (!sessionKey) {
        return next();
      }

      return this.sessionService
        .getSession<any>(ctx)
        .then((session) => {
          Object.defineProperty(ctx, 'session', {
            get() {
              return session;
            },
            set(newValue) {
              session = Object.assign({}, newValue);
            },
          });

          if (isCommand(ctx, INIT_MENUS)) {
            session = new TelegramActivity<TelegramMenu>({
              type: UserActivityType.MENU,
              isInit: true,
            });
          }

          return next().then(
            this.sessionService.saveSession<any>(ctx, session),
          );
        })
        .catch((err) => {
          throw new Error(err);
        });
    };
  }

  static callback() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (ctx: CustomCtx<any>, next: Function) => {
      const cb: any = ctx.callbackQuery;

      if (cb && cb.data) {
        try {
          ctx.state.callbackData = TelegramMenuService.remapShortToFull(
            JSON.parse(cb.data),
          );
        } catch (error) {
          ctx.state.callbackDataError = {
            message: 'Cannot parse passed data: ' + cb.data,
            error,
          };
        }
      }

      return next();
    };
  }
}
