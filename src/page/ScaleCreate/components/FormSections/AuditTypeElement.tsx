import { Form, Radio } from "antd";
import { auditTypeOptions } from "../../config";

export const AuditTypeElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {![1, 2].includes(focusType) && (
                <Form.Item label={"审核模式"} name={"auditType"}>
                    <Radio.Group>
                        {auditTypeOptions.map((item) => (
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
