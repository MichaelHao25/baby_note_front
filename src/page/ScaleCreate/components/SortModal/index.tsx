import {
    memo,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { Button, Drawer, Table } from "antd";
import update from "immutability-helper";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { DataType } from "../index.tsx";
interface Props {
    onRef: any;
    callBack: (event: any) => void;
}

interface DraggableBodyRowProps
    extends React.HTMLAttributes<HTMLTableRowElement> {
    index: number;
    moveRow: (dragIndex: number, hoverIndex: number) => void;
}

const type = "DraggableBodyRow";

const DraggableBodyRow = ({
    index,
    moveRow,
    className,
    style,
    ...restProps
}: DraggableBodyRowProps) => {
    const ref = useRef<HTMLTableRowElement>(null);
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: (monitor) => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName:
                    dragIndex < index
                        ? " drop-over-downward"
                        : " drop-over-upward",
            };
        },
        drop: (item: { index: number }) => {
            moveRow(item.index, index);
        },
    });
    const [, drag] = useDrag({
        type,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));

    return (
        <tr
            ref={ref}
            className={`${className}${isOver ? dropClassName : ""}`}
            style={{ cursor: "move", ...style }}
            {...restProps}
        />
    );
};

const SortModal = memo<Props>(({ onRef, callBack }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("页面展示顺序设置");

    const [data, setData] = useState<DataType[]>([]);

    const columns = [
        {
            title: "排序",
            dataIndex: "seq",
            align: "center",
            key: "seq",
            render: (_, record, idx) => {
                return <>{idx + 1}</>;
            },
        },
        {
            title: "量表",
            dataIndex: "name",
            align: "center",
            key: "name",
        },
    ];

    const components = {
        body: {
            row: DraggableBodyRow,
        },
    };

    const moveRow = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const dragRow = data[dragIndex];
            setData(
                update(data, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragRow],
                    ],
                }),
            );
        },
        [data],
    );

    const showDrawer = (list: DataType[]) => {
        setData(list);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    //用useImperativeHandle暴露一些外部ref能访问的属性
    useImperativeHandle(onRef, () => {
        // 需要将暴露的接口返回出去
        return {
            open: showDrawer,
            close: onClose,
        };
    });

    return (
        <Drawer
            title={title}
            closable={{ "aria-label": "Close Button" }}
            onClose={onClose}
            width={700}
            open={open}
            footer={
                <div className="flex justify-end">
                    <div>
                        <Button
                            onClick={() => {
                                callBack?.("cancel");
                            }}
                        >
                            取消
                        </Button>
                        <Button
                            type="primary"
                            className="ml-[15px]"
                            onClick={() => {
                                callBack?.("confirm", data);
                            }}
                        >
                            确认
                        </Button>
                    </div>
                </div>
            }
        >
            <DndProvider backend={HTML5Backend}>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    components={components}
                    onRow={(_, index) => {
                        const attr = {
                            index,
                            moveRow,
                        };
                        return attr as React.HTMLAttributes<any>;
                    }}
                />
            </DndProvider>
        </Drawer>
    );
});

export default SortModal;
