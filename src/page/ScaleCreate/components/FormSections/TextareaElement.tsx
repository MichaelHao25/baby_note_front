import { Form, Input } from "antd";

export const TextareaElement = () => {
    return (
        <Form.Item label="说明" name="textarea">
            <Input.TextArea placeholder={"请填写说明"} />
        </Form.Item>
    );
};
