import { Form, Input, Radio } from "antd";
import { useRef } from "react";
import { TeacherSelect } from "../../../../components/TeacherSelect/indx";
import { auditorOptions } from "../../config";

interface AuditorIndexElementProps {}

export const AuditorIndexElement = ({}: AuditorIndexElementProps) => {
    const auditorIndexExtra = useRef<HTMLDivElement>(null);
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    const auditorIndex = Form.useWatch("auditorIndex", form);
    const checkTeacher = Form.useWatch("checkTeacher", form);
    const onChangeCheckTeacher = (value: string[]) => {
        form.setFieldValue("checkTeacher", value);
    };

    return (
        <div>
            <div className={"flex gap-2 items-start"}>
                <Form.Item
                    label={
                        focusType && focusType === 1
                            ? "评价人"
                            : focusType === 2
                              ? "可发起评价他人"
                              : "审核人"
                    }
                    name="auditorIndex"
                >
                    {[1, 2].includes(focusType) ? (
                        <></>
                    ) : (
                        <Radio.Group>
                            {auditorOptions.map((item) => (
                                <Radio.Button
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.name}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    )}
                </Form.Item>
                {/* 如果审核模式为1或2，则不显示审核人 */}
                {(focusType !== 0 || auditorIndex !== 0) && (
                    <div>
                        <TeacherSelect
                            extra={auditorIndexExtra.current}
                            type={0}
                            value={checkTeacher}
                            onChange={onChangeCheckTeacher}
                        />
                    </div>
                )}
            </div>
            {/* {(focusType !== 0 || auditorIndex !== 0) && ( */}
            <div ref={auditorIndexExtra}></div>
            {/* )} */}
            <Form.Item
                label={`${
                    focusType && focusType === 1
                        ? "评价人"
                        : focusType === 2
                          ? "可发起评价他人"
                          : "审核人"
                }-指定教师`}
                hidden
                name="checkTeacher"
            >
                <Input type="hidden" />
            </Form.Item>
        </div>
    );
};
