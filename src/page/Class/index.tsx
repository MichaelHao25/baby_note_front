import { memo, useEffect, useRef, useState } from "react";
import { Button, Table, type TableProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditModal from "./components/editModal.tsx";
import { useNavigate } from "react-router";
import {
    useGetCategoriesQuery,
    useModifyCategoriesMutation,
    useAddCategoriesMutation,
    useDeleteCategoriesMutation,
} from "../../store/apiSlice.ts";
import './index.css';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    "data-row-key": string;
}

const Row: React.FC<Readonly<RowProps>> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props["data-row-key"],
    });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: "move",
        ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
    };

    return (
        <tr
            {...props}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        />
    );
};

export interface DataType {
    criterionName: string;
    criterionId: string;
    endDate: string;
    show: number;
    type: number;
    allUser: boolean;
    criterionRelationId: string;
    teachers: Teacher[];
    seq: number;
    startDate: string;
}

export interface Teacher {
    name: string;
    id: string;
}

// 增强版数据预处理
const processData = (data) => {
    return data.flatMap((parent) => {
        return parent?.childs?.map((child, index) => ({
            ...child,
            key: parent.id,
            parentName: parent.name,
            parentSeq: parent.seq, // 添加父级排序号
            parentCount: parent.count, // 父级项目总数
            parentRowSpan: index === 0 ? parent.childs.length : 0, // 父级合并行数
            childSeq: child.seq, // 子级自身排序号
        }));
    });
};

const Class = memo(() => {
    const editModalRef = useRef<any>(null);
    const {
        data: categories,
        isLoading: categoriesIsLoading,
        isSuccess: isFetchSuccess,
        refetch,
    } = useGetCategoriesQuery({
        schoolCode: "RBI850",
    });
    // 调用 useModifyCategoriesMutation 钩子
    const [modifyCategory, { isSuccess: isModifySuccess }] =
        useModifyCategoriesMutation();
    const [addCategory, { isSuccess: isAddSuccess }] =
        useAddCategoriesMutation();
    const [deleteCategory, { isSuccess: isDelSuccess }] =
        useDeleteCategoriesMutation();

    const [dataSource, setDataSource] = useState([]);
    const [tableData, setTableData] = useState([]);

    const columns: TableProps<DataType>["columns"] = [
        {
            title: "序号",
            dataIndex: "parentRowSpan",
            key: "parentRowSpan",
            align: "center",
            render: (value, row, index) => ({
                children: row?.parentSeq,
                props: {
                    rowSpan: row?.parentRowSpan,
                    style: { textAlign: "center" },
                },
            }),
        },
        {
            title: "分类名称",
            dataIndex: "parentName",
            key: "parentName",
            align: "center",
            render: (value, row) => ({
                children: (
                    <div className="realtive">
                        <span>{row?.parentName}</span>
                        <a
                            className="absolute right-2 top-2"
                            onClick={() => {
                                const list = dataSource.filter(
                                    (item) => item?.key === row?.key,
                                );
                                console.log("modify", row, list);
                                editModalRef.current?.open("modify", row, list);
                            }}
                        >
                            编辑
                        </a>
                    </div>
                ),
                props: { rowSpan: row?.parentRowSpan },
            }),
        },
        {
            title: "子分类",
            dataIndex: "name",
            key: "name",
            align: "center",
        },
    ];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
                distance: 1,
            },
        }),
    );

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            const newTable = [...tableData];

            const activeItem = dataSource.find((i) => i.id === active.id);
            const activeIndex = tableData.findIndex(
                (item) => item.id === activeItem.key,
            );

            const overItem = dataSource.find((i) => i.id === over?.id);
            const overIndex = tableData.findIndex(
                (item) => item.id === overItem.key,
            );

            if (overIndex === -1 || activeIndex === -1) return;

            const newData = arrayMove(newTable, activeIndex, overIndex);
            setTableData(() => {
                return newData;
            });

            setDataSource(() => {
                return processData(newData);
            });
        }
    };

    useEffect(() => {
        if (isFetchSuccess && categories?.data) {
            const data = categories?.data?.filter(item => item.childs);
            setTableData(data);
            setDataSource(processData(data));
        }
    }, [isFetchSuccess, categories]);

    return (
        <div
            className="evaluate w-full h-full bg-white p-2.5"
            style={{ overflowY: "auto", height: "calc(100vh - 80px)" }}
        >
            <div className="flex justify-end">
                <Button type="primary">excel导出分类</Button>
                <Button type="primary" className="ml-2 mr-2">
                    excel导入分类
                </Button>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        editModalRef.current?.open("add");
                    }}
                >
                    <span>创建</span>
                </Button>
            </div>
            <div className="mt-[15px]">
                <DndContext
                    sensors={sensors}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        // rowKey array
                        items={dataSource?.map((i) => i?.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Table<DataType>
                            bordered
                            components={{
                                body: { row: Row },
                            }}
                            rowKey="id"
                            size="middle"
                            columns={columns}
                            pagination={false}
                            dataSource={dataSource}
                        />
                    </SortableContext>
                </DndContext>
            </div>

            <EditModal
                onRef={editModalRef}
                callBack={async ({ type, list, info }) => {
                    try {
                        if (type === "add") {
                            const fetchData = {
                                schoolCode: "RBI850",
                                name: info?.parentName,
                                id: list[0]?.pid,
                                childDocs: list.map((item) => ({
                                    name: item?.name,
                                    count: 1,
                                    seq: item?.seq,
                                })),
                            };

                            await addCategory(fetchData);
                        } else if (type === "modify") {
                            const fetchData = {
                                schoolCode: "RBI850",
                                name: info?.parentName,
                                id: list[0]?.pid,
                                childDocs: list.map((item) => ({
                                    name: item?.name,
                                    id: item?.id,
                                    seq: item?.seq,
                                })),
                            };

                            await modifyCategory(fetchData);
                        } else {
                            await deleteCategory({ id: list[0]?.pid });
                        }
                        editModalRef.current?.close();
                        await refetch();
                    } catch (err) {
                        console.error(err);
                    }
                }}
            />
        </div>
    );
});

export { Class as Component };
