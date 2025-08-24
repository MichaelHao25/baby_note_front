import { Button, Form, InputNumber, Modal, Radio, Select } from "antd";

const options = [
    {
        name: "选择评价标准",
        type: 0,
    },
    {
        name: "输入数值",
        type: 1,
    },
    {
        name: "文本描述",
        type: 2,
    },
];
export const inputRuleOptions = [
    {
        name: "整数",
        value: 0,
    },
    {
        name: "可输入小数",
        value: 1,
    },
];
export interface IEvaluationMethodProps {
    initialConfig?: {
        open: boolean;
        evaluationMethod?: number;
        minValue?: number;
        maxValue?: number;
        inputRule?: number;
        inputLine?: number;
        fillType?: number;
    };
    onOk: (values: IEvaluationMethodProps["initialConfig"]) => void;
    rowLevelCount?: number;
}
export const EvaluationMethod = (props: IEvaluationMethodProps) => {
    const { initialConfig, onOk, rowLevelCount = 1 } = props;
    const { open, ...initialValues } = initialConfig || {};
    const [form] = Form.useForm();
    const evaluationMethod = Form.useWatch("evaluationMethod", form);

    return (
        <Modal
            open={open}
            onCancel={() => {
                onOk?.({
                    open: false,
                });
            }}
            onOk={() => {
                form.validateFields().then((values) => {
                    onOk?.(values);
                });
            }}
            title="设置评价方式"
            width={700}
            afterOpenChange={(open) => {
                if (open) {
                    form.resetFields();
                }
            }}
        >
            <Form
                form={form}
                className="min-h-36"
                initialValues={initialValues}
            >
                <Form.Item
                    name="evaluationMethod"
                    label="评价方式"
                    rules={[{ required: true, message: "请选择评价方式" }]}
                >
                    <Radio.Group>
                        {options.map((item) => {
                            const isDisabled =
                                rowLevelCount > 1 &&
                                (item.type === 1 || item.type === 2);
                            return (
                                <Radio.Button
                                    key={item.type}
                                    value={item.type}
                                    disabled={isDisabled}
                                    title={
                                        isDisabled
                                            ? "只有层次为1时才可选择此选项"
                                            : ""
                                    }
                                >
                                    {item.name}
                                </Radio.Button>
                            );
                        })}
                    </Radio.Group>
                </Form.Item>
                {evaluationMethod === 1 && (
                    <>
                        <Form.Item
                            rules={[
                                { required: true, message: "请输入最小值" },
                            ]}
                            name="minValue"
                            label="最小值"
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item
                            rules={[
                                { required: true, message: "请输入最大值" },
                            ]}
                            name="maxValue"
                            label="最大值"
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item
                            rules={[
                                { required: true, message: "请选择输入规则" },
                            ]}
                            name="inputRule"
                            label="输入规则"
                        >
                            <Radio.Group>
                                {inputRuleOptions.map((item) => (
                                    <Radio.Button
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.name}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    </>
                )}
                {evaluationMethod === 2 && (
                    <>
                        <Form.Item
                            rules={[
                                { required: true, message: "请输入输入框高度" },
                            ]}
                            name="inputLine"
                            label="输入框高度"
                        >
                            <InputNumber addonAfter="行" />
                        </Form.Item>
                    </>
                )}
                {evaluationMethod === 3 && (
                    <>
                        <Form.Item
                            rules={[
                                { required: true, message: "请选择填写类型" },
                            ]}
                            name="fillType"
                            label="填写类型"
                        >
                            <Radio.Group>
                                {[
                                    {
                                        name: "数值",
                                        value: 0,
                                    },
                                    {
                                        name: "文本",
                                        value: 1,
                                    },
                                ].map((item) => (
                                    <Radio.Button
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.name}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    );
};
