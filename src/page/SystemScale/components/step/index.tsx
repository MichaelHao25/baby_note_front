interface IProps {
  title: string;
  step: number;
}
export const Step = (props: IProps) => {
  const { title, step } = props;
  return (
    <div className={"flex py-5 text-base items-center gap-3"}>
      <span className="bg-[#ffbf02] rounded-full block w-7 h-7 flex items-center justify-center">
        {step}
      </span>
      <h4 className={"font-bold"}>{title}</h4>
    </div>
  );
};
