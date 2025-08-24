import { memo, useEffect, useRef, useState } from "react";
import { Select, DatePicker, Button, Table, type TableColumnsType } from "antd";
import {
    CaretDownOutlined,
    FormOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { RecordItem, UserInfoType } from "./type.ts";
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
import EditModal from "./components/editModal.tsx";

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

const MyPersonalData = memo(() => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState<UserInfoType>(null);
    const dateFormat = "YYYY-MM-DD";
    const [date, setDate] = useState([
        dayjs("2015/01/01", dateFormat),
        dayjs("2015/01/01", dateFormat),
    ]);

    const addRecordModalRef = useRef<any>(null);
    const createLatitudeModalRef = useRef<any>(null);
    const editModalRef = useRef<any>(null);

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

    const [tabs] = useState([
        {
            code: "0",
            label: "自主提交",
            items: [
                {
                    label: "次数",
                    num: 0,
                },
                {
                    label: "指标覆盖率",
                    num: "0",
                },
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
                {
                    label: "指标覆盖率",
                    num: "0",
                },
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
                {
                    label: "被退回",
                    num: 0,
                },
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

    const fetchUserInfo = async () => {
        try {
            const res = {
                id: "659c32c710674979b4641445",
                createDate: "2024/01/11 11:52:58",
                education: 5,
                age: 94665600000,
                teachAges: [
                    {
                        startDate: 757353600000,
                    },
                ],
                userId: "659befdda5f838b3673796b6",
                schoolCode: "RBI850",
                ageNumber: 52,
                teachNumber: 377,
                computeCriterionId: ["659c32ea4413762a879c3a56"],
                type: 1,
                computeCriterionName: ["评价体系"],
                userName: "朱崎泓",
                url: "https://yxyspbase.yxuer.com/common-head.png",
                gender: "女",
                userPower: {
                    grades: ["一年级", "五年级", "三年级", "二年级", "四年级"],
                    subjects: [
                        "科技",
                        "拓展（体）",
                        "语文",
                        "英语",
                        "唱游",
                        "美术",
                        "拓展",
                        "音乐",
                        "道法",
                        "拓展（心）",
                        "体育",
                        "信息科技",
                        "探究",
                        "数学",
                        "体健",
                        "拓展（科）",
                    ],
                },
                joinType: 1,
                useComputCriterionMap: {
                    "659c32ea4413762a879c3a56": true,
                },
            };
            setUserInfo(res);
        } catch (err) {
            console.error(err);
        }
    };

    const formatTeachNumber = (teachNumber: number) => {
        const year = Math.floor(teachNumber / 12).toFixed(0);
        const month = teachNumber % 12;

        return `${year}年${month}月`;
    };

    const fetchTableData = () => {
        const pieDataTemp = JSON.parse(JSON.stringify(fetchData.pie));

        let myEvaluation = {};
        myEvaluation["singPieData"] = fetchData.pie[0];
        const tableData = pieDataTemp.find(function (item) {
            return item.id == myEvaluation.singPieData.id;
        });

        setMyEvaluation(myEvaluation);

        console.log("tableData", tableData);
        console.log("fetchData", fetchData);
        setDataSource(tableData.children);
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
        fetchUserInfo();
        fetchTableData();
        fetchRecordList();
    }, []);

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
                                onClick={() => {
                                    editModalRef.current?.open(userInfo);
                                }}
                            />
                        </div>
                        <div>
                            <span className="text-xl font-semibold">
                                {userInfo?.userName}
                            </span>
                            <img src={divider} className="w-[130px] mt-[0px]" />
                            <div className="flex mt-[5px]">
                                <div className="rounded-[4px] text-[14px] bg-[#edf1f9] px-[8px] py-[5px]">
                                    学历：本科
                                </div>
                                <div className="rounded-[4px] text-[14px] bg-[#edf1f9] px-[8px] py-[5px] ml-[10px]">
                                    教龄：
                                    {formatTeachNumber(userInfo?.teachNumber)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="header-plan">
                        {/*<div*/}
                        {/*  className="ml-[15px] w-[120px] h-[122px] flex flex-col justify-center items-center border border-[#d6d9df] bg-[#f4f7fe] rounded-xl add-btn"*/}
                        {/*  onClick={() => {*/}
                        {/*    addRecordModalRef.current?.open(recordList);*/}
                        {/*  }}*/}
                        {/*>*/}
                        {/*  <div className="icon w-[24px] h-[24px] bg-[#4085ea] rounded-[12px] flex items-center justify-center">*/}
                        {/*    <PlusOutlined style={{ color: "#fff" }} />*/}
                        {/*  </div>*/}
                        {/*  <div className="icon-active w-[24px] h-[24px] bg-[#fff] rounded-[12px] flex items-center justify-center">*/}
                        {/*    <PlusOutlined style={{ color: "#4085ea" }} />*/}
                        {/*  </div>*/}
                        {/*  <div className="add-btn-title mt-[5px]">添加记录</div>*/}
                        {/*</div>*/}
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

                <div className="flex pt-[15px] px-[10px]">
                    <div className="w-[500px] px-[15px] border-r border-[#e9e9e9]">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start">
                                <CaretDownOutlined className="mt-[5px]" />
                                <span className="ml-[10px]">积点分布</span>
                            </div>
                            <Button type="primary">积点详情</Button>
                        </div>
                        <div className="w-full h-[400px]">
                            {Object.keys(myEvaluation.singPieData).length && (
                                <PointPieChart
                                    single={false}
                                    seriesData={[myEvaluation.singPieData]}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex-1 px-[15px]">
                        <div>
                            <Button type="primary" shape="round">
                                教学与科研
                            </Button>
                        </div>
                        <div className="flex mt-[10px]">
                            <div className="w-[300px] h-[200px]">
                                {Object.keys(myEvaluation.singPieData)
                                    .length && (
                                    <PointPieChart
                                        single
                                        seriesData={[myEvaluation.singPieData]}
                                    />
                                )}
                            </div>
                            <div className="w-[930px]">
                                <Table<DataType>
                                    columns={columns}
                                    dataSource={dataSource}
                                    bordered
                                    rowKey="id"
                                    scroll={{ y: 320 }}
                                    pagination={false}
                                    size="small"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*<AddRecordModal*/}
            {/*  onRef={addRecordModalRef}*/}
            {/*  callBack={(info) => {*/}
            {/*    addRecordModalRef?.current?.close();*/}

            {/*    info && createLatitudeModalRef.current?.open(info);*/}
            {/*  }}*/}
            {/*/>*/}

            {/*<CreateLatitudeModal onRef={createLatitudeModalRef} callBack={() => {}} />*/}

            <EditModal
                onRef={editModalRef}
                callBack={() => {
                    editModalRef.current?.close();
                }}
            />
        </div>
    );
});

export { MyPersonalData as Component };
