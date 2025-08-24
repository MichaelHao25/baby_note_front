import { memo, useEffect, useRef, useState } from "react";
import { Button, Tabs, Table, Tag, Select, type TableProps } from "antd";
import SortModal from "./components/sortModal.tsx";
import { useNavigate } from "react-router";
import {
    useGetCategoriesQuery,
    useGetEvaluateListQuery,
} from "../../store/apiSlice.ts";
import { focusStatusOptions, focusTypeOptions } from "../ScaleCreate/config.ts";

interface TabItem {
    code: string;
    label: string;
    num?: number;
}

export interface DataType {
    evaluationType: number;
    number: number;
    evaluations: any[];
    criterionId: string;
    subjects: any[];
    viewType: number;
    name: string;
    reviewTeachers: string[];
    reviewStatus: number;
    id: string;
    type: number;
    seq: number;
}

const Evaluate = memo(() => {
    const navigate = useNavigate();

    const [tabs, setTabs] = useState<TabItem[]>([]);
    const [curTab, setCurTab] = useState(0);
    const [curType, setCurType] = useState(-1);
    const [curStatus, setCurStatus] = useState(0);

    const {
        data: evaluateList,
        isLoading: evaluateListLoading,
        isSuccess: isFetchListSuccess,
        refetch: refetchEvaluateList,
    } = useGetEvaluateListQuery({
        focusStatus: curStatus,
        focusType: curType,
        parendId: curTab,
        schoolCode: "RBI850",
    });

    const {
        data: categories,
        isLoading: categoriesIsLoading,
        isSuccess: isFetchCategoriesSuccess,
        refetch: refetchCategories,
    } = useGetCategoriesQuery({
        schoolCode: "RBI850",
    });

    const sortModalRef = useRef<any>(null);

    const columns: TableProps<DataType>["columns"] = [
        {
            title: "子分类",
            dataIndex: "groupName",
            key: "groupName",
            align: "center",
            render: (text, row) => {
                const el = (
                    <div className="w-full h-full">
                        <span>{text}</span>
                        <Tag
                            color="gold"
                            className="absolute top-[1px] right-[-5px]"
                            style={{ position: "absolute", cursor: "pointer" }}
                            onClick={() => {
                                const list = tableData.filter(
                                    (item) => item.groupName === row.groupName,
                                );
                                sortModalRef.current?.open(row, list);
                            }}
                        >
                            排序
                        </Tag>
                    </div>
                );

                return {
                    children: el,
                    props: {
                        rowSpan: row.rowSpan,
                    },
                };
            },
        },
        {
            title: "量表",
            dataIndex: ["scaleName"],
            align: "center",
            key: "name",
        },
        {
            title: "类型",
            dataIndex: ["focusType"],
            align: "center",
            key: "focusType",
            render: (text, row) => {
                const title = text == "0" ? "自评" : "他评";
                return (
                    <div className="relative w-full">
                        <span>{title}</span>
                        <Tag
                            color="gold"
                            className="absolute top-[-12px] right-[-15px]"
                            style={{ position: "absolute" }}
                        >
                            {title}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: "被评选人",
            dataIndex: ["evaluationTeachersName"],
            align: "center",
            key: "evaluationTeachersName",
            render: (_, record) => (
                <>
                    <span>{record.evaluationTeachersName?.join("、") || '-'}</span>
                </>
            ),
        },
        {
            title: "评价人/审核人",
            dataIndex: ["checkTeacherName"],
            align: "center",
            key: "checkTeacherName",
            render: (_, record) => (
                <>
                    <span>{record.checkTeacherName?.join("、")}</span>
                </>
            ),
        },
        {
            title: "操作",
            key: "action",
            align: "center",
            render: (_, record) => (
                <>
                    <a>复制</a>
                    <a
                        className="ml-[10px]"
                        onClick={() => {
                            navigate(`/scaleCreate?id=${record.id}`);
                        }}
                    >
                        编辑
                    </a>
                </>
            ),
        },
    ];

    const [tableData, setTableData] = useState([]);

    const handleTableData = (tabs: any[], curCode: number) => {
        const curChilds = tabs.find((item) => item.code === curCode)?.childs || [];

        const processedData = curChilds.reduce((acc, group) => {
            const groupName = group.name;
            let list = group.list;
            if (curType != -1) {
                list = list.filter((item) => item.focusType == curType);
            }

            list.forEach((item, index) => {
                acc.push({
                    ...item,
                    groupName,
                    rowSpan: index === 0 ? list.length : 0, // 第一个元素设置合并行数
                });
            });

            return acc;
        }, []);

        setTableData(processedData);
    };

    // useEffect(() => {
    //     if (categories && isFetchCategoriesSuccess) {
    //         const list = categories.data;
    //         const newTabs = list.map((item) => ({
    //             code: item.id,
    //             label: item.name,
    //         }));
    //         setTabs(newTabs);
    //         setCurTab(newTabs[0]?.code);
    //     }
    // }, [isFetchCategoriesSuccess, categories]);

    useEffect(() => {
        if (evaluateList?.data && isFetchListSuccess) {
            const list = evaluateList.data;
            let newTabs = list.map((item) => ({
                code: item.id,
                label: item.name,
                ...item,
            }));
            newTabs = newTabs.filter(item => item.childs);
            setTabs(newTabs);
            setCurTab(curTab || newTabs[0]?.code);

            handleTableData(newTabs, curTab || newTabs[0]?.code);
        }
    }, [isFetchListSuccess, evaluateList]);

    useEffect(() => {
        refetchEvaluateList();
    }, [curType, curStatus]);

    // useEffect(() => {
    //     refetchEvaluateList();
    // }, []);

    return (
        <div
            className="evaluate w-full bg-white p-2.5"
            style={{ height: "calc(100vh - 150px)" }}
        >
            <div>
                <Tabs
                    type="card"
                    tabBarExtraContent={
                        <Button type="primary" size="middle">
                            导出量表结构
                        </Button>
                    }
                    onChange={(code) => {
                        setCurTab(code);
                        handleTableData(tabs, code);
                    }}
                    items={tabs.map((item) => {
                        return {
                            label: `${item.label}${item.num ? `(${item.num})` : ""}`,
                            key: item.code,
                            children: (
                                <>
                                    <div className="flex justify-between">
                                        <div className="flex">
                                            <div>
                                                <span className="mr-[5px]">
                                                    类型
                                                </span>
                                                <Select
                                                    defaultValue={curType}
                                                    style={{ width: 120 }}
                                                    onChange={(val) => {
                                                        setCurType(val);
                                                    }}
                                                    fieldNames={{
                                                        label: "name",
                                                        value: "value",
                                                    }}
                                                    options={[
                                                        {
                                                            name: "全部",
                                                            value: -1,
                                                        },
                                                        ...focusTypeOptions,
                                                    ]}
                                                />
                                            </div>
                                            <div className="ml-[15px]">
                                                <span className="mr-[5px]">
                                                    状态
                                                </span>
                                                <Select
                                                    defaultValue={curStatus}
                                                    onChange={(val) => {
                                                        setCurStatus(val);
                                                    }}
                                                    style={{ width: 120 }}
                                                    fieldNames={{
                                                        label: "name",
                                                        value: "value",
                                                    }}
                                                    options={focusStatusOptions}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                navigate("/scaleCreate");
                                            }}
                                        >
                                            添加量表
                                        </Button>
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
                                </>
                            ),
                        };
                    })}
                />
            </div>

            <SortModal onRef={sortModalRef} />
        </div>
    );
});

export { Evaluate as Component };
