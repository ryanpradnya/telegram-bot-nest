import {
  ApplicationType,
  UserActivityType,
} from '../../../delivery/enum/activity.enum';
import { UserActivity } from '../../../delivery/interfaces/general/activity.interface';

export class TelegramActivity<T> implements UserActivity {
  data: T;
  type: UserActivityType;
  application: ApplicationType;
  isInit: boolean;

  constructor(partial: Partial<TelegramActivity<T>>) {
    Object.assign(this, { ...partial, application: ApplicationType.TELEGRAM });
  }
}
