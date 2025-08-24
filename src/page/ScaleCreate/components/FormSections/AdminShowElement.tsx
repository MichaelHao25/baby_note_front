import { Form, Radio } from "antd";
import { adminShowOptions } from "../../config";

export const AdminShowElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {focusType !== 0 && (
                <Form.Item
                    label={"管理员是否能看到自己被评任务"}
                    name={"adminShow"}
                >
                    <Radio.Group>
                        {adminShowOptions.map((item) => (
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
