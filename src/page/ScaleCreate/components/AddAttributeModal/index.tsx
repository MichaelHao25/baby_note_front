import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { Modal, Radio, Input, Button, Form, InputNumber, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { focusIndexList, inputType, listObject, titleObject } from "./config";
import { UploadWrap } from "../../../../components/Upload";
import type { AttrData } from "../../../../types/api";
import { v4 as uuidv4 } from "uuid";

export interface IAddAttributeModalRef {
    open: (record?: AttrData) => void;
}

export interface IAddAttributeModalProps {
    value?: AttrData[];
    onChange?: (value: AttrData[]) => void;
}

// 扩展AttrData类型，添加缺少的属性
interface ExtendedAttrData extends AttrData {
    associationalWord?: string;
    fileList?: any[];
}

const AddAttributeModal = forwardRef<
    IAddAttributeModalRef,
    IAddAttributeModalProps
>((props, ref) => {
    const { value = [], onChange } = props;
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<AttrData | null>(null);
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        open: (record?: AttrData) => {
            handleOpen(record);
        },
    }));

    // 处理确定按钮点击
    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            let newValue = value;
            if (editRecord) {
                // 更新现有属性
                newValue = newValue.map((item) =>
                    item.id === editRecord.id
                        ? ({ ...item, ...values } as AttrData)
                        : item,
                );
                message.success("更新成功");
            } else {
                // 添加新属性（生成临时ID）
                newValue = [...value, { id: uuidv4(), ...values }];
            }
            // 关闭弹窗并触发onChange
            setOpen(false);
            onChange?.(newValue);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("表单验证失败", error);
        }
    };

    // 处理删除
    const handleDelete = () => {
        if (!editRecord) return;

        Modal.confirm({
            title: "确认删除",
            content: "确定要删除这个属性吗？",
            onOk: () => {
                try {
                    const newValue = value.filter(
                        (item) => item.id !== editRecord.id,
                    );
                    message.success("删除成功");
                    setOpen(false);
                    onChange?.(newValue);
                } catch (error) {
                    console.error("删除失败", error);
                    message.error("删除失败");
                }
            },
        });
    };

    // 打开弹窗
    const handleOpen = (record?: AttrData) => {
        setOpen(true);
        if (record) {
            setEditRecord(record);
            // 预填表单数据
            form.setFieldsValue({
                ...record,
            });
        } else {
            setEditRecord(null);
            form.resetFields();
        }
    };

    const initialValues = {
        focusIndex: 0,
        fileUploadingStatus: 0,
        inputType: 0,
        optionsList: [{ name: "" }, { name: "" }, { name: "" }, { name: "" }],
        descTitle: "",
    };

    const focusIndexValue: number = Form.useWatch("focusIndex", form);
    const inputTypeValue: number = Form.useWatch("inputType", form);
    useEffect(() => {
        if (focusIndexValue === 3) {
            form.setFieldsValue({
                descTitle: "简单概况本次记录的内容",
            });
        }
    }, [focusIndexValue]);

    return (
        <>
            <Button type="primary" onClick={() => handleOpen()}>
                添加属性
            </Button>
            <Modal
                title={editRecord ? "编辑属性" : "添加属性"}
                open={open}
                onCancel={() => setOpen(false)}
                width={800}
                footer={[
                    editRecord && (
                        <Button key="danger" onClick={handleDelete}>
                            删除
                        </Button>
                    ),
                    <Button key="cancel" onClick={() => setOpen(false)}>
                        取消
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                        loading={loading}
                    >
                        确定
                    </Button>,
                ]}
            >
                <Form form={form} initialValues={initialValues}>
                    <Form.Item label="类型" name="focusIndex">
                        <Radio.Group disabled={!!editRecord?.id}>
                            {focusIndexList.map((item) => (
                                <Radio.Button key={item.type} value={item.type}>
                                    {item.name}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={titleObject[focusIndexValue] ?? ""}
                        name="fileUploadingStatus"
                    >
                        <Radio.Group>
                            {(listObject[focusIndexValue] ?? []).map(
                                (item, index) => (
                                    <Radio.Button key={index} value={index}>
                                        {item.name}
                                    </Radio.Button>
                                ),
                            )}
                        </Radio.Group>
                    </Form.Item>
                    {[2].includes(focusIndexValue) && (
                        <Form.Item label="填写方式" name="inputType">
                            <Radio.Group>
                                {inputType.map((item, index) => (
                                    <Radio.Button key={index} value={index}>
                                        {item.name}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    )}
                    {[0, 1, 2, 3, 4, 5, 6].includes(focusIndexValue) && (
                        <Form.Item
                            label="属性名称"
                            name="name"
                            rules={[
                                { required: true, message: "请输入属性名称" },
                            ]}
                        >
                            <Input placeholder="请输入属性名称" />
                        </Form.Item>
                    )}
                    {[6].includes(focusIndexValue) && (
                        <Form.Item label="上传提示" name="desc">
                            <Input.TextArea placeholder="请输入上传提示" />
                        </Form.Item>
                    )}

                    {[2, 3].includes(focusIndexValue) && (
                        <Form.Item label="填写提示" name="descTitle">
                            <Input.TextArea placeholder="请输入填写提示" />
                        </Form.Item>
                    )}
                    {[2].includes(focusIndexValue) && (
                        <Form.Item label="输入框高度" name="rowNum">
                            <InputNumber
                                placeholder="请输入输入框高度"
                                addonAfter={<span>行</span>}
                            />
                        </Form.Item>
                    )}
                    {[2].includes(focusIndexValue) && (
                        <Form.Item
                            tooltip="用中英文，隔开"
                            label={
                                inputTypeValue === 1
                                    ? "下拉选项"
                                    : "输入框填写联想词"
                            }
                            name="associationalWord"
                        >
                            <Input.TextArea placeholder="请输入选项" />
                        </Form.Item>
                    )}
                    {[0, 1].includes(focusIndexValue) && (
                        <Form.Item
                            label="选项"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (
                                            !value ||
                                            value.filter(
                                                (v: any) => v && v.name.trim(),
                                            ).length < 2
                                        ) {
                                            return Promise.reject(
                                                "至少需要两个有效选项",
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Form.List
                                name={"optionsList"}
                                // 这里不能设置initialValue，否则会报错
                                // initialValue={initialValues.optionsList}
                            >
                                {(fields, { add, remove }) => {
                                    return (
                                        <>
                                            <div className="flex flex-wrap gap-x-4 flex-row">
                                                {fields.map(
                                                    ({ key, name, ...arr }) => (
                                                        <Form.Item
                                                            {...arr}
                                                            key={key}
                                                            name={[
                                                                name,
                                                                "name",
                                                            ]}
                                                            className="flex-1/3"
                                                        >
                                                            <Input
                                                                placeholder={`选项${name + 1}`}
                                                                addonAfter={
                                                                    <DeleteOutlined
                                                                        onClick={() =>
                                                                            remove(
                                                                                key,
                                                                            )
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </Form.Item>
                                                    ),
                                                )}
                                            </div>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusOutlined />}
                                            >
                                                添加选项
                                            </Button>
                                        </>
                                    );
                                }}
                            </Form.List>
                        </Form.Item>
                    )}
                    {[6].includes(focusIndexValue) && (
                        <Form.Item name={"fileList"} label={"参考附件"}>
                            <UploadWrap />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    );
});

export default AddAttributeModal;
