import { Form, Checkbox } from "antd";
import { codeClassEvalsOptions } from "../../config";

interface CodeClassEvalsElementProps {}

export const CodeClassEvalsElement = ({}: CodeClassEvalsElementProps) => {
    const form = Form.useFormInstance();
    const focusType = Form.useWatch("focusType", form);

    return (
        <>
            {focusType === 2 && (
                <Form.Item label={"听课性质"} name={"codeClassEvals"}>
                    <Checkbox.Group>
                        {codeClassEvalsOptions.map((item) => (
                            <Checkbox key={item.value} value={item.value}>
                                {item.name}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>
            )}
        </>
    );
};
