import { memo, useEffect, useRef, useState } from "react";
import { Button, Select, Table, Tooltip } from "antd";
import type { SubjectItem, YearItem } from "../Evaluationdetails/type.ts";
import EvaluateModal from "./components/evaluateModal.tsx";
import subjectData from "./subject.json";
import yearData from "./yearData.json";
import data from "./data.json";
import { CopyOutlined, LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import "./index.css";

const BatchEvaluate = memo(() => {
    const navigate = useNavigate();
    const [yearList, setYearList] = useState<YearItem[]>([]);
    const [subjectList, setSubjectList] = useState<SubjectItem[]>([]);
    const evalModalRef = useRef<any>(null);

    const [dataSource, setDataSource] = useState([]);
    const [levelList] = useState([
        {
            code: "A",
            label: "A",
        },
        {
            code: "A-",
            label: "A-",
        },
        {
            code: "B",
            label: "B",
        },
        {
            code: "B-",
            label: "B-",
        },
        {
            code: "C",
            label: "C",
        },
    ]);

    const initColumns = [
        {
            title: "教师",
            dataIndex: "name",
            key: "name",
            align: "center",
            render: (_, record) => {
                return (
                    <div className="relative w-full h-full teacher-name px-[8px] py-[10px]">
                        <div className="absolute left-[0px] top-[0px] text-[12px] py-[1px] px-[2px] bg-[#ff4040] text-[#fff] cursor-pointer clear-btn">
                            清空
                        </div>
                        <div>{record.name}</div>
                        <div className="absolute right-[0px] top-[0px] text-[12px] py-[1px] px-[2px] bg-[#409eff] text-[#fff] cursor-pointer copy-btn">
                            复制
                        </div>
                    </div>
                );
            },
        },
    ];
    const [columns, setColumns] = useState([]);

    const fetchYearList = async () => {
        try {
            const list = yearData;
            setYearList(list);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSubjectList = async () => {
        try {
            const list = subjectData;
            setSubjectList(list);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTableData = async () => {
        try {
            const res = data;
            const newColumns = res.dimensionTree.map((item) => {
                return {
                    title: item.name,
                    align: "center",
                    dataIndex: item.id,
                    key: item.id,
                    render: (text, record) => {
                        return (
                            <Tooltip
                                title={
                                    <div className="w-[230px] h-[150px] bg-[#252525]">
                                        {levelList.map((item) => {
                                            return (
                                                <Button
                                                    className="mr-[15px] mb-[10px]"
                                                    style={{ width: "60px" }}
                                                >
                                                    {item.label}
                                                </Button>
                                            );
                                        })}

                                        <div className="cursor-pointer flex items-center p-[6px] hover:bg-[#333]">
                                            <CopyOutlined />
                                            <span className="ml-[10px]">
                                                结果同步给该列所有的人
                                            </span>
                                        </div>
                                        <div className="cursor-pointer items-center p-[6px] hover:bg-[#333]">
                                            <CopyOutlined />
                                            <span className="ml-[10px]">
                                                结果同步给该未评价的人
                                            </span>
                                        </div>
                                    </div>
                                }
                                placement="right"
                            >
                                <div className="w-full h-full px-[12px] py-[20px] table-item">
                                    {text}
                                </div>
                            </Tooltip>
                        );
                    },
                };
            });
            setColumns([...initColumns, ...newColumns]);
            const newData = [];
            res.teachers.forEach((tea, index) => {
                const teacherRow = {};
                newColumns.forEach((col, idx) => {
                    teacherRow[col.key] =
                        res.dimensionTree[idx]?.comments?.[index];
                    teacherRow["name"] = tea.teacherIdName;
                });
                newData.push(teacherRow);
            });

            setDataSource(newData);
            console.log("newData", newData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSubjectList();
        fetchYearList();
        fetchTableData();
    }, []);

    return (
        <div className="w-full h-full bg-[#f2f4f8]">
            <div className="w-full h-[40px] bg-white flex items-center px-[5px] border-b border-px border-[#ebedf0]">
                <Button
                    color="default"
                    variant="text"
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    <LeftOutlined />
                    返回
                </Button>

                <div className="flex-1 text-center ml-[-200px]">上课</div>
            </div>

            <div className="p-[15px]">
                <div className="bg-white p-[15px]">
                    <div className="flex items-center justify-between">
                        <div className="flex">
                            <div className="flex items-center justify-between">
                                <span className="mr-[5px]">轮次</span>
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    style={{ width: "180px" }}
                                    options={[
                                        { value: "1", label: "第一轮" },
                                        { value: "2", label: "第二轮" },
                                        { value: "3", label: "第三轮" },
                                    ]}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="mx-[5px]">年级</span>
                                <Select
                                    showSearch
                                    style={{ width: "180px" }}
                                    placeholder="请选择"
                                >
                                    {yearList.map((item) => {
                                        return (
                                            <Select.Option
                                                key={item.grade}
                                                value={item.grade}
                                            >
                                                {item.grade}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="mx-[5px]">学科</span>
                                <Select
                                    showSearch
                                    style={{ width: "180px" }}
                                    placeholder="请选择"
                                >
                                    {subjectList.map((item) => {
                                        return (
                                            <Select.Option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.subject}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Button
                                type="primary"
                                onClick={() => evalModalRef.current?.open()}
                            >
                                Excel批量导入
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-[15px] w-full teacher-table">
                    <Table
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        scroll={{ y: 765 }}
                        size="small"
                    />
                </div>
            </div>

            <EvaluateModal
                onRef={evalModalRef}
                callBack={() => {
                    evalModalRef.current?.close();
                }}
            />
        </div>
    );
});

export { BatchEvaluate as Component };
