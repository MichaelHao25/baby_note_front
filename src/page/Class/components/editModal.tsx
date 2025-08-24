import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { memo, useImperativeHandle, useState } from "react";
import type { DataType } from "../index.tsx";

interface Props {
  onRef: any;
  callBack: (event: any) => void;
}

const EditModal = memo<Props>(({ onRef, callBack }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("标题");
  const [curType, setCurType] = useState<"add" | "modify">("add");
  const [info, setInfo] = useState<DataType>(null);
  const [data, setData] = useState<DataType[]>([]);

  const columns = [
    {
      title: "排序",
      dataIndex: "seq",
      align: "center",
      key: "seq",
    },
    {
      title: "分类名称",
      dataIndex: "name",
      align: "center",
      key: "name",
      render: (_, row) => {
        return (
          <Input
            value={row?.name}
            onChange={(e) => {
              row['name'] = e.target.value;
              setData((data) => [...data]);
            }}
          />
        );
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      align: "center",
      key: "action",
      render: (_, row, index) => {
        return (
          <Popconfirm
            title="确定删除"
            description="删除不可逆, 确定进行删除?"
            onConfirm={() => {
              data.splice(index, 1);
              setData([...data]);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type={"link"} danger>
              删除
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const showDrawer = (
    type: "modify" | "add",
    info?: DataType,
    list?: any[],
  ) => {
    setCurType(type);
    if (type === "add") {
      setTitle("新增量表分类");
    } else {
      setTitle(info?.parentName);
      setInfo(info);
      setData([...list]);
    }
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setInfo(null);
    setData([]);
  };

  //用useImperativeHandle暴露一些外部ref能访问的属性
  useImperativeHandle(onRef, () => {
    // 需要将暴露的接口返回出去
    return {
      open: showDrawer,
      close: onClose,
    };
  });

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <span>{title}</span>

          {curType === "modify" && (
            <Popconfirm
              title="确定删除"
              description="删除不可逆, 确定进行删除?"
              onConfirm={async () => {
                console.log({
                  type: "delete",
                  list: data,
                  info,
                });
                callBack?.({
                  type: "delete",
                  list: data,
                  info,
                });
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type={"link"} danger>
                <span>删除</span>
                <CloseOutlined />
              </Button>
            </Popconfirm>
          )}
        </div>
      }
      closable={{ "aria-label": "Close Button" }}
      onClose={onClose}
      width={650}
      open={open}
      footer={
        <div className="flex justify-end">
          <Button
            onClick={() => {
              onClose();
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            className="ml-[10px]"
            onClick={() => {
              callBack?.({
                type: curType,
                list: data,
                info,
              });
            }}
          >
            确定
          </Button>
        </div>
      }
    >
      <Form>
        <Form.Item label="分类名称">
          <Input
            value={info?.parentName}
            onChange={(e) => {
              setInfo((info) => ({ ...info, parentName: e.target.value }));
            }}
          />
        </Form.Item>
        <Form.Item label="二级分类">
          <Button
            type="primary"
            onClick={() => {
              // data.push({
              //     name:  '',
              //     seq: data[data.length - 1].seq  +  1
              // });

              if (data.length) {
                setData([
                  ...data,
                  {
                    name: "",
                    seq: data[data.length - 1].seq + 1,
                  },
                ]);
              } else {
                setData([
                  {
                    name: "",
                    seq: 1,
                  },
                ]);
              }
            }}
          >
            <span>添加</span>
            <PlusOutlined />
          </Button>
          <Table
            className="mt-[10px]"
            size="small"
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default EditModal;
