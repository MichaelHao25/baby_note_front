import { CaretDownOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Empty, Progress, Spin, type MenuProps } from "antd";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toggleIcon from "../../assets/img/examine-toggle-icon.png";
import titleIcon from "../../assets/img/progress-icon.png";
import {
    useCalendarListQuery,
    useGetEvaluateListQuery,
} from "../../store/apiSlice.ts";
import "./index.css";

const Evaluateprogress = memo(() => {
    const navigate = useNavigate();

    const { data: calendarList, isSuccess: isFetchCalendarListSuccess } =
        useCalendarListQuery();

    const {
        data: evaluateList,
        isLoading: evaluateListLoading,
        isSuccess: isFetchListSuccess,
        refetch: refetchEvaluateList,
    } = useGetEvaluateListQuery({
        schoolCode: "RBI850",
    });

    const [items, setItems]: MenuProps["items"] = useState([
        {
            code: "2024-0",
            label: "",
        },
    ]);

    const [topTabs, setTopTabs] = useState<any[]>([]);
    const [curTopTab, setCurTopTab] = useState<any>(null);

    const [curTerm, setCurTerm] = useState("");

    const onClick = (value) => {
        const code = value.item.props.code;
        const selectedItem = items.find((item) => item.code === code);
        setCurTerm(selectedItem.label);
    };

    useEffect(() => {
        if (isFetchListSuccess && evaluateList?.data) {
            const newTabs = evaluateList?.data.map(item => {
                const allList = item?.childs?.map(item => item.list).flat() || [];
                const allSize = allList.reduce((preValue, item) => preValue + item.allSize, 0)
                const finishSize = allList.reduce((preValue, item) => preValue + item.finishSize, 0)
                return {
                    ...item,
                    allSize,
                    finishSize
                }
            });
            console.log('newTabs', newTabs);
            setTopTabs(newTabs || []);
            setCurTopTab(newTabs?.[0] || {});
        }
    }, [evaluateList, isFetchListSuccess]);

    useEffect(() => {
        if (isFetchCalendarListSuccess && calendarList) {
            const list = calendarList.data;
            const newList = list.map((item) => {
                return {
                    label: item.name,
                    code: item.id,
                };
            });

            setItems(newList);
            setCurTerm(newList[0].label);
        }
    }, [isFetchCalendarListSuccess, calendarList]);

    return (
        <div
            className="w-full h-full bg-[#f2f4f8]"
            style={{ overflowY: "auto" }}
        >
            <div className="w-full h-[40px] bg-white flex justify-center items-center border-b border-px border-[#ccc] sticky top-0">
                <Dropdown
                    menu={{
                        items,
                        selectable: true,
                        defaultSelectedKeys: [items[0]?.code],
                        onClick,
                    }}
                    placement="bottom"
                >
                    <div>
                        <span>{curTerm}</span>
                        <DownOutlined />
                    </div>
                </Dropdown>
            </div>

            <div className="header-toggle w-full bg-white flex  p-[15px]">
                {topTabs.map((item) => {
                    return (
                        <div
                            className={`toggle-item w-[200px] bg-[#edf3fe] mr-[15px] p-[10px] rounded-[8px]${item.id === curTopTab.id ? " toggle-item-active" : ""}`}
                            key={item.id}
                            onClick={() => {
                                setCurTopTab(item);
                            }}
                        >
                            <div className="toggle-item-title flex">
                                <img
                                    src={toggleIcon}
                                    className="w-[24px] h-[24px] rounded-[12px]"
                                    alt=""
                                />
                                <span className="ml-[8px]">{item.name}</span>
                            </div>
                            <div className="toggle-item-content rounded-[10px] mt-[10px] bg-[#fff] flex p-[3px]">
                                <div className="text-center flex-1 border-solid border-r border-[#f1f6fe]">
                                    <div className="text-[18px] mt-[5px]">
                                        {item.finishSize || 0}
                                    </div>
                                    <div className="text-[12px]">次数</div>
                                </div>
                                <div className="text-center flex-1">
                                    <div className="text-[18px] mt-[5px]">
                                        {Math.floor(
                                            (item.finishSize ||
                                                0 / item.allSize ||
                                                0) * 100,
                                        )}
                                        %
                                    </div>
                                    <div className="text-[12px]">完成度</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pl-[15px] pr-[15px] mt-[15px] pb-[80px]">
                <Spin spinning={!isFetchCalendarListSuccess}>
                    <div className="bg-white p-[15px] w-full">
                        {curTopTab?.childs?.length ? (
                            curTopTab?.childs.map((item) => {
                                return (
                                    <>
                                        {item.list?.length && item.list.some(iten => iten.focusType == 1) ? (
                                            <div className="mb-[10px]">
                                                <div className="inline-block px-[10px] py-[8px] bg-[#e6effd] w-auto rounded-[8px]">
                                                    <img
                                                        src={titleIcon}
                                                        className="w-[24px] h-[24px] mr-[10px] inline-block"
                                                    />
                                                    <span className="text-[16px] font-medium">
                                                        {item.name}
                                                    </span>
                                                    <CaretDownOutlined
                                                        style={{
                                                            color: "#518df1",
                                                        }}
                                                        className="ml-[10px]"
                                                    />
                                                </div>

                                                <div className="flex mt-[15px] flex-wrap">
                                                    {item?.list?.map((iten) => {
                                                        return (
                                                          iten?.focusType == 1 ? (
                                                            <div className="border-solid border border-[#d6e3fc] rounded-[8px] w-[24%] mr-[15px] mb-[15px]">
                                                                <div className="p-[15px]">
                                                                    <div className="text-[#333] text-[16px]">
                                                                        {
                                                                            iten.scaleName
                                                                        }
                                                                    </div>
                                                                    <div className="text-[14px] mt-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
                                                                        <span className="text-[#999]">
                                                                            评价老师：
                                                                        </span>
                                                                        <span>
                                                                            {iten.checkTeacherName?.join(
                                                                              "、",
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="p-[15px] bg-[#e0ebfd] flex justify-between text-[12px]">
                                                                    <div className="flex items-center">
                                                                        <span className="w-[80px]">
                                                                            评价进度
                                                                        </span>
                                                                        <Progress
                                                                          percent={Math.floor(
                                                                            (iten.finishSize /
                                                                              iten.allSize) *
                                                                            100,
                                                                          )}
                                                                          percentPosition={{
                                                                              align: "center",
                                                                              type: "inner",
                                                                          }}
                                                                          size={[
                                                                              100, 20,
                                                                          ]}
                                                                          strokeColor="#7ff0d9"
                                                                        />
                                                                    </div>
                                                                    <a
                                                                      className="text-[#518df1] text-[14px]"
                                                                      onClick={() => {
                                                                          const queryParams =
                                                                            iten;
                                                                          const params =
                                                                            new URLSearchParams(
                                                                              queryParams,
                                                                            );
                                                                          navigate(
                                                                            `/teacherDevelopEvaluate/Evaluationdetails?${params}`,
                                                                          );
                                                                      }}
                                                                    >
                                                                        去评价
                                                                    </a>
                                                                </div>
                                                            </div>
                                                          ) : null
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ) : null}
                                    </>
                                );
                            })
                        ) : (
                            <div className="w-full h-[500px] flex justify-center items-center">
                                <Empty description="暂无数据哦~" />
                            </div>
                        )}
                    </div>
                </Spin>
            </div>
        </div>
    );
});

export { Evaluateprogress as Component };
