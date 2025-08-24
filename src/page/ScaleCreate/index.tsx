import { Button, Form, message, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Header } from "../../components/Header";
import {
    useAddEvaluateMutation,
    useGetCategoriesQuery,
    useGetEvaluateInfoQuery,
    useGetSubjectsQuery,
    useLazyGetEvaluateInfoQuery,
    useUpdateEvaluateMutation,
} from "../../store/apiSlice";
import {
    adminShowOptions,
    auditTypeOptions,
    auditorOptions,
    checkPowerTypeOptions,
    codeClassEvalsOptions,
    dataTypeAskOptions,
    evalBatchReviewOptions,
    evalCheckPowerOptions,
    evalCountOptions,
    evalTypeOptions,
    evaluationObjectOptions,
    focusStatusOptions,
    focusTypeOptions,
    mustDoIndexOptions,
    seeTypeOptions,
    selectOrgOptions,
    selfEvalTypeOptions,
    subjectFilterTypeOptions,
    subjectTypeOptions,
    submitShowMessageOptions,
} from "./config";
import { type IAddAttributeModalRef } from "./components/AddAttributeModal";
import { AdminShowElement } from "./components/FormSections/AdminShowElement";
import { AttributeSettingElement } from "./components/FormSections/AttributeSettingElement";
import { AuditTypeElement } from "./components/FormSections/AuditTypeElement";
import { AuditorIndexElement } from "./components/FormSections/AuditorIndexElement";
import { BasicInfoElement } from "./components/FormSections/BasicInfoElement";
import { CheckPowerTypeElement } from "./components/FormSections/CheckPowerTypeElement";
import { CodeClassEvalsElement } from "./components/FormSections/CodeClassEvalsElement";
import { ReactCorssTable } from "./components/CorssTable";
import { DataTypeAskElement } from "./components/FormSections/DataTypeAskElement";
import { DateHintElement } from "./components/FormSections/DateHintElement";
import { EvalBatchReviewElement } from "./components/FormSections/EvalBatchReviewElement";
import { EvalCheckPowerElement } from "./components/FormSections/EvalCheckPowerElement";
import { EvalCountElement } from "./components/FormSections/EvalCountElement";
import { EvalTypeElement } from "./components/FormSections/EvalTypeElement";
import { EvaluationObjectIndexElement } from "./components/FormSections/EvaluationObjectIndexElement";
import { MustDoElement } from "./components/FormSections/MustDoElement";
import { MustDoIndexElement } from "./components/FormSections/MustDoIndexElement";
import { ReviewinfoIndexElement } from "./components/FormSections/ReviewinfoIndexElement";
import { RuleTabsElement } from "./components/FormSections/RuleTabsElement";
import { SeeTypeIndexElement } from "./components/FormSections/SeeTypeIndexElement";
import { SelectOrgElement } from "./components/FormSections/SelectOrgElement";
import { SelfEvalTypeElement } from "./components/FormSections/SelfEvalTypeElement";
import { Step } from "./components/step";
import { SubjectFilterTypeElement } from "./components/FormSections/SubjectFilterTypeElement";
import { SubjectTypeElement } from "./components/FormSections/SubjectTypeElement";
import { SubmitShowMessageElement } from "./components/FormSections/SubmitShowMessageElement";
import { TableSet } from "./components/TableSet";
import { TextareaElement } from "./components/FormSections/TextareaElement";
import { list1 } from "./components/CorssTable/constant";
import type { AttrData } from "../../types/api.ts";
import SortModal from "./components/SortModal";

