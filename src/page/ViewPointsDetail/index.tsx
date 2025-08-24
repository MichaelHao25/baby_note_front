import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Empty, Radio, Tabs } from "antd";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { Header } from "../../components/Header";
import CardItem from "./components/cardItem";
import data from "./data.json";
import data2 from "./data2.json";
import { useGetMyInfoQuery } from "../../store/apiSlice.ts";
const { RangePicker } = DatePicker;
const Chart1 = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const myChart = useRef<echarts.ECharts>(null);

    const {
        data: myInfo,
        isSuccess: isFetchInfoSuccess,
        refetch: refetchInfo,
    } = useGetMyInfoQuery();

    function configData() {
        if (myChart.current) {
            myChart.current.dispose();
        } // console.log(data,'data')
        const option = {
            legend: {
                data: ["教师", "平均"],
                bottom: 0,
                right: 10,
                itemWidth: 14,
                itemHeight: 14,
            },
            tooltip: {
                trigger: "axis",
            },
            radar: {
                radius: "60%",
                indicator: [
                    {
                        name: "Sales",
                    },
                    {
                        name: "Administration",
                    },
                    {
                        name: "Information",
                    },
                    {
                        name: "Customer",
                    },
                    {
                        name: "Development",
                    },
                    {
                        name: "Marketing",
                    },
                ],
            },
            series: [
                {
                    name: "TeacherRandar",
                    type: "radar",
                    data: [
                        {
                            value: [],
                            name: "教师",
                            areaStyle: {
                                color: "rgba(84,112,198,0.3)",
                            },
                        },
                        {
                            value: [],
                            name: "平均",
                            areaStyle: {
                                color: "rgba(145,204,177,0.3)",
                            },
                        },
                    ],
                },
            ],
        };
        option.legend.data[0] = data[0].teacherName;
        option.series[0].data[0].name = data[0].teacherName;
        option.radar.indicator = data.reduce(function (value, item) {
            value.push({
                name: item.name,
                max: 1,
                color: "#333",
            });
            return value;
        }, []);
        option.series[0].data[0].value = data.reduce(function (value, item) {
            value.push(item.chartScore || 0);
            return value;
        }, []);
        option.series[0].data[1].value = data.reduce(function (value, item) {
            value.push(item.ave || 0);
            return value;
        }, []);

        if (option.radar.indicator.length == 1) {
            // 如果只有一个元素
            option.radar.indicator.push(
                {
                    name: "",
                    max: 1,
                    color: "#333",
                },
                {
                    name: "",
                    max: 1,
                    color: "#333",
                },
                {
                    name: "",
                    max: 1,
                    color: "#333",
                },
            );

            option.series[0].data[0].value.push(0.2, 0.2, 0.2);
            option.series[0].data[1].value.push(0.2, 0.2, 0.2);
        }

        if (option.radar.indicator.length == 2) {
            //如果有两个元素
            option.radar.indicator.splice(1, 0, {
                name: "",
                max: 1,
                color: "#333",
            });
            option.radar.indicator.unshift({
                name: "",
                max: 1,
                color: "#333",
            });

            option.series[0].data[0].value.splice(1, 0, 0.2);
            option.series[0].data[0].value.unshift(0.2);
            option.series[0].data[1].value.splice(1, 0, 0.2);
            option.series[0].data[1].value.unshift(0.2);
        }

        if (chartRef.current) {
            myChart.current = echarts.init(chartRef.current);
            myChart.current.setOption(option);
        }
    }
    useEffect(() => {
        configData();
        const resize = () => {
            if (myChart.current) {
                myChart.current.resize();
            }
        };
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);
    return (
        <div className="bg-white p-4 relative rounded">
            <Title />
            <div className="h-96 w-full" ref={chartRef}></div>
        </div>
    );
};
const Title = () => {
    return (
        <div className="flex gap-2">
            <span className="bg-amber-400 pr-1"></span>
            <h4 className="font-bold">相关量表</h4>
        </div>
    );
};

