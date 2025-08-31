import { Toast } from "konsta/react";
import { useEffect, useRef, useState } from "react";
import { GlobalToastService, type IToast } from "./Toast";

export const GlobalToast = () => {
  const [state, setState] = useState<null | IToast>(null);

  const timerId = useRef<number>(0);
  useEffect(() => {
    const subscription = GlobalToastService.subscribe((value) => {
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

  //   if (state) {
  // }
  // return <></>;
  return <Toast {...state} />;
};