// 添加类型定义
interface TitleInfoItem {
    name: string;
    key: string;
}
export async function loader() {
    return {
        title: "教师量表",
    };
}
export const Component = () => {
    const [searchParams] = useSearchParams();
    const [getEvaluateInfo, { data: evaluateInfo }] =
        useLazyGetEvaluateInfoQuery();
    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            getEvaluateInfo({ id }).then((res) => {
                if (res?.data?.code !== 1) {
                    message.error(res?.data?.msg || "获取量表信息失败");
                    return;
                }

                const fetchData = {
                    ...res.data.data,
                    classifyId: res.data.data.classifyId.map((item) =>
                        Number(item),
                    ),
                };

                if (fetchData?.dateRange) {
                    fetchData.dateRange = [
                        dayjs(fetchData.dateRange[0]),
                        dayjs(fetchData.dateRange[1]),
                    ];
                }



                const attributes = fetchData?.attributes.map((item) => ({
                    ...item,
                    optionsList: item.options.map((i) => ({ name: i })),
                }));
                setAttrList(attributes);
                form.setFieldsValue(fetchData);
            });
        }
    }, [getEvaluateInfo]);
    const [addEvaluateMutation, { isLoading: isAddLoading }] =
        useAddEvaluateMutation();
    const [updateEvaluateMutation, { isLoading: isUpdateLoading }] =
        useUpdateEvaluateMutation();
    const [form] = useForm();
    const navigate = useNavigate();
    const initialValues = {
        scaleName: "",
        codeClassEvals: [0, 1],
        focusType: 0,
        focusStatus: 0,
        subjectTypeIndex: 0,
        selectOrg: 0,
        evalType: 0,
        subjectS: 0,
        selfEvalType: 0,
        subjectFilterType: 0,
        textarea: "",
        auditType: 0,
        auditorIndex: 0,
        evaluationObjectIndex: 0,
        submitShowMessage: 0,
        messageList: [""],
        adminShow: 0,
        seeTypeIndex: 0,
        evalCheckPower: 0,
        checkPowerType: 0,
        mustDoIndex: 0,
        mustDo: 1,
        dataTypeAsk: 0,
        dateRange: [dayjs(), dayjs()],
        corssTable: list1,
    };
    const { data: categories } = useGetCategoriesQuery({
        schoolCode: "RBI850",
    });
    const [attrList, setAttrList] = useState<AttrData[]>([]);
    const sortModalRef = useRef<any>(null);
    useEffect(() => {
        const id = searchParams.get("id");
        if (categories && !id) {
            const ids: number[] = [];
            const getIds = (data: any) => {
                return data.some((item: any) => {
                    if (!item.id) {
                        return false;
                    }
                    ids.push(item.id);
                    if (item.childs) {
                        return getIds(item.childs);
                    }
                    return true;
                });
            };
            getIds(categories.data);
            form.setFieldsValue({
                classifyId: ids,
            });
        }
    }, [categories, form]);
    return (
        <div className="h-full flex-col flex">
            <Header
                title="教师量表"
                extComponent={
                    <>
                        <TableSet />
                        <Button>已提交记录调整</Button>
                        <Button danger>删除</Button>
                        <Button
                            loading={isAddLoading || isUpdateLoading}
                            type={"primary"}
                            onClick={() => {
                                form.validateFields().then((values) => {
                                    if (evaluateInfo?.data?.id) {
                                        updateEvaluateMutation({
                                            ...values,
                                            attrList: values?.attrList?.map(
                                                (i, idx) => ({
                                                    ...i,
                                                    seq: idx,
                                                }),
                                            ),
                                            id: evaluateInfo?.data?.id,
                                        }).then((res) => {
                                            if (res?.data?.code === 1) {
                                                message.success("保存成功");
                                                navigate(-1);
                                            } else {
                                                message.error(
                                                    res?.data?.msg ||
                                                        "保存失败",
                                                );
                                            }
                                        });
                                    } else {
                                        addEvaluateMutation({
                                            ...values,
                                            attrList: values?.attrList?.map(
                                                (i, idx) => ({
                                                    ...i,
                                                    seq: idx,
                                                }),
                                            ),
                                        }).then((res) => {
                                            if (res?.data?.code === 1) {
                                                message.success("保存成功");
                                                navigate(-1);
                                            } else {
                                                message.error(
                                                    res?.data?.msg ||
                                                        "保存失败",
                                                );
                                            }
                                        });
                                    }
                                });
                            }}
                        >
                            保存
                        </Button>
                    </>
                }
            />
            <div className="flex-1 flex bg-gray-100 p-4 h-1">
                <div className="flex flex-1 overflow-y-scroll bg-white">
                    <Form
                        form={form}
                        className={"w-full p-5!"}
                        initialValues={initialValues}
                    >
                        <BasicInfoElement />
                        <Step
                            title={"基本设置"}
                            step={1}
                        />
                        <CodeClassEvalsElement />
                        <SelectOrgElement />
                        <EvalTypeElement />
                        <SubjectTypeElement />
                        <SelfEvalTypeElement />
                        <SubjectFilterTypeElement />
                        <TextareaElement />
                        <AuditTypeElement />
                        <ReviewinfoIndexElement />
                        <AuditorIndexElement />
                        <EvaluationObjectIndexElement />
                        <SubmitShowMessageElement />
                        <AdminShowElement />
                        <SeeTypeIndexElement />
                        <EvalCheckPowerElement />
                        <CheckPowerTypeElement />
                        <MustDoIndexElement />
                        <MustDoElement />
                        <DataTypeAskElement />
                        <EvalCountElement />
                        <EvalBatchReviewElement />

                        <Step
                            title={"填写信息"}
                            step={2}
                            after={
                                <Button
                                    type="link"
                                    onClick={() =>
                                        sortModalRef.current?.open(attrList)
                                    }
                                >
                                    页面展示顺序设置
                                </Button>
                            }
                        />
                        <DateHintElement />
                        <AttributeSettingElement
                            attrProps={attrList}
                            onChange={(list) => {
                                setAttrList(list);
                            }}
                        />
                        <Step
                            title={"评价内容"}
                            step={3}
                        />
                        <RuleTabsElement />
                        <ReactCorssTable />

                        <Step
                            title={"字段说明"}
                            step={4}
                        />
                        <div className="border p-4 rounded-md bg-gray-50">
                            <h3 className="text-lg font-bold mb-4">
                                表单字段说明
                            </h3>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">字段名</th>
                                        <th className="border p-2">说明</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">
                                            scaleName
                                        </td>
                                        <td className="border p-2">量表名称</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            classifyId
                                        </td>
                                        <td className="border p-2">分类</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            focusType
                                        </td>
                                        <td className="border p-2">
                                            类型 -
                                            {focusTypeOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            focusStatus
                                        </td>
                                        <td className="border p-2">
                                            状态 -
                                            {focusStatusOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">endTime</td>
                                        <td className="border p-2">停用时间</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            codeClassEvals
                                        </td>
                                        <td className="border p-2">
                                            听课性质 -
                                            {codeClassEvalsOptions.map(
                                                (item) => (
                                                    <span
                                                        key={item.value}
                                                        className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                    >
                                                        {item.value}:{item.name}
                                                    </span>
                                                ),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            selectOrg
                                        </td>
                                        <td className="border p-2">
                                            记录班级 -
                                            {selectOrgOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">evalType</td>
                                        <td className="border p-2">
                                            专家评价 -
                                            {evalTypeOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            subjectTypeIndex
                                        </td>
                                        <td className="border p-2">
                                            学科性质 -
                                            {subjectTypeOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">subjectS</td>
                                        <td className="border p-2">学科列表</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            selfEvalType
                                        </td>
                                        <td className="border p-2">
                                            能够自评 -
                                            {selfEvalTypeOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            subjectFilterType
                                        </td>
                                        <td className="border p-2">
                                            评价时学科显示规则 -
                                            {subjectFilterTypeOptions.map(
                                                (item) => (
                                                    <span
                                                        key={item.value}
                                                        className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                    >
                                                        {item.value}:{item.name}
                                                    </span>
                                                ),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">textarea</td>
                                        <td className="border p-2">说明</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            auditType
                                        </td>
                                        <td className="border p-2">
                                            审核模式 -
                                            {auditTypeOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            reviewinfoIndex
                                        </td>
                                        <td className="border p-2">审核流程</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            auditorIndex
                                        </td>
                                        <td className="border p-2">
                                            审核人/评价人 -
                                            {auditorOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            checkTeacher
                                        </td>
                                        <td className="border p-2">
                                            审核人-指定教师
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            evaluationObjectIndex
                                        </td>
                                        <td className="border p-2">
                                            被评价人 -
                                            {evaluationObjectOptions.map(
                                                (item) => (
                                                    <span
                                                        key={item.type}
                                                        className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                    >
                                                        {item.type}:{item.name}
                                                    </span>
                                                ),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            evaluationTeachers
                                        </td>
                                        <td className="border p-2">
                                            被评价人-限定老师
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            submitShowMessage
                                        </td>
                                        <td className="border p-2">
                                            提交后出现激励话 -
                                            {submitShowMessageOptions.map(
                                                (item) => (
                                                    <span
                                                        key={item.value}
                                                        className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                    >
                                                        {item.value}:{item.name}
                                                    </span>
                                                ),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            messageList
                                        </td>
                                        <td className="border p-2">
                                            激励话列表
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            adminShow
                                        </td>
                                        <td className="border p-2">
                                            管理员是否能看到自己被评任务 -
                                            {adminShowOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            seeTypeIndex
                                        </td>
                                        <td className="border p-2">
                                            被评价人结果显示 -
                                            {seeTypeOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            evalCheckPower
                                        </td>
                                        <td className="border p-2">
                                            评价人能否在他评面板看到其它老师评价
                                            -
                                            {evalCheckPowerOptions.map(
                                                (item) => (
                                                    <span
                                                        key={item.value}
                                                        className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                    >
                                                        {item.value}:{item.name}
                                                    </span>
                                                ),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            checkPowerType
                                        </td>
                                        <td className="border p-2">
                                            非管理层老师结果显示 -
                                            {checkPowerTypeOptions.map(
                                                (item) => (
                                                    <span
                                                        key={item.value}
                                                        className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                    >
                                                        {item.value}:{item.name}
                                                    </span>
                                                ),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            mustDoIndex
                                        </td>
                                        <td className="border p-2">
                                            次数要求/计划轮次 -
                                            {mustDoIndexOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            dateRange
                                        </td>
                                        <td className="border p-2">日期范围</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">mustDo</td>
                                        <td className="border p-2">
                                            每学期/每学年需要完成次数
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            dataTypeAsk
                                        </td>
                                        <td className="border p-2">
                                            要求性质 -
                                            {dataTypeAskOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            evalCount
                                        </td>
                                        <td className="border p-2">
                                            轮次中可被多次评价 -
                                            {evalCountOptions.map((item) => (
                                                <span
                                                    key={item.value}
                                                    className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                >
                                                    {item.value}:{item.name}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            evalBatchReview
                                        </td>
                                        <td className="border p-2">
                                            审核模式 -
                                            {evalBatchReviewOptions.map(
                                                (item) => (
                                                    <span
                                                        key={item.value}
                                                        className="ml-1 bg-blue-100 px-1 rounded mr-1"
                                                    >
                                                        {item.value}:{item.name}
                                                    </span>
                                                ),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            evalBatchReviewTeachers
                                        </td>
                                        <td className="border p-2">
                                            审核模式相关的教师
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">dateHint</td>
                                        <td className="border p-2">
                                            创建记录时归属日期的提示描述
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">attrList</td>
                                        <td className="border p-2">属性列表</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            titleinfoList
                                        </td>
                                        <td className="border p-2">
                                            规则列表标题
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">
                                            startDate
                                        </td>
                                        <td className="border p-2">开始日期</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">endDate</td>
                                        <td className="border p-2">结束日期</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Form>
                </div>
            </div>

            <SortModal
                onRef={sortModalRef}
                callBack={(type, payload) => {
                    if (type === "confirm") {
                        setAttrList(payload || []);
                    }
                    sortModalRef.current?.close();
                }}
            />
        </div>
    );
};

Component.displayName = "ScaleCreate";
