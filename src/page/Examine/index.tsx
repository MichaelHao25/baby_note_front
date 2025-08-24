import { memo, useEffect, useRef, useState } from "react";
import { Badge, Button, Empty, Input, Pagination, Select, Spin } from "antd";
import toggleIcon from "../../assets/img/examine-toggle-icon.png";
import "./index.css";
import CardItem from "./components/cardItem.tsx";
import {
    useGetCategoriesQuery,
    useGetExamineListQuery,
    usePutExamineMutation,
} from "../../store/apiSlice.ts";
import TeacherAutoComplete from "./components/teacherAutoComplete.tsx";
import EvalModal from "./components/evalModal.tsx";

const Examine = memo(() => {
    const [putExamine, { isSuccess: isExamineSuccess }] =
        usePutExamineMutation();

    const [topTabs, setTopTabs] = useState<any[]>([]);
    const [curTopTab, setCurTopTab] = useState(0);
    const evalModalRef = useRef<any>(null);

    const [mainTabs] = useState([
        {
            code: false,
            label: "未审核",
        },
        {
            code: true,
            label: "已审核",
        },
    ]);
    const [curMainTab, setCurMainTab] = useState(mainTabs[0].code);
    const [loading, setLoading] = useState(false);
    const [pageParams, setPageParams] = useState({
        page: 1,
        size: 20,
        total: 100,
    });

    const [mainData, setMainData] = useState<any>({});

    const { data: categories, isSuccess: isFetchCategoriesSuccess } =
        useGetCategoriesQuery({
            schoolCode: "RBI850",
        });

    const {
        data: examineList,
        isLoading: examineListLoading,
        isSuccess: isFetchExamineListSuccess,
        refetch: refetchExamineList,
    } = useGetExamineListQuery({
        schoolCode: "RBI850",
        userId: "659befdda5f838b3673796b6",
        criterionClassId: curTopTab,
        criterionId: "",
        pageNum: pageParams.page,
        pageCount: pageParams.size,
        review: curMainTab,
        isLoading: true,
        teacherId: "",
    });

    useEffect(() => {
        if (isFetchCategoriesSuccess && categories?.data) {
            setTopTabs(categories.data);
            setCurTopTab(categories.data?.[0]?.id);
        }
    }, [isFetchCategoriesSuccess, categories]);

    useEffect(() => {
        if (isFetchExamineListSuccess && examineList) {
            setMainData(examineList.data);
            setPageParams((page) => ({
                ...page,
                total:
                    examineList.data?.review?.length ||
                    examineList.data?.notReview?.length,
            }));
        }
    }, [isFetchExamineListSuccess, examineList]);

    useEffect(() => {
        if (mainData?.cate && topTabs) {
            const newTabs = topTabs.map((item) => {
                const id = item.id;
                const values = Object.values(mainData.cate);

                const filterItems = values.filter((value) => value.id == id);
                const notReviewedCount = filterItems.reduce(
                    (preV, item) => preV + item.notReviewedCount,
                    0,
                );
                const reviewedCount = filterItems.reduce(
                    (preV, item) => preV + item.reviewedCount,
                    0,
                );

                return {
                    ...item,
                    reviewedCount,
                    notReviewedCount,
                };
            });
            setTopTabs(newTabs);
        }
    }, [mainData]);

    useEffect(() => {
        if (isExamineSuccess) {
            refetchExamineList();
        }
    }, [isExamineSuccess]);

    return (
        <div
            className="w-full h-full bg-[#f2f4f8]"
            style={{ overflowY: "auto" }}
        >
            <div className="header-toggle w-full bg-white flex  p-[15px]">
                {topTabs.map((item) => {
                    return (
                        <div
                            className={`toggle-item w-[200px] bg-[#edf3fe] mr-[15px] p-[10px] rounded-[8px]${item.id === curTopTab ? " toggle-item-active" : ""}`}
                            key={item.id}
                            onClick={() => {
                                setCurTopTab(item.id);
                                refetchExamineList();
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
                                        {item.reviewedCount || 0}
                                    </div>
                                    <div className="text-[12px]">
                                        <Badge
                                            color="#b5fad2"
                                            text="已审个数"
                                        />
                                    </div>
                                </div>
                                <div className="text-center flex-1">
                                    <div className="text-[18px] mt-[5px]">
                                        {item.notReviewedCount || 0}
                                    </div>
                                    <div className="text-[12px]">
                                        <Badge
                                            color="#ed6060"
                                            text="未审个数"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pl-[15px] pr-[15px] mt-[15px] pb-[80px]">
                <div className="flex justify-between bg-white p-[15px] border-b border-[#ebedf0] sticky top-0 z-50">
                    <div className="main-tabs flex">
                        {mainTabs.map((item) => {
                            return (
                                <div
                                    className={`main-tab-item${item.code === curMainTab ? " main-tab-item-active" : ""}`}
                                    key={item.code}
                                    onClick={() => {
                                        setCurMainTab(item.code);
                                        refetchExamineList();
                                    }}
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center">
                        {curMainTab == false && (
                            <Button
                                type="primary"
                                onClick={async () => {
                                    try {
                                        // const list = mainData?.notReview?.map(item => ({ id: item.id, type: 1, score: item.score }))
                                        // await putExamine(list);
                                        //
                                        // if (isExamineSuccess) {
                                        //     await refetchExamineList();
                                        // }
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                            >
                                一键通过
                            </Button>
                        )}
                        <div className="flex items-center ml-[10px]">
                            <span className="w-[100px]">搜索教师</span>
                            <TeacherAutoComplete
                                selectItem={(teacher) => {
                                    refetchExamineList();
                                }}
                            />
                        </div>
                        <div className="ml-[10px]">
                            <span className="mr-[5px]">筛选</span>
                            <Select
                                defaultValue="all"
                                style={{ width: 120 }}
                                options={[
                                    { value: "all", label: "所有" },
                                    // { value: "1", label: "获得荣誉" },
                                    // { value: "2", label: "润德于心" },
                                    // { value: "3", label: "结对互助" },
                                    // { value: "4", label: "对外交流" },
                                    // { value: "5", label: "志愿服务" },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                <Spin spinning={examineListLoading}>
                    <div className="p-[15px] pt-[12px] flex flex-wrap main-content bg-white">
                        {curMainTab == false ? (
                            mainData?.notReview?.length ? (
                                mainData?.notReview?.map((item) => {
                                    return (
                                        <CardItem
                                            data={item}
                                            key={item.id}
                                            callback={async (mode, data) => {
                                                try {
                                                    if (mode == "detail") {
                                                        evalModalRef.current?.open(
                                                            data,
                                                        );
                                                    } else {
                                                        await putExamine({
                                                            id: data.id,
                                                            score: data.score,
                                                            type: data.type,
                                                        });
                                                    }
                                                } catch (err) {
                                                    console.error(err);
                                                }
                                            }}
                                        />
                                    );
                                })
                            ) : (
                                <div className="w-full h-[500px] flex justify-center items-center">
                                    <Empty description="暂无数据哦~" />
                                </div>
                            )
                        ) : mainData?.review?.length ? (
                            mainData?.review?.map((item) => {
                                return (
                                    <CardItem
                                        key={item.id}
                                        data={item}
                                        callback={async (mode, data) => {
                                            try {
                                                if (mode == "detail") {
                                                    evalModalRef.current?.open(
                                                        data,
                                                    );
                                                } else {
                                                    await putExamine({
                                                        id: data.id,
                                                        score: data.score,
                                                        type: data.type,
                                                    });
                                                }
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}
                                    />
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

            <div className="w-full h-[60px] flex justify-center items-center fixed bottom-0 bg-[#f2f4f8]">
                <Pagination
                    defaultCurrent={pageParams.page}
                    total={pageParams.total}
                    onChange={(page, pageSize) => {
                        setPageParams((info) => {
                            return {
                                page,
                                size: pageSize,
                                total: info.total,
                            };
                        });
                        refetchExamineList();
                    }}
                />
            </div>

            <EvalModal
                onRef={evalModalRef}
                callBack={async (type, data) => {
                    await putExamine({
                        id: data.id,
                        score: data.score,
                        type: data.type,
                    });

                    if (isExamineSuccess) {
                        await refetchExamineList();
                    }

                    evalModalRef.current?.close();
                }}
            />
        </div>
    );
});

export { Examine as Component };
