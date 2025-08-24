import React from "react";
import { produce } from "immer";
import type { IChildComponentProps } from "../../interface";
import TextArea from "antd/es/input/TextArea";

interface IObservationPointProps extends IChildComponentProps {
    placeholder?: string;
}

export const ObservationPoint: React.FC<IObservationPointProps> = (
    props: IObservationPointProps,
) => {
    const {
        setState,
        getCorssTableData,
        placeholder,
        value,
        rowIndex,
        columnIndex,
    } = props;
    const corssTableData = getCorssTableData();

    return (
        <label
            className="w-full h-full relative
          before:absolute before:inset-0 
          flex items-center justify-center
     before:border-2 before:border-blue-400
     before:transition-opacity before:duration-300 before:ease-in-out 
     before:pointer-none:
     before:opacity-0
     hover:before:opacity-100
     "
        >
            <TextArea
                placeholder={placeholder}
                className="bg-none! 
                        bg-transparent! border-none! outline-none! text-center relative z-10  focus-within:border-transparent! focus-within:bg-transparent! focus-within:shadow-none!"
                value={String(value || "")}
                autoSize={{ minRows: 1 }}
                onChange={(e) => {
                    const dart = produce(corssTableData, (draft) => {
                        const cell = draft[rowIndex][columnIndex];
                        cell.value = e.target.value;
                    });
                    setState({ data: dart });
                }}
            />
        </label>
    );
};
