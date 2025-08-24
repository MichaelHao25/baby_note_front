import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { HolderOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input, Switch, Table, message } from "antd";
import type { TableColumnsType } from "antd";
import { dataset } from "./config";
import {
    useAddEexcelMutation,
    useGetEexcelListQuery,
    useUpdateEexcelMutation,
    useUpdateEexcelSeqMutation,
} from "../../../../store/eexcelApiSlice";

interface DataType {
    id: string;
    excelName: string;
    excelNikeName: string;
    isshow: boolean;
}

interface TableSortProps {
    criterionId: string;
}

interface RowContextProps {
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button
            type="text"
            size="small"
            icon={<HolderOutlined />}
            style={{ cursor: "move" }}
            ref={setActivatorNodeRef}
            {...listeners}
        />
    );
};

const initialData: DataType[] = dataset;

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    "data-row-key": string;
}

const Row: React.FC<RowProps> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props["data-row-key"] });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
    };

    const contextValue = useMemo<RowContextProps>(
        () => ({ setActivatorNodeRef, listeners }),
        [setActivatorNodeRef, listeners],
    );

    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};

export const TableSort: React.FC<TableSortProps> = ({ criterionId }) => {
    const [updateEexcel] = useUpdateEexcelMutation();
    const [updateEexcelSeq] = useUpdateEexcelSeqMutation();

    // 查询列表数据
    const {
        data: excelListData,
        refetch,
        isLoading,
    } = useGetEexcelListQuery({ criterionId: criterionId });

    const updateExcelVisibility = async (id: string, isshow: boolean) => {
        try {
            const response = await updateEexcel({ id, isshow }).unwrap();
            if (response.code === 1) {
                message.success("更新成功");
                // 更新本地数据状态
                refetch();
            } else {
                message.error(response.msg || "更新失败");
            }
        } catch (error) {
            console.error("更新失败:", error);
            message.error("更新失败，请稍后再试");
        }
    };

    // 添加更新nikeName的函数
    const updateExcelNikeName = async (id: string, excelNikeName: string) => {
        try {
            const response = await updateEexcel({ id, excelNikeName }).unwrap();
            if (response.code === 1) {
                message.success("更新成功");
                // 刷新数据
                refetch();
            } else {
                message.error(response.msg || "更新失败");
            }
        } catch (error) {
            console.error("更新失败:", error);
            message.error("更新失败，请稍后再试");
        }
    };

    const columns: TableColumnsType<DataType> = [
        {
            key: "sort",
            align: "center",
            width: 80,
            render: () => <DragHandle />,
        },
        {
            title: "量表内容",
            dataIndex: "excelName",
        },
        {
            title: "显示描述",
            dataIndex: "excelNikeName",
            render: (_, record) => {
                return (
                    <Input
                        defaultValue={record.excelNikeName}
                        onBlur={(e) => {
                            updateExcelNikeName(record.id, e.target.value);
                        }}
                    />
                );
            },
        },
        {
            title: "是否显示",
            dataIndex: "isshow",
            render: (_, record) => {
                return (
                    <Switch
                        checked={record.isshow}
                        onChange={(checked) => {
                            updateExcelVisibility(record.id, checked);
                        }}
                    />
                );
            },
        },
    ];

    const onDragEnd = async ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id && excelListData?.data) {
            const activeIndex = excelListData.data.findIndex(
                (record) => record.id === active?.id,
            );
            const overIndex = excelListData.data.findIndex(
                (record) => record.id === over?.id,
            );
            const newData = arrayMove(
                excelListData.data,
                activeIndex,
                overIndex,
            );

            try {
                // 准备排序请求数据
                const updatedData = newData.map((item, index) => ({
                    id: item.id,
                    seq: index,
                }));

                // 发送排序请求
                await updateEexcelSeq(updatedData).unwrap();
                // 重新获取最新数据
                refetch();
            } catch (error) {
                console.error("排序失败:", error);
                message.error("排序失败，请稍后再试");
            }
        }
    };

    // 将API返回的类型转换为组件所需的类型
    const formattedData: DataType[] =
        excelListData?.data?.map((item) => ({
            id: item.id,
            excelName: item.excelName,
            nikeName: item.nikeName || "",
            isshow: Boolean(item.isshow),
        })) || [];

    // 获取items用于SortableContext
    const sortableItems = formattedData.map((item) => item.id);

    return (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext
                items={sortableItems}
                strategy={verticalListSortingStrategy}
            >
                <Table<DataType>
                    rowKey="id"
                    loading={isLoading}
                    components={{ body: { row: Row } }}
                    columns={columns}
                    dataSource={formattedData}
                />
            </SortableContext>
        </DndContext>
    );
};
