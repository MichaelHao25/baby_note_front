import { Form, Input, Radio } from "antd";
import { useRef } from "react";
import { TeacherSelect } from "../../../../components/TeacherSelect/indx";
import { evalBatchReviewOptions } from "../../config";

interface EvalBatchReviewElementProps {}

export const EvalBatchReviewElement = ({}: EvalBatchReviewElementProps) => {
    const evalBatchReviewExtra = useRef<HTMLDivElement>(null);
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    const evalBatchReview = Form.useWatch("evalBatchReview", form);
    const evalBatchReviewTeachers = Form.useWatch(
        "evalBatchReviewTeachers",
        form,
    );
    const onChangeEvalBatchReviewTeachers = (value: string[]) => {
        form.setFieldValue("evalBatchReviewTeachers", value);
    };
    return (
        <>
            {focusType === 1 && (
                <Form.Item label={"审核模式"} name="evalBatchReview">
                    <Radio.Group>
                        {evalBatchReviewOptions.map((item) => (
                            <Radio.Button key={item.value} value={item.value}>
                                {item.name}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
            )}
            {evalBatchReview === 1 && (
                <div>
                    <TeacherSelect
                        extra={evalBatchReviewExtra.current}
                        type={1}
                        value={evalBatchReviewTeachers}
                        onChange={onChangeEvalBatchReviewTeachers}
                    />
                </div>
            )}
            {/* {evalBatchReview === 1 &&  */}
            <div ref={evalBatchReviewExtra}></div>
            {/* } */}
            <Form.Item
                label={"被评价人-限定老师"}
                hidden
                name="evalBatchReviewTeachers"
            >
                <Input type="hidden" />
            </Form.Item>
        </>
    );
};
