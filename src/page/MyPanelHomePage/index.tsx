import { memo, useEffect, useRef, useState } from "react";
import { Select, DatePicker, Button, Table, type TableColumnsType } from "antd";
import {
    CaretDownOutlined,
    FormOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { RecordItem } from "./type.ts";
import divider from "../../assets/img/user-divider.png";
import avatar from "../../assets/img/user-avatar.png";
import toggleIcon from "../../assets/img/examine-toggle-icon.png";
import authIcon from "../../assets/img/auth-icon.png";
import PointPieChart from "./components/pointPieChart.tsx";
import fetchData from "./data.json";
import recordListData from "./recordList.json";
import "./index.css";
import AddRecordModal from "./components/addRecordModal.tsx";
import CreateLatitudeModal from "./components/createLatitudeModal.tsx";
import { useNavigate } from "react-router";
import {
    useAddRecordMutation, useGetGradeListQuery,
    useGetMyInfoQuery, useGetTotalNumQuery,
} from "../../store/apiSlice.ts";
import type { MyInfoResponse } from "../../types/api.ts";

const { RangePicker } = DatePicker;

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    street: string;
    building: string;
    number: number;
    companyAddress: string;
    companyName: string;
    gender: string;
}

type UserInfo = MyInfoResponse;

const MyPanelHomePage = memo(() => {
    const navigate = useNavigate();

    const {
        data: myInfo,
        isSuccess: isFetchInfoSuccess,
        refetch: refetchInfo,
    } = useGetMyInfoQuery();

    const [addRecord, { isSuccess: isAddSuccess }] = useAddRecordMutation();

    const [userInfo, setUserInfo] = useState<UserInfo>(null);
    const dateFormat = "YYYY-MM-DD";
    const [date, setDate] = useState([
        dayjs("2015/01/01", dateFormat),
        dayjs("2015/01/01", dateFormat),
    ]);

    const addRecordModalRef = useRef<any>(null);
    const createLatitudeModalRef = useRef<any>(null);

    const { data: totalRes, isSuccess: isFetchTotalSuccess, refetch: refetchTabs } = useGetTotalNumQuery();

    const columns: TableColumnsType<DataType> = [
        {
            title: "教学与科研具体情况",
            children: [
                {
                    title: "类目",
                    dataIndex: "name",
                    key: "name",
                    align: "center",
                    width: 150,
                },
                {
                    title: "次数",
                    dataIndex: "count",
                    key: "count",
                    align: "center",
                    width: 150,
                },
                {
                    title: "积点",
                    dataIndex: "score",
                    key: "score",
                    align: "center",
                    width: 150,
                },
            ],
        },
    ];

    const [dataSource, setDataSource] = useState([]);

    const [tabs, setTabs] = useState([
        {
            code: "0",
            label: "自主提交",
            items: [
                {
                    label: "次数",
                    num: 0,
                },
                // {
                //     label: "指标覆盖率",
                //     num: "0",
                // },
            ],
            icon: toggleIcon,
            bg: "#eaf1fd",
            hoverBg: "#d8e6f9",
        },
        {
            code: "1",
            label: "被他人评价",
            items: [
                {
                    label: "次数",
                    num: 0,
                },
                // {
                //     label: "指标覆盖率",
                //     num: "0",
                // },
            ],
            icon: toggleIcon,
            bg: "#eaf1fd",
            hoverBg: "#d8e6f9",
        },
        {
            code: "2",
            label: "评价他人",
            items: [
                {
                    label: "次数",
                    num: 0,
                },
            ],
            icon: toggleIcon,
            bg: "#eaf1fd",
            hoverBg: "#d8e6f9",
        },
        {
            code: "3",
            label: "待审核",
            items: [
                {
                    label: "次数",
                    num: 0,
                },
                // {
                //     label: "被退回",
                //     num: 0,
                // },
            ],
            icon: authIcon,
            bg: "#fff7f1",
            hoverBg: "#ffe6d5",
        },
    ]);
    const [curTab, setCurTab] = useState(tabs[0].code);

    const [myEvaluation, setMyEvaluation] = useState({
        singPieData: {},
    });

    const [recordList, setRecordList] = useState<RecordItem[]>([]);

    const formatTeachNumber = (teachNumber: number) => {
        const year = Math.floor(teachNumber / 12).toFixed(0);
        const month = teachNumber % 12;

        return `${year}年${month}月`;
    };

    var color = [
        "rgba(84, 112, 198, ",
        "rgba(238, 102, 102, ",
        "rgba(59, 162, 114, ",
        "rgba(252, 132, 82, ",
        "rgba(154, 96, 180, ",
    ];
    const setPieData = function setPieData(result) {
        // 计算获取总点数
        var count = 0;
        result.forEach(function (item) {
            item.children.forEach(function (item1) {
                item1.score = Number(item1.score);
                count = count + item1.score;
            }); // 将二级指标的分数相加到一级指标上面，前端加不规范，要改

            item.score = item.children.reduce(function (value, item1) {
                value += item1.score;
                return value;
            }, 0);
        }); // 过滤空数据

        result.forEach(function (item) {
            item.children = item.children.filter(function (item1) {
                return item1.score;
            });
        });
        result = result.filter(function (item) {
            return item.score;
        });
        result.forEach(function (item, index) {
            // 给饼图设置最小角度
            item.children.forEach(function (item1, index1) {
                if (item1.score < (count / 360) * 20)
                    item1.score = (count / 360) * 20;
            });
            item.score = item.children.reduce(function (value, item) {
                value += item.score;
                return value;
            }, 0);
        });
        var colorClearList = ["0.8", "0.65"];
        result.forEach(function (item, index) {
            item.value = item.score;
            item.itemStyle = {
                color: color[index % 5] + "1)",
            };
            item.children.forEach(function (item1, index1) {
                item1.value = item1.score;
                item1.itemStyle = {
                    color: color[index % 5] + colorClearList[index1 % 2] + ")",
                };
            });
        });
        return result;
    }; // 创建记录相关

    const fetchTableData = () => {
        const res = { result: fetchData };
        const pieDataTemp = JSON.parse(JSON.stringify(fetchData.pie));

        let myEvaluation = {};
        myEvaluation["countPieData"] = [];

        setTimeout(() => {
            myEvaluation["findEvalueSum"] = res.result;
            res.result.pie = setPieData(res.result.pie);
            myEvaluation["countPieData"] = res.result.pie;
            myEvaluation["systemCount"] = myEvaluation["countPieData"].reduce(
                function (value, item) {
                    value += item.score;
                    return value;
                },
                0,
            );

            if (res.result.pie.length > 0) {
                myEvaluation["singPieData"] = res.result.pie[0];
                myEvaluation["tableData"] = pieDataTemp.find(function (item) {
                    return item.id == myEvaluation["singPieData"].id;
                });
            }

            setMyEvaluation(myEvaluation);

            setDataSource(myEvaluation["tableData"].children);
        });
    };

    const fetchRecordList = async () => {
        try {
            const res = recordListData;
            setRecordList(res);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTableData();
        fetchRecordList();
    }, []);

    useEffect(() => {
        if (isFetchInfoSuccess && myInfo) {
            setUserInfo(myInfo.data);
        }
    }, [isFetchInfoSuccess, myInfo]);

    useEffect(() => {
        if (totalRes?.data && isFetchTotalSuccess) {
            const newTabs =  tabs.map((item, idx) => {
                item.items[0].num = totalRes?.data[idx + 1];
                return {
                    ...item,
                }
            })
            setTabs(newTabs);
        }
    }, [totalRes, isFetchTotalSuccess])

    return (
        <div className="w-full h-full bg-[#f0f2f7] p-[15px] overflow-y-auto">
            <div className="h-[145px] bg-white relative w-[960px]">
                <div className="header-container">
                    <div className="tips"></div>
                    <div className="header-user h-full flex items-center">
                        <div className="relative">
                            <img
                                src={avatar}
                                className="w-[100px] h-[100px] rounded-[50px]"
                            />
                            <FormOutlined
                                className="absolute right-0 top-0"
                                style={{ color: "#cac5c6", cursor: "pointer" }}
                            />
                        </div>
                        <div className='mt-[-40px]'>
                            <span className="text-xl font-semibold">
                                {userInfo?.name}
                            </span>
                            <img src={divider} className="w-[130px] mt-[0px]" />
                            <div className="flex mt-[5px]">
                                {/*<div className="rounded-[4px] text-[14px] bg-[#edf1f9] px-[8px] py-[5px]">*/}
                                {/*    学历：本科*/}
                                {/*</div>*/}
                                {/*<div className="rounded-[4px] text-[14px] bg-[#edf1f9] px-[8px] py-[5px] ml-[10px]">*/}
                                {/*  教龄：{formatTeachNumber(userInfo?.teachNumber)}*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                    <div className="header-plan">
                        <div
                            className="ml-[15px] w-[120px] h-[122px] flex flex-col justify-center items-center border border-[#d6d9df] bg-[#f4f7fe] rounded-xl add-btn"
                            onClick={() => {
                                addRecordModalRef.current?.open();
                            }}
                        >
                            <div className="icon w-[24px] h-[24px] bg-[#4085ea] rounded-[12px] flex items-center justify-center">
                                <PlusOutlined style={{ color: "#fff" }} />
                            </div>
                            <div className="icon-active w-[24px] h-[24px] bg-[#fff] rounded-[12px] flex items-center justify-center">
                                <PlusOutlined style={{ color: "#4085ea" }} />
                            </div>
                            <div className="add-btn-title mt-[5px]">
                                添加记录
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-[25px] bg-white rounded-[5px] p-[15px]">
                <div className="flex items-center pb-[15px] border-b border-[#e8eaee]">
                    <div className="bg-[#e6f0fe] text-[#0066f8] p-[8px] rounded-[3px] text-[14px] mr-[20px]">
                        评价体系
                    </div>
                    <Select
                        defaultValue="0"
                        style={{ width: 90 }}
                        options={[
                            { value: "0", label: "当期" },
                            { value: "1", label: "生涯" },
                        ]}
                    />
                    <RangePicker
                        value={date}
                        style={{ marginLeft: "15px" }}
                        onChange={(dates) => {
                            setDate(dates);
                        }}
                    />
                </div>

                <div className="mt-[15px] flex pb-[15px] border-b border-[#e4e7eb]">
                    {tabs.map((item) => {
                        return (
                            <div
                                className={`toggle-item w-[200px] mr-[15px] p-[10px] rounded-[8px]${item.label === curTab ? " toggle-item-active" : ""}`}
                                key={item.code}
                                style={{ background: item.bg }}
                                onClick={() => {
                                    // setCurTopTab(item.id);
                                    // fetchMainData();
                                    navigate("/teacherDevelop/myEvaluation");
                                }}
                            >
                                <div className="toggle-item-title flex">
                                    <img
                                        src={item.icon}
                                        className="w-[24px] h-[24px] rounded-[12px]"
                                        alt=""
                                    />
                                    <span className="ml-[8px]">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="toggle-item-content rounded-[10px] mt-[10px] bg-[#fff] flex p-[3px]">
                                    {item.items?.length === 1 ? (
                                        <>
                                            <div className="text-center flex-1">
                                                <div className="text-[18px] mt-[5px]">
                                                    {item?.items?.[0]?.num}
                                                </div>
                                                <div className="text-[12px]">
                                                    {item?.items?.[0]?.label}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-center flex-1 border-solid border-r border-[#f1f6fe]">
                                                <div className="text-[18px] mt-[5px]">
                                                    {item?.items?.[0]?.num}
                                                </div>
                                                <div className="text-[12px]">
                                                    {item?.items?.[0]?.label}
                                                </div>
                                            </div>
                                            <div className="text-center flex-1">
                                                <div className="text-[18px] mt-[5px]">
                                                    {item?.items?.[1]?.num}%
                                                </div>
                                                <div className="text-[12px]">
                                                    {item?.items?.[1]?.label}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/*<div className="flex pt-[15px] px-[10px]">*/}
                {/*    <div className="w-[500px] px-[15px] border-r border-[#e9e9e9]">*/}
                {/*        <div className="flex items-start justify-between">*/}
                {/*            <div className="flex items-start">*/}
                {/*                <CaretDownOutlined className="mt-[5px]" />*/}
                {/*                <span className="ml-[10px]">积点分布</span>*/}
                {/*            </div>*/}
                {/*            <Button*/}
                {/*                type="primary"*/}
                {/*                onClick={() => {*/}
                {/*                    navigate(*/}
                {/*                        "/teacherDevelop/viewPointsDetail",*/}
                {/*                    );*/}
                {/*                }}*/}
                {/*            >*/}
                {/*                积点详情*/}
                {/*            </Button>*/}
                {/*        </div>*/}
                {/*        <div className="w-full h-[400px]">*/}
                {/*            {Object.keys(myEvaluation.singPieData).length && (*/}
                {/*                <PointPieChart*/}
                {/*                    single={false}*/}
                {/*                    seriesData={[myEvaluation.singPieData]}*/}
                {/*                />*/}
                {/*            )}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="flex-1 px-[15px]">*/}
                {/*        <div>*/}
                {/*            <Button type="primary" shape="round">*/}
                {/*                教学与科研*/}
                {/*            </Button>*/}
                {/*        </div>*/}
                {/*        <div className="flex mt-[10px]">*/}
                {/*            <div className="w-[300px] h-[200px]">*/}
                {/*                {Object.keys(myEvaluation.singPieData)*/}
                {/*                    .length && (*/}
                {/*                    <PointPieChart*/}
                {/*                        single*/}
                {/*                        seriesData={[myEvaluation.singPieData]}*/}
                {/*                    />*/}
                {/*                )}*/}
                {/*            </div>*/}
                {/*            <div className="w-[930px]">*/}
                {/*                <Table<DataType>*/}
                {/*                    columns={columns}*/}
                {/*                    dataSource={dataSource}*/}
                {/*                    bordered*/}
                {/*                    rowKey="id"*/}
                {/*                    scroll={{ y: 320 }}*/}
                {/*                    pagination={false}*/}
                {/*                    size="small"*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

            <AddRecordModal
                onRef={addRecordModalRef}
                callBack={(info) => {
                    addRecordModalRef?.current?.close();

                    info && createLatitudeModalRef.current?.open(info);
                }}
            />

            <CreateLatitudeModal
                onRef={createLatitudeModalRef}
                callBack={(type, payload) => {
                    if (type === "change") {
                        createLatitudeModalRef.current?.close();
                        setTimeout(
                            () => addRecordModalRef.current?.open(),
                            100,
                        );
                    } else {
                        addRecord({
                            schoolCode: "RBI850",
                            criterionId: payload.criterionId,
                            subject: "",
                            userId: "659befdda5f838b3673796b6",
                            // levelSum: "4",
                            score: null,
                            attributes: [
                                ...payload?.attrList.map((i) => ({
                                    ...i,
                                    criterionAttrId: "659c93c310674979b46414bc",
                                    type: i.focusIndex,
                                    value: i.value,
                                    options: i.options,
                                })),
                            ],
                            scores: payload?.teacherScoreJsons,
                            teacherDimensionDataJsons: [],
                            dataTime: new Date(payload.date).getTime(),
                            description: payload.desc,
                            isLoading: true,
                        });
                        createLatitudeModalRef.current?.close();
                        refetchInfo();
                        refetchTabs();
                    }
                }}
            />
        </div>
    );
});

export { MyPanelHomePage as Component };
