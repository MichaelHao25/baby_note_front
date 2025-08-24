import { Form, Radio } from "antd";
import { checkPowerTypeOptions } from "../../config";

export const CheckPowerTypeElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {![0, 1].includes(focusType) && (
                <Form.Item
                    label={"非管理层老师结果显示"}
                    name={"checkPowerType"}
                >
                    <Radio.Group>
                        {checkPowerTypeOptions.map((item) => (
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
