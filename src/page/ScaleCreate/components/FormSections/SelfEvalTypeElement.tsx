import { Form, Radio } from "antd";
import { selfEvalTypeOptions } from "../../config";

export const SelfEvalTypeElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {focusType === 2 && (
                <Form.Item label={"能够自评"} name={"selfEvalType"}>
                    <Radio.Group>
                        {selfEvalTypeOptions.map((item) => (
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
