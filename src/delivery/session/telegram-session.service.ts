import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TelegramActivity } from 'src/dataprovider/entity/telegram/telegram-activity.entity';
import { Context } from 'telegraf';
import { SessionOption } from '../interfaces/telegram/telegram-session.interface';

@Injectable()
export class TelegramSessionService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  getSessionKey(ctx: Context): string {
    const { from, chat } = ctx;
    return from && chat ? `${from.id}:${chat.id}` : '';
  }

  async getSession<T>(ctx: Context): Promise<TelegramActivity<T>> {
    const sessionKey = this.getSessionKey(ctx);
    const res = JSON.parse(await this.cacheManager.get(sessionKey));
    return res ? res : {};
  }

  saveSession<T>(
    ctx: Context,
    session: TelegramActivity<T>,
    option: Partial<SessionOption> = {},
  ) {
    const { ttl, sessionKey } = option;
    const key = sessionKey ? sessionKey : this.getSessionKey(ctx);

    return this.cacheManager.set(key, JSON.stringify(session), { ttl });
  }

  clearSession(ctx: Context) {
    const sessionKey = this.getSessionKey(ctx);
    return this.cacheManager.del(sessionKey);
  }
}
