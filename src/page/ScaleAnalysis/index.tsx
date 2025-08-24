import { memo, useEffect, useState } from "react";
import {
    Button,
    Cascader,
    DatePicker,
    Empty,
    Input,
    Select,
    Spin,
    Table,
} from "antd";
import dayjs from "dayjs";
import type { RecordItem, ScaleItem } from "./type.ts";
import type { YearItem } from "../Evaluationdetails/type.ts";
import scaleList from "./scaleData.json";
import yearList from "./yearData.json";
import recordInfo from "./recordData.json";
import titleIcon from "../../assets/img/eval-modal-icon.png";
import titleIcon2 from "../../assets/img/record-icon.png";
import titleIcon3 from "../../assets/img/progress-icon.png";
import toggleIcon from "../../assets/img/examine-toggle-icon.png";
import "./index.css";
import {
    useGetCategoriesQuery,
    useGetSubjectsQuery,
} from "../../store/apiSlice.ts";

const { RangePicker } = DatePicker;

const ScaleAnalysis = memo(() => {
    const [scaleData, setScaleData] = useState<ScaleItem[]>([]);
    const [curScale, setCurScale] = useState([]);
    const [yearData, setYearData] = useState<YearItem[]>([]);
    const [curYear, setCurYear] = useState(1970);
    const [subjectData, setSubjectData] = useState<any[]>([]);
    const [curSubject, setCurSubject] = useState("");
    const [recordData, setRecordData] = useState<RecordItem>(null);

    const { data: categories, isSuccess: isFetchCategoriesSuccess } =
        useGetCategoriesQuery({
            schoolCode: "RBI850",
        });
    const { data: subjects, isSuccess: isFetchSubjectsSuccess } =
        useGetSubjectsQuery();

    const [loading, setLoading] = useState(false);

    const dimensionColumns = [
        {
            title: "评价纬度",
            dataIndex: "name",
            align: "center",
            width: 300,
            key: "name",
        },
        {
            title: "",
            dataIndex: "levels",
            key: "levels",
            render: (_, record) => {
                return (
                    <div className="flex">
                        {record.levels.map((item, idx) => {
                            console.log("record", record);
                            return (
                                <div
                                    className="mr-[10px] flex p-[5px] rounded-[4px] w-[120px] justify-between"
                                    style={{
                                        background: record?.indexMap?.[idx]
                                            ? "#678bfa"
                                            : "#ededed",
                                        color: record?.indexMap?.[idx]
                                            ? "#fff"
                                            : "#000",
                                    }}
                                >
                                    <span>{item.level}</span>
                                    <span>
                                        {record?.indexMap?.[idx]
                                            ? record?.indexMap?.[idx] + "次"
                                            : ""}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
    ];
    const [dimensionData, setDimensionData] = useState([]);

    const teacherColumns = [
        {
            title: "教师",
            dataIndex: "teacherIdName",
            align: "center",
            width: 300,
            key: "teacherIdName",
        },
        {
            title: "评论次数",
            dataIndex: "evalCount",
            align: "center",
            width: 120,
            key: "evalCount",
            sorter: (a, b) => a.evalCount - b.evalCount,
        },
        {
            title: "平均值",
            dataIndex: "avg",
            align: "center",
            width: 120,
            key: "avg",
            sorter: (a, b) => a.avg - b.avg,
        },
        {
            title: "最高值",
            dataIndex: "max",
            align: "center",
            width: 120,
            key: "max",
            sorter: (a, b) => a.max - b.max,
        },
        {
            title: "最低值",
            dataIndex: "min",
            align: "center",
            width: 120,
            key: "min",
            sorter: (a, b) => a.min - b.min,
        },
        {
            title: "总值",
            dataIndex: "sum",
            align: "center",
            key: "sum",
            sorter: (a, b) => a.sum - b.sum,
        },
    ];
    const [teacherData, setTeacherData] = useState([]);

    const dateFormat = "YYYY-MM-DD";
    const [date, setDate] = useState([
        dayjs("2015/01/01", dateFormat),
        dayjs("2015/01/01", dateFormat),
    ]);

    const iconMaps = {
        "0": titleIcon,
        "1": titleIcon2,
        "2": titleIcon3,
    };
    const getTitleIcon = (index: number) => {
        return iconMaps?.[index] || titleIcon;
    };

    const fetchScaleList = async () => {
        try {
            const res = scaleList;
            setScaleData(res);
            // setCurScale(res[0].id);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchYearList = async () => {
        try {
            const res = yearList;
            setCurYear(res[0].year);
            setYearData(res);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSubjectList = async () => {
        try {
            const res = [
                "语文",
                "数学",
                "英语",
                "道法",
                "体育",
                "体健",
                "唱游",
                "音乐",
                "美术",
                "信息科技",
                "探究",
                "科技",
                "拓展",
                "拓展（体）",
                "拓展（心）",
                "拓展（科）",
            ];
            setCurSubject(res[0]);
            setSubjectData(res);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRecordData = async () => {
        try {
            setLoading(true);
            const res = recordInfo;

            setTimeout(() => {
                setLoading(false);
                setRecordData(res);
                setDimensionData(res?.dimensionTree || []);
                setTeacherData(res?.teacherData || []);
            }, 1200);
        } catch (err) {
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        // fetchScaleList();
        fetchYearList();
        // fetchSubjectList();
        fetchRecordData();
    }, []);

    useEffect(() => {
        if (isFetchCategoriesSuccess && categories) {
            setScaleData(categories.data);
            setCurScale(categories.data[0].id);
        }
    }, [isFetchCategoriesSuccess, categories]);

    useEffect(() => {
        if (isFetchSubjectsSuccess && subjects) {
            setSubjectData([
                { id: undefined, name: "全学科" },
                ...subjects.data,
            ]);
            setCurSubject("全学科");
        }
    }, [isFetchSubjectsSuccess, subjects]);

    return (
        <div className="flex bg-white" style={{ height: "calc(100vh - 80px)" }}>
            <div className="w-[300px] border-r border-[#e8eaee] p-[15px]">
                <div className="text-[#333]">筛选分析范围</div>

                <div className="mt-[15px]">
                    <div className="text-[#999]">时段</div>
                    <div className="flex flex-wrap mt-[10px]">
                        <RangePicker
                            value={date}
                            format={dateFormat}
                            onChange={(dates) => {
                                setDate(dates);
                            }}
                        />
                    </div>
                </div>

                <div className="mt-[15px]">
                    <div className="text-[#999]">量表</div>
                    <div className="flex flex-wrap mt-[10px]">
                        <Cascader
                            prefix={
                                <img
                                    src={toggleIcon}
                                    className="w-[24px] rounded-[12px]"
                                />
                            }
                            options={scaleData}
                            value={curScale}
                            style={{ width: "250px" }}
                            fieldNames={{
                                label: "name",
                                value: "id",
                                children: "childs",
                            }}
                            onChange={(ids, items) => {
                                setCurScale(ids);
                            }}
                            placeholder="请选择"
                        />
                    </div>
                </div>

                <div className="mt-[15px]">
                    <div className="text-[#999]">年级</div>
                    <div className="flex flex-wrap mt-[10px]">
                        {yearData.map((item) => {
                            return (
                                <Button
                                    type={
                                        curYear === item.year
                                            ? "primary"
                                            : "default"
                                    }
                                    key={item.year}
                                    className="mr-[5px] mb-[5px]"
                                    onClick={() => {
                                        setCurYear(item.year);
                                        fetchRecordData();
                                    }}
                                >
                                    {item.grade}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-[15px]">
                    <div className="text-[#999]">学科</div>
                    <div className="flex flex-wrap mt-[10px]">
                        {subjectData.map((item) => {
                            return (
                                <Button
                                    type={
                                        curSubject === item.name
                                            ? "primary"
                                            : "default"
                                    }
                                    key={item.id}
                                    className="mr-[5px] mb-[5px]"
                                    onClick={() => {
                                        setCurSubject(item.name);
                                    }}
                                >
                                    {item.name}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex-1 p-[15px] main-content overflow-auto">
                <Spin spinning={loading} delay={500}>
                    <div className="mt-[15px]">
                        {recordData && Object.keys(recordData).length ? (
                            <div>
                                <div className="border-b border-[#e7e7e7] pb-[20px]">
                                    <div className="font-semibold flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="border-l-[3px] border-[#ffaa2e] pl-[10px]">
                                                评价分布
                                            </span>
                                        </div>
                                        <div>
                                            <Button
                                                type="primary"
                                                className="mr-[10px]"
                                            >
                                                下载教师一人一表
                                            </Button>
                                            <Button type="primary">
                                                下载统计报表
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-[15px]">
                                        <Table
                                            dataSource={dimensionData}
                                            columns={dimensionColumns}
                                            bordered
                                            size="small"
                                            pagination={false}
                                        />
                                    </div>
                                </div>

                                <div className="pt-[15px]">
                                    <div className="font-semibold flex items-center justify-between">
                                        <div className="flex items-center justify-between">
                                            <span className="border-l-[3px] border-[#ffaa2e] pl-[10px]">
                                                评价详情
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-[70px]">筛选</div>
                                            <Select
                                                defaultValue="0"
                                                style={{
                                                    width: 120,
                                                    margin: "0 15px",
                                                }}
                                                options={[
                                                    {
                                                        value: "0",
                                                        label: "只看汇总",
                                                    },
                                                    {
                                                        value: "1",
                                                        label: "只看评价详情",
                                                    },
                                                    {
                                                        value: "2",
                                                        label: "看所有",
                                                    },
                                                ]}
                                            />
                                            <Input.Search placeholder="搜索老师" />
                                        </div>
                                    </div>
                                    <div className="mt-[15px]">
                                        <Table
                                            dataSource={teacherData}
                                            columns={teacherColumns}
                                            bordered
                                            size="small"
                                            pagination={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-[700px] flex justify-center items-center">
                                <Empty description="暂无数据哦~" />
                            </div>
                        )}
                    </div>
                </Spin>
            </div>
        </div>
    );
});

export { ScaleAnalysis as Component };
