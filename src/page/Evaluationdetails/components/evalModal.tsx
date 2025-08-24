import { memo, useEffect, useImperativeHandle, useState } from "react";
import {Button, DatePicker, Drawer, Form, Input, message, Popconfirm} from "antd";
import titleIcon from "../../../assets/img/eval-modal-icon.png";
import "../index.css";
import {
    useDeleteRecordMutation, useGetAuditDetailQuery,
    useGetCategoriesQuery,
    useGetEvaluateInfoQuery,
    useGetRecordDetailQuery,
} from "../../../store/apiSlice.ts";
import type { EvalItem, TeacherItem } from "../../Evaluationdetails/type.ts";
import dayjs from "dayjs";
import {transformEvaluationData, transformToObject} from "../../../utils/transform.ts";
import {UploadWrap} from "../../MyPanelHomePage/components/FileUploader.tsx";

interface Props {
    onRef: any;
    callBack: (type: string, data: any) => void;
}

const { TextArea } = Input;

const EvalModal = memo<Props>(({ onRef, callBack }) => {
    const [deleteRecord, { isSuccess: isDelSuccess }] = useDeleteRecordMutation();

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("标题");

    const [evalList, setEvalList] = useState<EvalItem[]>();
    const [evalType, setEvalType] = useState(
        "教学与科研 / 质量保证（语、数、英、体育学科）",
    );
    const [info, setInfo] = useState<any>(null);

    const [curType, setCurType] = useState<any>(null);
    const [date, setDate] = useState<dayjs>();

    // const {
    //   data: categories,
    //   refetch: refetchCategories,
    // } = useGetCategoriesQuery({
    //   id: curType?.id
    // });
    //
    const {
        data: detailRes,
        refetch: refetchInfo,
    } = useGetRecordDetailQuery({ id: curType?.id });

    const {
        data: auditDetailRes,
        refetch: refetchAuditDetail,
    } = useGetAuditDetailQuery({ id: curType?.id });

    const [attrList, setAttrList] = useState<any>([]);
    const [detail, setDetail] =  useState<any>(null);

    const {
        data: evaluateRes,
        refetch: refetchEvaluateInfo,
    } = useGetEvaluateInfoQuery({ id: curType?.criterionId });


    const [observationPointData, setObservationPointData] = useState<{
        observationPoint: string,
        list: { point: string,  name: string }[]
    }[]>({});

    const [score, setScore] = useState(0);

    const showDrawer = (info: TeacherItem) => {
        console.log('info', info)
        setScore(info.score);
        // fetchEvalList();
        refetchInfo(info?.criterionId);
        // refetchAuditDetail(info?.criterionId);
        refetchEvaluateInfo(info?.criterionId);
        setCurType(info);

        setEvalType(`${info?.parentName} / ${info?.sonName}`);
        setTitle(`评价${info?.name || ''}`);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setCurType(null);
    };

    //用useImperativeHandle暴露一些外部ref能访问的属性
    useImperativeHandle(onRef, () => {
        // 需要将暴露的接口返回出去
        return {
            open: showDrawer,
            close: onClose,
        };
    });

    useEffect(() => {
        const corssTable = evaluateRes?.data?.corssTable || [];
        if (corssTable.length) {
            const result = transformEvaluationData(corssTable);
            setObservationPointData(result);
        }

        if (evaluateRes?.data) {
            setDetail(evaluateRes.data)
            setAttrList(evaluateRes?.data?.attributes?.map(item => ({...item})));
            setTitle(`评价${curType?.name}`);
        }
    }, [evaluateRes, detail]);

    useEffect(() => {
        if (curType?.id) {
            refetchEvaluateInfo();
        }
    }, [curType]);

    useEffect(() => {
        if (isDelSuccess) {
            onClose();
        }
    }, [isDelSuccess]);

    // useEffect(() => {
    //     if (detailRes?.data) {
    //         const classifyName = detailRes?.data?.classifyName[0]?.name;
    //         setEvalType(`${classifyName} / ${detailRes?.data?.evaluation?.scaleName}`);
    //         setAttrList(detailRes?.data?.attributes?.map(item => ({...item})) || []);
    //         setDetail(detailRes?.data)
    //     }
    // },  [detailRes])

    return (
        <Drawer
            title={title}
            closable={{ "aria-label": "Close Button" }}
            onClose={onClose}
            width={1000}
            open={open}
            footer={<div className='flex justify-between'>
                <div className='text-[18px] font-semibold'>
                    总评：
                </div>

                <div>
                    <Button onClick={() => {
                        callBack?.(null);
                    }}>取消</Button>
                    <Button type='primary' className='ml-[15px]' onClick={() => {
                        const files = attrList.filter(item => item.focusIndex == 6);

                        const allFiles = files.map(item => item.files || []) || [];
                        const allFlatFiles = allFiles.flat();
                        const isUpload = allFlatFiles?.length;

                        if (files.length && !isUpload) {
                            return message.warning('请上传附件!');
                        }

                        const teacherScoreJsons = observationPointData.map(item => {
                            return {
                                dimensionId: "659c93c34413762a879c74cb",
                                scoreType: 0,
                                name: item.observationPoints?.name,
                                index: item.observationPoints?.index,
                                score: item.observationPoints?.selectPoint,
                                options: item.observationPoints?.list
                            }
                        })

                        callBack?.('add', {
                            ...detail,
                            date,
                            detailRes,
                            criterionId: curType?.criterionId,
                            info: curType,
                            attrList,
                            teacherScoreJsons,
                            userId: curType.id,
                        });

                        setDetail(null);
                        setDate(dayjs());
                    }}>确认</Button>
                </div>
            </div>}
        >
            {/*<div className="flex items-center p-[10px] rounded-[8px] bg-[#deeafd]">*/}
            {/*    <img src={titleIcon} alt="" className="w-[30px] h-[30px] mr-[10px]" />*/}
            {/*    <span className="text-[16px]">{evalType}</span>*/}
            {/*</div>*/}

            {/*<div className="my-[15px] p-[10px] bg-[#f3f3f3]">{info.desc}</div>*/}

            <div className='mt-2 border-b border-px border-[#dcdfe6] '>
                <Form.Item label="记录归属日期">
                    <DatePicker value={dayjs(date)} onChange={(item) => {
                        setDate(new Date(item).getTime());
                    }}/>
                </Form.Item>


                {/*<Form.Item label="记录说明">*/}
                {/*  <div>*/}
                {/*    <TextArea rows={3} value={detail?.description} onChange={e => {*/}
                {/*      const newValue = e.target.value;*/}
                {/*      setDetail((info) => {*/}
                {/*        return { ...info, description: newValue };*/}
                {/*      });*/}
                {/*    }} />*/}
                {/*  </div>*/}
                {/*</Form.Item>*/}
            </div>

            {/*<div className="my-[10px]">*/}
            {/*  <span className="pl-[5px] border-l-[3px] border-[#ffaa2e] text-[16px] font-semibold">*/}
            {/*    {evalType}*/}
            {/*  </span>*/}
            {/*</div>*/}
            <div className='mt-5'>
                {attrList?.map((item, idx) => {
                    return (
                        <>
                            <div key={item?.id} className="mb-[15px]">
                                {/*<div className="my-[10px]">*/}
                                {/*            <span className="pl-[5px] border-l-[3px] border-[#ffaa2e] text-[16px] font-semibold">*/}
                                {/*              {item?.name}*/}
                                {/*            </span>*/}
                                {/*</div>*/}
                                {
                                    item?.focusIndex === 0 && (
                                        <Form.Item label={item.name} required>
                                            <div className='flex flex-wrap'>
                                                {item?.options.map((level, idx) => {
                                                    return (
                                                        <Button
                                                            key={level}
                                                            type={level == item.value?.[0] ? 'primary' : 'default'}
                                                            className="ml-[10px] mb-[10px]"
                                                            onClick={() => {
                                                                item.value = [level];
                                                                setAttrList(list => [...list])
                                                            }}
                                                            style={{width: "100px"}}
                                                        >
                                                            {level}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </Form.Item>
                                    )
                                }

                                {
                                    item?.focusIndex === 1 && (
                                        <Form.Item label={item.name} required>
                                            <div className='flex flex-wrap'>
                                                {item?.options.map((level, idx) => {
                                                    return (
                                                        <Button
                                                            key={level}
                                                            type={item.value?.includes(level) ? 'primary' : 'default'}
                                                            className="ml-[10px] mb-[10px]"
                                                            onClick={() => {
                                                                if (!item.value) {
                                                                    item.value = [];
                                                                    item.value.push(level);
                                                                } else {
                                                                    if (item.value.includes(level)) {
                                                                        item.value = item.value.filter(item => item != level);
                                                                    } else {
                                                                        item.value.push(level);
                                                                    }
                                                                }

                                                                setAttrList(list => [...list])
                                                            }}
                                                            style={{width: "100px"}}
                                                        >
                                                            {level}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </Form.Item>
                                    )
                                }

                                {
                                    item.focusIndex === 2 ? (
                                        <Form.Item label={item.name} required>
                                            <div className="mt-[5px]">
                                                <Input value={item.value} onChange={e => {
                                                    const newValue = e.target.value;
                                                    attrList[idx].value = [newValue];
                                                    setAttrList(list => [...list])
                                                }}/>
                                            </div>
                                        </Form.Item>
                                    ) : null
                                }
                                {
                                    item.focusIndex === 3 ? (
                                        <Form.Item label={item.name} required>
                                            <div className="mt-[5px]">
                                                <div className="">填写说明：简单概述本次记录的内容</div>
                                                <TextArea rows={3} value={item.value} onChange={e => {
                                                    const newValue = e.target.value;
                                                    attrList[idx].value = [newValue];
                                                    setAttrList(list => [...list])
                                                }}/>
                                            </div>
                                        </Form.Item>
                                    ) : null
                                }

                                {
                                    item.focusIndex === 5 ? (
                                        <Form.Item label={item.name} required>
                                            <div className="mt-[5px]">
                                                <Input value={item.value} onChange={e => {
                                                    const newValue = e.target.value;
                                                    attrList[idx].value = [newValue];
                                                    setAttrList(list => [...list])
                                                }}/>
                                            </div>
                                        </Form.Item>
                                    ) : null
                                }

                                {
                                    item.focusIndex === 6 ? (
                                        <div className="pt-[10px] border-y border-[#e8eaee]">
                                            <Form.Item label="附件提交" required>
                                                {/*<FileUpload uploadSuccess={(newFile, files) => {*/}
                                                {/*    const fileJson = files.map(item => {*/}
                                                {/*        const url = item.fullurl*/}
                                                {/*        // const fullurl = item.fullurl*/}
                                                {/*        return {*/}
                                                {/*            fileName: "file.png",*/}
                                                {/*            // fullurl,*/}
                                                {/*            url,*/}
                                                {/*            fileMineType: "image",*/}
                                                {/*        }*/}
                                                {/*    });*/}
                                                {/*    attrList[idx].fileJsons = fileJson;*/}
                                                {/*    attrList[idx].fileMineType  = "image";*/}
                                                {/*    attrList[idx].fileUploadingStatus  = 1;*/}

                                                {/*    setAttrList(list => [...list]);*/}
                                                {/*}} />*/}
                                                <UploadWrap onChange={(files) => {
                                                    const fileJson = files.map(item => {
                                                        return {
                                                            fileName: item.fileName,
                                                            url: item.url,
                                                            fileMineType: "image",
                                                        }
                                                    });
                                                    attrList[idx].files = fileJson;
                                                    attrList[idx].fileMineType = "image";
                                                    attrList[idx].fileUploadingStatus = 1;

                                                    setAttrList(list => [...list]);
                                                }}/>
                                            </Form.Item>
                                        </div>
                                    ) : null
                                }


                            </div>


                        </>

                    );
                })}
            </div>

            {
                observationPointData.length ? (
                    observationPointData?.map(item => {
                        return (
                            <div>
                                <div className="my-[10px]">
                    <span className="pl-[5px] border-l-[3px] border-[#ffaa2e] text-[16px] font-semibold">
                      {item?.level}
                    </span>
                                </div>
                                <div className="mt-[15px] w-full bg-[#f8f8f8]">
                                    <div className="p-[15px] ">
                                        <div className="level-desc-title">评价标准参考</div>
                                        <div className="flex w-full h-[60px] border-[#d7e3f7] border">
                                            <div
                                                className="w-[150px] flex items-center justify-center text-[#333] text-[14px]">
                                                观察点
                                            </div>
                                            <div
                                                className="flex-1 flex items-center justify-center pr-[15px] text-[#777] text-[14px]">
                                                {item?.observationPoints?.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="border-t border-[#e7e7e7] px-[30px] py-[5px] flex flex-wrap items-start pt-[15px]">
                                        <div className="text-[#888] w-[auto]">{item?.level}</div>
                                        <div className='flex-1'>
                                            {item?.observationPoints?.list?.map((level, idx) => {
                                                return (
                                                    <Button
                                                        key={level.point}
                                                        type={item?.observationPoints?.['selectPoint'] == level.point ? 'primary' : 'default'}
                                                        className="ml-[10px] mb-[10px]"
                                                        onClick={() => {
                                                            item['observationPoints']['selectPoint'] = level.point
                                                            item['observationPoints']['index'] = idx

                                                            setObservationPointData(data => [...data])
                                                        }}
                                                    >
                                                        {level.standard}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : null
            }

        {/*    <div className="my-[10px] flex items-center">*/}
        {/*<span className="pl-[5px] border-l-[3px] border-[#ffaa2e] text-[16px] font-semibold mr-10">*/}
        {/* 总评*/}
        {/*</span>*/}
        {/*        <Input value={score} onChange={e => setScore(e.target.value)} className='!w-20' />*/}
        {/*    </div>*/}
        </Drawer>
    );
});

export default EvalModal;
