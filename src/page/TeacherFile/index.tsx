import { memo, useEffect, useRef, useState } from "react";
import { Button, DatePicker, Empty, Input, Spin } from "antd";
import dayjs from "dayjs";
import type { AreaItem, RecordItem } from "./type.ts";
import type { YearItem } from "../Evaluationdetails/type.ts";
import areaList from "./areaData.json";
import yearList from "./yearData.json";
import recordInfo from "./recordData.json";
import CardItem from "./components/cardItem.tsx";
import titleIcon from "../../assets/img/eval-modal-icon.png";
import titleIcon2 from "../../assets/img/record-icon.png";
import titleIcon3 from "../../assets/img/progress-icon.png";
import "./index.css";
import DownloadModal from "./components/downloadModal.tsx";
import { DownloadOutlined } from "@ant-design/icons";
import {
    useGetCategoriesQuery,
    useGetSubjectsQuery,
} from "../../store/apiSlice.ts";

const { RangePicker } = DatePicker;

const TeacherFile = memo(() => {
    const [areaData, setAreaData] = useState<AreaItem[]>([]);
    const [curArea, setCurArea] = useState(-1);
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
    const downloadModalRef = useRef<any>(null);

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

    const fetchAreaList = async () => {
        try {
            const res = areaList;
            setAreaData(res);
            setCurArea(res[0].id);
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
            const res = {
                ...recordInfo,
                criterionDatas: recordInfo.criterionDatas.filter(
                    (item) => item.record.length,
                ),
            };

            setTimeout(() => {
                setLoading(false);
                setRecordData(res);
            }, 1200);
        } catch (err) {
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        // fetchAreaList();
        fetchYearList();
        // fetchSubjectList();
        fetchRecordData();
    }, []);

    useEffect(() => {
        if (isFetchCategoriesSuccess && categories) {
            setAreaData([
                { id: undefined, name: "全领域" },
                ...categories.data,
            ]);
            setCurArea(undefined);
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
        <div
            className="flex w-full bg-white"
            style={{ height: "calc(100vh - 80px)" }}
        >
            <div className="w-[300px] border-r border-[#e8eaee] p-[15px]">
                <div className="text-[#333]">筛选查看内容</div>

                <div className="mt-[15px]">
                    <div className="text-[#999]">评价体系</div>
                    <div className="flex flex-wrap mt-[10px]">
                        <Button
                            type={"primary"}
                            className="mr-[5px] mb-[5px]"
                            onClick={() => {
                                fetchRecordData();
                            }}
                        >
                            评价体系
                        </Button>
                    </div>
                </div>

                <div className="mt-[15px]">
                    <div className="text-[#999]">领域</div>
                    <div className="flex flex-wrap mt-[10px]">
                        {areaData.map((item) => {
                            return (
                                <Button
                                    type={
                                        curArea === item.id
                                            ? "primary"
                                            : "default"
                                    }
                                    key={item.id}
                                    className="mr-[5px] mb-[5px]"
                                    onClick={() => {
                                        setCurArea(item.id);
                                        fetchRecordData();
                                    }}
                                >
                                    {item.name}
                                </Button>
                            );
                        })}
                    </div>
                </div>

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
                                        fetchTableData();
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
                    <div className="border-l-[3px] border-[#ffaa2e] pl-[10px] font-semibold flex items-center justify-between">
                        <div className="flex items-center">
                            <span>参与教师</span>
                            <span className="mx-[10px]">
                                {recordData?.participation}
                            </span>
                            <Input.Search
                                placeholder="请输入教师姓名搜索"
                                style={{ width: "220px" }}
                            />
                        </div>
                        <div>
                            <Button type="primary" className="mr-[10px]">
                                下载教师发展报告
                            </Button>
                            <Button type="primary">下载归档档案袋</Button>
                        </div>
                    </div>

                    <div className="mt-[15px]">
                        {recordData?.criterionDatas?.length ? (
                            recordData?.criterionDatas?.map((item, idx) => {
                                return (
                                    <div className="mb-[15px] last-of-type:mb-0">
                                        <div
                                            className="flex items-center p-[10px] rounded-[8px] bg-[#deeafd] record-title"
                                            key={item.criterionId}
                                        >
                                            <img
                                                src={getTitleIcon(idx)}
                                                alt=""
                                                className="w-[30px] h-[30px] mr-[10px]"
                                            />
                                            <span className="text-[15px] w-[100px]">
                                                {item.criterionName}
                                            </span>

                                            <span className="text-[14px] ml-[50px]">
                                                提交教师{" "}
                                                {item.submitTeacherCount}
                                            </span>
                                            <span className="text-[14px] ml-[20px]">
                                                记录数 {item.size}
                                            </span>
                                        </div>
                                        <div className="mt-[15px] flex flex-wrap">
                                            {item.record?.map((item) => {
                                                return (
                                                    <CardItem
                                                        data={item}
                                                        key={item.id}
                                                    />
                                                );
                                            })}
                                        </div>
                                        {item.record.length >= 3 && (
                                            <div className="flex justify-end">
                                                <a
                                                    className="text-[#5d98ed]"
                                                >
                                                    {"查看更多>>"}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="w-full h-[700px] flex justify-center items-center">
                                <Empty description="暂无数据哦~" />
                            </div>
                        )}
                    </div>
                </Spin>
            </div>

            <DownloadModal
                onRef={downloadModalRef}
                callBack={() => {
                    downloadModalRef.current?.close();
                }}
            />

            <div
                className="absolute top-4 right-2 flex w-[130px] h-[36px] border-[2px] border-[#1f8dff] rounded-[18px] bg-[#ecf4fd] items-center cursor-pointer"
                onClick={() => {
                    downloadModalRef.current?.open();
                }}
            >
                <div className="w-[36px] h-[36px] bg-[#1f8dff] flex justify-center items-center rounded-[18px]">
                    <DownloadOutlined style={{ color: "#fff" }} />
                </div>
                <div className="text-center ml-[10px]">下载管理</div>
            </div>
        </div>
    );
});

export { TeacherFile as Component };
