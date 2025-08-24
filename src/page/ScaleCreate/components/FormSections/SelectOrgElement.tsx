import { Form, Radio } from "antd";
import { selectOrgOptions } from "../../config";

export const SelectOrgElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {[1, 2].includes(focusType) && (
                <Form.Item label={"记录班级"} name={"selectOrg"}>
                    <Radio.Group>
                        {selectOrgOptions.map((item) => (
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
