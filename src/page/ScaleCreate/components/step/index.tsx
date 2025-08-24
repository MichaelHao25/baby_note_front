interface IProps {
    title: string;
    step: number;
    after?: React.ReactNode;
}
export const Step = (props: IProps) => {
    const { title, step, after } = props;
    return (
        <div
            className={"flex py-5 text-base items-center gap-3 justify-between"}
        >
            <div className="flex items-center gap-3">
                <span className="bg-[#ffbf02] rounded-full w-7 h-7 flex items-center justify-center">
                    {step}
                </span>
                <h4 className={"font-bold"}>{title}</h4>
            </div>
            {after}
        </div>
    );
};
