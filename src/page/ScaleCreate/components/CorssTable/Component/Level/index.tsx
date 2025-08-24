import { Dropdown, Modal, type MenuProps } from "antd";
import {
    ICellType,
    IEvaluationMethod,
    type ICell,
    type IChildComponentProps,
} from "../../interface";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    DeleteOutlined,
    EditOutlined,
    PauseOutlined,
    PlusOutlined,
    StopOutlined,
} from "@ant-design/icons";
import {
    EvaluationMethod,
    type IEvaluationMethodProps,
} from "./Component/EvaluationMethod";
import { useState } from "react";
import { getRowLevel } from "./utils/getRowLevel";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { transposeTable } from "../../utils/transposeTable";
import { getRowStartAndEndIndex } from "./utils/getRowStartAndEndIndex";
import { copyRow } from "./utils/copyRow";
import { getLevelBlocks, findBlockByRowIndex } from "./utils/getLevelBlocks";
import { updateLevelFlags } from "../../utils/updateLevelFlags";
import { extractPreservedData } from "./utils/extractPreservedData";
import TextArea from "antd/es/input/TextArea";

interface ILevelProps extends IChildComponentProps {
    placeholder: string;
    flag: string;
    hidden?: boolean;
}
export const Level: React.FC<ILevelProps> = (props: ILevelProps) => {
    const {
        placeholder,
        flag,
        setState,
        rowIndex,
        columnIndex,
        getCorssTableData,
        hidden = false,
    } = props;
    const corssTableData = getCorssTableData();
    /**
     * 获取行中所有的层级
     */
    const rowLevel = getRowLevel({
        rowIndex,
        corssTableData,
        isFilterKey: true,
    });
    /**
     * 整个表格是否只有一行层级了，来控制层级是否可以进行删除
     */
    const isOnlyOneRowLevel =
        corssTableData.filter((row) => row[0].contentType === "level")
            .length === 1;

    // 获取所有维度块信息，用于判断上移下移是否可用
    const levelBlocks = getLevelBlocks(corssTableData);
    const currentBlock = findBlockByRowIndex(levelBlocks, rowIndex);
    const currentBlockIndex = currentBlock
        ? levelBlocks.findIndex(
              (block) => block.levelKey === currentBlock.levelKey,
          )
        : -1;

    // 判断是否可以上移下移
    const canMoveUp = currentBlockIndex > 0;
    const canMoveDown =
        currentBlockIndex >= 0 && currentBlockIndex < levelBlocks.length - 1;
    const [evaluationMethodInitialConfig, setEvaluationMethodInitialConfig] =
        useState<IEvaluationMethodProps["initialConfig"]>();

    // 创建辅助函数来自动更新角标
    const setStateWithFlagUpdate = (newData: ICell[][]) => {
        const updatedData = updateLevelFlags(newData);
        setState({ data: updatedData });
    };
    /** 是否可以新建子维度 */
    const isCreateSubLvel = corssTableData[rowIndex].find((cell) => {
        return cell.contentType === "selectEvaluationStandard";
    });
    const items: MenuProps["items"] = [
        {
            key: "1",
            label: "并列维度",
            icon: <PauseOutlined />,

            onClick: () => {
                console.log("并列维度");
                const dart = produce(corssTableData, (draft) => {
                    const { endIndex } = getRowStartAndEndIndex({
                        rowIndex,
                        columnIndex: 0,
                        corssTableData,
                    });
                    const row = copyRow({
                        corssTableData,
                        columnIndex: 0,
                        rowIndex,
                        copyType: "parallel",
                    });

                    draft.splice(endIndex + 1, 0, ...row);
                });
                setStateWithFlagUpdate(dart);
            },
        },
        {
            key: "2",
            label: "新建子维度",
            disabled: !isCreateSubLvel,
            icon: <PlusOutlined />,
            onClick: () => {
                console.log("新建子维度");
                // 只有一个层级
                if (rowLevel.length === 1) {
                    // 判断层级2是否是 default 类型
                    const [{ _key: key }] = rowLevel;
                    const isLevel2Default = corssTableData[rowIndex].find(
                        (cell) => {
                            return (
                                cell.parentKey === key &&
                                cell.type === ICellType.Default
                            );
                        },
                    );
                    if (isLevel2Default) {
                        const { startIndex, endIndex } = getRowStartAndEndIndex(
                            {
                                rowIndex,
                                columnIndex,
                                corssTableData,
                            },
                        );
                        if (startIndex !== endIndex) {
                            /**
                             * 起点和终点不一样，说明跨越了多行
                             */
                            const dart = produce(corssTableData, (draft) => {
                                const levelKey = uuidv4();
                                for (let i = startIndex; i <= endIndex; i++) {
                                    if (i === startIndex) {
                                        draft[startIndex][1] = {
                                            type: ICellType.Content,
                                            _key: levelKey,
                                            contentType: "level",
                                            placeholder: "请输入维度名称",
                                            flag: "b1",
                                        };
                                    } else {
                                        draft[i][1] = {
                                            type: ICellType.Default,
                                            _key: uuidv4(),
                                            parentKey: levelKey,
                                        };
                                    }
                                }
                            });
                            setStateWithFlagUpdate(dart);
                            return;
                        }
                        const dart = produce(corssTableData, (draft) => {
                            const row = [...draft[rowIndex]].reverse();
                            const lastDefaultItem = row.find((cell) => {
                                return (
                                    cell.type === ICellType.Default &&
                                    cell.parentKey === key
                                );
                            });

                            if (lastDefaultItem) {
                                draft[rowIndex].find((item, index) => {
                                    if (item._key === lastDefaultItem._key) {
                                        draft[rowIndex][index] = {
                                            type: ICellType.Content,
                                            _key: lastDefaultItem._key,
                                            contentType: "level",
                                            placeholder: "请输入维度名称",
                                            flag: "b1",
                                        };
                                        return true;
                                    }
                                });
                            }
                        });
                        setStateWithFlagUpdate(dart);
                        return;
                    } else {
                        const dart = produce(corssTableData, (draft) => {
                            const level2HeaderKey = uuidv4();
                            const level2Key = uuidv4();
                            const newColumn = [
                                {
                                    type: ICellType.Header,
                                    _key: level2HeaderKey,
                                    title: "层次2",
                                },
                                {
                                    type: ICellType.Default,
                                    _key: uuidv4(),
                                    parentKey: level2HeaderKey,
                                },
                            ];
                            if (!currentBlock) {
                                return;
                            }
                            console.log(currentBlock);

                            draft.forEach((rows, index) => {
                                if (newColumn[index]) {
                                    rows.splice(
                                        columnIndex + 1,
                                        0,
                                        newColumn[index],
                                    );
                                    return;
                                }
                                const { startIndex, endIndex } = currentBlock;
                                if (index >= startIndex && index <= endIndex) {
                                    if (index === startIndex) {
                                        rows.splice(columnIndex + 1, 0, {
                                            type: ICellType.Content,
                                            _key: level2Key,
                                            contentType: "level",
                                            placeholder: "请输入维度名称",
                                            flag: "B1",
                                        });
                                    } else {
                                        rows.splice(columnIndex + 1, 0, {
                                            type: ICellType.Default,
                                            _key: uuidv4(),
                                            parentKey: level2Key,
                                        });
                                    }
                                    return;
                                }
                                const cell = rows[columnIndex];
                                if (cell.type === ICellType.Default) {
                                    rows.splice(columnIndex + 1, 0, {
                                        type: ICellType.Default,
                                        _key: uuidv4(),
                                        parentKey: cell.parentKey,
                                    });
                                } else {
                                    rows.splice(columnIndex + 1, 0, {
                                        type: ICellType.Default,
                                        _key: uuidv4(),
                                        parentKey: cell._key,
                                    });
                                }
                            });
                        });
                        console.log(dart);

                        setStateWithFlagUpdate(dart);
                        return;
                    }
                }
                // 有多个层级,复制一行
                const dart = produce(corssTableData, (draft) => {
                    const { endIndex } = getRowStartAndEndIndex({
                        rowIndex,
                        columnIndex,
                        corssTableData,
                    });
                    const row = copyRow({
                        corssTableData,
                        columnIndex,
                        rowIndex,
                        copyType: "sub",
                    });

                    draft.splice(endIndex + 1, 0, ...row);
                });
                setStateWithFlagUpdate(dart);
                return;
            },
        },
        {
            key: "3",
            label: "上移",
            disabled: !canMoveUp,
            icon: <ArrowUpOutlined />,
            onClick: () => {
                // 实现上移逻辑
                const dart = produce(corssTableData, (draft) => {
                    const { rowIndex } = props;

                    // 获取所有维度块
                    const levelBlocks = getLevelBlocks(draft);

                    // 找到当前所在的维度块
                    const currentBlock = findBlockByRowIndex(
                        levelBlocks,
                        rowIndex,
                    );
                    if (!currentBlock) return;

                    // 找到当前块在所有块中的索引
                    const currentBlockIndex = levelBlocks.findIndex(
                        (block) => block.levelKey === currentBlock.levelKey,
                    );

                    // 如果是第一个块，无法上移
                    if (currentBlockIndex <= 0) return;

                    // 获取上一个块
                    const prevBlock = levelBlocks[currentBlockIndex - 1];

                    // 提取两个块的数据
                    const currentRows = draft.slice(
                        currentBlock.startIndex,
                        currentBlock.endIndex + 1,
                    );
                    const prevRows = draft.slice(
                        prevBlock.startIndex,
                        prevBlock.endIndex + 1,
                    );

                    // 删除原来的数据
                    draft.splice(
                        prevBlock.startIndex,
                        currentBlock.endIndex - prevBlock.startIndex + 1,
                    );

                    // 重新插入：先插入当前块，再插入上一个块
                    draft.splice(
                        prevBlock.startIndex,
                        0,
                        ...currentRows,
                        ...prevRows,
                    );
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
                // 实现下移逻辑
                const dart = produce(corssTableData, (draft) => {
                    const { rowIndex } = props;

                    // 获取所有维度块
                    const levelBlocks = getLevelBlocks(draft);

                    // 找到当前所在的维度块
                    const currentBlock = findBlockByRowIndex(
                        levelBlocks,
                        rowIndex,
                    );
                    if (!currentBlock) return;

                    // 找到当前块在所有块中的索引
                    const currentBlockIndex = levelBlocks.findIndex(
                        (block) => block.levelKey === currentBlock.levelKey,
                    );

                    // 如果是最后一个块，无法下移
                    if (currentBlockIndex >= levelBlocks.length - 1) return;

                    // 获取下一个块
                    const nextBlock = levelBlocks[currentBlockIndex + 1];

                    // 提取两个块的数据
                    const currentRows = draft.slice(
                        currentBlock.startIndex,
                        currentBlock.endIndex + 1,
                    );
                    const nextRows = draft.slice(
                        nextBlock.startIndex,
                        nextBlock.endIndex + 1,
                    );

                    // 删除原来的数据
                    draft.splice(
                        currentBlock.startIndex,
                        nextBlock.endIndex - currentBlock.startIndex + 1,
                    );

                    // 重新插入：先插入下一个块，再插入当前块
                    draft.splice(
                        currentBlock.startIndex,
                        0,
                        ...nextRows,
                        ...currentRows,
                    );
                });
                setStateWithFlagUpdate(dart);
            },
        },
        {
            key: "5",
            label: "删除",
            disabled: isOnlyOneRowLevel && columnIndex === 0,
            icon: <DeleteOutlined />,
            onClick: () => {
                Modal.confirm({
                    title: "删除",
                    content: "确定要删除该维度吗？",
                    keyboard: true,
                    onOk: () => {
                        /**
                         * 如果只有一行层级，并且不是第一列，并且这一列只剩下最后一个层级
                         */
                        if (isOnlyOneRowLevel && columnIndex !== 0) {
                            /**
                             * 当前列是否只有这一个层级
                             */
                            const isOnlyOneColumnLevel =
                                corssTableData.filter(
                                    (row) =>
                                        row[columnIndex].contentType ===
                                        "level",
                                ).length === 1;
                            if (isOnlyOneColumnLevel) {
                                const dart = produce(
                                    corssTableData,
                                    (draft) => {
                                        draft.forEach((row, _rowIndex) => {
                                            row.splice(columnIndex, 1);
                                        });
                                    },
                                );
                                setStateWithFlagUpdate(dart);
                                return;
                            }
                        }
                        /**
                         * 正常删除
                         */
                        const dart = produce(corssTableData, (draft) => {
                            const { _key, columnIndex, rowIndex } = props;

                            const deleteRows = draft
                                .slice(rowIndex)
                                .map((row) => {
                                    if (
                                        row[columnIndex].type ===
                                        ICellType.Content
                                    ) {
                                        if (row[columnIndex]._key === _key) {
                                            return row[columnIndex];
                                        }
                                    } else if (
                                        row[columnIndex].type ===
                                            ICellType.Default &&
                                        row[columnIndex].parentKey === _key
                                    ) {
                                        return row[columnIndex];
                                    }
                                })
                                .filter((item): item is ICell => {
                                    return item !== undefined;
                                });
                            const transposedData = transposeTable(draft);
                            transposedData.forEach((column, _columnIndex) => {
                                /**
                                 * 处理选中列之前的列
                                 */
                                if (_columnIndex < columnIndex) {
                                    /**
                                     * 如果当前这一行是default类型的话直接删除
                                     */
                                    if (
                                        column[rowIndex].type ===
                                        ICellType.Default
                                    ) {
                                        column.splice(
                                            rowIndex,
                                            deleteRows.length,
                                        );
                                    } else {
                                        /**
                                         * 判断是否是全部删除
                                         */
                                        const key = column[rowIndex]._key;
                                        const defaultCell = [...column]
                                            .splice(rowIndex)
                                            .filter(
                                                (item) =>
                                                    item.parentKey === key,
                                            );

                                        if (
                                            defaultCell.length + 1 ===
                                            deleteRows.length
                                        ) {
                                            column.splice(
                                                rowIndex,
                                                deleteRows.length,
                                            );
                                        } else {
                                            column.splice(
                                                rowIndex + 1,
                                                deleteRows.length,
                                            );
                                        }
                                    }
                                } else {
                                    column.splice(rowIndex, deleteRows.length);
                                }
                            });
                            const res = transposeTable(transposedData);
                            return res;
                        });
                        setStateWithFlagUpdate(dart);
                    },
                });
            },
        },
        {
            key: "6",
            label: "评价方式",
            icon: <EditOutlined />,
            onClick: () => {
                const currentRowData = corssTableData[rowIndex];
                console.log("当前行数据:", currentRowData);
                const selectEvaluationStandardItem = currentRowData.find(
                    (item) =>
                        item.contentType ===
                        IEvaluationMethod.SelectEvaluationStandard,
                );
                if (selectEvaluationStandardItem) {
                    setEvaluationMethodInitialConfig({
                        open: true,
                        evaluationMethod: 0,
                    });
                }
                const inputValueItem = currentRowData.find(
                    (item) => item.contentType === IEvaluationMethod.InputValue,
                );
                if (inputValueItem) {
                    const { minValue, maxValue, inputRule } = inputValueItem;
                    setEvaluationMethodInitialConfig({
                        open: true,
                        evaluationMethod: 1,
                        minValue,
                        maxValue,
                        inputRule,
                    });
                }
                const inputTextItem = currentRowData.find(
                    (item) => item.contentType === IEvaluationMethod.InputText,
                );
                if (inputTextItem) {
                    const { inputLine } = inputTextItem;
                    setEvaluationMethodInitialConfig({
                        open: true,
                        evaluationMethod: 2,
                        inputLine,
                    });
                }
            },
        },
        {
            key: "7",
            label: hidden ? "启用" : "停用",
            icon: <StopOutlined />,
            onClick: () => {
                Modal.confirm({
                    title: hidden ? "启用" : "停用",
                    content: hidden
                        ? "启用后该维度将重新在新建记录中显示"
                        : "停用后新建的记录将不会显示该维度",
                    onOk: () => {
                        // 实现停用/启用逻辑
                        const dart = produce(corssTableData, (draft) => {
                            const { _key, rowIndex } = props;

                            // 查找当前行级别的所有相关行
                            const { startIndex, endIndex } =
                                getRowStartAndEndIndex({
                                    rowIndex,
                                    columnIndex: 0,
                                    corssTableData,
                                });

                            // 为相关的所有行设置或取消hidden属性
                            for (let i = startIndex; i <= endIndex; i++) {
                                // 遍历该行的所有单元格，查找层次1的单元格
                                draft[i].forEach((cell, cellIndex) => {
                                    if (
                                        cellIndex === 0 &&
                                        (cell._key === _key ||
                                            cell.parentKey === _key)
                                    ) {
                                        cell.hidden = !hidden;
                                    }
                                });
                            }
                        });
                        setStateWithFlagUpdate(dart);
                    },
                    keyboard: true,
                });
            },
        },
    ];
    return (
        <>
            <Dropdown
                menu={{ items }}
                trigger={["contextMenu"]}
            >
                <label
                    className={`
     w-full h-full flex items-center justify-center relative
     before:absolute before:inset-0 
     before:border-2 before:border-blue-400
     before:transition-opacity before:duration-300 before:ease-in-out 
     before:pointer-none:
     before:opacity-0
     hover:before:opacity-100
     ${hidden ? "bg-gray-200 opacity-60" : ""}
     `}
                >
                    <TextArea
                        placeholder={placeholder}
                        className="bg-none! 
                        bg-transparent! border-none! outline-none! text-center relative z-10  focus-within:border-transparent! focus-within:bg-transparent! focus-within:shadow-none!"
                        autoSize={{ minRows: 1 }}
                        value={String(props.value || "")}
                        onChange={(e) => {
                            const dart = produce(corssTableData, (draft) => {
                                const cell =
                                    draft[props.rowIndex][props.columnIndex];
                                cell.value = e.target.value;
                            });
                            setState({ data: dart });
                        }}
                        disabled={hidden}
                    />

                    <div className="absolute top-1 right-1 text-xs text-black-50 scale-75 uppercase">
                        {flag}
                    </div>
                    {hidden && columnIndex === 0 && (
                        <div className="absolute top-1 left-1 text-xs text-red-500 bg-red-100 px-1 rounded">
                            已停用
                        </div>
                    )}
                </label>
            </Dropdown>
            <EvaluationMethod
                initialConfig={evaluationMethodInitialConfig}
                rowLevelCount={rowLevel.length}
                onOk={(values) => {
                    if (!values) {
                        return;
                    }

                    setEvaluationMethodInitialConfig({
                        ...values,
                    });
                    const { evaluationMethod } = values;
                    if (typeof evaluationMethod !== "number") {
                        return;
                    }
                    if ([1, 2].includes(evaluationMethod)) {
                        // 在设置评价方式后，检查当前观察点内的评价标准行，如果有多行就删除成一行
                        const dart = produce(corssTableData, (draft) => {
                            if (!currentBlock) {
                                return;
                            }
                            const { startIndex, endIndex } = currentBlock;

                            // 从后往前删除，避免索引偏移问题
                            for (let i = endIndex; i > startIndex; i--) {
                                draft.splice(i, 1);
                            }

                            draft[startIndex].splice(-3);
                            const newContent: ICell[] = [];
                            if (evaluationMethod === 2) {
                                const { inputLine } = values;
                                newContent.push({
                                    type: ICellType.Content,
                                    _key: uuidv4(),
                                    contentType: "inputText",
                                    inputLine: inputLine,
                                });
                                newContent.push({
                                    type: ICellType.Default,
                                    _key: uuidv4(),
                                    parentKey: newContent[0]._key,
                                });
                                newContent.push({
                                    type: ICellType.Default,
                                    _key: uuidv4(),
                                    parentKey: newContent[0]._key,
                                });
                            }
                            if (evaluationMethod === 1) {
                                const { minValue, maxValue, inputRule } =
                                    values;
                                newContent.push({
                                    type: ICellType.Content,
                                    _key: uuidv4(),
                                    contentType: "inputValue",
                                    minValue,
                                    maxValue,
                                    inputRule,
                                });
                                newContent.push({
                                    type: ICellType.Default,
                                    _key: uuidv4(),
                                    parentKey: newContent[0]._key,
                                });
                                newContent.push({
                                    type: ICellType.Default,
                                    _key: uuidv4(),
                                    parentKey: newContent[0]._key,
                                });
                            }
                            draft[startIndex].push(...newContent);
                        });
                        setStateWithFlagUpdate(dart);
                        return;
                    }
                    if (evaluationMethod === 0) {
                        const dart = produce(corssTableData, (draft) => {
                            if (!currentBlock) {
                                return;
                            }
                            const { startIndex, endIndex } = currentBlock;

                            // 在删除前提取需要保留的数据
                            const preservedData = extractPreservedData(
                                corssTableData,
                                startIndex,
                                endIndex,
                            );

                            for (let i = endIndex; i >= startIndex; i--) {
                                draft.splice(i, 1);
                            }

                            const row = copyRow(
                                {
                                    corssTableData,
                                    columnIndex,
                                    rowIndex,
                                    copyType: "parallel",
                                },
                                preservedData,
                            );

                            draft.splice(startIndex, 0, ...row);
                        });
                        setStateWithFlagUpdate(dart);
                    }
                }}
            />
        </>
    );
};
