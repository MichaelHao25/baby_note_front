import { Form, Input, Cascader, Select, DatePicker } from "antd";
import { focusTypeOptions, focusStatusOptions } from "../../config";
import icon1 from "../../../../assets/img/icon1.png";
import { useGetCategoriesQuery } from "../../../../store/apiSlice";

interface BasicInfoElementProps {}

export const BasicInfoElement = (props: BasicInfoElementProps) => {
    const { data: categories, isLoading: categoriesIsLoading } =
        useGetCategoriesQuery({ schoolCode: "RBI850" });
    const form = Form.useFormInstance();
    const focusStatus = Form.useWatch("focusStatus", form);

    return (
        <div
            className={
                "w-full pl-5 flex gap-5 items-center border-b border-solid border-b-gray-100"
            }
        >
            <div className={"w-32 h-32 flex items-center justify-center"}>
                <img className={"w-20 h-20"} src={icon1} alt="" />
            </div>
            <div>
                <div className="flex gap-5">
                    <Form.Item
                        label={"量表名称 "}
                        rules={[{ required: true, message: "请输入量表名称" }]}
                        name={"scaleName"}
                    >
                        <Input placeholder={"输入量表名称"} className="w-40!" />
                    </Form.Item>

                    <Form.Item label={"分      类 "} name={"classifyId"}>
                        <Cascader
                            loading={categoriesIsLoading}
                            options={categories?.data}
                            className="w-40!"
                            fieldNames={{
                                label: "name",
                                value: "id",
                                children: "childs",
                            }}
                        />
                    </Form.Item>
                </div>
                <div className="flex gap-5">
                    <Form.Item
                        className={"mb-0!"}
                        label={"类      型 "}
                        name={"focusType"}
                    >
                        <Select className="w-40!">
                            {focusTypeOptions.map((item) => (
                                <Select.Option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        className={"mb-0!"}
                        label={"状      态 "}
                        name={"focusStatus"}
                    >
                        <Select className="w-40!">
                            {focusStatusOptions.map((item) => (
                                <Select.Option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {focusStatus !== 0 && (
                        <Form.Item
                            label={"停用时间"}
                            name={"endTime"}
                            className="mb-0!"
                        >
                            <DatePicker
                                className="w-40!"
                                placeholder="请选择停用时间"
                            />
                        </Form.Item>
                    )}
                </div>
            </div>
        </div>
    );
};
