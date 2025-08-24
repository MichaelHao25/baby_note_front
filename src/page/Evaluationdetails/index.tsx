import { LeftOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Input, message, Progress } from "antd";
import dayjs from "dayjs";
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import toggleIcon from "../../assets/img/examine-toggle-icon.png";
import "./index.css";
import teacherData from "./teacher.json";
import type { SubjectItem, TeacherItem } from "./type.ts";
import EvalModal from "./components/evalModal.tsx";
import {
    useAddRecordMutation,
    useGetAuditListQuery,
    useGetGradeListQuery,
    useGetOtherEvalTeacherListQuery,
    useGetSubjectsQuery,
} from "../../store/apiSlice.ts";
import TeacherAutoComplete from "../Examine/components/teacherAutoComplete.tsx";

const Evaluationdetails = memo(() => {
    // 获取 searchParams 对象和设置方法（类似 useState）
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const id = searchParams.get("id");
    const name = searchParams.get("scaleName");
    const parentName = searchParams.get("parentName");

    const [yearList, setYearList] = useState<{ code: string; label: string; }[]>([]);
    const [curYear, setCurYear] = useState([]);
    const [subjectList, setSubjectList] = useState<SubjectItem[]>([]);
    const [curSubject, setCurSubject] = useState([]);
    const evalModalRef = useRef<any>(null);

    const [addRecord, { isSuccess: isAddSuccess }] = useAddRecordMutation();

    const {
        data: evalListRes,
        isSuccess: isFetchListSuccess,
        refetch: refetchEvalList,
    } = useGetOtherEvalTeacherListQuery({ criterionId: id, grade: curYear.join(','), subject: curSubject.join(',') });

    const [topRoundList, setTopRoundList] = useState([
        {
            allSize: 0,
            finishSize: 0,
            name: "第1轮",
            id: "65c1942fb566d2058f2f2cb8",
            seq: 0,
        },
        // {
        //     allSize: 32,
        //     finishSize: 33,
        //     name: "第2轮",
        //     id: "65c1942fb566d2058f2f2cb9",
        //     seq: 1,
        // },
    ]);
    const [curRound, setCurRound] = useState(topRoundList[0].id);

    const { data: subjects, isSuccess: isFetchSubjectsSuccess } =
      useGetSubjectsQuery();

    const { data: gradeRes, isSuccess: isFetchGradeSuccess } = useGetGradeListQuery();

    const [allTeacherList, setAllTeacherList] = useState<{
        id: number;
        name: string;
        grade: number;
        class_number: number;
        subject_id: number;
        subject_name: string;
        checkInfo: any[];
        bye: boolean;
    }[]>([]);
    const [teacherList, setTeacherList] = useState<{
        id: number;
        name: string;
        grade: number;
        class_number: number;
        subject_id: number;
        subject_name: string;
        checkInfo: any[];
        bye: boolean;
    }[]>([]);

    useEffect(() => {
        if (evalListRes?.data && isFetchListSuccess) {
            const newList = Object.values(evalListRes.data);
            setTeacherList(newList);
            setAllTeacherList(newList);
        }
    }, [evalListRes, isFetchListSuccess]);

    useEffect(() => {
        if (isFetchSubjectsSuccess && subjects) {
            setSubjectList(subjects.data);
            setCurSubject([subjects.data[0].id]);
        }
    }, [isFetchSubjectsSuccess, subjects]);

    useEffect(() => {
        if (isFetchGradeSuccess && gradeRes.data) {
            const entries = Object.entries(gradeRes.data);
            const newGrades = entries.map(item => ({ code: item[0], label: item[1] }))
            setYearList(newGrades)
            setCurYear([newGrades[0]?.code]);
        }

    }, [gradeRes, isFetchGradeSuccess]);

    useEffect(() => {
        refetchEvalList();
    }, [curSubject, curYear])

    return (
        <div className="w-full h-full bg-[#f2f4f8] overflow-y-hidden">
            <div className="w-full h-[40px] bg-white flex items-center px-[5px] border-b border-px border-[#ebedf0]">
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

                <div className="flex-1 text-center ml-[-200px]">{name}</div>
            </div>

            <div className="flex h-full">
                <div className="w-[300px] h-full bg-white border-r border-px border-[#ebedf0] p-[15px]">
                    <div className="text-[16px]">筛选评价范围</div>

                    <div className="mt-[15px]">
                        <div className="text-[#999]">年级</div>
                        <div className="flex flex-wrap mt-[10px]">
                            {yearList.length ? yearList.map((item, idx) => {
                                return (
                                    <Button
                                        type={
                                            curYear.includes(item.code)
                                                ? "primary"
                                                : "default"
                                        }
                                        size={"middle"}
                                        key={idx}
                                        className="mr-[5px] mb-[5px]"
                                        onClick={() => {
                                            if (curYear.includes(item.code)) {
                                                const newList = curYear.filter(i => i !== item.code);
                                                setCurYear(newList);
                                            } else {
                                                setCurYear([...curYear, item.code])
                                            }

                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            }) : null}
                        </div>
                    </div>

                    <div className="mt-[15px]">
                        <div className="text-[#999]">学科</div>
                        <div className="flex flex-wrap mt-[10px]">
                            {subjectList.map((item) => {
                                return (
                                    <Button
                                        size={"middle"}
                                        type={
                                            curSubject.includes(item.id)
                                                ? "primary"
                                                : "default"
                                        }
                                        key={item.id}
                                        className="mr-[5px] mb-[5px]"
                                        onClick={() => {
                                            if (curSubject.includes(item.id)) {
                                                const newList = curSubject.filter(i => i !== item.id);
                                                setCurSubject(newList);
                                            } else {
                                                setCurSubject([...curSubject, item.id])
                                            }
                                        }}
                                    >
                                        {item.name}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-[15px]">
                    <div className="bg-white p-[15px] flex rounded-[8px]">
                        {topRoundList.map((item) => {
                            return (
                                <div
                                    className={`w-[160px] h-[75px] bg-[#edf3fe] rounded-[8px] p-[15px] flex flex-col justify-center mr-[15px]${item.id === curRound ? " round-active" : ""}`}
                                    key={item.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setCurRound(item.id)}
                                >
                                    <div className="flex">
                                        <img
                                            src={toggleIcon}
                                            className="w-[24px] rounded-[12px]"
                                        />
                                        <span className="ml-[10px] text-[#000] round-name">
                                            {item.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-[10px]">
                                        <span className="text-[#000] text-[12px] w-[60px] finish-text">
                                            完成度
                                        </span>
                                        <Progress
                                            percent={Math.floor(
                                                (item.finishSize /
                                                    item.allSize) *
                                                    100,
                                            )}
                                            percentPosition={{
                                                align: "center",
                                                type: "inner",
                                            }}
                                            size={[90, 15]}
                                            strokeColor="#7ff0d9"
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <div className="flex flex-col mt-[3px]">
                            <Button color="primary" variant="dashed">
                                <span>新增轮次</span>
                                <PlusOutlined />
                            </Button>
                            <Button
                                color="primary"
                                variant="dashed"
                                className="mt-[5px]"
                            >
                                <span>减少轮次</span>
                                <MinusOutlined />
                            </Button>
                        </div>
                    </div>

                    <div className="mt-[15px] bg-white p-[15px] rounded-[8px]">
                        <div className="flex justify-between">
                            <div>
                                {/*<Input*/}
                                {/*    placeholder="请输入教师姓名"*/}
                                {/*    style={{ width: "180px" }}*/}
                                {/*/>*/}
                                <TeacherAutoComplete
                                  selectItem={(id) => {
                                      const newList = allTeacherList.filter(i => i.id === id);
                                      if (!newList) return;
                                      setTeacherList(newList);
                                  }}
                                  onSearchChange={text => {
                                      if (!text) {
                                          return setTeacherList(allTeacherList);
                                      }
                                      const newList = allTeacherList.filter(i => i.name === text);
                                      setTeacherList(newList);
                                  }}
                                />
                                <span className="mx-[10px]">
                                    共{teacherList.length}名教师，已评
                                    {
                                        teacherList?.filter((item) => Object.keys(item?.checkinfo || {}).length).length
                                    }
                                    名
                                </span>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        navigate(
                                            "/teacherDevelopEvaluate/batchEvaluate",
                                        );
                                    }}
                                >
                                    批量评价
                                </Button>
                            </div>
                            <Button type="primary">下载统计表</Button>
                        </div>

                        <div className="mt-[15px] overflow-y-auto h-auto" style={{ height: "calc(100vh - 285px)" }}>
                            <div className="flex flex-wrap h-auto" >
                                {teacherList?.length ? teacherList.map((tea) => {
                                    return (
                                        <div
                                            key={tea.id}
                                            className={`teacher-item w-[255px] h-[100px] flex items-center border-[4px] border-[#d9e1f3] mr-[15px] mb-[15px]${tea.data?.[0]?.level ? " teacher-evaluated" : ""}`}
                                        >
                                            <div className="line"></div>
                                            <div className="px-[20px] border-r border-[#dddfe6]">
                                                <img
                                                    src="https://yxyspbase.yxuer.com/common-head.png?imageView2/1/w/35/h/35"
                                                    className="w-[35px]"
                                                />
                                                <div className="text-[16px] mt-[10px] font-semibold">
                                                    {tea.name}
                                                </div>
                                            </div>

                                            {tea.checkinfo?.criterionId == id ? (
                                                <div className="flex flex-col justify-center items-center pl-[15px] w-[145px]">
                                                    <div className="mt-[5px] flex text-[13px] justify-between w-full">
                                                        <div className="w-[50px]">
                                                            评价：
                                                        </div>
                                                        <div className="level flex-1 border-b border-px border-[#d0dbf3] text-right">
                                                            {tea.checkinfo?.score}
                                                        </div>
                                                    </div>
                                                    <div className="mt-[5px] flex text-[12px] justify-between w-full">
                                                        <div className="w-[50px]">
                                                            评价人：
                                                        </div>
                                                        <div className="flex-1 border-b border-[#d0dbf3] text-right">
                                                            {
                                                                tea.checkinfo?.ob_name
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="mt-[5px] flex text-[12px] justify-between w-full">
                                                        <div className="w-[50px]">
                                                            时间：
                                                        </div>
                                                        <div className="flex-1 border-b border-[#d0dbf3] text-right">
                                                            {dayjs(tea.checkinfo.dateTime).format("YYYY-MM-DD")}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col justify-center items-center pl-[35px] pt-[5px]">
                                                    <Button
                                                        type="primary"
                                                        className="w-[100px]"
                                                        onClick={() => {
                                                            evalModalRef.current?.open(
                                                                {
                                                                    ...tea,
                                                                    parentName,
                                                                    sonName: name,
                                                                    criterionId: id
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        评价
                                                    </Button>
                                                    <a
                                                        className="mt-[10px] text-[#409eff] text-[13px]"
                                                    >
                                                        本轮不评价{}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }) : (
                                    <div className="w-full h-[500px] flex justify-center items-center">
                                        <Empty description="暂无数据哦~" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EvalModal
                onRef={evalModalRef}
                callBack={async (type, payload) => {
                    const res = await addRecord({
                        schoolCode: "RBI850",
                        criterionId: id,
                        subject: "",
                        // levelSum: "4",
                        userId: payload.userId,
                        score: null,
                        attributes: [
                            ...payload?.attrList?.map((i) => ({
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
                        isLoading: true,
                    });

                    message.success(res?.data?.msg || '操作成功');

                    refetchEvalList();
                    evalModalRef.current?.close();
                }}
            />
        </div>
    );
});

export { Evaluationdetails as Component };
