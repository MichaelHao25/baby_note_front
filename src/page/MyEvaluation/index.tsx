import { memo, useEffect, useRef, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Button, DatePicker, Empty, Input, Pagination, Select } from "antd";
import { useNavigate } from "react-router";
import toggleIcon from "../../assets/img/examine-toggle-icon.png";
import authIcon from "../../assets/img/auth-icon.png";
import searchListData from "./searchList.json";
import CardItem from "./components/cardItem.tsx";
import EvalModal from "./components/evalModal.tsx";
import {
    useGetRecordListQuery, useGetTotalNumQuery,
    useUpdateRecordMutation,
} from "../../store/apiSlice.ts";

const { RangePicker } = DatePicker;

const MyEvaluation = memo(() => {
    const navigate = useNavigate();

    const [pageParams, setPageParams] = useState({
        page: 1,
        size: 12,
        total: 0,
    });
    const { data: listRes, refetch: refetchList } = useGetRecordListQuery({
        page: pageParams.page,
        pageSize: pageParams.size
    });
    const [updateRecord, { isSuccess: isChangeSuccess }] = useUpdateRecordMutation();

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

    const [searchList] = useState(
        searchListData.map((item) => ({ value: item.id, label: item.name })),
    );

    const { data: totalRes, isSuccess: isFetchTotalSuccess, refetch: refetchTabs } = useGetTotalNumQuery();
    const [fetchData, setFetchData] = useState();

    const evalModalRef = useRef<any>(null);

    useEffect(() => {
        if (listRes?.data) {
            setFetchData(listRes.data.data || []);
            setPageParams(params => {
                return { ...params, page: listRes?.data?.current_page, total: listRes?.data?.total, pageSize: Number(listRes?.data?.per_page) };
            })
        }
    }, [listRes]);

    useEffect(() => {
        refetchList();
    }, [isChangeSuccess]);

    useEffect(() => {
        if (totalRes?.data && isFetchTotalSuccess) {
            const newTabs =  tabs.map((item, idx) => {
                item.items[0].num = totalRes?.data[idx + 1];
                return {
                    ...item,
                }
            });
            setTabs(newTabs);
        }
    }, [totalRes, isFetchTotalSuccess])

    return (
        <div className="w-full h-full bg-[#f0f2f7]">
            <div className="w-full h-[40px] bg-[white] border-b border-[#e2e2e2] flex items-center">
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
                <div className="flex-1 text-center pl-[280px]">评价体系</div>

                <div className="pr-[15px]">
                    <Select
                        defaultValue="0"
                        style={{ width: 120 }}
                        options={[
                            { value: "0", label: "当期" },
                            { value: "1", label: "生涯" },
                        ]}
                    />

                    <RangePicker style={{ marginLeft: "10px" }} />
                </div>
            </div>

            <div className="flex py-[15px] border-b border-[#e4e7eb] px-[15px] bg-white">
                {tabs.map((item) => {
                    return (
                        <div
                            className={`toggle-item w-[200px] mr-[15px] p-[10px] rounded-[8px]${item.label === curTab ? " toggle-item-active" : ""}`}
                            key={item.code}
                            style={{ background: item.bg }}
                            onClick={() => {
                                setCurTab(item.code);
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
                                <span className="ml-[8px]">{item.label}</span>
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

            <div className="p-[15px]">
                <div className="flex justify-between p-[15px] bg-white rounded-tl-[8px] rounded-tr-[8px]">
                    <div>
                        <span className="text-[16px] font-semibold pl-[5px] border-l-[3px] border-[#ffaa44]">
                            我的相关记录
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Input
                            placeholder="输入想查询的内容：日期、说明、地点.."
                            style={{ width: "300px" }}
                        />
                        <div className="flex items-center mx-[10px]">
                            <span className="w-[50px]">筛选</span>
                            <Select
                                defaultValue="all"
                                style={{ width: 120 }}
                                options={[
                                    { value: "all", label: "全部" },
                                    ...searchList,
                                ]}
                            />
                        </div>
                        <Button type="primary">下载档案袋</Button>
                    </div>
                </div>
                <div
                    className="bg-white px-[15px] pb-[15px] rounded-bl-[8px] rounded-br-[8px] flex flex-wrap overflow-y-auto"
                    style={{ maxHeight: "calc(100vh - 305px)" }}
                >
                    <div className='w-full flex flex-wrap items-start justify-between'>
                        {fetchData?.length ? (
                            fetchData.map((item) => {
                                return (
                                    <CardItem
                                        data={item}
                                        key={item.id}
                                        callback={(data) => {
                                            evalModalRef.current?.open(data);
                                        }}
                                    />
                                );
                            })
                        ) : (
                            <div className="w-full h-[600px] flex justify-center items-center">
                                <Empty description="暂无数据哦~" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full h-[60px] flex justify-center items-center fixed bottom-0 bg-[#f2f4f8]">
                <Pagination
                  defaultCurrent={pageParams.page}
                  total={pageParams.total}
                  size={pageParams.size}
                  onChange={(page, pageSize) => {
                      setPageParams((info) => {
                          return {
                              ...info,
                              page,
                              total: info.total,
                          };
                      });
                      refetchList({
                          page: page,
                          pageSize: pageParams.size
                      });
                  }}
                />
            </div>

            <EvalModal
                onRef={evalModalRef}
                callBack={async (type, payload) => {
                    if (type === "deleteSuccess") {
                        refetchList();
                    } else if (type === "change") {
                        await updateRecord({
                            ...payload.detail,
                            // teacherAttrJsons: payload.attrList,
                            attributes: payload.attrList,
                            scores: payload.scores,
                            // teacherScoreJsons: payload.teacherScoreJsons
                        });
                        await refetchTabs();
                        await refetchList();
                    }
                    evalModalRef.current?.close();
                }}
            />
        </div>
    );
});

export { MyEvaluation as Component };
