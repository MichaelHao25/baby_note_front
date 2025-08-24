import { Form, Radio } from "antd";
import { dataTypeAskOptions } from "../../config";

export const DataTypeAskElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    return (
        <>
            {![2].includes(focusType) && (
                <div className={"pl-8"}>
                    <Form.Item label={"要求性质"} name="dataTypeAsk">
                        <Radio.Group>
                            {dataTypeAskOptions.map((item) => (
                                <Radio.Button
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.name}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                </div>
            )}
        </>
    );
};
