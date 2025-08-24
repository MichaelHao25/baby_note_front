import { Form, Input, Tabs } from "antd";
import { useRef } from "react";
import { RuleModal } from "../RuleModal";
import { TeacherSelect } from "../../../../components/TeacherSelect/indx";

interface TitleInfoItem {
    rule: string;
    key?: string | number;
    list?: string[];
}

interface ReviewinfoIndexElementProps {}

const TeacherSelectWrap = (props: {
    value?: string[];
    onChange?: (value: string[]) => void;
}) => {
    const { value, onChange } = props;
    const reviewinfoIndexExtra = useRef<HTMLDivElement>(null);
    return (
        <>
            <div>
                <TeacherSelect
                    extra={reviewinfoIndexExtra.current}
                    type={0}
                    value={value}
                    onChange={onChange}
                />
            </div>
            <div ref={reviewinfoIndexExtra}></div>
        </>
    );
};
export const ReviewinfoIndexElement = (props: ReviewinfoIndexElementProps) => {
    const form = Form.useFormInstance();
    const auditType = Form.useWatch("auditType", form);
    const reviewinfoIndex = Form.useWatch("reviewinfoIndex", form);

    const onChangeReviewinfoIndexTeacher = (value: string[], index: number) => {
        const newReviewinfoIndexTeacher = [...(reviewinfoIndex ?? [])];
        newReviewinfoIndexTeacher[index].list = value;
        form.setFieldValue("reviewinfoIndexTeacher", newReviewinfoIndexTeacher);
    };
    return (
        <>
            <Form.Item hidden name={"reviewinfoIndex"}>
                <Input type="hidden" />
            </Form.Item>
            {auditType === 1 && (
                <Form.Item label={"审核流程"}>
                    <Tabs
                        defaultActiveKey="0"
                        type="editable-card"
                        onChange={(key) => {
                            console.log("key", key);
                        }}
                        addIcon={
                            <RuleModal
                                text={"设置"}
                                value={reviewinfoIndex}
                                onChange={(value) => {
                                    form.setFieldsValue({
                                        reviewinfoIndex: value,
                                    });
                                }}
                            />
                        }
                        items={(reviewinfoIndex ?? []).map(
                            (item: TitleInfoItem, index: number) => {
                                const { rule, key } = item;
                                return {
                                    label: rule,
                                    key,
                                    closeIcon: null,
                                    children: (
                                        <TeacherSelectWrap
                                            value={
                                                reviewinfoIndex?.[index]
                                                    ?.list ?? []
                                            }
                                            onChange={(value) => {
                                                onChangeReviewinfoIndexTeacher(
                                                    value,
                                                    index,
                                                );
                                            }}
                                        />
                                    ),
                                };
                            },
                        )}
                    />
                </Form.Item>
            )}
        </>
    );
};
