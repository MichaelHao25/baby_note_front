import { Form, Radio } from "antd";
import { subjectFilterTypeOptions } from "../../config";

export const SubjectFilterTypeElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {![0, 1, 2].includes(focusType) && (
                <Form.Item
                    label={"评价时学科显示规则"}
                    name={"subjectFilterType"}
                >
                    <Radio.Group>
                        {subjectFilterTypeOptions.map((item) => (
                            <Radio.Button key={item.value} value={item.value}>
                                {item.name}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
            )}
        </>
    );
};
