import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input } from "antd";
import React from "react";
import { useState } from "react";

interface IValue {
    rule: string;
    key?: string | number;
    list?: string[];
}

interface IRuleModal {
    text?: string;
    value?: Array<IValue>;
    onChange?: (value: Array<IValue>) => void;
}

export const RuleModal = (props: IRuleModal) => {
    const { value = [], onChange, text } = props;
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    return (
        <div className="w-full h-full">
            <Drawer
                title={"规则管理"}
                open={open}
                width={800}
                afterOpenChange={(open) => {
                    if (open) {
                        form.setFieldsValue({
                            ruleList: value,
                        });
                    }
                }}
                onClose={() => {
                    setOpen(false);
                    form.validateFields().then(
                        (values: { ruleList: IValue[] }) => {
                            if (onChange && values.ruleList) {
                                onChange(
                                    values.ruleList.map((item, index) => {
                                        return {
                                            ...item,
                                            key:
                                                item.key?.toString() ||
                                                index.toString(),
                                        };
                                    }),
                                );
                            }
                        },
                    );
                }}
            >
                <Form<{ ruleList: IValue[] }> form={form}>
                    <Form.List name="ruleList">
                        {(fields, { add, remove }) => {
                            return (
                                <>
                                    {fields.map((field) => {
                                        const { key, name } = field;
                                        return (
                                            <React.Fragment key={key}>
                                                <Form.Item
                                                    key={key}
                                                    label=""
                                                    name={[name, "rule"]}
                                                >
                                                    <Input
                                                        addonAfter={
                                                            key === 0 ? null : (
                                                                <DeleteFilled
                                                                    onClick={() =>
                                                                        remove(
                                                                            name,
                                                                        )
                                                                    }
                                                                />
                                                            )
                                                        }
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    hidden
                                                    name={[name, "key"]}
                                                >
                                                    <Input type="hidden" />
                                                </Form.Item>
                                                <Form.Item
                                                    hidden
                                                    name={[name, "list"]}
                                                >
                                                    <Input type="hidden" />
                                                </Form.Item>
                                            </React.Fragment>
                                        );
                                    })}
                                    <Button
                                        type={"dashed"}
                                        className="w-full"
                                        icon={<PlusOutlined />}
                                        onClick={() => add({})}
                                    >
                                        添加新规则
                                    </Button>
                                </>
                            );
                        }}
                    </Form.List>
                </Form>
            </Drawer>
            <div
                onClick={() => setOpen(true)}
                className="w-full h-full px-3 flex items-center justify-center gap-2"
            >
                <PlusOutlined />
                {text || "规则管理"}
            </div>
        </div>
    );
};
