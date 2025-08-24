import { Form, Radio, DatePicker } from "antd";
import { mustDoIndexOptions } from "../../config";

export const MustDoIndexElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    const mustDoIndex = Form.useWatch("mustDoIndex", form);
    return (
        <>
            {![2].includes(focusType) && (
                <div className="flex gap-4">
                    <Form.Item
                        label={focusType == 0 ? "次数要求" : "计划轮次"}
                        name={"mustDoIndex"}
                    >
                        <Radio.Group>
                            {mustDoIndexOptions.map((item) => (
                                <Radio.Button
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.name}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                    {mustDoIndex === 2 && (
                        <Form.Item name={"dateRange"}>
                            <DatePicker.RangePicker />
                        </Form.Item>
                    )}
                </div>
            )}
        </>
    );
};
