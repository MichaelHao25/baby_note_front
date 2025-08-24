import { memo, useEffect, useRef, useState } from "react";
import { Button, DatePicker, Spin, Table, Select, type TableProps } from "antd";
import dayjs from "dayjs";
import type { AreaItem } from "../TeacherFile/type.ts";
import type { YearItem } from "../Evaluationdetails/type.ts";
import areaList from "./areaData.json";
import yearList from "./yearData.json";
import rightInfo from "./rightData.json";
import type { ColumnsType } from "./type.ts";
import LineChart from "./components/lineChart.tsx";
import PieChart from "./components/pieChart.tsx";
import {
    useGetCategoriesQuery,
    useGetSubjectsQuery,
} from "../../store/apiSlice.ts";

// import './index.css';

const { RangePicker } = DatePicker;

const EvaluateResults = memo(() => {
    const [areaData, setAreaData] = useState<AreaItem[]>([]);
    const [curArea, setCurArea] = useState(-1);
    const [yearData, setYearData] = useState<YearItem[]>([]);
    const [curYear, setCurYear] = useState(1970);
    const [subjectData, setSubjectData] = useState<any[]>([]);
    const [curSubject, setCurSubject] = useState("");

    const { data: categories, isSuccess: isFetchCategoriesSuccess } =
        useGetCategoriesQuery({
            schoolCode: "RBI850",
        });
    const { data: subjects, isSuccess: isFetchSubjectsSuccess } =
        useGetSubjectsQuery();

    // const [recordData, setRecordData] = useState<RecordItem>(null);
    const [lineOption, setLineOption] = useState({
        grid: {
            left: "2%",
            right: "2%",
            top: "20%",
            bottom: "8%",
            containLabel: true,
        },
        legend: {
            icon: "roundRect",
            show: true,
            data: [],
        },
        xAxis: {
            type: "category",
            data: [],
        },
        yAxis: {
            type: "value",
            axisLabel: {},
            splitLine: {
                lineStyle: {
                    type: "dashed",
                    width: 1,
                },
                show: true,
            },
            min: 0,
            max: 5,
            splitNumber: 5,
        },
        series: [
            // {
            //     "name": "德育与育德",
            //     "type": "line",
            //     "label": {
            //         "show": true
            //     },
            //     "data": [
            //         1,
            //         6
            //     ]
            // },
            // {
            //     "name": "教学与科研",
            //     "type": "line",
            //     "label": {
            //         "show": true
            //     },
            //     "data": [
            //         30,
            //         1
            //     ]
            // },
            // {
            //     "name": "团队与合作",
            //     "type": "line",
            //     "label": {
            //         "show": true
            //     },
            //     "data": [
            //         1,
            //         0
            //     ]
            // },
            // {
            //     "name": "特色项目",
            //     "type": "line",
            //     "label": {
            //         "show": true
            //     },
            //     "data": [
            //         0,
            //         0
            //     ]
            // }
        ],
    });
    const [pieOption, setPieOption] = useState({
        title: {
            text: "总计",
            subtext: 3,
            textStyle: {
                fontSize: 20,
                color: "#333",
                lineHeight: 20,
            },
            subtextStyle: {
                fontSize: 22,
                color: "#333",
            },
            textAlign: "center",
            left: "17%",
            top: "42%",
        },
        tooltip: {
            trigger: "item",
        },
        legend: {
            type: "scroll",
            orient: "vertical",
            right: "3%",
            top: "center",
            data: [],
        },
        series: [
            {
                name: "姓名",
                type: "pie",
                radius: [55, 70],
                center: ["18%", "50%"],
                label: {
                    show: false,
                },
                itemStyle: {
                    borderWidth: 3,
                    borderColor: "#fff",
                },
                data: [],
            },
        ],
    });

    const handleLineChart = () => {
        const dataList = rightInfo
            .map((item) => Object.values(item.dataMap))
            .flat();
        const xAxisData = Object.keys(rightInfo[0].dataMap);
        const lineData = rightInfo.map((item) => {
            return {
                name: item.dimensionName,
                data: Object.values(item.dataMap),
            };
        });
        const legend = rightInfo.map((item) => item.dimensionName);

        lineOption.series = [];
        lineData.forEach(function (item) {
            // dataList.push.apply(dataList, (0, toConsumableArray.Z)(item.data));
            lineOption.series.push({
                name: item.name,
                type: "line",
                label: {
                    show: true,
                },
                data: item.data,
            });
        });
        const max = Math.max.apply(Math, dataList);
        lineOption.yAxis.max = max ? Math.ceil(max / 5) * 5 : 5;
        lineOption.xAxis.data = xAxisData;
        lineOption.legend.data = legend;

        setLineOption(lineOption);

        // if (document.getElementById('line-chart-123')) {
        //     myChartRef.current = init(document.getElementById('line-chart-123'));
        //     myChartRef.current?.on('legendselectchanged', function (event) {
        //         // emits('legendClick', event.selected);
        //         console.log('legendClick')
        //     });
        //     myChartRef.current.setOption(option, true);
        // }
    };

    const handlePieChart = () => {
        console.log(rightInfo);
        const legend = rightInfo.map((item) => {
            const name = item.dimensionName;
            const dataStrArr = item.dataStr.split("-");

            return `${name} ${dataStrArr[0]}人/${dataStrArr[1]}条`;
        });
        const series = rightInfo.map((item, idx) => {
            const values = Object.values(item.dataMap);

            return {
                name: legend[idx],
                value: values.reduce((preValue, item) => preValue + item, 0),
            };
        });

        const subtext = series.reduce(
            (preValue, item) => preValue + item.value,
            0,
        );

        pieOption.series[0].data = series;
        pieOption.title.subtext = subtext;
        pieOption.legend.data = legend;

        setPieOption(pieOption);
    };

    const [dataSource, setDataSource] = useState([
        {
            key: "1",
            name: "胡彦斌",
            age: 32,
            address: "西湖区湖底公园1号",
        },
        {
            key: "2",
            name: "胡彦祖",
            age: 42,
            address: "西湖区湖底公园1号",
        },
    ]);

    const initColumns = [
        {
            title: "被评老师",
            dataIndex: "teacher",
            align: "center",
            key: "teacher",
        },
        {
            title: "小计",
            dataIndex: "ave",
            align: "center",
            key: "ave",
            sorter: (a, b) => a?.ave - b?.ave,
        },
    ];
    const [columns, setColumns] = useState<TableProps<ColumnsType>["columns"]>(
        [],
    );

    const [loading, setLoading] = useState(false);

    const dateFormat = "YYYY-MM-DD";
    const [date, setDate] = useState([
        dayjs("2015/01/01", dateFormat),
        dayjs("2015/01/01", dateFormat),
    ]);

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

    const fetchTableData = async () => {
        try {
            setDataSource([]);
            setLoading(true);

            handleLineChart();
            handlePieChart();

            const lastColumns = rightInfo.map((item, index) => {
                return {
                    title: item.dimensionName,
                    dataIndex: `dimensionName${index + 1}`,
                    key: `dimensionName${index + 1}`,
                    align: "center",
                    sorter: (a, b) =>
                        a?.[`dimensionName${index + 1}`] -
                        b?.[`dimensionName${index + 1}`],
                };
            });
            setColumns([...initColumns, ...lastColumns]);
            const tableData = rightInfo[0]?.childs?.[0]?.teachers.map(
                (item) => {
                    return {
                        teacher: item?.name,
                    };
                },
            );

            rightInfo.forEach((item, index) => {
                item.teachers.forEach((tea, idx) => {
                    tableData[idx][`dimensionName${index + 1}`] = tea.sumScore;
                    if (index === 1) {
                        tableData[idx][`ave`] = item.ave;
                    }
                });
            });

            setTimeout(() => {
                setLoading(false);
                setDataSource(tableData);
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
        fetchTableData();
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
            className="flex bg-white"
            style={{ height: "calc(100vh - 100px)", overflow: "hidden" }}
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
                                fetchTableData();
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
                                        fetchTableData();
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
                                        fetchTableData();
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
            <div className="flex-1 px-[15px] main-content overflow-auto">
                <Spin spinning={loading} delay={500}>
                    <div className="font-semibold flex items-center justify-between sticky h-[50px] top-0 bg-white z-50">
                        <div className="flex items-center">
                            <span className="pl-[10px] border-l-[3px] border-[#ffaa2e] ">
                                评价体系
                            </span>
                        </div>
                        <div>
                            <Button
                                color="primary"
                                className="mr-[10px]"
                                variant="outlined"
                            >
                                {"查看教师组 >>"}
                            </Button>
                            <Button type="primary">下载数据汇总表</Button>
                        </div>
                    </div>

                    <div className="mt-[15px] flex">
                        <div className="w-[400px] h-[300px]">
                            <PieChart options={pieOption} />
                        </div>
                        <div className="flex-1 h-[300px]  ml-[15px]">
                            <div className="flex items-center ml-[35px]">
                                <span className="mr-[10px]">趋势查看</span>
                                <Select
                                    defaultValue="0"
                                    style={{ width: 120 }}
                                    onChange={() => {
                                        fetchTableData();
                                    }}
                                    options={[
                                        { value: "0", label: "按月" },
                                        { value: "1", label: "按学期" },
                                        { value: "2", label: "按学年" },
                                    ]}
                                />
                            </div>
                            <div className="flex-1 h-full ml-[15px]">
                                <LineChart options={lineOption} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-[15px]">
                        <Table
                            size="small"
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                            bordered
                        />
                    </div>
                </Spin>
            </div>
        </div>
    );
});

export { EvaluateResults as Component };
