import { EditFilled } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Tabs } from "antd";
import { useRef, useState } from "react";
import { useParams } from "react-router";
import icon1 from "../../assets/img/icon1.png";
import { Header } from "../../components/Header";
import { TeacherSelect } from "../../components/TeacherSelect/indx";
import { TableWrap } from "./components/Table";

export const SystemScale = () => {
    const { id } = useParams();
    const [editMode] = useState<boolean>(id ? true : false);
    const teacherSelectExtra = useRef<HTMLDivElement>(null);
    return (
        <div className="h-full flex-col flex">
            <Header title="编辑体系量表" />
            <div className="flex-1 flex bg-gray-100 p-4 h-1">
                <div className="flex flex-1 overflow-y-scroll bg-white">
                    <Form className={"w-full p-5!"}>
                        <div
                            className={
                                "w-full pl-5 flex gap-5 items-center border-b border-solid border-b-gray-100 mb-4"
                            }
                        >
                            <div
                                className={
                                    "w-32 h-32 flex items-center justify-center"
                                }
                            >
                                <img
                                    className={"w-20 h-20"}
                                    src={icon1}
                                    alt=""
                                />
                            </div>
                            <div className="flex-1 max-w-150">
                                <div className="flex flex-row gap-2">
                                    <Form.Item
                                        label={"名称 :  "}
                                        className="mb-0! flex-1"
                                    >
                                        <Input value={"评价体系"} />
                                    </Form.Item>
                                    <Form.Item
                                        className={"flex-1 "}
                                        label={"计算周期 :  "}
                                    >
                                        <Select>
                                            <Select.Option>学期</Select.Option>
                                            <Select.Option>学年</Select.Option>
                                            <Select.Option>年度</Select.Option>
                                            <Select.Option>
                                                指定时段
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        className={"flex-1 "}
                                        label={"状态 : "}
                                    >
                                        <Select>
                                            <Select.Option>公开</Select.Option>
                                            <Select.Option>
                                                只有管理员能看
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        className={"flex-1 mb-0!"}
                                        label={"状态 : "}
                                    >
                                        <Input.TextArea
                                            placeholder={"请填写说明"}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <Form.Item label="参与教师">
                            <TeacherSelect />
                        </Form.Item>

                        <Card
                            title={<div>总点数计算公式</div>}
                            extra={
                                <Button
                                    type="link"
                                    ghost
                                    icon={<EditFilled></EditFilled>}
                                >
                                    公式设置
                                </Button>
                            }
                            size="small"
                        >
                            <div className="text-center">
                                ADD(A1)+ADD(A2)+ADD(A3)+ADD(A4)
                            </div>
                        </Card>
                        <div className="pt-5"></div>
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size={"small"}
                            style={{ marginBottom: 32 }}
                            items={[
                                {
                                    key: "1",
                                    tabKey: "1",
                                    label: "设置数据源",
                                    children: <TableWrap />,
                                },
                                {
                                    key: "2",
                                    tabKey: "2",
                                    label: "设置评价标准",
                                    children: <TableWrap />,
                                },
                            ]}
                        />
                    </Form>
                </div>
            </div>
        </div>
    );
};

export { SystemScale as Component };
