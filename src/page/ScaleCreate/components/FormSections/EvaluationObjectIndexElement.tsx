import { Form, Input, Radio } from "antd";
import { useRef } from "react";
import { TeacherSelect } from "../../../../components/TeacherSelect/indx";
import { evaluationObjectOptions } from "../../config";

interface EvaluationObjectIndexElementProps {}

export const EvaluationObjectIndexElement =
    ({}: EvaluationObjectIndexElementProps) => {
        const evaluationObjectIndexExtra = useRef<HTMLDivElement>(null);
        const form = Form.useFormInstance();
        const evaluationObjectIndex = Form.useWatch(
            "evaluationObjectIndex",
            form,
        );
        const evaluationTeachers = Form.useWatch("evaluationTeachers", form);
        const onChangeEvaluationTeachers = (value: string[]) => {
            form.setFieldValue("evaluationTeachers", value);
        };
        return (
            <>
                <div className={"flex gap-2 items-start"}>
                    <Form.Item label={"被评价人"} name="evaluationObjectIndex">
                        <Radio.Group>
                            {evaluationObjectOptions.map((item) => (
                                <Radio.Button key={item.type} value={item.type}>
                                    {item.name}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                    {evaluationObjectIndex === 2 && (
                        <div>
                            <TeacherSelect
                                extra={evaluationObjectIndexExtra.current}
                                type={1}
                                value={evaluationTeachers}
                                onChange={onChangeEvaluationTeachers}
                            />
                        </div>
                    )}
                </div>
                {/* {evaluationObjectIndex === 2 && ( */}
                <div ref={evaluationObjectIndexExtra}></div>
                {/* )} */}
                <Form.Item
                    label={"被评价人-限定老师"}
                    hidden
                    name="evaluationTeachers"
                >
                    <Input type="hidden" />
                </Form.Item>
            </>
        );
    };
