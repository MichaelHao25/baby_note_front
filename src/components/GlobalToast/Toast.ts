import { BehaviorSubject } from "rxjs";
export interface IToast {
  /**
   * Toast button content
   */
  button?: React.ReactNode;
  /**
   * Toast position (only on wide screens). Can be `left`, `center` or `right`
   *
   * @default 'left'
   */
  position?: "left" | "center" | "right";
  /**
   * Allows to open/close Toast and set its initial state
   *
   * @default false
   */
  opened?: boolean;
  /**
   * Toast title
   */
  children?: React.ReactNode;
  /**
   * Toast duration in ms. Set to `0` to disable auto close
   */
  duration?: number;
}
export const GlobalToastService = new BehaviorSubject<null | IToast>(null);
