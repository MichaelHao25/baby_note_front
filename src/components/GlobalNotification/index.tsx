import { Notification } from "konsta/react";
import { useEffect, useRef, useState } from "react";
import { GlobalNotificationService, type INotification } from "./Notification";

export const GlobalNotification = () => {
  const [state, setState] = useState<null | INotification>(null);

  const timerId = useRef<number>(0);
  useEffect(() => {
    const subscription = GlobalNotificationService.subscribe((value) => {
      console.log(value);

      if (value === null) {
        setState((prev) => ({ ...prev, opened: false }));
      } else {
        const duration = value?.duration ?? 3000;
        clearTimeout(timerId.current);
        timerId.current = setTimeout(() => {
          setState((prev) => ({ ...prev, opened: false }));
        }, duration);
        setState(value);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log(state);

  //   if (state) {
  // }
  // return <></>;
  return <Notification {...state} />;
};
