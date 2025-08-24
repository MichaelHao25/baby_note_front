import { Form, Radio } from "antd";
import { evalCheckPowerOptions } from "../../config";

export const EvalCheckPowerElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {focusType !== 0 && (
                <Form.Item
                    label={"评价人能否在他评面板看到其它老师评价"}
                    name={"evalCheckPower"}
                >
                    <Radio.Group>
                        {evalCheckPowerOptions.map((item) => (
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
