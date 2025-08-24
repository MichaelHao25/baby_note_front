import React from "react";
import { Dropdown, InputNumber, Modal } from "antd";
import type { MenuProps } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    StopOutlined,
} from "@ant-design/icons";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import {
    ICellType,
    type IChildComponentProps,
    type ICell,
} from "../../interface";
import { getObservationPointBounds } from "../../utils/getObservationPointBounds";
import { updateLevelFlags } from "../../utils/updateLevelFlags";
import TextArea from "antd/es/input/TextArea";

interface ISelectEvaluationStandardProps extends IChildComponentProps {
    placeholder: string;
    index: number;
    hidden?: boolean;
}

export const SelectEvaluationStandard: React.FC<
    ISelectEvaluationStandardProps
> = (props: ISelectEvaluationStandardProps) => {
    const {
        setState,
        getCorssTableData,
        placeholder,
        index,
        value,
        rowIndex,
        columnIndex,
        hidden,
    } = props;
    const corssTableData = getCorssTableData();

    // 创建辅助函数来自动更新角标
    const setStateWithFlagUpdate = (newData: ICell[][]) => {
        const updatedData = updateLevelFlags(newData);
        setState({ data: updatedData });
    };

    // 获取当前行所属观察点的边界
    const { startIndex, endIndex } = getObservationPointBounds(
        corssTableData,
        rowIndex,
    );

    // 判断是否可以上移下移（仅在观察点边界内）
    let canMoveUp = false;
    let canMoveDown = false;

    // 查找上方是否有同类型同index的项（在观察点边界内）
    for (let i = rowIndex - 1; i >= startIndex; i--) {
        const cell = corssTableData[i][columnIndex];
        if (
            cell.contentType === "selectEvaluationStandard" &&
            cell.index === index
        ) {
            canMoveUp = true;
            break;
        }
    }

    // 查找下方是否有同类型同index的项（在观察点边界内）
    for (let i = rowIndex + 1; i <= endIndex; i++) {
        const cell = corssTableData[i][columnIndex];
        if (
            cell.contentType === "selectEvaluationStandard" &&
            cell.index === index
        ) {
            canMoveDown = true;
            break;
        }
    }

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: "添加",
            icon: <PlusOutlined />,
            onClick: () => {
                console.log(corssTableData);

                // 在当前行后添加新的评价标准行
                const dart = produce(corssTableData, (draft) => {
                    // 创建新行，结构与当前行相同
                    const currentRow = draft[rowIndex];
                    const getDefaultColumn = () => {
                        const index = currentRow.findIndex(
                            (cell) =>
                                cell.contentType === "selectEvaluationStandard",
                        );
                        return index;
                    };
                    const newRow = currentRow.map((cell, cellIndex) => {
                        if (cellIndex < getDefaultColumn()) {
                            // 前3列（层次1、层次2、观察点）设为default
                            return {
                                type: ICellType.Default,
                                _key: uuidv4(),
                                parentKey:
                                    cell.type === ICellType.Default
                                        ? cell.parentKey
                                        : cell._key,
                            };
                        } else {
                            // 评价标准列
                            return {
                                type: ICellType.Content,
                                _key: uuidv4(),
                                contentType: "selectEvaluationStandard",
                                index: cellIndex - currentRow.length - 3,
                                placeholder: cell.placeholder || "请输入内容",
                            };
                        }
                    });

                    draft.splice(rowIndex + 1, 0, newRow);
                });
                setStateWithFlagUpdate(dart);
            },
        },
        {
            key: "2",
            label: "删除",
            icon: <DeleteOutlined />,
            onClick: () => {
                Modal.confirm({
                    title: "删除",
                    content: "确定要删除该行吗？",
                    keyboard: true,
                    onOk: () => {
                        const dart = produce(corssTableData, (draft) => {
                            draft.splice(rowIndex, 1);
                        });
                        setStateWithFlagUpdate(dart);
                    },
                });
            },
        },
        {
            key: "3",
            label: "上移",
            disabled: !canMoveUp,
            icon: <ArrowUpOutlined />,
            onClick: () => {
                const dart = produce(corssTableData, (draft) => {
                    // 找到上一个同类型同index的行（在观察点边界内）
                    let targetRowIndex = -1;
                    for (let i = rowIndex - 1; i >= startIndex; i--) {
                        const cell = draft[i][columnIndex];
                        if (
                            cell.contentType === "selectEvaluationStandard" &&
                            cell.index === index
                        ) {
                            targetRowIndex = i;
                            break;
                        }
                    }

                    if (targetRowIndex >= 0) {
                        // 交换两行
                        const currentRow = draft[rowIndex];
                        const targetRow = draft[targetRowIndex];
                        draft[rowIndex] = targetRow;
                        draft[targetRowIndex] = currentRow;
                    }
                });
                setStateWithFlagUpdate(dart);
            },
        },
        {
            key: "4",
            label: "下移",
            disabled: !canMoveDown,
            icon: <ArrowDownOutlined />,
            onClick: () => {
                const dart = produce(corssTableData, (draft) => {
                    // 找到下一个同类型同index的行（在观察点边界内）
                    let targetRowIndex = -1;
                    for (let i = rowIndex + 1; i <= endIndex; i++) {
                        const cell = draft[i][columnIndex];
                        if (
                            cell.contentType === "selectEvaluationStandard" &&
                            cell.index === index
                        ) {
                            targetRowIndex = i;
                            break;
                        }
                    }

                    if (targetRowIndex >= 0) {
                        // 交换两行
                        const currentRow = draft[rowIndex];
                        const targetRow = draft[targetRowIndex];
                        draft[rowIndex] = targetRow;
                        draft[targetRowIndex] = currentRow;
                    }
                });
                setStateWithFlagUpdate(dart);
            },
        },
        {
            key: "5",
            label: hidden ? "启用" : "停用",
            icon: <StopOutlined />,
            onClick: () => {
                Modal.confirm({
                    title: hidden ? "启用" : "停用",
                    content: hidden
                        ? "启用后该评价标准将重新显示"
                        : "停用后该评价标准将不再显示",
                    onOk: () => {
                        const dart = produce(corssTableData, (draft) => {
                            // 切换当前单元格的hidden状态
                            const cell = draft[rowIndex][columnIndex];
                            cell.hidden = !hidden;
                        });
                        setStateWithFlagUpdate(dart);
                    },
                    keyboard: true,
                });
            },
        },
    ];

    return (
        <Dropdown
            menu={{ items }}
            trigger={["contextMenu"]}
        >
            <label
                className={`w-full h-full flex items-center justify-center relative
                    min-h-10
          before:absolute before:inset-0 
     before:border-2 before:border-blue-400
     before:transition-opacity before:duration-300 before:ease-in-out 
     before:pointer-none:
     before:opacity-0
     hover:before:opacity-100

     ${hidden ? "bg-gray-200 opacity-60" : ""}
        `}
            >
                {["1"].includes(String(index)) ? (
                    <InputNumber
                        type={"number"}
                        placeholder={placeholder}
                        className={`bg-none! bg-transparent!
                             border-none! outline-none! text-center relative z-10  focus-within:border-transparent! focus-within:bg-transparent! focus-within:shadow-none! 
                             [&>.ant-input-number-handler-wrap]:hidden!
                             [&_.ant-input-number-input]:text-center!
                             ${hidden ? "text-gray-500" : ""}`}
                        value={String(value || "")}
                        onChange={(e) => {
                            const dart = produce(corssTableData, (draft) => {
                                const cell = draft[rowIndex][columnIndex];
                                cell.value = e;
                            });
                            setState({ data: dart });
                        }}
                        disabled={hidden}
                    />
                ) : (
                    <TextArea
                        placeholder={placeholder}
                        value={String(value || "")}
                        className="bg-none! 
                        bg-transparent! border-none! outline-none! text-center relative z-10  focus-within:border-transparent! focus-within:bg-transparent! focus-within:shadow-none!"
                        onChange={(e) => {
                            const dart = produce(corssTableData, (draft) => {
                                const cell = draft[rowIndex][columnIndex];
                                cell.value = e.target.value;
                            });
                            setState({ data: dart });
                        }}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                    />
                )}
                {hidden && (
                    <div className="absolute top-1 left-1 text-xs text-red-500 bg-red-100 px-1 rounded">
                        已停用
                    </div>
                )}
            </label>
        </Dropdown>
    );
};
