import { Form, Radio } from "antd";
import { seeTypeOptions } from "../../config";

export const SeeTypeIndexElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {focusType !== 0 && (
                <Form.Item label={"被评价人结果显示"} name={"seeTypeIndex"}>
                    <Radio.Group>
                        {seeTypeOptions.map((item) => (
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
