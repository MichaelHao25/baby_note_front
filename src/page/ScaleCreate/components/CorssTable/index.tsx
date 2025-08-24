import { useEffect, useRef } from "react";
import { CorssTable } from "./CorssTable";
import { IEvaluationMethod, type ICell } from "./interface";
import { SelectEvaluationStandard } from "./Component/SelectEvaluationStandard";
import { Level } from "./Component/Level";
import { ObservationPoint } from "./Component/ObservationPoint";
import { inputRuleOptions } from "./Component/Level/Component/EvaluationMethod";
import { Form } from "antd";

export const ReactCorssTable = () => {
    return (
        <Form.Item
            label=""
            name="corssTable"
        >
            <CorssTable
                contentRender={{
                    [IEvaluationMethod.SelectEvaluationStandard]:
                        SelectEvaluationStandard,
                    level: Level,
                    observationPoint: ObservationPoint,
                    [IEvaluationMethod.InputValue]: (cell: ICell) => {
                        const {
                            minValue = 0,
                            maxValue = 0,
                            inputRule = "",
                        } = cell;
                        return (
                            <div
                                className={
                                    "w-full h-full relative before:absolute before:inset-0  before:border-2 before:border-blue-400 before:transition-opacity before:duration-300 before:ease-in-out  before:pointer-none  before:opacity-0 hover:before:opacity-100"
                                }
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    数值：{minValue} ~ {maxValue} 规则：
                                    {
                                        inputRuleOptions.find(
                                            (item) => item.value === inputRule,
                                        )?.name
                                    }
                                </div>
                            </div>
                        );
                    },
                    [IEvaluationMethod.InputText]: () => {
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
                                <div className="w-full h-full flex items-center justify-center">
                                    文本输入
                                </div>
                            </div>
                        );
                    },
                }}
            />
        </Form.Item>
    );
};
