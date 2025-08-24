import { Form, Radio } from "antd";
import { evalCountOptions } from "../../config";

export const EvalCountElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {focusType === 1 && (
                <Form.Item label={"轮次中可被多次评价"} name="evalCount">
                    <Radio.Group>
                        {evalCountOptions.map((item) => (
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
