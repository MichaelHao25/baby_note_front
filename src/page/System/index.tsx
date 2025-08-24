import { memo, useEffect, useState } from "react";
import { Button, Table, type TableProps } from "antd";

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

const System = memo(() => {
    const columns: TableProps<DataType>["columns"] = [
        {
            title: "序号",
            dataIndex: "seq",
            key: "seq",
            align: "center",
        },
        {
            title: "规则体系名称",
            dataIndex: "criterionName",
            key: "criterionName",
            align: "center",
        },
        {
            title: "说明",
            dataIndex: "desc",
            key: "desc",
            align: "center",
        },
        {
            title: "状态",
            dataIndex: "show",
            key: "show",
            align: "center",
            render: (text, record, index) => (
                <>{text === 0 ? "公开" : "不公开"}</>
            ),
        },
        {
            title: "统计周期",
            dataIndex: "date",
            key: "date",
            align: "center",
            render: (text, record, index) => <>学期</>,
        },
        {
            title: "操作",
            key: "action",
            align: "center",
            render: (_, record) => (
                <>
                    <a>编辑</a>
                </>
            ),
        },
    ];

    const [tableData, setTableData] = useState([]);

    const fetchTableData = async () => {
        try {
            const res = [
                {
                    criterionName: "评价体系",
                    criterionId: "659c32ea4413762a879c3a56",
                    endDate: "2025/08/10 00:00:00",
                    show: 0,
                    type: 0,
                    allUser: true,
                    criterionRelationId: "659c32ea10674979b4641449",
                    teachers: [
                        {
                            name: "贲春梅",
                            id: "659befdda5f838b3673796bb",
                        },
                        {
                            name: "曹程轩",
                            id: "659befdda5f838b3673796c7",
                        },
                        {
                            name: "陈贇",
                            id: "659befdda5f838b3673796c9",
                        },
                        {
                            name: "陈奕",
                            id: "659befdda5f838b3673796c8",
                        },
                        {
                            name: "戴苏婷",
                            id: "659befdda5f838b3673796c1",
                        },
                        {
                            name: "杜雅",
                            id: "659befdda5f838b3673796ca",
                        },
                        {
                            name: "冯敏书",
                            id: "659befdda5f838b3673796be",
                        },
                        {
                            name: "房蕾",
                            id: "659befdda5f838b3673796cb",
                        },
                        {
                            name: "黄佳宁",
                            id: "659befdda5f838b3673796c4",
                        },
                        {
                            name: "郝曾仪",
                            id: "659befdda5f838b3673796cc",
                        },
                        {
                            name: "洪源",
                            id: "659befdda5f838b3673796cd",
                        },
                        {
                            name: "胡雯君",
                            id: "659befdda5f838b3673796b9",
                        },
                        {
                            name: "林赛赛",
                            id: "659befdda5f838b3673796ce",
                        },
                        {
                            name: "李群",
                            id: "659befdda5f838b3673796cf",
                        },
                        {
                            name: "吕俊",
                            id: "659befdda5f838b3673796d2",
                        },
                        {
                            name: "刘秀莲",
                            id: "659befdda5f838b3673796d1",
                        },
                        {
                            name: "刘定斐",
                            id: "659befdda5f838b3673796d0",
                        },
                        {
                            name: "刘岚",
                            id: "659befdda5f838b3673796b7",
                        },
                        {
                            name: "马燕萍",
                            id: "659befdda5f838b3673796c5",
                        },
                        {
                            name: "齐虹",
                            id: "659befdda5f838b3673796c2",
                        },
                        {
                            name: "祁扬",
                            id: "659befdda5f838b3673796d3",
                        },
                        {
                            name: "宋青云",
                            id: "659befdda5f838b3673796d4",
                        },
                        {
                            name: "孙慈容",
                            id: "659befdda5f838b3673796d5",
                        },
                        {
                            name: "吴秋华",
                            id: "659befdda5f838b3673796ba",
                        },
                        {
                            name: "吴健群",
                            id: "659befdda5f838b3673796c3",
                        },
                        {
                            name: "王晋",
                            id: "659befdda5f838b3673796c6",
                        },
                        {
                            name: "王栋",
                            id: "659befdda5f838b3673796d6",
                        },
                        {
                            name: "王凌",
                            id: "659befdda5f838b3673796d7",
                        },
                        {
                            name: "王晔",
                            id: "659befdda5f838b3673796d8",
                        },
                        {
                            name: "吴晓艳",
                            id: "659befdda5f838b3673796d9",
                        },
                        {
                            name: "王金萍",
                            id: "659befdda5f838b3673796b5",
                        },
                        {
                            name: "薛峰",
                            id: "659befdda5f838b3673796da",
                        },
                        {
                            name: "徐文燕",
                            id: "659befdda5f838b3673796dc",
                        },
                        {
                            name: "许鑫",
                            id: "659befdda5f838b3673796dd",
                        },
                        {
                            name: "徐敏",
                            id: "659befdda5f838b3673796db",
                        },
                        {
                            name: "徐裕华",
                            id: "659befdda5f838b3673796de",
                        },
                        {
                            name: "叶薇芳",
                            id: "658bcc01a5f838b794712504",
                        },
                        {
                            name: "严明丽",
                            id: "659befdda5f838b3673796bc",
                        },
                        {
                            name: "杨骏",
                            id: "659befdda5f838b3673796bf",
                        },
                        {
                            name: "杨健",
                            id: "659befdda5f838b3673796df",
                        },
                        {
                            name: "姚文贇",
                            id: "659befdda5f838b3673796e0",
                        },
                        {
                            name: "袁晓影",
                            id: "659befdda5f838b3673796e1",
                        },
                        {
                            name: "朱文洁",
                            id: "659befdda5f838b3673796bd",
                        },
                        {
                            name: "周雅君",
                            id: "659befdda5f838b3673796c0",
                        },
                        {
                            name: "张斌",
                            id: "659befdda5f838b3673796e2",
                        },
                        {
                            name: "张慧菁",
                            id: "659befdda5f838b3673796e3",
                        },
                        {
                            name: "张丽玲",
                            id: "659befdda5f838b3673796e4",
                        },
                        {
                            name: "张玲",
                            id: "659befdda5f838b3673796e5",
                        },
                        {
                            name: "张敏",
                            id: "659befdda5f838b3673796e6",
                        },
                        {
                            name: "张敏燕",
                            id: "659befdda5f838b3673796e7",
                        },
                        {
                            name: "张青",
                            id: "659befdda5f838b3673796e8",
                        },
                        {
                            name: "朱瑾",
                            id: "659befdda5f838b3673796ea",
                        },
                        {
                            name: "朱佳玲",
                            id: "659befdda5f838b3673796e9",
                        },
                        {
                            name: "邹圣劭",
                            id: "659befdda5f838b3673796eb",
                        },
                        {
                            name: "朱雪龑",
                            id: "659befdda5f838b3673796b8",
                        },
                        {
                            name: "朱崎泓",
                            id: "659befdda5f838b3673796b6",
                        },
                    ],
                    seq: 1,
                    startDate: "2025/02/10 00:00:00",
                },
            ];

            setTableData(res);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTableData();
    }, []);

    return (
        <div className="evaluate w-full h-full bg-white p-2.5" style={{ height: 'calc(100vh - 90px)' }}>
            <div className="flex justify-end">
                <Button type="primary">创建体系</Button>
            </div>
            <div className="mt-[15px]">
                <Table<DataType>
                    columns={columns}
                    bordered
                    size="middle"
                    dataSource={tableData}
                    pagination={false}
                />
            </div>
        </div>
    );
});

export { System as Component };
