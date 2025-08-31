import { BehaviorSubject } from "rxjs";
export interface INotification {
  /**
   * Allows to open/close Toast and set its initial state
   *
   * @default false
   */
  opened?: boolean;
  /**
   * Toast title
   */
  icon?: React.ReactNode;
  title?: React.ReactNode;
  titleRightText?: React.ReactNode;
  subtitle?: React.ReactNode;
  text?: React.ReactNode;
  duration?: number;
}
export const GlobalNotificationService =
  new BehaviorSubject<null | INotification>(null);
