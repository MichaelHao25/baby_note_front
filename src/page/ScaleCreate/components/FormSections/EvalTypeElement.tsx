import { Form, Radio } from "antd";
import { evalTypeOptions } from "../../config";

export const EvalTypeElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {focusType === 2 && (
                <Form.Item label={"专家评价"} name={"evalType"}>
                    <Radio.Group>
                        {evalTypeOptions.map((item) => (
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
