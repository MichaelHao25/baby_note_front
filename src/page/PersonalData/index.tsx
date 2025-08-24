import { RightOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import avatar from "../../assets/img/user-avatar.png";
import SettingModal from "./components/settingModal.tsx";
import "./index.css";
import selectData from "./selectData.json";
import settingInfo from "./settingData.json";
import teacherInfo from "./teacherData.json";
import PieChart from "./components/pieChart.tsx";

const { RangePicker } = DatePicker;

const PersonalData = memo(() => {
    const [yearData, setYearData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);
    const [teacherData, setTeacherData] = useState(null);
    const [settingData, setSettingData] = useState(null);
    const settingModalRef = useRef<any>(null);
    const navigate = useNavigate();
    const [option, setOption] = useState({
        // tooltip: {
        //       trigger: 'item',
        //       formatter: '{b}: {c} ({d}%)' // 这里定义了悬停提示的显示内容
        //   },
        series: [
            {
                type: "pie",
                radius: "50%",
                data: [
                    {
                        value: 1048,
                        name: "Search Engine",
                    },
                    {
                        value: 735,
                        name: "Direct",
                    },
                    {
                        value: 580,
                        name: "Email",
                    },
                    {
                        value: 484,
                        name: "Union Ads",
                    },
                    {
                        value: 300,
                        name: "Video Ads",
                    },
                ],
                label: {
                    formatter: function formatter(params) {
                        var dataTip = params.name.split("（"); // let ret = "";// 拼接加\n返回的类目项
                        // let maxLength = 8;// 每项显示文字个数
                        // let valLength = params.name.length;// X轴类目项的文字个数
                        // let rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
                        // if (rowN > 1) {
                        //   for (let i = 0; i < rowN; i++) {
                        //     let temp = "";// 每次截取的字符串
                        //     let start = i * maxLength;// 开始截取的位置
                        //     let end = start + maxLength;// 结束截取的位置
                        //     // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                        //     temp =  params.name.substring(start, end) + "\n";
                        //     ret += temp; // 凭借最终的字符串
                        //   }
                        //   return ret;
                        // }
                        // return params.name;

                        if (params.name.length < 8) {
                            return params.name;
                        }

                        return dataTip[0] + "\n" + "（" + dataTip[1];
                    },
                    fontSize: 12,
                },
                labelLine: {
                    length: 10,
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
            },
        ],
    });
    const [table, setTable] = useState({
        //表格数据
        tableHead: [
            {
                name: "教龄",
            },
            {
                name: "图标描述",
            },
        ],
        tableData: [],
        tableage: [],
        page: {
            pageSize: 10,
            pageNum: 1,
            configSum: 0,
        },
    });
    const [rolddata, setRolddata] = useState([]);
    const [teacherName, setTeacherName] = useState("");
    const [filterTeacherData, setFilterTeacherData] = useState([]);

    const dateFormat = "YYYY-MM-DD";
    const [date, setDate] = useState([
        dayjs("2015/01/01", dateFormat),
        dayjs("2015/01/01", dateFormat),
    ]);

    const myChart = useRef<any>(null);

    const fetchSelectData = async () => {
        try {
            const res = selectData;
            setYearData(
                res.grades.map((item) => {
                    return { label: item, value: item };
                }),
            );
            setSubjectData(
                res.subjects.map((item) => {
                    return { label: item, value: item };
                }),
            );
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSettingData = async () => {
        try {
            const res = settingInfo;
            setSettingData(res);
        } catch (err) {
            console.error(err);
        }
    };

    const [teacherdata, setTeacherdata] = useState({
        ageChartMap: {},
        //年龄饼图
        degreeChartMap: {},
        //学历饼图
        teachChartMap: {},
        //教龄饼图
        retireCharMap: {},
        //n年退休饼图
        teachers: [], //教师
    });
    const color = [
        "rgba(84, 112, 198)",
        "rgba(238, 102, 102)",
        "rgba(59, 162, 114)",
        "rgba(252, 132, 82)",
        "rgba(154, 96, 180)",
    ];
    const [allDataObject, setAllDataObject] = useState({});
    const [allData, setAllData] = useState<any>(null);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [titleList, setTitleList] = useState<any[]>([]);
    const [sortName, setSortName] = useState("按照姓名排序");
    const [isShow, setIsShow] = useState(false);
    const [titles, setTitles] = useState([
        {
            color: "#4668bb",
            label: "德育与育德",
        },
        {
            color: "#f05a5c",
            label: "教学与科研",
        },
        {
            color: "#2c976a",
            label: "团队与合作",
        },
        {
            color: "#ff774c",
            label: "特色项目",
        },
    ]);
    const fetchTeacherData = async () => {
        try {
            const res = teacherInfo;
            setTeacherData(res);
            setAllData(res);
            setTeachers(res.result.teachers);

            if (res.status == 1) {
                table.tableData = [];
                table.tableage = [];
                teacherdata.teachers = [];
                setAllDataObject(res.result);
                teacherdata.ageChartMap = res.result.ageChartMap;
                teacherdata.degreeChartMap = res.result.degreeChartMap;
                teacherdata.teachChartMap = res.result.teachChartMap;
                teacherdata.retireCharMap = res.result.retireCharMap;

                console.log("teacherdata---", teacherdata);
                const newTitleList = {};
                res.result.titles.forEach(function (item, index) {
                    newTitleList[item] = color[index % 5];
                });
                setTitleList(newTitleList);
                res.result.teachers.sort(function (a, b) {
                    if (setSortName("按照姓名排序")) {
                        return a.userName
                            .substring(0, 1)
                            .localeCompare(
                                b.userName.substring(0, 1),
                                "zh-Hans-CN",
                            );
                    } else {
                        return Number(b.score) - Number(a.score);
                    }
                });
                res.result.teachers.forEach(function (item) {
                    item.pieData = [];
                    item.treeNodes.forEach(function (i) {
                        if (i.score > 0)
                            item.pieData.push({
                                value: parseInt(i.score),
                                name: parseInt(i.score),
                                itemStyle: {
                                    color: titleList[i.name],
                                },
                            });
                    });
                });
                teacherdata.teachers = res.result.teachers.filter(
                    function (item) {
                        return item.userName.includes(teacherName);
                    },
                );
                setFilterTeacherData(
                    JSON.parse(JSON.stringify(res.result.teachers)),
                );
                var arr = []; //teacherList-教师列表，sortList-排序列表

                if (res.result.teachChartMap) {
                    arr.push({
                        title: "教龄分布",
                        data: res.result.teachChartMap,
                        type: "teachNamesMap",
                        teacherList: res.result.teachNamesMap,
                        sortList: res.result.teachSort,
                    });
                }

                if (res.result.ageChartMap) {
                    arr.push({
                        title: "年龄分布",
                        data: res.result.ageChartMap,
                        type: "ageNamesMap",
                        teacherList: res.result.ageNamesMap,
                        sortList: res.result.ageSort,
                    });
                }

                arr.push({
                    title: "学历分布",
                    data: res.result.degreeChartMap,
                    type: "degreeNameChartMap",
                    teacherList: res.result.degreeNameChartMap,
                    sortList: res.result.degreeSort,
                });

                if (res.result.retireCharMap) {
                    arr.push({
                        title: "".concat(
                            res.result.retireCharAge,
                            "\u5E74\u5185\u6559\u5E08\u9000\u4F11",
                        ),
                        data: res.result.retireCharMap,
                        type: "",
                        teacherList: res.result.genderRetireNamesCharMap,
                        sortList: res.result.genderRetireSort,
                    });
                }

                arr.push({
                    title: "\u6027\u522B\u5206\u5E03",
                    data: res.result.genderCharMap,
                    type: "genderNamesCharMap",
                    teacherList: res.result.genderNamesCharMap,
                    sortList: res.result.genderSort,
                });

                setTeacherData(teacherdata);
                setTeacherdata(teacherdata);

                console.log("teacherdata", teacherdata);
                // ishow.value = true;
                setIsShow(true);
                // ishowtime.value = false;
                // isshow.value = false;
                // input.value = '';
                // input1.value = '';
                // input2.value = '';
                // rolddata.value = arr;

                console.log("arr", arr);
                setRolddata(arr);
            } else {
                setIsShow(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSelectData();
        fetchTeacherData();
        fetchSettingData();
    }, []);

    return (
        <div
            className="w-full h-full bg-white rounded-[8px] p-[15px] overflow-y-auto"
            style={{ height: "calc(100vh - 70px)" }}
        >
            <div className="w-full font-semibold flex items-center justify-between sticky h-[40px] top-[-20px] bg-white z-50">
                <div className="flex items-center">
                    <span className="pl-[10px] border-l-[3px] border-[#ffaa2e] ">
                        教师分布
                    </span>
                    <Select
                        defaultValue="一年级"
                        style={{ width: 100 }}
                        options={yearData}
                    />
                    <Select
                        defaultValue="语文"
                        style={{ width: 100 }}
                        options={subjectData}
                    />
                </div>
                <div>
                    <Button
                        type="primary"
                        onClick={() =>
                            settingModalRef.current?.open(settingData)
                        }
                    >
                        高级设置
                    </Button>
                </div>
            </div>

            <div className="mt-[15px]">
                <div className="flex flex-wrap">
                    {rolddata.map((item) => {
                        return (
                            <div className="w-[450px] h-[300px] mr-[10px] mt-[10px]">
                                <PieChart
                                    options={option}
                                    list={item.data}
                                    clickItem={(item) => {
                                        console.log(item);
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="w-full font-semibold flex items-center justify-between sticky h-[40px] top-[-20px] bg-white z-50 mt-[15px]">
                <div className="flex items-center pt-[15px] border-b border-[#e8eaee] w-full">
                    <div className="pl-[10px] border-l-[3px] border-[#ffaa2e] w-38">
                        教师列表 ({teachers?.length}人)
                    </div>
                    <Input
                        placeholder="请输入教师姓名来查找"
                        style={{ width: "180px" }}
                    />
                </div>
            </div>
            <div className="py-[15px] border-b border-[#e8eaee]">
                <div className="flex items-center ">
                    <div className="bg-[#e6f0fe] text-[#0066f8] p-[8px] rounded-[3px] text-[14px] mr-[20px]">
                        评价体系
                    </div>

                    <RangePicker
                        value={date}
                        style={{ marginLeft: "15px" }}
                        onChange={(dates) => {
                            setDate(dates);
                        }}
                    />
                </div>

                <div className="flex items-center mt-[15px]">
                    {titles.map((item) => {
                        return (
                            <div
                                key={item.label}
                                className="mr-[15px] flex items-center"
                            >
                                <div
                                    className="w-[35px] h-[20px] rounded-[5px]"
                                    style={{ background: item.color }}
                                ></div>
                                <div className="text-[16px] ml-[5px]">
                                    {item.label}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex items-center">
                        <span className="mr-[8px]">排序</span>
                        <Select style={{ width: "150px" }} defaultValue={1}>
                            <Select.Option value={1}>
                                按照姓名排序
                            </Select.Option>
                            <Select.Option value={2}>
                                按照积分排序
                            </Select.Option>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="mt-[15px] flex flex-wrap">
                {teacherdata?.teachers?.map((item) => {
                    return (
                        <div
                            className="teacher-card-item mr-[15px] mb-[15px]"
                            key={item.id}
                            onClick={() => {
                                navigate(
                                    `/teacherDevelopSchool/Mypersonaldata?id=${item.id}`,
                                );
                            }}
                        >
                            <div className="teacher-card-left">
                                <div className="teacher-avatar relative flex-col justify-center">
                                    <img
                                        src={avatar}
                                        alt=""
                                        className="w-[64px]"
                                    />
                                    <div className="w-[24px] h-[24px] rounded-[12px] bg-[#ff5b5c] text-[#fff] text-[12px] text-center leading-[24px] absolute right-5 bottom-0">
                                        {item?.gender}
                                    </div>
                                </div>
                                <div className="text-center ml-[-16px] text-[14px] mt-[12px] font-semibold">
                                    {item?.userName}
                                </div>
                                <div className="mt-[5px] text-[#6b798f] text-[14px]">
                                    <div>学历：本科</div>
                                    <div>年龄：{item.ageNumber}</div>
                                    <div>
                                        教龄：
                                        {Math.floor(item.teachNumber / 12)}年
                                    </div>
                                </div>
                            </div>
                            <div className="line"></div>
                            <div className="teacher-card-right flex-1">
                                <div className="pie-chart">
                                    <PieChart options={option} list={item} />
                                </div>
                                <div className="flex justify-between px-[20px]">
                                    <div className="flex bottom">
                                        <div className="flex">
                                            <div className="text text-[#a3a2a1] text-[12px]">
                                                得点数
                                            </div>
                                            <div>3.5</div>
                                        </div>
                                    </div>
                                    <RightOutlined />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <SettingModal
                onRef={settingModalRef}
                callBack={() => {
                    settingModalRef.current?.close();
                }}
            />
        </div>
    );
});

export { PersonalData as Component };
