import {memo, useEffect, useImperativeHandle, useState} from "react";
import { Button, DatePicker, Drawer, Form, Input, message } from "antd";
import titleIcon from "../../../assets/img/eval-modal-icon.png";
import titleIcon2 from "../../../assets/img/record-icon.png";
import titleIcon3 from "../../../assets/img/progress-icon.png";
import type {FindTreeItem, RecordItem} from "../type.ts";
import {CaretDownOutlined, PlusOutlined} from "@ant-design/icons";
import "../index.css";
import {useGetEvaluateInfoQuery, useGetMyInfoQuery, useGetRecordDetailQuery} from "../../../store/apiSlice.ts";
import type {EvaluateInfo, RecordDetail} from "../../../types/api.ts";
import dayjs from "dayjs";
import FileUpload from "./FileUpload.tsx";
import {UploadWrap} from "./FileUploader.tsx";
import {transformEvaluationData} from "../../../utils/transform.ts";

const {TextArea} = Input;

interface Props {
    onRef: any;
    callBack: (type: string, payload: any) => void;
}

const iconMaps = {
    "0": titleIcon,
    "1": titleIcon2,
    "2": titleIcon3,
};
const getTitleIcon = (index: number) => {
    return iconMaps?.[index] || titleIcon;
};

const CreateLatitudeModal = memo<Props>(({onRef, callBack}) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("标题");

    // const {
    //   data: detailRes,
    //   refetch: refetchInfo,
    // } = useGetRecordDetailQuery({ id: '' });


    // const []

    const [detailInfo, setDetailInfo] = useState<any>(null);
    const [evaluateInfo, setEvaluateInfo] = useState<EvaluateInfo>(null);

    const [recordList, setRecordList] = useState<RecordItem[]>([]);
    const [curType, setCurType] = useState<RecordItem>();

    const [curTitle, setCurTitle] = useState("");

    const [date, setDate] = useState<dayjs>();
    const [desc, setDesc] = useState('');
    const [curLevel, setCurLevel] = useState('');

    const [findTree, setFindTree] = useState<FindTreeItem[]>([]);
    const [file, setFile] = useState(null);

    const [attrList, setAttrList] = useState<any>([]);
    const {
        data: evaluateRes,
        refetch: refetchEvaluateInfo,
    } = useGetEvaluateInfoQuery({id: curType?.id});
    const showDrawer = (info: RecordItem) => {
        // refetchInfo({ id: info.id });
        refetchEvaluateInfo({id: info.id});

        setCurType(info);
        setTitle(`${info.name}`);
        setCurTitle(`${info.parentName} / ${info.name}`);
        // fetchFindTree();
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setDetailInfo(null);
    };


    //用useImperativeHandle暴露一些外部ref能访问的属性
    useImperativeHandle(onRef, () => {
        // 需要将暴露的接口返回出去
        return {
            open: showDrawer,
            close: onClose,
        };
    });

    // useEffect(() => {
    //   if (detailRes?.data) {
    //     setDetailInfo(detailRes.data)
    //   }
    // }, [detailRes]);
    const [observationPoint, setObservationPoint] = useState('');
    const [observationPointData, setObservationPointData] = useState<{
        observationPoint: string,
        list: { point: string, name: string }[]
    }[]>([]);



    useEffect(() => {
        const corssTable = evaluateRes?.data?.corssTable || [];
        if (corssTable.length) {
            // const transformData = transformToObject(corssTable);
            // const list = transformData.filter(item => item.evaluationStandard).map(item => ({
            //     point: item.points,
            //     name: item.evaluationStandard
            // }))

            // const result = {
            //     observationPoint: transformData.find(item => item.observationPoint)?.observationPoint,
            //     list
            // }
            // console.log('result', result)
            const result = transformEvaluationData(corssTable);
            // console.log('result', result);
            setObservationPointData(result);
        }


        if (evaluateRes?.data) {
            setEvaluateInfo(evaluateRes.data)
            setAttrList(evaluateRes?.data?.attributes?.map(item => ({...item})));
            setCurTitle(`${curType?.parentName} / ${curType?.name}`);
        }
    }, [evaluateRes]);

    return (
        <Drawer
            title={title}
            closable={{"aria-label": "Close Button"}}
            onClose={onClose}
            width={1000}
            open={open}
            footer={
                <div className="flex justify-end">
                    <div>
                        <Button
                            onClick={() => {
                                callBack?.(null);
                            }}
                        >
                            取消
                        </Button>
                        <Button
                            type="primary"
                            className="ml-[15px]"
                            onClick={() => {
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
                                    desc,
                                    date,
                                    evaluateInfo,
                                    level: curLevel,
                                    file,
                                    criterionId: curType?.id,
                                    info: curType,
                                    attrList,
                                    observationPoint,
                                    teacherScoreJsons
                                });

                                setFile(null);
                                setEvaluateInfo(null);
                                setDesc('');
                                setDate(dayjs());
                            }}
                        >
                            确认
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="flex items-center p-[10px] rounded-[8px] bg-[#deeafd] record-title justify-between">
                <div className="flex items-center">
                    <img
                        src={getTitleIcon(0)}
                        alt=""
                        className="w-[30px] h-[30px] mr-[10px]"
                    />
                    <span className="text-[15px]">{curTitle}</span>
                </div>

                <Button type="primary" onClick={() => {
                    callBack?.('change');
                }}>更改</Button>
            </div>

            <div className="mt-[15px]">
                <Form labelCol={{span: "3"}}>
                    <Form.Item label="记录归属日期">
                        <DatePicker value={dayjs(date)} onChange={(item) => {
                            setDate(new Date(item).getTime());
                        }}/>
                    </Form.Item>
                    {/*<Form.Item label="记录说明">*/}
                    {/*    <div className="mt-[5px]">*/}
                    {/*        <div className="">填写说明：简单概述本次记录的内容</div>*/}
                    {/*        <TextArea rows={3} value={desc} onChange={e => {*/}
                    {/*            const newValue = e.target.value;*/}
                    {/*            setDesc(newValue);*/}
                    {/*        }}/>*/}
                    {/*    </div>*/}
                    {/*</Form.Item>*/}

                    {/*<div className="pt-[10px] border-y border-[#e8eaee]">*/}
                    {/*  <Form.Item label="附件提交">*/}
                    {/*    <FileUpload uploadSuccess={newFile => {*/}
                    {/*      setFile(newFile);*/}
                    {/*    }} />*/}
                    {/*  </Form.Item>*/}
                    {/*</div>*/}
                </Form>
            </div>

            <div className="mt-[15px]">
                {/*<div className="my-[10px]">*/}
                {/*    <span className="pl-[5px] border-l-[3px] border-[#ffaa2e] text-[16px] font-semibold">*/}
                {/*      {curType?.name}*/}
                {/*    </span>*/}
                {/*</div>*/}
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

                {
                    // observationPointData.length ? (
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
                    // ) : null
                }
            </div>
        </Drawer>
    );
});

export default CreateLatitudeModal;
