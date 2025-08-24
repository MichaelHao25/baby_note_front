import { DeleteFilled, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Drawer,
    Form,
    Input,
    InputNumber,
    Radio,
} from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { cnLevelList, enLevelList } from "./config";

interface IEvaluationFormula {
    value?: any;
    onChange?: (value: any) => void;
}
export const EvaluationFormula = (props: IEvaluationFormula) => {
    const { value, onChange } = props;
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const initialValues = {
        titleinfoList: "null",
        isExpression: "0",
        defaultRule: "SUM",
        formula: "",
        updateScore: "0",
        ruleIndex: 2,
    };
    const isExpression = Form.useWatch("isExpression", form);
    const updateScore = Form.useWatch("updateScore", form);
    const ruleIndex = Form.useWatch("ruleIndex", form);
    useEffect(() => {
        if (ruleIndex === 0) {
            form.setFieldsValue({
                scoreLevel: enLevelList,
            });
        }
        if (ruleIndex === 1) {
            form.setFieldsValue({
                scoreLevel: cnLevelList,
            });
        }
    }, [ruleIndex]);
    return (
        <div>
            <Drawer
                title="评价结果计算公式"
                open={open}
                width={800}
                afterOpenChange={(open) => {
                    if (open) {
                        // form.setFieldsValue(value);
                    } else {
                        // onChange(form.getFieldsValue());
                    }
                }}
                onClose={() => {
                    setOpen(false);
                    form.validateFields().then((values) => {
                        console.log(values);
                    });
                }}
                footer={
                    <div className="flex justify-end gap-4">
                        <Button
                            type="default"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            取消
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                form.validateFields().then((values) => {
                                    console.log(values);
                                });
                            }}
                        >
                            保存
                        </Button>
                    </div>
                }
            >
                <Form
                    form={form}
                    initialValues={initialValues}
                >
                    <Form.Item
                        label="规则"
                        name="titleinfoList"
                    >
                        <Radio.Group>
                            <Radio.Button value="null">
                                缺省积点规则
                            </Radio.Button>
                            <Radio.Button value="custom">
                                自定义积点规则
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="根据公式计算总分"
                        name="isExpression"
                    >
                        <Radio.Group>
                            <Radio.Button value="0">是</Radio.Button>
                            <Radio.Button value="1">否</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="公式快速填写"
                        name="defaultRule"
                        hidden={isExpression === "1"}
                    >
                        <Radio.Group>
                            {[
                                {
                                    name: "SUM",
                                    type: "A1",
                                },
                                {
                                    name: "AVE",
                                    type: "(A1)/1",
                                },
                            ].map((item) => (
                                <Radio.Button
                                    key={item.name}
                                    value={item.name}
                                >
                                    {item.name}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="公式"
                        name="formula"
                        hidden={isExpression === "1"}
                        tooltip={
                            <div>
                                说明:由于每个量表可以用于多次评价，而且每个量表的积点也不同，因此，需要运用计算公式获得一个维度的总点数。
                                <br />
                                举例说明计算公式写法: <br />
                                取量表多次评价的总点数：ADD(L1) <br />
                                取量表多次评价的最大点数：MAX(L1) <br />
                                取量表多次评价的平均点数：MEAN(L1) <br />
                                取量表的评价次数：COUNT(L1) <br />
                                条件判断: IF(条件判断表达式, true的结果,
                                false的结果) <br />
                                多量表的计算：1个量表累加,1个量表取最大 <br />
                                公式：ADD(L1) + MAX(L2) <br />
                                多量表的计算：1个量表达到5次,得到5点,否则0点;1个量表取平均{" "}
                                <br />
                                公式：IF(COUNT(L1) &gt;= 5, 5, 0) + MEAN(L2)
                            </div>
                        }
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="支持审核或管理手动调整总分"
                        name="updateScore"
                    >
                        <Radio.Group>
                            <Radio.Button value="0">支持</Radio.Button>
                            <Radio.Button value="1">不支持</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="设置积分赋值说明"
                        hidden={updateScore === "1"}
                        name="updateHelp"
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="显示规则"
                        name="ruleIndex"
                        tooltip="注意,重新设置后下面的数据会丢失"
                    >
                        <Radio.Group>
                            {[
                                {
                                    name: "字母",
                                },
                                {
                                    name: "汉字",
                                },
                                {
                                    name: "积点",
                                },
                            ].map((item, index) => (
                                <Radio.Button
                                    key={index}
                                    value={index}
                                >
                                    {item.name}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                    {ruleIndex !== 2 && (
                        <Form.List name="scoreLevel">
                            {(fields, { add, remove }) => (
                                <div>
                                    <div className="flex justify-between">
                                        <div className="flex-1 text-center">
                                            说明
                                        </div>
                                        <div className="flex-1 text-center">
                                            积点要求
                                            <span className="text-blue-500">
                                                (本列引用值是根据上方公式计算得出)
                                            </span>
                                        </div>
                                    </div>
                                    {fields.map((field) => (
                                        <div
                                            className="flex justify-between gap-6"
                                            key={field.key}
                                        >
                                            <Form.Item
                                                key={field.key}
                                                label=""
                                                className="flex-1"
                                                name={[field.name, "level"]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                key={field.key}
                                                label=""
                                                className="flex-1"
                                                name={[field.name, "score"]}
                                            >
                                                <InputNumber className="w-full!" />
                                            </Form.Item>
                                            <Button
                                                type="text"
                                                icon={<DeleteFilled />}
                                                onClick={() =>
                                                    remove(field.name)
                                                }
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        type={"dashed"}
                                        className="w-full"
                                        icon={<PlusOutlined />}
                                        onClick={() => add({})}
                                    >
                                        添加新规则
                                    </Button>
                                </div>
                            )}
                        </Form.List>
                    )}
                </Form>
            </Drawer>
            <Button
                type={"primary"}
                icon={<SettingOutlined />}
                onClick={() => setOpen(true)}
            >
                公式设置
            </Button>
        </div>
    );
};
