import React from "react";
import { produce } from "immer";
import type { IChildComponentProps } from "../../interface";

interface ISelectEvaluationStandardAndInputProps extends IChildComponentProps {
    placeholder?: string;
}

export const SelectEvaluationStandardAndInput = (
    props: ISelectEvaluationStandardAndInputProps,
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
        <div
            className="w-full h-full relative
          before:absolute before:inset-0 
     before:border-2 before:border-blue-400
     before:transition-opacity before:duration-300 before:ease-in-out 
     before:pointer-none:
     before:opacity-0
     hover:before:opacity-100
     "
        >
            <input
                placeholder={placeholder}
                className="w-full h-full bg-none border-none outline-none text-center relative z-10"
                value={String(value || "")}
                onChange={(e) => {
                    const dart = produce(corssTableData, (draft) => {
                        const cell = draft[rowIndex][columnIndex];
                        cell.value = e.target.value;
                    });
                    setState({ data: dart });
                }}
            />
        </div>
    );
};
