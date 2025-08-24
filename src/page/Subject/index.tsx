import { memo, useEffect, useState } from "react";
import { Button, Table, type TableProps } from "antd";
import data from "./data.json";
import type { TeacherItem } from "./type.ts";
import {useGetTeacherSubjectListQuery} from "../../store/apiSlice.ts";

const Subject = memo(() => {
    const columns: TableProps<TeacherItem>["columns"] = [
        {
            title: "排序",
            dataIndex: "seq",
            key: "seq",
            align: "center",
            render: (_, record,index) => (
                <>
                    {index + 1}
                </>
            ),
        },
        {
            title: "学科",
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        // {
        //     title: "界面中显示/不显示",
        //     dataIndex: "show",
        //     key: "show",
        //     align: "center",
        // },
        {
            title: "操作",
            key: "action",
            align: "center",
            render: (_, record) => (
                <>
                    <Button type="primary">编辑</Button>
                </>
            ),
        },
    ];

    const [tableData, setTableData] = useState([]);

    const fetchTableData = async () => {
        try {
            const res = data;

            setTableData(res.sort((a, b) => a.seq - b.seq));
        } catch (err) {
            console.error(err);
        }
    };

    const { data: listRes, refetch: refetchList, isSuccess } = useGetTeacherSubjectListQuery();


    useEffect(() => {
        if (listRes?.data && isSuccess) {
            setTableData(listRes.data);
        }
    }, [listRes, isSuccess]);

    return (
        <div
            className="evaluate bg-white"
            style={{ height: "calc(100vh - 70px)", overflow: "hidden" }}
        >
            <div className="mt-[10px] py-2.5 w-[99%] m-auto">
                <Table<TeacherItem>
                    columns={columns}
                    loading={!isSuccess}
                    bordered
                    size="middle"
                    scroll={{ y: 710 }}
                    dataSource={tableData}
                    pagination={false}
                />
            </div>
        </div>
    );
});

export { Subject as Component };
