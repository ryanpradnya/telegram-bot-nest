import { ApplicationType, UserActivityType } from '../../enum/activity.enum';

export interface UserActivity {
  type: UserActivityType;
  application: ApplicationType;
}