const Chart2 = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const myChart = useRef<echarts.ECharts>(null);
    const keepTwoDecimals = function keepTwoDecimals(num, degree) {
        if (num == 0) return 0;
        if (degree) return Math.floor(num);
        return Math.round(num * 100) / 100;
    };

    function configData() {
        if (myChart.current) {
            myChart.current.dispose();
        } // console.log(data,'data')
        const degree = "user.appPage.teacherEvaluation.scoreType" == "达成度";
        const option = {
            legend: {
                data: ["我的", "平均"],
            },
            tooltip: {
                trigger: "axis",
                formatter: function formatter(params) {
                    return "<div>\n          <div>"
                        .concat(
                            params[0].axisValue,
                            '</div>\n          <div style="display: flex;align-items: center;gap:4px;width:100%;">\n            <div style="width:8px;height:8px;background:#5470C6;border-radius: 50%;"></div>\n            <div style="flex:1;">',
                        )
                        .concat(
                            params[0].seriesName,
                            '&nbsp;&nbsp;&nbsp;&nbsp;\n              <span style="font-weight:bold;">',
                        )
                        .concat(
                            keepTwoDecimals(Number(params[0].value), degree),
                        )
                        .concat(
                            degree ? "%" : "",
                            '</span>\n            </div>\n          </div>\n          <div style="display: flex;align-items: center;gap:4px;width:100%;">\n            <div style="width:8px;height:8px;background:#91CC75;border-radius: 50%;"></div>\n            <div style="flex:1;">',
                        )
                        .concat(
                            params[1].seriesName,
                            '&nbsp;&nbsp;&nbsp;&nbsp; \n              <span style="font-weight:bold;">',
                        )
                        .concat(
                            keepTwoDecimals(Number(params[0].value), degree),
                        )
                        .concat(
                            degree ? "%" : "",
                            "</span>  \n            </div>\n          </div>\n      </div>",
                        );
                },
            },
            grid: {
                left: "2%",
                right: "2%",
                top: "20%",
                bottom: "8%",
                containLabel: true,
            },
            xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    data: [150, 230, 224, 218, 135, 147, 260],
                    type: "line",
                    name: "我的",
                },
                {
                    data: [150, 230, 220, 210, 135, 147, 260],
                    type: "line",
                    name: "平均",
                },
            ],
        };

        if (degree) {
            option.yAxis = {
                type: "value",
                min: 0,
                max: 100,
                splitNumber: 4,
                interval: 25,
                axisLabel: {
                    show: true,
                    interval: "auto",
                    formatter: "{value} %",
                },
            };
        }
        option.legend.data[0] = data2[0].teacherName;
        option.series[0].name = data2[0].teacherName;
        option.xAxis.data = data2.reduce(function (value, item) {
            value.push(item.start);
            return value;
        }, []);
        option.series[0].data = data2.reduce(function (value, item) {
            value.push(item.score.toFixed(2));
            return value;
        }, []);
        option.series[1].data = data2.reduce(function (value, item) {
            value.push(item.ave.toFixed(2));
            return value;
        }, []);

        if (chartRef.current) {
            myChart.current = echarts.init(chartRef.current);
            myChart.current.setOption(option);
        }
    }
    useEffect(() => {
        configData();
        const resize = () => {
            if (myChart.current) {
                myChart.current.resize();
            }
        };
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);
    return (
        <div className="bg-white p-4 relative rounded">
            <Title />
            <div className="h-96 w-full" ref={chartRef}></div>
        </div>
    );
};
const Table = () => {
    return (
        <div
            className={`
        grid  text-base text-center flex-1 grid-cols-4 border-l border-blue-200 rounded
        *:border-blue-200
        *:border-r
        *:border-b
        *:border-solid
        *:py-2
        *:px-1
        *:flex
        *:items-center
        *:justify-center
        
        `}
        >
            <div className="bg-blue-50 border-t sticky top-10">层次1</div>
            <div className="bg-blue-50 border-t sticky top-10">层次2</div>
            <div className="bg-blue-50 border-t sticky top-10">次数</div>
            <div className="bg-blue-50 border-t sticky top-10">积点</div>
            <div className="col-span-2 ">总计</div>
            <div>0</div>
            <div>0</div>
            <div className="row-span-7">德育与育德</div>
            <div>获得荣誉</div>
            <div>-</div>
            <div>-</div>
            <div>润德于心</div>
            <div>-</div>
            <div>-</div>
            <div>育人导行</div>
            <div>-</div>
            <div>-</div>
            <div>安全责任</div>
            <div>-</div>
            <div>-</div>
            <div>辐射引领</div>
            <div>-</div>
            <div>-</div>
            <div>勤勉敬业</div>
            <div>-</div>
            <div>-</div>
            <div>乐于奉献</div>
            <div>-</div>
            <div>-</div>
            <div className="row-span-8">教学与科研</div>
            <div>实践教学</div>
            <div>-</div>
            <div>-</div>
            <div>专业研修</div>
            <div>-</div>
            <div>-</div>
            <div>质量保证（语、数、英、体育学科）</div>
            <div>-</div>
            <div>-</div>
            <div>质量保证（音、美、科技学科）</div>
            <div>-</div>
            <div>-</div>
            <div>规范教学</div>
            <div>-</div>
            <div>-</div>
            <div>学生获奖</div>
            <div>-</div>
            <div>-</div>
            <div>课题研究</div>
            <div>-</div>
            <div>-</div>
            <div>专业成果</div>
            <div>-</div>
            <div>-</div>
            <div className="row-span-2 ">团队与合作</div>
            <div>团结爱校</div>
            <div>-</div>
            <div>-</div>
            <div>工会活动</div>
            <div>-</div>
            <div>-</div>
            <div>特色项目</div>
            <div>特色项目</div>
            <div>-</div>
            <div>-</div>
        </div>
    );
};
export const ViewPointsDetail = () => {
    const {
        data: myInfo,
    } = useGetMyInfoQuery();

    return (
        <div className="h-full flex flex-col">
            <Header title={myInfo?.data?.name} />
            <div className="border-t border-solid border-gray-200 pt-2 flex-1 flex flex-col h-1">
                <div className="w-full px-4">
                    <Tabs
                        items={[{ key: "1", tabKey: "1", label: "评价体系" }]}
                        className={`[&>.ant-tabs-nav]:mb-0!`}
                        tabBarExtraContent={{
                            right: (
                                <div className="flex gap-2">
                                    <RangePicker />
                                    <Button type="primary">下载归档数据</Button>
                                </div>
                            ),
                        }}
                    ></Tabs>
                </div>
                <div className="flex-1 h-1 flex p-4 bg-gray-200">
                    <div className="flex-1 flex bg-white rounded-lg p-4">
                        <div className="overflow-y-auto flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="sticky top-0 bg-white pb-2">
                                        <Radio.Group>
                                            <Radio.Button value="large">
                                                看数据分析
                                            </Radio.Button>
                                            <Radio.Button value="default">
                                                看评价标准
                                            </Radio.Button>
                                        </Radio.Group>
                                    </div>
                                    <Table />
                                </div>
                                <div>
                                    <div className="flex flex-row gap-2 items-center justify-between pb-2">
                                        <h3
                                            className="text-lg font-bold"
                                            style={{
                                                background:
                                                    "linear-gradient(to right,var(--color-amber-300),var(--color-amber-300)) left bottom/100% 10px no-repeat",
                                            }}
                                        >
                                            实践教学
                                        </h3>
                                        <div>
                                            <Radio.Group>
                                                <Radio.Button value="large">
                                                    数据分析
                                                </Radio.Button>
                                                <Radio.Button value="default">
                                                    相关记录
                                                </Radio.Button>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                    <div className="border border-blue-200 bg-blue-50 rounded px-4 pb-4">
                                        <div className="pt-4">
                                            <div className="bg-white rounded p-4">
                                                <Title />
                                                <div className="flex justify-start pt-4">
                                                    <div
                                                        className=" group
                                                  border-blue-200 bg-blue-50 rounded-lg p-2 flex gap-10 border-solid border
                                                  cursor-pointer
                                                  items-center
                                                  relative
                                                  hover:bg-blue-500
                                                  hover:text-white
                          "
                                                    >
                                                        <span className="flex gap-2 items-center">
                                                            <span className="w-2 border border-blue-200 border-solid h-2 rounded-full bg-amber-500 group-hover:border-white"></span>
                                                            实践教学
                                                        </span>
                                                        <span className="group-hover:invisible">
                                                            0次
                                                        </span>
                                                        <span className="invisible group-hover:visible absolute right-4">
                                                            <PlusCircleOutlined />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <Chart1 />
                                        </div>
                                        <div className="pt-4">
                                            <Chart2 />
                                        </div>
                                        <div className="pt-4">
                                            <div className="bg-white rounded p-4">
                                                <Empty description="暂无数据哦~" />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <div className="bg-white rounded p-4 flex flex-row gap-4 flex-wrap">
                                                <CardItem />
                                                <CardItem />
                                                <CardItem />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ViewPointsDetail as Component };
