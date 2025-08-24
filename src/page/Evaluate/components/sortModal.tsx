import {memo, useImperativeHandle, useState} from "react";
import {Drawer, Table} from "antd";
import type {DataType} from "../index.tsx";

interface Props {
    onRef: any,
    callBack: (event: any) => void
}

const SortModal = memo<Props>(({onRef, callBack}) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('标题');

    const [data, setData] = useState<DataType[]>([]);

    const columns = [
        {
            title: '排序',
            dataIndex: 'seq',
            align: 'center',
            key: 'seq',
            render: (_, record, idx) => {
                return <>{idx + 1}</>
            }
        },
        {
            title: '量表',
            dataIndex: 'scaleName',
            align: 'center',
            key: 'scaleName',
        }
    ];

    const showDrawer = (info: DataType, list: DataType[]) => {
        setTitle(info?.groupName);
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
            close: onClose
        };
    });

    return (
        <Drawer
            title={title}
            closable={{'aria-label': 'Close Button'}}
            onClose={onClose}
            width={700}
            open={open}
        >
            <Table
                size='small'
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
            />
        </Drawer>
    )
});

export default SortModal;