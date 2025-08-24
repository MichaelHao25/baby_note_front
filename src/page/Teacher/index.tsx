import { memo, useEffect, useState } from "react";
import { Button, Input, Table, type TableProps } from "antd";
import userAvatar from "../../assets/img/user-avatar.png";
import type { TeacherItem } from "./type.ts";
import {useGetTeacherListQuery} from "../../store/apiSlice.ts";

const Teacher = memo(() => {
    const [searchValue, setSearchValue] = useState('');
    const columns: TableProps<TeacherItem>["columns"] = [
        {
            title: "头像",
            dataIndex: "avatar",
            key: "avatar",
            align: "center",
            render: (_) => {
                return (
                    <div className="flex justify-center">
                        <img src={userAvatar} className="w-[40px]" />
                    </div>
                );
            },
        },
        {
            title: "教师",
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        // {
        //     title: "性别",
        //     dataIndex: "gender",
        //     key: "gender",
        //     align: "center",
        // },
        // {
        //     title: "学历",
        //     dataIndex: "joinType",
        //     key: "joinType",
        //     align: "center",
        //     render: (text, record, index) => <>{"本科"}</>,
        // },
        // {
        //     title: "教龄",
        //     dataIndex: "teachNumber",
        //     key: "teachNumber",
        //     align: "center",
        //     render: (text, record, index) => <>{formatTeachNumber(text)}</>,
        // },
        // {
        //     title: "阶梯",
        //     dataIndex: "",
        //     key: "",
        //     align: "center",
        //     render: (text, record, index) => <>{"-"}</>,
        // },
        {
            title: "班级",
            dataIndex: "orgNum",
            key: "orgNum",
            align: "center",
        },
        {
            title: "年级",
            dataIndex: "grade",
            key: "grade",
            align: "center",
        },
        // {
        //     title: "量表评价体系",
        //     dataIndex: ["computeCriterionName"],
        //     key: "computeCriterionName",
        //     align: "center",
        // },
        {
            title: "学科",
            key: "subject_name",
            align: "center",
            dataIndex: "subject_name",
            render: (_, record) => {
                // const keys = Object.keys(record.showSubjectGradeMap);
                //
                return (
                    <>
                        <span>{record?.subject_name || '-'}</span>
                    </>
                );
            },
        },
        // {
        //     title: "查看权限",
        //     key: "showSubjectGradeMap",
        //     align: "center",
        //     dataIndex: "showSubjectGradeMap",
        //     render: (_, record) => {
        //         // const keys = Object.keys(record.showSubjectGradeMap);
        //
        //         return (
        //             <>
        //                 <span>{"年级学科"}</span>
        //             </>
        //         );
        //     },
        // },
        // {
        //     title: "参与教师发展",
        //     key: "showSubjectGradeMap",
        //     align: "center",
        //     dataIndex: "showSubjectGradeMap",
        //     render: (_, record) => {
        //         // const keys = Object.keys(record.showSubjectGradeMap);
        //
        //         return (
        //             <>
        //                 <span>{"参与"}</span>
        //             </>
        //         );
        //     },
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

    const { data: listRes, refetch: refetchList, isSuccess } = useGetTeacherListQuery({
        name: searchValue
    });

    useEffect(() => {
        if (listRes?.data && isSuccess) {
            if (searchValue) {
                const newData = listRes?.data.filter(item => item.name.includes(searchValue));
                return setTableData(newData);
            }
            setTableData(listRes?.data);
        }
    }, [listRes, isSuccess]);

    return (
        <div
            className="evaluate bg-white"
            style={{ height: "calc(100vh - 70px)", overflow: "hidden" }}
        >
            <div className="flex justify-between items-center px-3 pt-3">
                <Input
                    placeholder="输入教师姓名搜索"
                    style={{ width: "200px" }}
                    value={searchValue}
                    onChange={e => {
                        setSearchValue(e.target.value);
                    }}
                    onBlur={() => {
                        refetchList();
                    }}
                />

                <div className="flex items-center">
                    <Button type="primary">导出教师信息</Button>
                    <Button type="primary" className="ml-[10px]">
                        excel导入信息
                    </Button>
                </div>
            </div>
            <div className="mt-[10px] py-2.5 w-[99%] m-auto">
                <Table<TeacherItem>
                    columns={columns}
                    bordered
                    loading={!isSuccess}
                    size="middle"
                    scroll={{ y: 665 }}
                    dataSource={tableData}
                    pagination={false}
                />
            </div>
        </div>
    );
});

export { Teacher as Component };
