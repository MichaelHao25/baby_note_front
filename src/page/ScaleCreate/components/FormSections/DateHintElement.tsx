import { Form, Input } from "antd";

export const DateHintElement = () => {
    return (
        <Form.Item label={"创建记录时，归属日期的提示描述 "} name="dateHint">
            <Input placeholder={"记录归属日期"} className={"w-40!"} />
        </Form.Item>
    );
};
