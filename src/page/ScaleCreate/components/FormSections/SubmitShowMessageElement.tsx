import { Form, Radio } from "antd";
import MotivationalPhrases from "../../MotivationalPhrases";
import { submitShowMessageOptions } from "../../config";

interface SubmitShowMessageElementProps {}

export const SubmitShowMessageElement = (
    props: SubmitShowMessageElementProps,
) => {
    const form = Form.useFormInstance();
    const submitShowMessage = Form.useWatch("submitShowMessage", form);
    const messageList = Form.useWatch("messageList", form);
    return (
        <>
            <div className={"flex gap-5 items-center"}>
                <Form.Item
                    label={"提交后出现激励话"}
                    name={"submitShowMessage"}
                >
                    <Radio.Group>
                        {submitShowMessageOptions.map((item) => (
                            <Radio.Button key={item.value} value={item.value}>
                                {item.name}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
                {submitShowMessage !== 0 && (
                    <Form.Item
                        label={`当前设置了${messageList?.length ?? 0}段话`}
                        name="messageList"
                        colon={false}
                    >
                        <MotivationalPhrases />
                    </Form.Item>
                )}
            </div>
        </>
    );
};
