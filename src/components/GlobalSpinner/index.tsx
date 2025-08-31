import { Preloader } from "konsta/react";

const GlobalSpinner = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Preloader className="k-color-brand-red" />
    </div>
  );
};

export default GlobalSpinner;
