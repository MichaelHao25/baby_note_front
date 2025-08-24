import { Form, Radio, Checkbox, Spin } from "antd";
import { subjectTypeOptions } from "../../config";
import { useGetSubjectsQuery } from "../../../../store/apiSlice";

interface SubjectTypeElementProps {}

export const SubjectTypeElement = (props: SubjectTypeElementProps) => {
    const { data: subjects, isFetching } = useGetSubjectsQuery();
    const form = Form.useFormInstance();
    const subjectTypeIndex = Form.useWatch("subjectTypeIndex", form);
    return (
        <>
            <Form.Item label={"学科性质"} name={"subjectTypeIndex"}>
                <Radio.Group>
                    {subjectTypeOptions.map((item) => (
                        <Radio.Button key={item.value} value={item.value}>
                            {item.name}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </Form.Item>
            {subjectTypeIndex !== 0 &&
                (isFetching === true ? (
                    <div className="flex justify-center items-center pb-6">
                        <Spin />
                    </div>
                ) : (
                    <Form.Item
                        label={""}
                        name={"subjectS"}
                        className="mt-[-10px]!"
                    >
                        <Checkbox.Group>
                            {subjects?.data?.map((item: any) => (
                                <Checkbox
                                    key={item.id}
                                    value={item.id}
                                    style={{ lineHeight: "32px" }}
                                >
                                    {item.name}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>
                ))}
        </>
    );
};
