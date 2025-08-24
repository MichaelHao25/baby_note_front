import { Form, Input, InputNumber } from "antd";

export const MustDoElement = () => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);
    const mustDoIndex = Form.useWatch("mustDoIndex", form);
    return (
        <>
            {![2].includes(focusType) && (
                <div className={"flex gap-2 pl-8"}>
                    <Form.Item
                        label={`${
                            mustDoIndex == 0
                                ? "每学期"
                                : mustDoIndex == 1
                                  ? "每学年"
                                  : ""
                        }需要完成`}
                        name="mustDo"
                    >
                        <InputNumber className={"w-25!"} addonAfter="次" />
                    </Form.Item>
                    <Form.Item
                        colon={false}
                        label={
                            <>
                                <span className={"text-blue-400 pr-2"}>
                                    * 填写具体次数后将会在提交时显示要求的次数
                                </span>
                            </>
                        }
                    >
                        <Input type="hidden" />
                    </Form.Item>
                </div>
            )}
        </>
    );
};
